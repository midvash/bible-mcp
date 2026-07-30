import type { BookDefinition } from '../data/books';
import type { VersionDefinition } from '../data/versions';
import { bookNameForVersion, formatChapter, formatVerse } from '../lib/markdown';
import { chapterKey, fetchChapters } from '../lib/r2';
import {
  MAX_REFERENCES,
  parseReferenceList,
  type ParsedReference,
} from '../lib/reference-parser';
import { chapterNotFound, resolveVersion } from '../lib/tool-guards';
import type { Tool } from '../mcp/types';

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text' as const, text }], isError };
}

/**
 * Teto de capítulos lidos numa chamada. Dez referências cruzando capítulos
 * poderiam pedir a Bíblia inteira; isto mantém a leitura previsível.
 */
const MAX_CHAPTERS = 60;

/** Capítulos que uma referência cobre, do inicial ao final. */
function chaptersOf(reference: ParsedReference): number[] {
  const last = reference.endChapter ?? reference.chapter;
  const out: number[] = [];
  for (let c = reference.chapter; c <= last; c++) out.push(c);
  return out;
}

/**
 * Formata uma referência que cruza capítulos: do versículo inicial até o fim do
 * primeiro capítulo, os capítulos do meio inteiros, e o último até o versículo
 * final.
 */
function formatCrossChapter(
  reference: ParsedReference,
  version: VersionDefinition,
  chapters: Map<string, string[]>,
): string {
  const { book, chapter, endChapter, verseStart, verseEnd } = reference;
  const last = endChapter!;
  const name = bookNameForVersion(book, version);

  const firstVerse = verseStart ?? 1;
  const lastChapterVerses = chapters.get(chapterKey(book.id, last));
  const lastVerse = verseEnd ?? lastChapterVerses?.length ?? 1;

  const lines = [
    `## ${name} ${chapter}:${firstVerse} — ${last}:${lastVerse} (${version.shortName})`,
    '',
  ];

  for (let c = chapter; c <= last; c++) {
    const verses = chapters.get(chapterKey(book.id, c));
    if (!verses) continue;

    const from = c === chapter ? firstVerse : 1;
    const to = c === last ? Math.min(lastVerse, verses.length) : verses.length;
    if (from > verses.length || to < from) continue;

    lines.push(`### ${name} ${c}`);
    for (let v = from; v <= to; v++) {
      const text = verses[v - 1];
      if (text && text.trim() !== '') lines.push(`**${v}** ${text}`);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

/** Formata uma referência contida num único capítulo. */
function formatSingleChapter(
  reference: ParsedReference,
  version: VersionDefinition,
  verses: string[],
): string {
  const { book, chapter, verseStart, verseEnd } = reference;

  if (verseStart === undefined) {
    return formatChapter(book, version, chapter, verses);
  }

  const end = Math.min(verseEnd ?? verseStart, verses.length);
  if (verseStart > verses.length) {
    return `Verse ${verseStart} does not exist. ${book.names.en} ${chapter} has ${verses.length} verses.`;
  }

  return formatVerse(
    book,
    version,
    chapter,
    verseStart,
    end,
    verses.slice(verseStart - 1, end),
  );
}

function refLabel(reference: ParsedReference, book: BookDefinition): string {
  const { chapter, endChapter, verseStart, verseEnd } = reference;
  const name = book.names.en;
  if (endChapter !== undefined) {
    return `${name} ${chapter}:${verseStart ?? 1}-${endChapter}:${verseEnd ?? ''}`;
  }
  if (verseStart === undefined) return `${name} ${chapter}`;
  if (verseEnd === undefined || verseEnd === verseStart) {
    return `${name} ${chapter}:${verseStart}`;
  }
  return `${name} ${chapter}:${verseStart}-${verseEnd}`;
}

export const getPassageTool: Tool = {
  definition: {
    name: 'get_passage',
    description:
      'Fetches Bible passages from natural-language references such as "John 3:16-18", "Psalm 23", "Romans 8:1-9:5" (crossing chapters) or "John 3:16; Romans 8:1" (several at once). This is the primary lookup tool when the user gives a citation instead of structured book/chapter/verse fields.',
    inputSchema: {
      type: 'object',
      properties: {
        reference: {
          type: 'string',
          description:
            'One or more free-form Bible references. Accepts localized book names, abbreviations, whole chapters ("Psalm 23"), verse ranges ("John 3:16-18"), chapter ranges ("Genesis 1-3"), ranges that cross chapters ("Romans 8:1-9:5"), and several references separated by semicolons or commas ("John 3:16; Romans 8:1"). At most ' +
            MAX_REFERENCES +
            ' per call.',
        },
        version: {
          type: 'string',
          description:
            'Optional Bible version slug. If omitted, uses the first version enabled by the connection URL, or "nvi" when no version filter exists.',
        },
      },
      required: ['reference'],
    },
    annotations: {
      title: 'Get Bible passage',
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

    const version = resolveVersion(ctx, args.version);
    if (!version.ok) return textResult(version.message, true);

    const parsed = parseReferenceList(input);
    if (!parsed.ok) return textResult(parsed.error, true);

    // Junta os capítulos de todas as referências e lê cada um uma única vez.
    const wanted: Array<[number, number]> = [];
    const seen = new Set<string>();
    for (const reference of parsed.references) {
      for (const chapter of chaptersOf(reference)) {
        const key = chapterKey(reference.book.id, chapter);
        if (seen.has(key)) continue;
        seen.add(key);
        wanted.push([reference.book.id, chapter]);
      }
    }

    if (wanted.length > MAX_CHAPTERS) {
      return textResult(
        `That asks for ${wanted.length} chapters. Request at most ${MAX_CHAPTERS} at a time.`,
        true,
      );
    }

    const chapters = await fetchChapters(
      ctx.env,
      version.value.slug,
      wanted,
      executionCtx,
    );

    const sections: string[] = [];
    const missing: string[] = [];

    for (const reference of parsed.references) {
      const first = chapters.get(chapterKey(reference.book.id, reference.chapter));
      if (!first) {
        missing.push(refLabel(reference, reference.book));
        continue;
      }

      sections.push(
        reference.endChapter !== undefined
          ? formatCrossChapter(reference, version.value, chapters)
          : formatSingleChapter(reference, version.value, first),
      );
    }

    if (sections.length === 0) {
      return textResult(
        parsed.references.length === 1
          ? chapterNotFound(
              parsed.references[0].book,
              version.value,
              parsed.references[0].chapter,
            )
          : `None of the requested passages were found in ${version.value.shortName}: ${missing.join(', ')}.`,
        true,
      );
    }

    if (missing.length > 0) {
      sections.push(
        `_Not found in ${version.value.shortName}: ${missing.join(', ')}._`,
      );
    }

    return textResult(sections.join('\n\n'));
  },
};
