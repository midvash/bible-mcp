import { BOOKS, type BookDefinition } from '../data/books';
import { VERSIONS } from '../data/versions';
import { lookupBook } from '../lib/books-lookup';
import { isLanguageAllowed, isVersionAllowed } from '../lib/context';
import { fetchChapter } from '../lib/r2';
import type { Tool } from '../mcp/types';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text' as const, text }], isError };
}

function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function clampLimit(value: unknown): number {
  const parsed = Number(value ?? DEFAULT_LIMIT);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

function booksForArgs(args: Record<string, unknown>): BookDefinition[] | null {
  if (args.book) {
    const book = lookupBook(String(args.book));
    return book ? [book] : null;
  }

  if (args.testament === 'old') {
    return BOOKS.filter((b) => b.testament === 'old');
  }
  if (args.testament === 'new') {
    return BOOKS.filter((b) => b.testament === 'new');
  }

  return BOOKS;
}

export const searchBibleTool: Tool = {
  definition: {
    name: 'search_bible',
    description:
      'Searches for a keyword or exact phrase in one Bible version and returns matching verse references in Markdown. Use this for discovery questions like "find verses about love in KJV". For direct citation lookup, use get_passage or get_verse.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Keyword or exact phrase to search for. Matching is case-insensitive and accent-insensitive; it is not semantic search.',
        },
        version: {
          type: 'string',
          description:
            'Single Bible version slug to search, such as "nvi", "kjv", "ara", or "rvr1960". Must be enabled by the connection URL filters.',
        },
        book: {
          type: 'string',
          description:
            'Optional book name, slug, or abbreviation in any supported book locale (ex.: "John", "João", "Salmos").',
        },
        testament: {
          type: 'string',
          enum: ['old', 'new'],
          description:
            'Optional testament filter. Use "old" for Old Testament or "new" for New Testament. Ignored when book is provided.',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: MAX_LIMIT,
          description: `Maximum number of matches to return. Default: ${DEFAULT_LIMIT}; max: ${MAX_LIMIT}.`,
        },
      },
      required: ['query', 'version'],
    },
    annotations: {
      title: 'Search Bible',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },

  async handler(args, ctx, executionCtx) {
    const query = String(args.query ?? '').trim();
    const versionSlug = String(args.version ?? '').toLowerCase().trim();
    const limit = clampLimit(args.limit);

    if (!query || !versionSlug) {
      return textResult('Missing required parameters: query, version.', true);
    }

    const version = VERSIONS.find((v) => v.slug === versionSlug);
    if (!version) {
      return textResult(`Version "${versionSlug}" not found.`, true);
    }
    if (!isVersionAllowed(ctx, versionSlug)) {
      const allowed = ctx.allowedVersions?.join(', ').toUpperCase() ?? '';
      return textResult(
        `Version **${version.shortName}** is not enabled for this connection.\nAvailable versions: ${allowed}`,
        true,
      );
    }
    if (!isLanguageAllowed(ctx, version.language)) {
      const allowed = ctx.allowedLanguages?.join(', ') ?? '';
      return textResult(
        `Version **${version.shortName}** uses language ${version.language}, which is not enabled for this connection.\nAvailable languages: ${allowed}`,
        true,
      );
    }

    const books = booksForArgs(args);
    if (!books) {
      return textResult(`Book "${String(args.book)}" not found.`, true);
    }

    const needle = normalize(query);
    const matches: string[] = [];
    let chaptersScanned = 0;

    for (const book of books) {
      for (let chapter = 1; chapter <= book.chapters; chapter++) {
        const verses = await fetchChapter(
          ctx.env,
          versionSlug,
          book.id,
          chapter,
          executionCtx,
        );
        chaptersScanned++;
        if (!verses) continue;

        for (let i = 0; i < verses.length; i++) {
          const verseText = verses[i];
          if (!verseText || !normalize(verseText).includes(needle)) continue;

          matches.push(
            `- **${book.names.en} ${chapter}:${i + 1}** (${version.shortName}) — ${verseText}`,
          );
          if (matches.length >= limit) {
            return textResult(
              [
                `## Search results for "${query}" (${version.shortName})`,
                '',
                ...matches,
                '',
                `_Returned ${matches.length} matches after scanning ${chaptersScanned} chapters. Narrow by book or testament for more targeted results._`,
              ].join('\n'),
            );
          }
        }
      }
    }

    if (matches.length === 0) {
      return textResult(
        `No matches found for "${query}" in ${version.shortName}. Scanned ${chaptersScanned} chapters.`,
      );
    }

    return textResult(
      [
        `## Search results for "${query}" (${version.shortName})`,
        '',
        ...matches,
        '',
        `_Returned ${matches.length} matches after scanning ${chaptersScanned} chapters._`,
      ].join('\n'),
    );
  },
};
