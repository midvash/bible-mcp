import type { Env } from '../env';

/**
 * Camada de busca sobre o índice FTS5 do Midvash (D1 `midvash-search`).
 *
 * O índice guarda **uma versão de referência por idioma** — 278k versículos
 * em duas tabelas FTS5 sobre o mesmo conteúdo:
 *
 *  - `search_verses_fts` → tokenizer `unicode61 remove_diacritics 2`.
 *    Busca por termos e frases, insensível a acento e caixa. Ranking BM25.
 *  - `search_verses_tri` → tokenizer `trigram`. Casa substring/prefixo
 *    (`ressurrei` → `ressurreição`, `ressuscitou`), usado como fallback
 *    quando a busca por termos não retorna nada.
 *
 * Este módulo só lê. O índice é populado pelo pipeline do Midvash.
 */

/** Versão indexada em `search_verses` para cada locale. */
export const INDEX_VERSION_BY_LOCALE = {
  de: 'luth1912',
  en: 'niv',
  es: 'nvies',
  fr: 'darby-fr',
  it: 'riveduta',
  ko: 'kor',
  'pt-br': 'naa',
  ru: 'synodal',
  zh: 'cuvs',
} as const;

export type IndexLocale = keyof typeof INDEX_VERSION_BY_LOCALE;

const INDEX_LOCALES = new Set<string>(Object.keys(INDEX_VERSION_BY_LOCALE));

/**
 * Resolve o locale do índice a usar para o idioma de uma versão bíblica.
 * `pt-pt` cai no índice pt-br. Idiomas-fonte (he, la, gr) não têm índice.
 */
export function indexLocaleForLanguage(language: string): IndexLocale | null {
  const lang = language.toLowerCase().trim();
  if (lang === 'pt' || lang === 'pt-pt' || lang === 'pt-br') return 'pt-br';
  return INDEX_LOCALES.has(lang) ? (lang as IndexLocale) : null;
}

/** Retorna a versão indexada de um locale — ex.: 'pt-br' → 'naa'. */
export function indexVersionForLocale(locale: IndexLocale): string {
  return INDEX_VERSION_BY_LOCALE[locale];
}

// ─── Normalização e parsing da query ─────────────────────────────────────

/** Minúscula sem acento — mesma normalização do tokenizer do índice. */
export function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

const TOKEN_RE = /[\p{L}\p{N}]+/gu;

export interface ParsedQuery {
  /** Expressão pronta para o operador `MATCH` do FTS5. */
  match: string;
  /** Tokens normalizados — usados para conferir o texto de outra versão. */
  tokens: string[];
  /** true quando o usuário pediu frase exata (query entre aspas). */
  phrase: boolean;
}

/**
 * Converte a query do usuário numa expressão FTS5 segura.
 *
 * Cada token vira uma string entre aspas, o que neutraliza os operadores
 * do FTS5 (`AND`, `OR`, `NOT`, `NEAR`, `*`, `^`, `:`, parênteses) — sem
 * isso, uma query como `deus OR *` derruba a consulta.
 *
 * Query entre aspas → uma única frase (termos adjacentes).
 * Query solta      → todos os termos exigidos, em qualquer posição (AND).
 */
