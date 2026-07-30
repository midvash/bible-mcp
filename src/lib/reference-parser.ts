import type { BookDefinition } from '../data/books';
import { lookupBook } from './books-lookup';

export interface ParsedReference {
  book: BookDefinition;
  /** Capítulo inicial. */
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
  /**
   * Capítulo final, quando a referência cruza capítulos ("Romanos 8:1-9:5" ou
   * "Gênesis 1-3"). Ausente quando começa e termina no mesmo capítulo.
   */
  endChapter?: number;
}

export type ParseResult =
  | { ok: true; reference: ParsedReference }
  | { ok: false; error: string };

export type ParseListResult =
  | { ok: true; references: ParsedReference[] }
  | { ok: false; error: string };

/** Teto de referências numa chamada só — evita amplificar leituras. */
export const MAX_REFERENCES = 10;

/**
 * Hífen simples, en dash e em dash: usuários digitam os três.
 *
 * Guardado como conteúdo de classe (com o hífen escapado), não como classe
 * pronta — interpolar `[-–—]` dentro de outra classe aninha os colchetes e
 * produz um padrão que não casa nada.
 */
const DASH_CHARS = '\\-\u2013\u2014';
const DASH = `[${DASH_CHARS}]`;

/**
 * Separa a parte do livro da parte numérica. O livro pode começar com número
 * ("1 João", "2 Reis"), então a divisão é feita pelo último bloco que contém
 * só dígitos e pontuação de referência.
 */
const SPLIT_RE = new RegExp(`^(.+?)\\s+([\\d:.\\s${DASH_CHARS}]+)$`);

interface Spec {
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
  endChapter?: number;
}

/**
 * Interpreta a parte numérica de uma referência. Cinco formas, da mais
 * específica para a mais geral:
 *
 *   8:1-9:5   capítulo 8 versículo 1 até capítulo 9 versículo 5
 *   3:16-18   capítulo 3, versículos 16 a 18
 *   3:16      capítulo 3, versículo 16
 *   1-3       capítulos 1 a 3 inteiros
 *   23        capítulo 23 inteiro
 */
function parseSpec(spec: string): Spec | null {
  const s = spec.replace(/\s+/g, '');
  const n = (v: string) => parseInt(v, 10);

  let m = new RegExp(`^(\\d+)[:.](\\d+)${DASH}(\\d+)[:.](\\d+)$`).exec(s);
  if (m) {
    return {
      chapter: n(m[1]),
      verseStart: n(m[2]),
      endChapter: n(m[3]),
      verseEnd: n(m[4]),
    };
  }

  m = new RegExp(`^(\\d+)[:.](\\d+)${DASH}(\\d+)$`).exec(s);
  if (m) {
    return { chapter: n(m[1]), verseStart: n(m[2]), verseEnd: n(m[3]) };
  }

  m = /^(\d+)[:.](\d+)$/.exec(s);
  if (m) {
    return { chapter: n(m[1]), verseStart: n(m[2]), verseEnd: n(m[2]) };
  }

  m = new RegExp(`^(\\d+)${DASH}(\\d+)$`).exec(s);
  if (m) {
    return { chapter: n(m[1]), endChapter: n(m[2]) };
  }

  m = /^(\d+)$/.exec(s);
  if (m) return { chapter: n(m[1]) };

  return null;
}

/**
 * Parseia uma referência bíblica em linguagem natural.
 *
 * Aceita "John 3:16", "João 3:16-18", "1 Coríntios 13", "1Sm 17:45-47",
 * "Salmos 23", "Romanos 8:1-9:5" e "Gênesis 1-3".
 */
