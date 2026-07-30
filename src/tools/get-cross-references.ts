import { crossRefsFor, type CrossRef } from '../lib/cross-refs';
import { bookNameForVersion } from '../lib/markdown';
import { chapterKey, fetchChapters } from '../lib/r2';
import { parseReference } from '../lib/reference-parser';
import { resolveVersion } from '../lib/tool-guards';
import type { Tool } from '../mcp/types';
import type { VersionDefinition } from '../data/versions';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 25;

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text' as const, text }], isError };
}

function clampLimit(value: unknown): number {
  const parsed = Number(value ?? DEFAULT_LIMIT);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

function refLabel(ref: CrossRef, version: VersionDefinition): string {
  const name = bookNameForVersion(ref.book, version);
  return ref.verseEnd === ref.verseStart
    ? `${name} ${ref.chapter}:${ref.verseStart}`
    : `${name} ${ref.chapter}:${ref.verseStart}-${ref.verseEnd}`;
}

export const getCrossReferencesTool: Tool = {
  definition: {
    name: 'get_cross_references',
    description:
      'Finds other Bible passages that relate to a given verse, ranked by how widely the link is attested. This answers "what else in Scripture speaks to this?" — the standard next step in study after reading a verse. Returns each related passage with its text, so no follow-up lookup is needed.',
    inputSchema: {
      type: 'object',
      properties: {
        reference: {
          type: 'string',
          description:
            'The verse to start from, such as "John 3:16" or "Romanos 8:28". Must point at a single verse; a whole chapter is too broad for cross-references.',
        },
        version: {
          type: 'string',
          description:
            'Optional Bible version slug for the text of the related passages. Defaults to the connection version, or "nvi".',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: MAX_LIMIT,
          description: `Maximum number of related passages. Default: ${DEFAULT_LIMIT}; max: ${MAX_LIMIT}.`,
        },
        include_text: {
          type: 'boolean',
          description:
            'Whether to include the text of each related passage. Default true. Set false for a compact list of references only.',
        },
      },
      required: ['reference'],
    },
    annotations: {
      title: 'Get cross-references',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },

  async handler(args, ctx, executionCtx) {
    const input = String(args.reference ?? '').trim();
    if (!input) {
      return textResult('Missing required parameter: reference.', true);
    }

    const parsed = parseReference(input);
    if (!parsed.ok) return textResult(parsed.error, true);

    const version = resolveVersion(ctx, args.version);
    if (!version.ok) return textResult(version.message, true);

    const { book, chapter, verseStart, endChapter } = parsed.reference;
    if (verseStart === undefined || endChapter !== undefined) {
      // Sugere no idioma da versão, para não responder "João 3" com "John 3:1".
      const name = bookNameForVersion(book, version.value);
      return textResult(
        `Cross-references start from a single verse. "${input}" points at more than one — try "${name} ${chapter}:1", for example.`,
        true,
      );
    }

    if (!ctx.env.SEARCH_DB) {
      return textResult('Cross-references are temporarily unavailable.', true);
    }

    const limit = clampLimit(args.limit);
    const refs = await crossRefsFor(
      ctx.env,
      book.id,
      chapter,
      verseStart,
      limit,
    );

    const sourceLabel = `${bookNameForVersion(book, version.value)} ${chapter}:${verseStart}`;

    if (refs.length === 0) {
      return textResult(
        `No cross-references recorded for ${sourceLabel}.`,
      );
    }

    const includeText = args.include_text !== false;
    const lines = [`## Cross-references for ${sourceLabel}`, ''];

    if (!includeText) {
      for (const ref of refs) {
        lines.push(`- **${refLabel(ref, version.value)}**`);
      }
      lines.push('', `_${refs.length} passages, most widely attested first._`);
      return textResult(lines.join('\n'));
    }

    // Um capítulo pode conter várias referências — deduplica antes de ler.
    const wanted: Array<[number, number]> = [];
    const seen = new Set<string>();
    for (const ref of refs) {
      const key = chapterKey(ref.book.id, ref.chapter);
      if (seen.has(key)) continue;
      seen.add(key);
      wanted.push([ref.book.id, ref.chapter]);
    }

    const chapters = await fetchChapters(
      ctx.env,
      version.value.slug,
      wanted,
      executionCtx,
    );

    for (const ref of refs) {
      const label = refLabel(ref, version.value);
      const verses = chapters.get(chapterKey(ref.book.id, ref.chapter));

      if (!verses) {
        lines.push(`- **${label}** — _not available in ${version.value.shortName}._`);
        continue;
      }

      const end = Math.min(ref.verseEnd, verses.length);
      const text = verses
        .slice(ref.verseStart - 1, end)
        .filter((v) => v && v.trim() !== '')
        .join(' ');

      lines.push(`- **${label}** — ${text || '_verse not present in this version._'}`);
    }

    lines.push(
      '',
      `_${refs.length} passages, most widely attested first. Text shown in ${version.value.shortName}._`,
    );

    return textResult(lines.join('\n'));
  },
};
