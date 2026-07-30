import { fetchChapter } from '../lib/r2';
import { formatChapter, localeForVersion } from '../lib/markdown';
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
  resolveVersion,
} from '../lib/tool-guards';
import type { Tool } from '../mcp/types';

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text' as const, text }], isError };
}

export const getChapterTool: Tool = {
  definition: {
    name: 'get_chapter',
    description:
      'Fetches a full Bible chapter from a specific version, formatted in Markdown with numbered verses. Use this when the user needs chapter-level context instead of an isolated verse.',
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
      },
      required: ['version', 'book', 'chapter'],
    },
    outputSchema: VERSES_OUTPUT_SCHEMA,
    annotations: {
      title: 'Get Bible chapter',
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

    const locale = localeForVersion(version.value);

    return dualResult(
      formatChapter(book.value, version.value, chapter.value, verses),
      {
        ...versionFields(version.value),
        verses: verses
          .map((text, i) =>
            structuredVerse(book.value, locale, chapter.value, i + 1, text),
          )
          // Alguns capítulos têm buracos no dado de origem.
          .filter((v) => v.text.trim() !== ''),
      },
    );
  },
};
