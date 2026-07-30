import { describe, expect, it } from 'vitest';
import {
  MAX_REFERENCES,
  parseReference,
  parseReferenceList,
  splitReferences,
} from './reference-parser';

function parse(input: string) {
  const result = parseReference(input);
  if (!result.ok) throw new Error(`expected "${input}" to parse: ${result.error}`);
  return result.reference;
}

function refuse(input: string) {
  const result = parseReference(input);
  if (result.ok) throw new Error(`expected "${input}" to be rejected`);
  return result.error;
}

describe('parseReference', () => {
  it('parses a single verse in Portuguese', () => {
    const r = parse('João 3:16');
    expect(r.book.names.en).toBe('John');
    expect(r.chapter).toBe(3);
    expect(r.verseStart).toBe(16);
    expect(r.verseEnd).toBe(16);
    expect(r.endChapter).toBeUndefined();
  });

  it('parses a verse range in English', () => {
    const r = parse('Romans 8:1-11');
    expect(r.chapter).toBe(8);
    expect(r.verseStart).toBe(1);
    expect(r.verseEnd).toBe(11);
  });

  it('parses a whole chapter', () => {
    const r = parse('Salmos 23');
    expect(r.book.names.en).toBe('Psalms');
    expect(r.chapter).toBe(23);
    expect(r.verseStart).toBeUndefined();
  });

  it('parses a book whose name starts with a number', () => {
    expect(parse('1 Coríntios 13').book.names.en).toBe('1 Corinthians');
    expect(parse('1Sm 17:45-47').book.names.en).toBe('1 Samuel');
  });

  it('accepts a dot as the chapter/verse separator', () => {
    const r = parse('John 3.16');
    expect(r.chapter).toBe(3);
    expect(r.verseStart).toBe(16);
  });

  // ─── Cruzando capítulos (B8) ──────────────────────────────────────────

  it('parses a range that crosses chapters', () => {
    const r = parse('Romans 8:1-9:5');
    expect(r.chapter).toBe(8);
    expect(r.verseStart).toBe(1);
    expect(r.endChapter).toBe(9);
    expect(r.verseEnd).toBe(5);
  });

  it('allows the end verse to be lower when chapters differ', () => {
    // 8:20-9:5 é válido: o 5 está no capítulo seguinte.
    const r = parse('Romans 8:20-9:5');
    expect(r.endChapter).toBe(9);
    expect(r.verseEnd).toBe(5);
  });

  it('parses a range of whole chapters', () => {
    const r = parse('Gênesis 1-3');
    expect(r.chapter).toBe(1);
    expect(r.endChapter).toBe(3);
    expect(r.verseStart).toBeUndefined();
  });

  it('accepts en dash and em dash', () => {
    expect(parse('Romans 8:1–11').verseEnd).toBe(11);
    expect(parse('Romans 8:1—11').verseEnd).toBe(11);
  });

  it('drops a redundant end chapter equal to the start', () => {
    expect(parse('John 3:1-3:5').endChapter).toBeUndefined();
    expect(parse('John 3:1-3:5').verseEnd).toBe(5);
  });

  // ─── Recusas ──────────────────────────────────────────────────────────

  it('rejects an out-of-range chapter, in English', () => {
    expect(refuse('John 99')).toContain('Invalid chapter');
  });

  it('rejects an out-of-range end chapter', () => {
    expect(refuse('John 20:1-99:2')).toContain('Invalid chapter');
  });

  it('rejects an end chapter before the start', () => {
    expect(refuse('John 9:1-3:2')).toContain('comes before');
  });

  it('rejects an end verse before the start in the same chapter', () => {
    expect(refuse('John 3:16-2')).toContain('comes before');
  });

  it('rejects an unknown book', () => {
    expect(refuse('Livro Inexistente 3')).toContain('Book not found');
  });

  it('rejects an unreadable reference', () => {
    expect(refuse('John')).toContain('Could not read');
    expect(refuse('')).toContain('Empty reference');
  });
});

describe('splitReferences', () => {
  it('splits on semicolons', () => {
    expect(splitReferences('John 3:16; Romans 8:1')).toEqual([
      'John 3:16',
      'Romans 8:1',
    ]);
  });

  it('splits on a comma when a new book follows', () => {
    expect(splitReferences('John 3:16, Romans 8:1')).toEqual([
      'John 3:16',
      'Romans 8:1',
    ]);
  });

  it('keeps a comma that separates verse numbers', () => {
    // "Gênesis 1:1, 3" é uma lista de versículos, não duas referências.
    expect(splitReferences('Gênesis 1:1, 3')).toEqual(['Gênesis 1:1, 3']);
  });

  it('splits on newlines', () => {
    expect(splitReferences('John 3:16\nRomans 8:1')).toHaveLength(2);
  });

  it('ignores empty segments', () => {
    expect(splitReferences('John 3:16;;  ; Romans 8:1')).toHaveLength(2);
  });
});

describe('parseReferenceList', () => {
  it('parses several references at once', () => {
    const result = parseReferenceList('John 3:16; Romans 8:1');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.references.map((r) => r.book.names.en)).toEqual([
      'John',
      'Romans',
    ]);
  });

  it('fails the whole call when one reference is bad', () => {
    // Meia resposta silenciosa é pior que um erro claro.
    const result = parseReferenceList('John 3:16; Nowhere 1:1');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain('Book not found');
  });

  it('caps how many references one call may ask for', () => {
    const many = Array.from({ length: MAX_REFERENCES + 1 }, () => 'John 3:16').join(
      '; ',
    );
    const result = parseReferenceList(many);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain('Too many references');
  });
});
