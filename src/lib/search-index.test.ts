import { describe, expect, it } from 'vitest';
import {
  indexLocaleForLanguage,
  indexVersionForLocale,
  normalizeText,
  parseQuery,
  textMatchesQuery,
  trigramMatch,
} from './search-index';

describe('normalizeText', () => {
  it('strips accents and lowercases', () => {
    expect(normalizeText('Coração')).toBe('coracao');
    expect(normalizeText('ÁGAPE')).toBe('agape');
  });

  it('strips Hebrew niqqud so the consonants can be matched', () => {
    // WLC grava Gênesis 1:1 com vogais intercaladas — 11 codepoints para
    // 6 letras. Sem remover, buscar בראשית não achava nada.
    expect(normalizeText('בְּרֵאשִׁית')).toBe('בראשית');
    expect(normalizeText('אֱלֹהִים')).toBe('אלהים');
  });

  it('turns the Hebrew maqaf into a space instead of gluing words', () => {
    expect(normalizeText('עַל־פְּנֵי')).toBe('על פני');
  });

  it('drops the Hebrew sof pasuq', () => {
    expect(normalizeText('הָאָרֶץ ׃')).toBe('הארץ ');
  });

  it('unifies final sigma with sigma', () => {
    // ς e σ são a mesma letra; quem digita "ουτωσ" precisa achar "ουτως".
    expect(normalizeText('ουτως')).toBe(normalizeText('ουτωσ'));
    expect(normalizeText('θεος')).toBe('θεοσ');
  });

  it('strips polytonic Greek diacritics', () => {
    expect(normalizeText('ἀγάπη')).toBe('αγαπη');
  });
});

describe('parseQuery', () => {
  it('quotes a single term', () => {
    expect(parseQuery('amor')?.match).toBe('"amor"');
  });

  it('requires every term when the query is loose', () => {
    expect(parseQuery('amor de deus')?.match).toBe('"amor" AND "de" AND "deus"');
  });

  it('treats a quoted query as one phrase', () => {
    const parsed = parseQuery('"amor de deus"');
    expect(parsed?.match).toBe('"amor de deus"');
    expect(parsed?.phrase).toBe(true);
  });

  it('neutralizes FTS5 operators so they cannot break the query', () => {
    // Sem o escape, `OR *` seria sintaxe do FTS5 e derrubaria a consulta.
    expect(parseQuery('deus OR *')?.match).toBe('"deus" AND "OR"');
    expect(parseQuery('paz NEAR(guerra)')?.match).toBe(
      '"paz" AND "NEAR" AND "guerra"',
    );
  });

  it('escapes embedded double quotes', () => {
    expect(parseQuery('a"b')?.match).toBe('"a" AND "b"');
  });

  it('normalizes tokens for cross-version checking', () => {
    expect(parseQuery('Coração')?.tokens).toEqual(['coracao']);
  });

  it('returns null when there is nothing searchable', () => {
    expect(parseQuery('')).toBeNull();
    expect(parseQuery('   ')).toBeNull();
    expect(parseQuery('!!! ??? ...')).toBeNull();
  });
});

describe('trigramMatch', () => {
  it('drops terms shorter than the trigram minimum', () => {
    const parsed = parseQuery('de ressurreicao')!;
    expect(trigramMatch(parsed)).toBe('"ressurreicao"');
  });

  it('returns null when every term is too short', () => {
    expect(trigramMatch(parseQuery('de o a')!)).toBeNull();
  });
});

describe('indexLocaleForLanguage', () => {
  it('maps Portuguese variants to the pt-br index', () => {
    expect(indexLocaleForLanguage('pt-br')).toBe('pt-br');
    expect(indexLocaleForLanguage('pt-pt')).toBe('pt-br');
    expect(indexLocaleForLanguage('pt')).toBe('pt-br');
  });

  it('passes through indexed locales', () => {
    expect(indexLocaleForLanguage('en')).toBe('en');
    expect(indexLocaleForLanguage('zh')).toBe('zh');
  });

  it('returns null for source languages with no index', () => {
    expect(indexLocaleForLanguage('he')).toBeNull();
    expect(indexLocaleForLanguage('gr')).toBeNull();
    expect(indexLocaleForLanguage('la')).toBeNull();
  });
});

describe('indexVersionForLocale', () => {
  it('names the reference version of each locale', () => {
    expect(indexVersionForLocale('pt-br')).toBe('naa');
    expect(indexVersionForLocale('en')).toBe('niv');
  });
});

describe('textMatchesQuery', () => {
  it('ignores accents and case', () => {
    const parsed = parseQuery('coracao alegre')!;
    expect(textMatchesQuery('O CORAÇÃO alegre embeleza o rosto', parsed)).toBe(
      true,
    );
  });

  it('requires every term', () => {
    const parsed = parseQuery('coracao alegre')!;
    expect(textMatchesQuery('O coração angustiado oprime', parsed)).toBe(false);
  });

  it('requires adjacency for a phrase', () => {
    const parsed = parseQuery('"amor de deus"')!;
    expect(textMatchesQuery('o amor de Deus foi derramado', parsed)).toBe(true);
    expect(textMatchesQuery('o amor que vem de Deus', parsed)).toBe(false);
  });
});
