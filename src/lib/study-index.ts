import type { BookDefinition } from '../data/books';
import type { Env } from '../env';
import type { IndexLocale, ParsedQuery } from './search-index';

/**
 * Camada de leitura sobre `search_metadata` no D1 `midvash-search` — o
 * material de estudo do Midvash, já indexado em FTS5 nos mesmos 9 idiomas do
 * índice de versículos:
 *
 *  - `commentary`  1.189 por idioma — um comentário por capítulo da Bíblia
 *  - `character`     463 por idioma — personagens bíblicos
 *  - `dictionary`    416 por idioma — verbetes
 *  - `theology`       20 por idioma — artigos
 *
 * ATENÇÃO: `body` é um resumo truncado em 500 caracteres, usado para ranquear
 * a busca — não é o artigo completo. O texto integral vive noutro banco, que
 * guarda também usuários, sessões e credenciais, e por isso não é (nem deve
 * ser) acessível a este Worker público. As tools devolvem o resumo e o link.
 */

export type StudyType = 'dictionary' | 'character' | 'theology' | 'commentary';

export const STUDY_TYPES: readonly StudyType[] = [
  'commentary',
  'character',
  'dictionary',
  'theology',
] as const;

/** Tamanho em que o pipeline do Midvash trunca `body`. */
export const STUDY_BODY_LIMIT = 500;

const SITE_ORIGIN = 'https://midvash.com';

/** Deeplink é relativo e, no locale `en`, vem sem prefixo de idioma. */
export function studyUrl(deeplink: string): string {
  return `${SITE_ORIGIN}${deeplink}`;
}

export interface StudyHit {
  type: StudyType;
  title: string;
  /** Resumo de até 500 caracteres — ver aviso acima. */
  summary: string;
  /** Trecho com os termos destacados em `**`. */
  snippet: string;
  url: string;
}

interface StudyRow {
  type: string;
  title: string;
  body: string;
  excerpt: string | null;
  deeplink: string;
  snippet: string;
}

function toHit(row: StudyRow): StudyHit {
  return {
    type: row.type as StudyType,
    title: row.title,
    summary: (row.excerpt || row.body || '').trim(),
    snippet: (row.snippet || row.title).trim(),
    url: studyUrl(row.deeplink),
  };
}

/**
 * Busca no índice de estudo. Uma consulta SQL, ranking BM25 sobre título e
 * resumo.
 *
 * O JOIN é necessário: `search_metadata_fts` indexa só `title` e `body` e
 * carrega `type`/`locale`/`slug` como UNINDEXED — `excerpt` e `deeplink` só
 * existem na tabela de conteúdo. A tabela FTS não pode ganhar alias, senão
 * `MATCH` e `bm25()` deixam de resolvê-la.
 */
export async function searchStudy(
  env: Env,
  parsed: ParsedQuery,
  opts: { locale: IndexLocale; type?: StudyType; limit: number },
): Promise<StudyHit[]> {
  const db = env.SEARCH_DB;
  if (!db) throw new Error('SEARCH_DB binding não disponível.');

  const filters = [
    'search_metadata_fts MATCH ?',
    'search_metadata_fts.locale = ?',
  ];
  const params: unknown[] = [parsed.match, opts.locale];

  if (opts.type) {
    filters.push('search_metadata_fts.type = ?');
    params.push(opts.type);
  }
  params.push(opts.limit);

  const { results } = await db
    .prepare(
      'SELECT m.type, m.title, m.body, m.excerpt, m.deeplink, ' +
        "snippet(search_metadata_fts, 1, '**', '**', '…', 14) AS snippet " +
        'FROM search_metadata_fts ' +
        'JOIN search_metadata m ON m.rowid = search_metadata_fts.rowid ' +
        `WHERE ${filters.join(' AND ')} ` +
        'ORDER BY bm25(search_metadata_fts) LIMIT ?',
    )
    .bind(...params)
    .all<StudyRow>();

  return (results ?? []).map(toHit);
}

/**
 * Monta o deeplink do comentário de um capítulo.
 *
 * O segmento do livro é sempre o slug em inglês, mesmo nos outros idiomas, e
 * o locale `en` não leva prefixo: `/bible-commentary/genesis/2` contra
 * `/pt-br/bible-commentary/genesis/2`.
 */
export function commentaryDeeplink(
  locale: IndexLocale,
  book: BookDefinition,
  chapter: number,
): string {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${prefix}/bible-commentary/${book.slugs.en}/${chapter}`;
}

/**
 * Comentário de um capítulo, ou null se não houver.
 *
 * Casa por deeplink e, como alternativa, por slug: três linhas por idioma
 * (Gênesis 31, 1 Samuel 13, 1 Crônicas 17) foram semeadas com o deeplink
 * truncado em `/bible-commentary`, e só o slug as encontra.
 */
export async function getCommentary(
  env: Env,
  locale: IndexLocale,
  book: BookDefinition,
  chapter: number,
): Promise<StudyHit | null> {
  const db = env.SEARCH_DB;
  if (!db) throw new Error('SEARCH_DB binding não disponível.');

  const row = await db
    .prepare(
      'SELECT type, title, body, excerpt, deeplink, title AS snippet ' +
        'FROM search_metadata ' +
        "WHERE type = 'commentary' AND locale = ? AND (deeplink = ? OR slug = ?) " +
        'LIMIT 1',
    )
    .bind(
      locale,
      commentaryDeeplink(locale, book, chapter),
      `${book.slugs.en}-${chapter}`,
    )
    .first<StudyRow>();

  if (!row) return null;

  const hit = toHit(row);
  // A linha com deeplink truncado apontaria pro índice de comentários; o link
  // canônico do capítulo é reconstruível a partir da referência.
  return { ...hit, url: studyUrl(commentaryDeeplink(locale, book, chapter)) };
}
