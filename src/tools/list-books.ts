import { BOOKS, type Locale } from '../data/books';
import { formatBookList } from '../lib/markdown';
import type { Tool } from '../mcp/types';

function textResult(text: string) {
  return { content: [{ type: 'text' as const, text }] };
}

const VALID_LOCALES = new Set<Locale>([
  'en',
  'pt-br',
  'es',
  'fr',
  'de',
  'it',
  'zh',
  'ru',
  'ko',
]);

function normalizeLocale(input: string): Locale {
  const l = input.toLowerCase().trim();
  if (l === 'pt' || l === 'pt-br' || l === 'pt-pt') return 'pt-br';
  return VALID_LOCALES.has(l as Locale) ? (l as Locale) : 'en';
}

export const listBooksTool: Tool = {
  definition: {
    name: 'list_books',
    description:
      'Lists the 66 canonical Bible books with localized names, slugs, abbreviations, testament grouping, and chapter counts. Use this when an agent needs valid book identifiers or localized display names before calling lookup tools.',
    inputSchema: {
      type: 'object',
      properties: {
        testament: {
          type: 'string',
          enum: ['old', 'new'],
          description:
            'Optional testament filter. Use "old" for Old Testament books or "new" for New Testament books.',
        },
        language: {
          type: 'string',
          description:
            'Optional locale for book names, slugs, and abbreviations. Supported values: en, pt-br, es, fr, de, it, zh, ru, ko. Defaults to en.',
        },
      },
    },
    annotations: {
      title: 'List Bible books',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },

  async handler(args) {
    const locale = normalizeLocale(args.language ? String(args.language) : 'en');

    let books = BOOKS;
    if (args.testament === 'old') {
      books = books.filter((b) => b.testament === 'old');
    } else if (args.testament === 'new') {
      books = books.filter((b) => b.testament === 'new');
    }

    return textResult(formatBookList(books, locale));
  },
};