export function parseQuery(raw: string): ParsedQuery | null {
  const trimmed = raw.trim();
  const quoted = /^["“'](.+)["”']$/.exec(trimmed);
  const body = quoted ? quoted[1] : trimmed;

  const tokens = Array.from(body.matchAll(TOKEN_RE), (m) => m[0]);
  if (tokens.length === 0) return null;

  const escape = (t: string) => t.replace(/"/g, '""');
  const match = quoted
    ? `"${tokens.map(escape).join(' ')}"`
    : tokens.map((t) => `"${escape(t)}"`).join(' AND ');

  return {
    match,
    tokens: tokens.map(normalizeText),
    phrase: Boolean(quoted),
  };
}

/**
 * Expressão para o índice de trigrama. O tokenizer exige pelo menos 3
 * caracteres por termo; termos menores são descartados.
 */
export function trigramMatch(parsed: ParsedQuery): string | null {
  const usable = parsed.tokens.filter((t) => t.length >= 3);
  if (usable.length === 0) return null;
  return usable.map((t) => `"${t.replace(/"/g, '""')}"`).join(' AND ');
}

// ─── Consulta ────────────────────────────────────────────────────────────

export interface IndexHit {
  bookId: number;
  chapter: number;
  verse: number;
  /** Texto do versículo na versão indexada do idioma. */
  text: string;
  /** Trecho com os termos destacados em `**`. */
  snippet: string;
}

export interface SearchIndexOptions {
  locale: IndexLocale;
  /** Restringe a um livro (1..66). */
  bookId?: number;
  /** Restringe a um testamento. Ignorado quando `bookId` está definido. */
  testament?: 'old' | 'new';
  limit: number;
}

export interface SearchIndexResult {
  hits: IndexHit[];
  /** Qual índice respondeu: termos completos ou trigrama (substring). */
  strategy: 'terms' | 'trigram';
}

/** Último livro do Antigo Testamento — Malaquias. */
const LAST_OT_BOOK_ID = 39;

interface FtsRow {
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
  snippet: string;
}

async function runFts(
  db: D1Database,
  table: 'search_verses_fts' | 'search_verses_tri',
  match: string,
  opts: SearchIndexOptions,
): Promise<IndexHit[]> {
  const filters: string[] = [`${table} MATCH ?`, 'locale = ?'];
  const params: unknown[] = [match, opts.locale];

  if (opts.bookId !== undefined) {
    filters.push('book_id = ?');
    params.push(opts.bookId);
  } else if (opts.testament === 'old') {
    filters.push('book_id <= ?');
    params.push(LAST_OT_BOOK_ID);
  } else if (opts.testament === 'new') {
    filters.push('book_id > ?');
    params.push(LAST_OT_BOOK_ID);
  }

  params.push(opts.limit);

  // O nome da tabela é interpolado, mas vem de um union type — nunca do usuário.
  const sql =
    `SELECT book_id, chapter, verse, text, ` +
    `snippet(${table}, 0, '**', '**', '…', 12) AS snippet ` +
    `FROM ${table} WHERE ${filters.join(' AND ')} ` +
    `ORDER BY bm25(${table}) LIMIT ?`;

  const { results } = await db
    .prepare(sql)
    .bind(...params)
    .all<FtsRow>();

  return (results ?? []).map((r) => ({
    bookId: r.book_id,
    chapter: r.chapter,
    verse: r.verse,
    text: r.text,
    snippet: r.snippet ?? r.text,
  }));
}

/**
 * Busca no índice: primeiro por termos (BM25), depois por trigrama se a
 * busca por termos não achar nada. Uma consulta SQL por tentativa.
 */
export async function searchIndex(
  env: Env,
  parsed: ParsedQuery,
  opts: SearchIndexOptions,
): Promise<SearchIndexResult> {
  const db = env.SEARCH_DB;
  if (!db) throw new Error('SEARCH_DB binding não disponível.');

  const byTerms = await runFts(db, 'search_verses_fts', parsed.match, opts);
  if (byTerms.length > 0) {
    return { hits: byTerms, strategy: 'terms' };
  }

  // Nada por termos — tenta substring/prefixo. Frase exata não faz fallback:
  // o usuário pediu literalidade.
  if (parsed.phrase) return { hits: [], strategy: 'terms' };

  const tri = trigramMatch(parsed);
  if (!tri) return { hits: [], strategy: 'terms' };

  const byTrigram = await runFts(db, 'search_verses_tri', tri, opts);
  return { hits: byTrigram, strategy: 'trigram' };
}

/**
 * Confere se o texto de um versículo satisfaz a query — usado quando os
 * resultados vêm do índice de um idioma mas serão exibidos noutra versão,
 * cuja tradução pode não conter os mesmos termos.
 */
export function textMatchesQuery(text: string, parsed: ParsedQuery): boolean {
  const haystack = normalizeText(text);
  if (parsed.phrase) return haystack.includes(parsed.tokens.join(' '));
  return parsed.tokens.every((t) => haystack.includes(t));
}
