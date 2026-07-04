import { describe, expect, it } from 'vitest';
import { parseReference } from './reference-parser';

describe('parseReference', () => {
  it('parses a single verse in Portuguese', () => {
    const result = parseReference('João 3:16');

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reference.book.names.en).toBe('John');
    expect(result.reference.chapter).toBe(3);
    expect(result.reference.verseStart).toBe(16);
    expect(result.reference.verseEnd).toBe(16);
  });

  it('parses a verse range in English', () => {
    const result = parseReference('Romans 8:1-11');

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reference.book.names.en).toBe('Romans');
    expect(result.reference.chapter).toBe(8);
    expect(result.reference.verseStart).toBe(1);
    expect(result.reference.verseEnd).toBe(11);
  });

  it('parses a whole chapter', () => {
    const result = parseReference('Salmos 23');

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reference.book.names.en).toBe('Psalms');
    expect(result.reference.chapter).toBe(23);
    expect(result.reference.verseStart).toBeUndefined();
  });

  it('rejects invalid chapters', () => {
    const result = parseReference('John 99');

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain('Capítulo inválido');
  });
});
