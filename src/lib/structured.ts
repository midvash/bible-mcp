import type { BookDefinition } from '../data/books';
import type { VersionDefinition } from '../data/versions';
import type { ToolOutputSchema, ToolResult } from '../mcp/types';

/**
 * Formas estruturadas que as tools devolvem junto do Markdown.
 *
 * O Markdown é para quem lê; isto é para quem processa. Sem ele, um cliente
 * programático precisa extrair referência e texto de uma string formatada —
 * frágil e desnecessário, já que o servidor tem os dados na mão.
 *
 * `outputSchema` é contrato: a spec 2025-06-18 exige que a resposta valide
 * contra o schema declarado. Os construtores aqui e os schemas abaixo são
 * escritos em par, de propósito, para não divergirem.
 */

export interface StructuredVerse {
  book: string;
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
}

/** Um versículo em forma de dados. `book` sai no idioma da versão. */
export function structuredVerse(
  book: BookDefinition,
  locale: keyof BookDefinition['names'],
  chapter: number,
  verse: number,
  text: string,
): StructuredVerse {
  return {
    book: book.names[locale],
    book_id: book.id,
    chapter,
    verse,
    text,
  };
}

const VERSE_ITEM = {
  type: 'object',
  properties: {
    book: { type: 'string', description: 'Book name in the language of the version.' },
    book_id: { type: 'integer', description: 'Canonical book number, 1 to 66.' },
    chapter: { type: 'integer' },
    verse: { type: 'integer' },
    text: { type: 'string' },
  },
  required: ['book', 'book_id', 'chapter', 'verse', 'text'],
} as const;

const VERSION_FIELDS = {
  version: { type: 'string', description: 'Version slug, such as "nvi".' },
  version_name: { type: 'string', description: 'Human-readable version name.' },
} as const;

/** Schema de uma resposta que devolve versículos. */
export const VERSES_OUTPUT_SCHEMA: ToolOutputSchema = {
  type: 'object',
  properties: {
    ...VERSION_FIELDS,
    verses: { type: 'array', items: VERSE_ITEM },
  },
  required: ['version', 'verses'],
};

/** Schema de `search_bible`. */
export const SEARCH_OUTPUT_SCHEMA: ToolOutputSchema = {
  type: 'object',
  properties: {
    ...VERSION_FIELDS,
    query: { type: 'string' },
    /** Como o resultado foi obtido — o rodapé em Markdown diz o mesmo em prosa. */
    strategy: {
      type: 'string',
      enum: ['ranked', 'ranked-cross-version', 'substring', 'scan'],
      description:
        'How the results were produced: ranked on the requested version, ranked on another version of the same language, substring fallback, or a book-scoped scan.',
    },
    matches: { type: 'array', items: VERSE_ITEM },
  },
  required: ['version', 'query', 'matches'],
};

/** Schema de `get_cross_references`. */
export const CROSS_REFS_OUTPUT_SCHEMA: ToolOutputSchema = {
  type: 'object',
  properties: {
    ...VERSION_FIELDS,
    source: {
      type: 'object',
      properties: {
        book: { type: 'string' },
        book_id: { type: 'integer' },
        chapter: { type: 'integer' },
        verse: { type: 'integer' },
      },
      required: ['book', 'book_id', 'chapter', 'verse'],
    },
    passages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          book: { type: 'string' },
          book_id: { type: 'integer' },
          chapter: { type: 'integer' },
          verse_start: { type: 'integer' },
          verse_end: { type: 'integer' },
          votes: {
            type: 'integer',
            description: 'How many sources attest this link. Higher is stronger.',
          },
          text: { type: 'string' },
        },
        required: ['book', 'book_id', 'chapter', 'verse_start', 'verse_end', 'votes'],
      },
    },
  },
  required: ['source', 'passages'],
};

/** Schema de `get_strongs`. */
export const STRONGS_OUTPUT_SCHEMA: ToolOutputSchema = {
  type: 'object',
  properties: {
    entries: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Strong\'s identifier, such as "H430".' },
          number: { type: 'integer' },
          language: { type: 'string', enum: ['hebrew', 'greek'] },
          lemma: { type: 'string' },
          transliteration: { type: ['string', 'null'] },
          pronunciation: { type: ['string', 'null'] },
          part_of_speech: { type: ['string', 'null'] },
          derivation: { type: ['string', 'null'] },
          definition: { type: ['string', 'null'] },
          kjv_definition: { type: ['string', 'null'] },
          outline: { type: ['string', 'null'] },
        },
        required: ['id', 'number', 'language', 'lemma'],
      },
    },
  },
  required: ['entries'],
};

/** Junta o Markdown e a forma estruturada numa resposta só. */
export function dualResult(
  text: string,
  structured: Record<string, unknown>,
): ToolResult {
  return {
    content: [{ type: 'text', text }],
    structuredContent: structured,
  };
}

/** Campos de versão presentes em quase toda resposta estruturada. */
export function versionFields(version: VersionDefinition) {
  return { version: version.slug, version_name: version.name };
}
