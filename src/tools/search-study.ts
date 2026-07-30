import {
  isLanguageAllowed,
  type ConnectionContext,
} from '../lib/context';
import {
  indexLocaleForLanguage,
  parseQuery,
  type IndexLocale,
} from '../lib/search-index';
import {
  searchStudy,
  STUDY_BODY_LIMIT,
  STUDY_TYPES,
  type StudyHit,
  type StudyType,
} from '../lib/study-index';
import type { Tool, ToolResult } from '../mcp/types';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 25;

function textResult(text: string, isError = false): ToolResult {
  return { content: [{ type: 'text' as const, text }], isError };
}

function clampLimit(value: unknown): number {
  const parsed = Number(value ?? DEFAULT_LIMIT);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

export type LocaleResolution =
  | { ok: true; locale: IndexLocale }
  | { ok: false; message: string };

/**
 * Idioma do material de estudo: o pedido explicitamente, senão o primeiro
 * habilitado na conexão, senão inglês.
 */
export function resolveStudyLocale(
  ctx: ConnectionContext,
  explicit?: unknown,
): LocaleResolution {
  if (explicit) {
    const requested = String(explicit);
    const locale = indexLocaleForLanguage(requested);
    if (!locale) {
      return {
        ok: false,
        message: `Study material is not available in "${requested}". Available languages: en, pt-br, es, fr, de, it, zh, ru, ko.`,
      };
    }
    if (!isLanguageAllowed(ctx, locale)) {
      const allowed = ctx.allowedLanguages?.join(', ') ?? '';
      return {
        ok: false,
        message: `Language ${locale} is not enabled for this connection.\nAvailable languages: ${allowed}`,
      };
    }
    return { ok: true, locale };
  }

  for (const lang of ctx.allowedLanguages ?? []) {
    const locale = indexLocaleForLanguage(lang);
    if (locale) return { ok: true, locale };
  }
  return { ok: true, locale: 'en' };
}

const TYPE_LABEL: Record<StudyType, string> = {
  commentary: 'Commentary',
  character: 'Character',
  dictionary: 'Dictionary',
  theology: 'Theology',
};

export function formatStudyHits(
  query: string,
  hits: StudyHit[],
  locale: IndexLocale,
): string {
  const lines = [`## Study results for "${query}" (${locale})`, ''];

  for (const hit of hits) {
    lines.push(`### ${TYPE_LABEL[hit.type] ?? hit.type} — ${hit.title}`);
    lines.push(hit.snippet);
    lines.push(`[Read the full entry](${hit.url})`);
    lines.push('');
  }

  lines.push(
    `_${hits.length} results, ranked by relevance. Each entry above is a summary of up to ${STUDY_BODY_LIMIT} characters — follow the link for the complete article._`,
  );

  return lines.join('\n');
}

export const searchStudyTool: Tool = {
  definition: {
    name: 'search_study',
    description:
      "Searches Midvash's Bible study library: chapter commentaries, Bible characters, dictionary entries, and theology articles, in 9 languages. Use this for background and explanation — who a person was, what a term means, what a chapter is about. For the biblical text itself, use search_bible or get_passage. Results are summaries with a link to the full article.",
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Words to search for across titles and summaries. Every word must appear, in any order. Accents and letter case are ignored.',
        },
        type: {
          type: 'string',
          enum: [...STUDY_TYPES],
          description:
            'Optional filter. "commentary" for chapter commentaries, "character" for people in the Bible, "dictionary" for term definitions, "theology" for doctrinal articles. Omit to search all four.',
        },
        language: {
          type: 'string',
          description:
            'Optional language for the study material: en, pt-br, es, fr, de, it, zh, ru, ko. Defaults to the connection language, or English.',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: MAX_LIMIT,
          description: `Maximum number of results. Default: ${DEFAULT_LIMIT}; max: ${MAX_LIMIT}.`,
        },
      },
      required: ['query'],
    },
    annotations: {
      title: 'Search Bible study library',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },

  async handler(args, ctx) {
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

    const resolved = resolveStudyLocale(ctx, args.language);
    if (!resolved.ok) return textResult(resolved.message, true);
    const { locale } = resolved;

    if (!ctx.env.SEARCH_DB) {
      return textResult(
        'The study library is temporarily unavailable.',
        true,
      );
    }

    const type = STUDY_TYPES.includes(args.type as StudyType)
      ? (args.type as StudyType)
      : undefined;

    const hits = await searchStudy(ctx.env, parsed, {
      locale,
      type,
      limit: clampLimit(args.limit),
    });

    if (hits.length === 0) {
      const scope = type ? `${TYPE_LABEL[type]} entries` : 'the study library';
      return textResult(
        `No matches found for "${rawQuery}" in ${scope} (${locale}).`,
      );
    }

    return textResult(formatStudyHits(rawQuery, hits, locale));
  },
};