export function parseReference(reference: string): ParseResult {
  if (!reference || typeof reference !== 'string') {
    return { ok: false, error: 'Empty reference.' };
  }

  const trimmed = reference.trim().replace(/\s+/g, ' ');
  const split = SPLIT_RE.exec(trimmed);
  if (!split) {
    return {
      ok: false,
      error: `Could not read the reference "${reference}". Use "Book Chapter:Verse" — for example "John 3:16", "Romans 8:1-11" or "Romans 8:1-9:5".`,
    };
  }

  const [, bookPart, specPart] = split;

  const book = lookupBook(bookPart);
  if (!book) {
    return {
      ok: false,
      error: `Book not found: "${bookPart}". Call list_books to see the accepted names.`,
    };
  }

  const spec = parseSpec(specPart);
  if (!spec) {
    return {
      ok: false,
      error: `Could not read "${specPart}" as a chapter and verse. Use forms like "3", "3:16", "3:16-18", "1-3" or "8:1-9:5".`,
    };
  }

  const { chapter, endChapter, verseStart, verseEnd } = spec;

  if (chapter < 1 || chapter > book.chapters) {
    return {
      ok: false,
      error: `Invalid chapter: ${chapter}. ${book.names.en} has ${book.chapters} chapters.`,
    };
  }
  if (endChapter !== undefined) {
    if (endChapter > book.chapters) {
      return {
        ok: false,
        error: `Invalid chapter: ${endChapter}. ${book.names.en} has ${book.chapters} chapters.`,
      };
    }
    if (endChapter < chapter) {
      return {
        ok: false,
        error: `Invalid range: chapter ${endChapter} comes before chapter ${chapter}.`,
      };
    }
  }
  if (verseStart !== undefined && verseStart < 1) {
    return { ok: false, error: `Invalid starting verse: ${verseStart}.` };
  }
  // Dentro do mesmo capítulo o fim precisa vir depois do início. Cruzando
  // capítulos não precisa: "8:20-9:5" é válido mesmo com 5 < 20.
  if (
    endChapter === undefined &&
    verseStart !== undefined &&
    verseEnd !== undefined &&
    verseEnd < verseStart
  ) {
    return {
      ok: false,
      error: `Invalid range: verse ${verseEnd} comes before verse ${verseStart}.`,
    };
  }

  return {
    ok: true,
    reference: {
      book,
      chapter,
      verseStart,
      verseEnd,
      ...(endChapter !== undefined && endChapter !== chapter
        ? { endChapter }
        : {}),
    },
  };
}

/** Qualquer letra latina, grega ou cirílica — usado para achar um livro novo. */
const HAS_LETTER = /[\p{L}]/u;

/**
 * Quebra uma entrada em referências individuais.
 *
 * Ponto e vírgula e quebra de linha sempre separam. Vírgula separa só quando o
 * que vem depois tem letra, isto é, parece um livro novo: assim
 * "João 3:16, Romanos 8:1" vira duas referências, e "Gênesis 1:1, 3" não é
 * quebrado no meio de uma lista de versículos.
 */
export function splitReferences(input: string): string[] {
  const parts: string[] = [];

  for (const chunk of input.split(/[;\n]+/)) {
    let buffer = '';
    for (const piece of chunk.split(',')) {
      if (buffer === '') {
        buffer = piece;
      } else if (HAS_LETTER.test(piece)) {
        parts.push(buffer);
        buffer = piece;
      } else {
        buffer += `,${piece}`;
      }
    }
    if (buffer.trim() !== '') parts.push(buffer);
  }

  return parts.map((p) => p.trim()).filter(Boolean);
}

/**
 * Parseia uma ou mais referências. Falha inteira se qualquer uma falhar — meia
 * resposta silenciosa é pior que um erro claro.
 */
export function parseReferenceList(input: string): ParseListResult {
  if (!input || typeof input !== 'string') {
    return { ok: false, error: 'Empty reference.' };
  }

  const parts = splitReferences(input);
  if (parts.length === 0) {
    return { ok: false, error: 'Empty reference.' };
  }
  if (parts.length > MAX_REFERENCES) {
    return {
      ok: false,
      error: `Too many references: ${parts.length}. Ask for at most ${MAX_REFERENCES} in one call.`,
    };
  }

  const references: ParsedReference[] = [];
  for (const part of parts) {
    const parsed = parseReference(part);
    if (!parsed.ok) return { ok: false, error: parsed.error };
    references.push(parsed.reference);
  }

  return { ok: true, references };
}
