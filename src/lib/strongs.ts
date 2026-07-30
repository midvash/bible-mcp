import type { Env } from '../env';
import { normalizeText, type IndexLocale } from './search-index';

/**
 * Léxico Strong: 8.674 verbetes hebraicos e 5.523 gregos, cada um com lema,
 * transliteração e definição traduzida nos 9 idiomas do Midvash.
 *
 * Cópia de `bible-config.strongs_entries` no D1 próprio do MCP — aquele banco
 * guarda usuário, sessão e credencial na mesma base e não pode ser ligado aqui.
 *
 * LIMITE IMPORTANTE: não há alinhamento palavra↔número. O texto `osmh` no R2
 * ("Open Scriptures Morphological Hebrew") chega sem as marcas morfológicas, e
 * sem elas não é possível dizer qual Strong corresponde a qual palavra de um
 * versículo. Por isso existe consulta por número e por lema, e **não** existe
 * uma tool que abra um versículo palavra por palavra: dado de estudo errado é
 * pior que dado ausente.
 */

export type StrongsLanguage = 'hebrew' | 'greek';

export interface StrongsEntry {
  /** `H430`, `G2316`. */
  id: string;
  number: number;
  language: StrongsLanguage;
  /** A palavra na escrita original. */
  lemma: string;
  transliteration: string | null;
  pronunciation: string | null;
  partOfSpeech: string | null;
  /** De onde a palavra deriva, no idioma pedido quando houver tradução. */
  derivation: string | null;
  /** Definição de Strong, no idioma pedido quando houver tradução. */
  definition: string | null;
  /** Como a KJV traduz a palavra. Só em inglês na fonte. */
  kjvDefinition: string | null;
  /** Sentidos numerados, no idioma pedido quando houver tradução. */
  outline: string | null;
}

/**
 * Sufixo de coluna por locale. As traduções ficam em colunas irmãs
 * (`definition_pt`, `outline_es`, …); inglês é a coluna base, sem sufixo.
 */
const COLUMN_SUFFIX: Record<IndexLocale, string> = {
  en: '',
  'pt-br': '_pt',
  es: '_es',
  de: '_de',
  fr: '_fr',
  it: '_it',
  zh: '_zh',
  ru: '_ru',
  ko: '_ko',
};

interface StrongsRow {
  id: string;
  number: number;
  language: string;
  lemma: string;
  transliteration: string | null;
  pronunciation: string | null;
  part_of_speech: string | null;
  derivation: string | null;
  derivation_localized: string | null;
  definition: string | null;
  strongs_def: string | null;
  definition_localized: string | null;
  kjv_def: string | null;
  outline: string | null;
  outline_localized: string | null;
}

/**
 * Colunas a selecionar. As localizadas ganham alias fixo, então o mapeamento
 * para `StrongsEntry` não depende do locale.
 *
 * O sufixo vem de uma tabela fechada, nunca da entrada do usuário — é o único
 * pedaço interpolado nesta consulta.
 */
function selectColumns(locale: IndexLocale): string {
  const s = COLUMN_SUFFIX[locale];
  const localized = (base: string) =>
    s === '' ? `NULL AS ${base}_localized` : `${base}${s} AS ${base}_localized`;

  return [
    'id',
    'number',
    'language',
    'lemma',
    'transliteration',
    'pronunciation',
    'part_of_speech',
    'derivation',
    localized('derivation'),
    'definition',
    'strongs_def',
    localized('definition'),
    'kjv_def',
    'outline',
    localized('outline'),
  ].join(', ');
}

function toEntry(row: StrongsRow): StrongsEntry {
  return {
    id: row.id,
    number: row.number,
    language: row.language === 'greek' ? 'greek' : 'hebrew',
    lemma: row.lemma,
    transliteration: row.transliteration,
    pronunciation: row.pronunciation,
    partOfSpeech: row.part_of_speech,
    derivation: row.derivation_localized ?? row.derivation,
    // `strongs_def` é a definição clássica; `definition` costuma ser um resumo.
    definition:
      row.definition_localized ?? row.strongs_def ?? row.definition,
    kjvDefinition: row.kjv_def,
    outline: row.outline_localized ?? row.outline,
  };
}

/**
 * Interpreta um identificador Strong. Aceita `H430`, `h430`, `G2316` e o número
 * puro — que exige `language`, porque 430 existe nas duas línguas.
 */
export function parseStrongsId(
  input: string,
  language?: StrongsLanguage,
): { number: number; language: StrongsLanguage } | null {
  const raw = input.trim();

  const prefixed = /^([HhGg])\s*0*(\d+)$/.exec(raw);
  if (prefixed) {
    return {
      number: parseInt(prefixed[2], 10),
      language: prefixed[1].toLowerCase() === 'h' ? 'hebrew' : 'greek',
    };
  }

  const bare = /^0*(\d+)$/.exec(raw);
  if (bare && language) {
    return { number: parseInt(bare[1], 10), language };
  }

  return null;
}

/** Verbete por número, ou null. */
export async function strongsByNumber(
  env: Env,
  number: number,
  language: StrongsLanguage,
  locale: IndexLocale,
): Promise<StrongsEntry | null> {
  const db = env.SEARCH_DB;
  if (!db) throw new Error('SEARCH_DB binding não disponível.');

  const row = await db
    .prepare(
      `SELECT ${selectColumns(locale)} FROM strongs_entries ` +
        'WHERE language = ? AND number = ? LIMIT 1',
    )
    .bind(language, number)
    .first<StrongsRow>();

  return row ? toEntry(row) : null;
}

/**
 * Verbetes por palavra: casa o lema na escrita original ou a transliteração.
 *
 * O lema é gravado com vogais (`אֱלֹהִים`), então a comparação é feita sobre a
 * forma normalizada — mesma normalização da busca, que remove niqqud e acento.
 * Isso significa varrer os verbetes do idioma na aplicação; são 8.674 no maior
 * caso, uma única consulta, e o resultado entra no cache de respostas.
 */
export async function strongsByWord(
  env: Env,
  word: string,
  locale: IndexLocale,
  limit: number,
  language?: StrongsLanguage,
): Promise<StrongsEntry[]> {
  const db = env.SEARCH_DB;
  if (!db) throw new Error('SEARCH_DB binding não disponível.');

  const filters: string[] = [];
  const params: unknown[] = [];
  if (language) {
    filters.push('language = ?');
    params.push(language);
  }

  const { results } = await db
    .prepare(
      `SELECT ${selectColumns(locale)} FROM strongs_entries` +
        (filters.length ? ` WHERE ${filters.join(' AND ')}` : ''),
    )
    .bind(...params)
    .all<StrongsRow>();

  const needle = normalizeText(word);
  const exact: StrongsRow[] = [];
  const partial: StrongsRow[] = [];

  for (const row of results ?? []) {
    const lemma = normalizeText(row.lemma);
    const translit = row.transliteration
      ? normalizeText(row.transliteration)
      : '';

    if (lemma === needle || translit === needle) exact.push(row);
    else if (lemma.includes(needle) || translit.includes(needle)) {
      partial.push(row);
    }
  }

  return [...exact, ...partial].slice(0, limit).map(toEntry);
}
