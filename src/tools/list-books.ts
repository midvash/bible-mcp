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
      'Lista os 66 livros da Bíblia agrupados por testamento, com nomes, slugs, abreviações e número de capítulos.',
    inputSchema: {
      type: 'object',
      properties: {
        testament: {
          type: 'string',
          enum: ['old', 'new'],
          description: 'Filtra por testamento: "old" (Antigo) ou "new" (Novo).',
        },
        language: {
          type: 'string',
          description:
            'Idioma dos nomes dos livros: en, pt-br, es, fr, de, it, zh, ru, ko. Padrão: en.',
        },
      },
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
