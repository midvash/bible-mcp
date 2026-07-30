import { BOOKS, type BookDefinition } from '../data/books';
import type { Env } from '../env';

/**
 * Referências cruzadas: dado um versículo, quais outros trechos das Escrituras
 * se relacionam com ele.
 *
 * Os dados vêm de `verse_cross_refs` no D1 próprio do MCP — uma cópia da
 * tabela homônima em `bible-config`. Esse outro banco guarda, na mesma base,
 * usuários, sessões e credenciais de provedor de IA, e por isso **não pode**
 * ser ligado a este Worker público. Ver scripts/mcp-search-schema.sql.
 *
 * `votes` mede a força da ligação: quantas fontes do dataset concordam que os
 * dois trechos se relacionam. Ordenar por ele coloca as ligações clássicas
 * primeiro — João 3:16 puxa Romanos 5:8 e 1 João 4:9-10 antes de tudo.
 */

export interface CrossRef {
  book: BookDefinition;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  votes: number;
}

interface CrossRefRow {
  to_book: number;
  to_ch: number;
  to_v_start: number;
  to_v_end: number;
  votes: number;
}

const BOOK_BY_ID = new Map<number, BookDefinition>(BOOKS.map((b) => [b.id, b]));

/**
 * Referências cruzadas de um versículo, das mais atestadas para as menos.
 *
 * Uma consulta, servida pelo índice `(from_book, from_ch, from_v, votes DESC)`.
 */
export async function crossRefsFor(
  env: Env,
  bookId: number,
  chapter: number,
  verse: number,
  limit: number,
): Promise<CrossRef[]> {
  const db = env.SEARCH_DB;
  if (!db) throw new Error('SEARCH_DB binding não disponível.');

  const { results } = await db
    .prepare(
      'SELECT to_book, to_ch, to_v_start, to_v_end, votes ' +
        'FROM verse_cross_refs ' +
        'WHERE from_book = ? AND from_ch = ? AND from_v = ? ' +
        'ORDER BY votes DESC, to_book, to_ch, to_v_start LIMIT ?',
    )
    .bind(bookId, chapter, verse, limit)
    .all<CrossRefRow>();

  const out: CrossRef[] = [];
  for (const row of results ?? []) {
    const book = BOOK_BY_ID.get(row.to_book);
    if (!book) continue;
    out.push({
      book,
      chapter: row.to_ch,
      verseStart: row.to_v_start,
      verseEnd: row.to_v_end,
      votes: row.votes,
    });
  }

  return out;
}
