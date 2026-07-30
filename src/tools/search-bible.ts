import { BOOKS, type BookDefinition } from '../data/books';
import type { VersionDefinition } from '../data/versions';
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
import { chapterKey, fetchChapters } from '../lib/r2';
import {
  parseQuery,
  searchIndex,
  textMatchesQuery,
  type IndexHit,
  type ParsedQuery,
} from '../lib/search-index';
import type { Tool } from '../mcp/types';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

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

// ─── Estratégia 2: varredura limitada a um livro ─────────────────────────

/**
 * Rede de segurança para quando o índice não está acessível. Varre o R2, e só
 * com filtro de livro — assim o número de leituras fica limitado ao maior livro
 * da Bíblia (Salmos, 150 capítulos).
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

    // ── Varredura: sem índice, ou hebraico ───────────────────────────────
    //
    // O tokenizer `unicode61 remove_diacritics 2` do FTS5 remove diacríticos
    // latinos e gregos, mas **não** o niqqud hebraico: no índice, אֱלֹהִים fica
    // com as vogais, e quem digita as consoantes soltas (אלהים) não casa nada.
    // A varredura usa `normalizeText`, que remove o niqqud, então para o
    // hebraico ela é o caminho correto — mais lenta, e exigindo filtro de
    // livro, mas com o resultado certo.
    const needsScan = version.language === 'he';

    if (needsScan || !ctx.env.SEARCH_DB) {
      if (!book) {
        return textResult(
          [
            needsScan
              ? `Searching **${version.shortName}** requires a **book** filter: Hebrew is indexed with its vowel points, so it is scanned instead of ranked.`
              : 'The search index is unavailable right now, so searching requires a **book** filter.',
            '',
            'Retry with `book` set (ex.: `book: "Genesis"`).',
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
      return searchResult(displayQuery, version, lines, [
        `Scanned all ${chaptersRead} chapters of ${bookNameForVersion(book, version)} in ${version.shortName}. ${
          needsScan
            ? 'Hebrew is indexed with its vowel points, so this version is scanned rather than ranked'
            : 'The ranked index was unavailable'
        }, and matches appear in canonical order.`,
      ], 'scan');
    }

    // ── Índice FTS5: toda versão é buscada em si mesma ──────────────────
    const result = await searchIndex(ctx.env, parsed, {
      version: version.slug,
      bookId: book?.id,
      testament: book ? undefined : testament,
      limit,
    });

    const notes: string[] = [];
    const strategy = result.strategy === 'trigram' ? 'substring' : 'ranked';
    if (result.strategy === 'trigram') {
      notes.push(
        'No whole-word matches, so these come from substring matching (partial words).',
      );
    }

    const lines = renderNativeHits(result.hits, limit);
    if (lines.length > 0) {
      notes.unshift(
        `${lines.length} matches ranked by relevance (BM25) across the whole ${version.shortName} index.`,
      );
    }

    return searchResult(displayQuery, version, lines, notes, strategy);
  },
};
