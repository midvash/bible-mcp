import { VERSIONS } from '../data/versions';
import {
  isLanguageAllowed,
  isVersionAllowed,
  type ConnectionContext,
} from '../lib/context';
import { fetchChapter } from '../lib/r2';
import { parseReference } from '../lib/reference-parser';
import type { Tool } from '../mcp/types';

const DEFAULT_COMPARE_VERSIONS = ['nvi', 'ara', 'kjv', 'rvr1960'];
const MAX_COMPARE_VERSIONS = 8;

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text' as const, text }], isError };
}

function normalizeVersions(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).toLowerCase().trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.toLowerCase().trim())
      .filter(Boolean);
  }
  return [];
}

function defaultVersionsForConnection(ctx: ConnectionContext): string[] {
  if (ctx.allowedVersions && ctx.allowedVersions.length > 0) {
    return ctx.allowedVersions.slice(0, MAX_COMPARE_VERSIONS);
  }

  if (ctx.allowedLanguages && ctx.allowedLanguages.length > 0) {
    return VERSIONS.filter((v) => isLanguageAllowed(ctx, v.language))
      .slice(0, MAX_COMPARE_VERSIONS)
      .map((v) => v.slug);
  }

  return DEFAULT_COMPARE_VERSIONS;
}

export const comparePassageTool: Tool = {
  definition: {
    name: 'compare_passage',
    description:
      'Compares the same Bible passage across multiple Bible versions and returns a Markdown side-by-side style comparison. Use this for translation comparison, sermon preparation, or study questions. For a single version, use get_passage.',
    inputSchema: {
      type: 'object',
      properties: {
        reference: {
          type: 'string',
          description:
            'Free-form Bible reference to compare. Accepts supported localized book names, abbreviations, whole chapters, and verse ranges. Examples: "John 3:16", "João 3:16-18", "Psalm 23".',
        },
        versions: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Optional list of Bible version slugs to compare. If omitted, uses versions enabled by the connection URL, or a small default set. Maximum 8 versions.',
        },
      },
      required: ['reference'],
    },
    annotations: {
      title: 'Compare Bible passage',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },

  async handler(args, ctx, executionCtx) {
    const referenceInput = String(args.reference ?? '').trim();
    if (!referenceInput) {
      return textResult('Missing required parameter: reference.', true);
    }

    const parsed = parseReference(referenceInput);
    if (!parsed.ok) {
      return textResult(parsed.error, true);
    }

    const requestedVersions = normalizeVersions(args.versions);
    const versionSlugs = (requestedVersions.length > 0
      ? requestedVersions
      : defaultVersionsForConnection(ctx)
    ).slice(0, MAX_COMPARE_VERSIONS);

    if (versionSlugs.length === 0) {
      return textResult('No Bible versions available to compare.', true);
    }

    const { book, chapter, verseStart, verseEnd } = parsed.reference;
    const start = verseStart ?? 1;
    const endFromReference = verseEnd ?? verseStart;

    const sections: string[] = [];
    const errors: string[] = [];

    for (const versionSlug of versionSlugs) {
      const version = VERSIONS.find((v) => v.slug === versionSlug);
      if (!version) {
        errors.push(`- Version "${versionSlug}" was not found.`);
        continue;
      }
      if (!isVersionAllowed(ctx, versionSlug)) {
        errors.push(`- ${version.shortName} is not enabled for this connection.`);
        continue;
      }
      if (!isLanguageAllowed(ctx, version.language)) {
        errors.push(
          `- ${version.shortName} uses language ${version.language}, which is not enabled for this connection.`,
        );
        continue;
      }

      const verses = await fetchChapter(
        ctx.env,
        versionSlug,
        book.id,
        chapter,
        executionCtx,
      );
      if (!verses || verses.length === 0) {
        errors.push(`- ${version.shortName}: ${book.names.en} ${chapter} was not found.`);
        continue;
      }

      const end = endFromReference ?? verses.length;
      if (start < 1 || start > verses.length || end > verses.length || end < start) {
        errors.push(
          `- ${version.shortName}: requested verses are outside ${book.names.en} ${chapter}.`,
        );
        continue;
      }

      const selected = verses.slice(start - 1, end);
      const ref =
        verseStart === undefined
          ? `${book.names.en} ${chapter}`
          : end === start
          ? `${book.names.en} ${chapter}:${start}`
          : `${book.names.en} ${chapter}:${start}-${end}`;

      sections.push(
        [
          `### ${version.shortName} — ${version.name}`,
          `**${ref}**`,
          '',
          ...selected.map((text, index) => `**${start + index}** ${text}`),
        ].join('\n'),
      );
    }

    if (sections.length === 0) {
      return textResult(
        [`Could not compare "${referenceInput}".`, '', ...errors].join('\n'),
        true,
      );
    }

    const output = [
      `## Comparison: ${book.names.en} ${chapter}${verseStart ? `:${start}${(endFromReference ?? start) !== start ? `-${endFromReference}` : ''}` : ''}`,
      '',
      ...sections,
    ];

    if (errors.length > 0) {
      output.push('', '## Skipped versions', '', ...errors);
    }

    return textResult(output.join('\n\n'));
  },
};
