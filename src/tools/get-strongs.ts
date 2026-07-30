import {
  parseStrongsId,
  strongsByNumber,
  strongsByWord,
  type StrongsEntry,
  type StrongsLanguage,
} from '../lib/strongs';
import {
  dualResult,
  STRONGS_OUTPUT_SCHEMA,
} from '../lib/structured';
import type { Tool } from '../mcp/types';
import { resolveStudyLocale } from './search-study';

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 15;

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text' as const, text }], isError };
}

function clampLimit(value: unknown): number {
  const parsed = Number(value ?? DEFAULT_LIMIT);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

function normalizeLanguage(value: unknown): StrongsLanguage | undefined {
  const v = String(value ?? '').toLowerCase().trim();
  if (v === 'hebrew' || v === 'hebraico' || v === 'he') return 'hebrew';
  if (v === 'greek' || v === 'grego' || v === 'gr') return 'greek';
  return undefined;
}

/** Verbete em forma de dados, com as chaves do outputSchema. */
function structuredEntry(entry: StrongsEntry) {
  return {
    id: entry.id,
    number: entry.number,
    language: entry.language,
    lemma: entry.lemma,
    transliteration: entry.transliteration,
    pronunciation: entry.pronunciation,
    part_of_speech: entry.partOfSpeech,
    derivation: entry.derivation,
    definition: entry.definition,
    kjv_definition: entry.kjvDefinition,
    outline: entry.outline,
  };
}

function formatEntry(entry: StrongsEntry): string {
  const lines = [`### ${entry.id} — ${entry.lemma}`];

  const meta: string[] = [];
  if (entry.transliteration) meta.push(`*${entry.transliteration}*`);
  if (entry.pronunciation) meta.push(`(${entry.pronunciation})`);
  if (entry.partOfSpeech) meta.push(entry.partOfSpeech);
  if (meta.length > 0) lines.push(meta.join(' · '));

  if (entry.definition) lines.push('', entry.definition);
  if (entry.outline) lines.push('', `**Senses:** ${entry.outline}`);
  if (entry.derivation) lines.push('', `**Derivation:** ${entry.derivation}`);
  if (entry.kjvDefinition) {
    lines.push('', `**Rendered in the KJV as:** ${entry.kjvDefinition}`);
  }

  return lines.join('\n');
}

export const getStrongsTool: Tool = {
  definition: {
    name: 'get_strongs',
    description:
      "Looks up a word in Strong's lexicon — 8,674 Hebrew and 5,523 Greek entries — by Strong's number (\"H430\", \"G2316\") or by the word itself, in the original script or transliterated (\"elohim\", \"θεός\"). Returns the lemma, transliteration, definition and senses, translated into the requested language. Use it when the question is what an original-language word means.",
    inputSchema: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          description:
            'Strong\'s identifier: "H430" for Hebrew, "G2316" for Greek. A bare number like "430" also works if `language` is given.',
        },
        word: {
          type: 'string',
          description:
            'A word to look up instead of a number. Accepts the original script ("אלהים", "θεός") or a transliteration ("elohim", "theos"). Vowel points and accents are ignored.',
        },
        language: {
          type: 'string',
          enum: ['hebrew', 'greek'],
          description:
            'Restricts the search, and is required when `number` is given without an H or G prefix.',
        },
        translation_language: {
          type: 'string',
          description:
            'Language for the definitions: en, pt-br, es, fr, de, it, zh, ru, ko. Defaults to the connection language, or English.',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: MAX_LIMIT,
          description: `Maximum entries when searching by word. Default: ${DEFAULT_LIMIT}; max: ${MAX_LIMIT}.`,
        },
      },
    },
    outputSchema: STRONGS_OUTPUT_SCHEMA,
    annotations: {
      title: "Get Strong's lexicon entry",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },

  async handler(args, ctx) {
    const numberInput = String(args.number ?? '').trim();
    const wordInput = String(args.word ?? '').trim();

    if (!numberInput && !wordInput) {
      return textResult(
        'Give either `number` (for example "H430") or `word` (for example "elohim").',
        true,
      );
    }

    const resolved = resolveStudyLocale(ctx, args.translation_language);
    if (!resolved.ok) return textResult(resolved.message, true);
    const { locale } = resolved;

    const language = normalizeLanguage(args.language);

    // Entrada é validada antes do binding: um pedido malformado merece um erro
    // de pedido malformado, esteja o léxico disponível ou não.
    const parsed = numberInput ? parseStrongsId(numberInput, language) : null;
    if (numberInput && !parsed) {
      return textResult(
        `Could not read "${numberInput}" as a Strong's number. Use "H430", "G2316", or a bare number together with \`language\`.`,
        true,
      );
    }

    if (!ctx.env.SEARCH_DB) {
      return textResult("Strong's lexicon is temporarily unavailable.", true);
    }

    if (parsed) {
      const entry = await strongsByNumber(
        ctx.env,
        parsed.number,
        parsed.language,
        locale,
      );
      if (!entry) {
        const prefix = parsed.language === 'hebrew' ? 'H' : 'G';
        return textResult(
          `No Strong's entry ${prefix}${parsed.number}.`,
        );
      }

      return dualResult(formatEntry(entry), {
        entries: [structuredEntry(entry)],
      });
    }

    const entries = await strongsByWord(
      ctx.env,
      wordInput,
      locale,
      clampLimit(args.limit),
      language,
    );

    if (entries.length === 0) {
      return textResult(
        `No Strong's entry matches "${wordInput}". Try the original script, a different transliteration, or a Strong's number.`,
      );
    }

    const header =
      entries.length === 1
        ? `## Strong's entry for "${wordInput}"`
        : `## ${entries.length} Strong's entries for "${wordInput}"`;

    return dualResult([header, '', ...entries.map(formatEntry)].join('\n\n'), {
      entries: entries.map(structuredEntry),
    });
  },
};
