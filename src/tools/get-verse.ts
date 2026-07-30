import { fetchChapter } from '../lib/r2';
import { formatVerse, localeForVersion } from '../lib/markdown';
import {
  dualResult,
  structuredVerse,
  versionFields,
  VERSES_OUTPUT_SCHEMA,
} from '../lib/structured';
import {
  chapterNotFound,
  resolveBook,
  resolveChapter,
  resolveVerseRange,
  resolveVersion,
} from '../lib/tool-guards';
import type { Tool } from '../mcp/types';

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text' as const, text }], isError };
}

export const getVerseTool: Tool = {
  definition: {
    name: 'get_verse',
    description:
      'Fetches one exact Bible verse or a contiguous verse range from a specific version. Use this when the book, chapter, verse, and version are already known. For natural references such as "John 3:16-18", prefer get_passage.',
    inputSchema: {
      type: 'object',
      properties: {
        version: {
          type: 'string',
          description:
            'Bible version slug to read from, such as "nvi", "kjv", "ara", or "rvr1960". Must be enabled by the connection URL filters.',
        },
        book: {
          type: 'string',
          description:
            'Bible book name, slug, or abbreviation. Accepts supported localized names such as "John", "João", "Salmos", or "1 Sm".',
        },
        chapter: {
          type: 'integer',
          minimum: 1,
          description: 'Chapter number within the selected book. Must be 1 or greater.',
        },
        verse: {
          type: 'integer',
          minimum: 1,
          description: 'Starting verse number. Must exist in the selected chapter.',
        },
        verse_end: {
          type: 'integer',
          minimum: 1,
          description:
            'Optional ending verse number for a range. Must be greater than or equal to verse and within the same chapter.',
        },
      },
      required: ['version', 'book', 'chapter', 'verse'],
    },
    outputSchema: VERSES_OUTPUT_SCHEMA,
    annotations: {
      title: 'Get Bible verse',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },

  async handler(args, ctx, executionCtx) {
    const version = resolveVersion(ctx, args.version, { required: true });
    if (!version.ok) return textResult(version.message, true);

    const book = resolveBook(args.book, { required: true });
    if (!book.ok) return textResult(book.message, true);

    const chapter = resolveChapter(book.value, args.chapter);
    if (!chapter.ok) return textResult(chapter.message, true);

    const verses = await fetchChapter(
      ctx.env,
      version.value.slug,
      book.value.id,
      chapter.value,
      executionCtx,
    );
    if (!verses || verses.length === 0) {
      return textResult(
        chapterNotFound(book.value, version.value, chapter.value),
        true,
      );
    }

    const start = Number(args.verse);
    const end = args.verse_end != null ? Number(args.verse_end) : start;
    const range = resolveVerseRange(
      book.value,
      chapter.value,
      verses.length,
      start,
      end,
    );
    if (!range.ok) return textResult(range.message, true);

    const selected = verses.slice(range.value.start - 1, range.value.end);
    const locale = localeForVersion(version.value);

    return dualResult(
      formatVerse(
        book.value,
        version.value,
        chapter.value,
        range.value.start,
        range.value.end,
        selected,
      ),
      {
        ...versionFields(version.value),
        verses: selected.map((text, i) =>
          structuredVerse(
            book.value,
            locale,
            chapter.value,
            range.value.start + i,
            text,
          ),
        ),
      },
    );
  },
};
