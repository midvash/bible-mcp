import { BOOKS, type BookDefinition } from '../data/books';
import { VERSIONS, type VersionDefinition } from '../data/versions';
import { lookupBook } from '../lib/books-lookup';
import type { ConnectionContext } from '../lib/context';
import { resolveVersion } from '../lib/tool-guards';
import { bookNameForVersion, localeForVersion } from '../lib/markdown';
import {
  dualResult,
  structuredVerse,
  versionFields,
  SEARCH_OUTPUT_SCHEMA,
} from '../lib/structured';
import { chapterKey, fetchChapters, type ChapterKey } from '../lib/r2';
import {
  indexLocaleForLanguage,
  indexVersionForLocale,
  parseQuery,
  searchIndex,
  textMatchesQuery,
  type IndexHit,
  type ParsedQuery,
} from '../lib/search-index';
import type { Tool } from '../mcp/types';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

/**
 * Quantos hits pedir ao índice quando o texto será exibido em outra versão:
 * parte dos resultados é descartada na conferência, então pedimos folga.
 */
const CROSS_VERSION_OVERFETCH = 3;

/**
 * Teto de leituras de capítulo por busca. O Worker tem limite de subrequests
 * por requisição — este teto garante que nenhuma busca chegue perto dele.
 */
const MAX_CHAPTER_READS = 60;

/** Quantas referências não confirmadas listar no rodapé. */
const MAX_UNVERIFIED_SHOWN = 5;

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text' as const, text }], isError };
}

