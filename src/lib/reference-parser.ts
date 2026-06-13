import type { BookDefinition } from '../data/books';
import { lookupBook } from './books-lookup';

export interface ParsedReference {
  book: BookDefinition;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
}

export type ParseResult =
  | { ok: true; reference: ParsedReference }
  | { ok: false; error: string };

/**
 * Parseia uma referência bíblica em linguagem natural.
 *
 * Aceita formatos como:
 *  - "John 3:16"
 *  - "João 3:16-18"
 *  - "1 Coríntios 13"
 *  - "1Sm 17:45-47"
 *  - "Salmos 23"
 *  - "Rev 1:1-3"
 *
 * Retorna um objeto estruturado ou um erro descritivo.
 */
export function parseReference(reference: string): ParseResult {
  if (!reference || typeof reference !== 'string') {
    return { ok: false, error: 'Referência vazia.' };
  }

  const trimmed = reference.trim().replace(/\s+/g, ' ');

  // Captura: (parte do livro) (capítulo)[:verso[-versoFim]]
  // O livro pode incluir números no início (1 João, 2 Reis, etc.)
  const match = trimmed.match(/^(.+?)\s+(\d+)(?:\s*[:\.\s]\s*(\d+)(?:\s*-\s*(\d+))?)?$/);
  if (!match) {
    return {
      ok: false,
      error: `Não foi possível interpretar a referência "${reference}". Use o formato "Livro Capítulo:Verso" (ex.: "João 3:16" ou "Romanos 8:1-11").`,
    };
  }

  const [, bookPart, chapterStr, verseStartStr, verseEndStr] = match;

  const book = lookupBook(bookPart);
  if (!book) {
    return {
      ok: false,
      error: `Livro não encontrado: "${bookPart}". Use um nome reconhecido em português, inglês ou espanhol.`,
    };
  }

  const chapter = parseInt(chapterStr, 10);
  if (Number.isNaN(chapter) || chapter < 1 || chapter > book.chapters) {
    return {
      ok: false,
      error: `Capítulo inválido: ${chapterStr}. ${book.names.en} tem ${book.chapters} capítulos.`,
    };
  }

  const verseStart = verseStartStr ? parseInt(verseStartStr, 10) : undefined;
  const verseEnd = verseEndStr ? parseInt(verseEndStr, 10) : verseStart;

  if (verseStart !== undefined && (Number.isNaN(verseStart) || verseStart < 1)) {
    return { ok: false, error: `Verso inicial inválido: ${verseStartStr}.` };
  }
  if (
    verseEnd !== undefined &&
    verseStart !== undefined &&
    (Number.isNaN(verseEnd) || verseEnd < verseStart)
  ) {
    return {
      ok: false,
      error: `Verso final inválido: deve ser maior ou igual ao inicial.`,
    };
  }

  return {
    ok: true,
    reference: {
      book,
      chapter,
      verseStart,
      verseEnd,
    },
  };
}