function clampLimit(value: unknown): number {
  const parsed = Number(value ?? DEFAULT_LIMIT);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

const BOOK_BY_ID = new Map<number, BookDefinition>(BOOKS.map((b) => [b.id, b]));

// ─── Formatação ──────────────────────────────────────────────────────────

interface ResultLine {
  book: BookDefinition;
  chapter: number;
  verse: number;
  text: string;
}

type Strategy = 'ranked' | 'ranked-cross-version' | 'substring' | 'scan';

/** Markdown para quem lê, dados para quem processa. */
function searchResult(
  query: string,
  version: VersionDefinition,
  lines: ResultLine[],
  notes: string[],
  strategy: Strategy,
) {
  const locale = localeForVersion(version);
  return dualResult(
    lines.length === 0
      ? emptyResult(query, version, notes)
      : formatResults(query, version, lines, notes),
    {
      ...versionFields(version),
      query,
      strategy,
      matches: lines.map((l) =>
        structuredVerse(l.book, locale, l.chapter, l.verse, l.text),
      ),
    },
  );
}

function formatResults(
  query: string,
  version: VersionDefinition,
  lines: ResultLine[],
  notes: string[],
): string {
  const out = [`## Search results for "${query}" (${version.shortName})`, ''];

  for (const line of lines) {
    const name = bookNameForVersion(line.book, version);
    out.push(`- **${name} ${line.chapter}:${line.verse}** — ${line.text}`);
  }

  if (notes.length > 0) {
    out.push('', ...notes.map((n) => `_${n}_`));
  }

  return out.join('\n');
}

function emptyResult(
  query: string,
  version: VersionDefinition,
  notes: string[],
): string {
  return [
    `No matches found for "${query}" in ${version.shortName}.`,
    ...notes.map((n) => `_${n}_`),
  ].join('\n\n');
}

// ─── Estratégia 1: a versão pedida é a versão indexada ───────────────────

/**
 * Devolve os hits do índice direto, com os termos destacados pelo
 * `snippet()` do FTS5. Zero leitura no R2.
 */
function renderNativeHits(hits: IndexHit[], limit: number): ResultLine[] {
  const lines: ResultLine[] = [];
  for (const hit of hits.slice(0, limit)) {
    const book = BOOK_BY_ID.get(hit.bookId);
    if (!book) continue;
    lines.push({
      book,
      chapter: hit.chapter,
      verse: hit.verse,
      text: hit.snippet,
    });
  }
  return lines;
}

// ─── Estratégia 2: índice de um idioma, texto de outra versão ────────────

interface CrossVersionRender {
  lines: ResultLine[];
  /** Referências que casaram no índice mas não na redação da versão pedida. */
  unverified: ResultLine[];
}

/**
 * O índice dá as referências ranqueadas e o texto vem do R2 da versão
 * pedida. Como as traduções diferem, cada versículo é conferido contra a
 * query — os que não batem vão para `unverified` em vez de sumirem.
 */
async function renderCrossVersionHits(
  ctx: ConnectionContext,
  version: VersionDefinition,
  hits: IndexHit[],
  parsed: ParsedQuery,
  limit: number,
  executionCtx: ExecutionContext,
): Promise<CrossVersionRender> {
  // Um capítulo pode conter vários hits — deduplica antes de ler.
  const wanted: Array<[number, number]> = [];
  const seen = new Set<ChapterKey>();
  for (const hit of hits) {
    const key = chapterKey(hit.bookId, hit.chapter);
    if (seen.has(key)) continue;
    seen.add(key);
    if (wanted.length >= MAX_CHAPTER_READS) break;
    wanted.push([hit.bookId, hit.chapter]);
  }

  const chapters = await fetchChapters(ctx.env, version.slug, wanted, executionCtx);

  const lines: ResultLine[] = [];
  const unverified: ResultLine[] = [];

  for (const hit of hits) {
    if (lines.length >= limit) break;

    const book = BOOK_BY_ID.get(hit.bookId);
    if (!book) continue;

    const verses = chapters.get(chapterKey(hit.bookId, hit.chapter));
    const text = verses?.[hit.verse - 1];
    if (!text) continue; // versículo não existe nesta versão

    const line = { book, chapter: hit.chapter, verse: hit.verse, text };
    if (textMatchesQuery(text, parsed)) {
      lines.push(line);
    } else if (unverified.length < MAX_UNVERIFIED_SHOWN) {
      unverified.push(line);
    }
  }

  return { lines, unverified };
}

// ─── Estratégia 3: varredura limitada a um livro ─────────────────────────

/**
 * Versões em hebraico, grego e latim não estão no índice FTS5. Para elas a
 * busca varre o R2, e só com filtro de livro — assim o número de leituras
 * fica limitado ao maior livro da Bíblia (Salmos, 150 capítulos).
 */
async function scanBook(
  ctx: ConnectionContext,
  version: VersionDefinition,
  book: BookDefinition,
  parsed: ParsedQuery,
  limit: number,
  executionCtx: ExecutionContext,
): Promise<{ lines: ResultLine[]; chaptersRead: number }> {
  const keys: Array<[number, number]> = [];
  for (let chapter = 1; chapter <= book.chapters; chapter++) {
    keys.push([book.id, chapter]);
  }

  const chapters = await fetchChapters(ctx.env, version.slug, keys, executionCtx);
  const lines: ResultLine[] = [];

  for (
    let chapter = 1;
    chapter <= book.chapters && lines.length < limit;
    chapter++
  ) {
    const verses = chapters.get(chapterKey(book.id, chapter));
    if (!verses) continue;

    for (let i = 0; i < verses.length && lines.length < limit; i++) {
      const text = verses[i];
      if (!text || !textMatchesQuery(text, parsed)) continue;
      lines.push({ book, chapter, verse: i + 1, text });
    }
  }

  return { lines, chaptersRead: chapters.size };
}

// ─── Tool ────────────────────────────────────────────────────────────────

export const searchBibleTool: Tool = {
  definition: {
    name: 'search_bible',
    description:
      'Searches the Bible text for words or an exact phrase and returns matching verses ranked by relevance. Matching ignores letter case and accents; wrap the query in double quotes for an exact phrase. Use this for discovery questions like "find verses about love". For a known citation, use get_passage or get_verse.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Words to search for. Every word must appear in the verse, in any order. Wrap the whole query in double quotes for an exact phrase. Accents and letter case are ignored. This is keyword search, not semantic search.',
        },
        version: {
          type: 'string',
          description:
            'Optional Bible version slug such as "nvi", "kjv", "ara", or "rvr1960". If omitted, uses the first version enabled by the connection URL, or "nvi".',
        },
        book: {
          type: 'string',
          description:
            'Optional book name, slug, or abbreviation in any supported book locale (ex.: "John", "João", "Salmos"). Required for versions in Hebrew, Greek, or Latin.',
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
      required: ['query'],
    },
    outputSchema: SEARCH_OUTPUT_SCHEMA,
    annotations: {
      title: 'Search Bible',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },

  async handler(args, ctx, executionCtx) {
    const rawQuery = String(args.query ?? '').trim();
    if (!rawQuery) {
      return textResult('Missing required parameter: query.', true);
    }

    const parsed = parseQuery(rawQuery);
    if (!parsed) {
      return textResult(
        `Query "${rawQuery}" has no searchable words. Use letters or numbers.`,
        true,
      );
    }

    // No cabeçalho, a query aparece sem as aspas de frase — elas já viram
    // uma nota no rodapé, e "" ficaria duplicado.
    const displayQuery = parsed.phrase
      ? rawQuery.replace(/^["“'](.*)["”']$/, '$1')
      : rawQuery;

    const resolved = resolveVersion(ctx, args.version);
    if (!resolved.ok) return textResult(resolved.message, true);
    const version = resolved.value;

    const limit = clampLimit(args.limit);

    let book: BookDefinition | undefined;
    if (args.book) {
      book = lookupBook(String(args.book)) ?? undefined;
      if (!book) {
        return textResult(`Book "${String(args.book)}" not found.`, true);
      }
    }

    const testament =
      args.testament === 'old' || args.testament === 'new'
        ? args.testament
        : undefined;

    const locale = indexLocaleForLanguage(version.language);

    // ── Estratégia 3: idioma fora do índice, ou índice indisponível ──────
    if (!locale || !ctx.env.SEARCH_DB) {
      if (!book) {
        const reason = locale
          ? 'The search index is unavailable right now'
          : `Version **${version.shortName}** is in ${version.language}, which the search index does not cover`;
        return textResult(
          [
            `${reason}, so searching it requires a **book** filter.`,
            '',
            `Retry with \`book\` set (ex.: \`book: "Psalms"\`), or search a modern-language version and read the result in ${version.shortName} with \`compare_passage\`.`,
          ].join('\n'),
          true,
        );
      }

      const { lines, chaptersRead } = await scanBook(
        ctx,
        version,
        book,
        parsed,
        limit,
        executionCtx,
      );
      const notes = [
        `Scanned all ${chaptersRead} chapters of ${bookNameForVersion(book, version)} in ${version.shortName}. This version is not in the ranked index, so matches appear in canonical order.`,
      ];
      return searchResult(displayQuery, version, lines, notes, 'scan');
    }

    // ── Estratégias 1 e 2: índice FTS5 ──────────────────────────────────
    const indexVersion = indexVersionForLocale(locale);
    const isNative = indexVersion === version.slug;

    const result = await searchIndex(ctx.env, parsed, {
      locale,
      bookId: book?.id,
      testament: book ? undefined : testament,
      limit: isNative
        ? limit
        : Math.min(limit * CROSS_VERSION_OVERFETCH, MAX_LIMIT * 3),
    });

    const notes: string[] = [];
    if (result.strategy === 'trigram') {
      notes.push(
        'No whole-word matches, so these come from substring matching (partial words).',
      );
    }

    if (result.hits.length === 0) {
      return searchResult(
        displayQuery,
        version,
        [],
        notes,
        result.strategy === 'trigram' ? 'substring' : 'ranked',
      );
    }

    if (isNative) {
      const lines = renderNativeHits(result.hits, limit);
      notes.unshift(
        `${lines.length} matches ranked by relevance (BM25) across the whole ${version.shortName} index.`,
      );
      return searchResult(
        displayQuery,
        version,
        lines,
        notes,
        result.strategy === 'trigram' ? 'substring' : 'ranked',
      );
    }

    const { lines, unverified } = await renderCrossVersionHits(
      ctx,
      version,
      result.hits,
      parsed,
      limit,
      executionCtx,
    );

    const indexShortName =
      VERSIONS.find((v) => v.slug === indexVersion)?.shortName ??
      indexVersion.toUpperCase();

    notes.unshift(
      `${lines.length} matches. Ranking comes from the ${indexShortName} index for ${version.language}; the text shown is ${version.shortName}.`,
    );

    if (unverified.length > 0) {
      const refs = unverified
        .map(
          (u) =>
            `${bookNameForVersion(u.book, version)} ${u.chapter}:${u.verse}`,
        )
        .join(', ');
      notes.push(
        `Also matched in ${indexShortName} but worded differently in ${version.shortName}: ${refs}.`,
      );
    }

    return searchResult(
      displayQuery,
      version,
      lines,
      notes,
      result.strategy === 'trigram' ? 'substring' : 'ranked-cross-version',
    );
  },
};
