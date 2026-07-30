import { describe, expect, it } from 'vitest';
import { parseStrongsId } from './strongs';

describe('parseStrongsId', () => {
  it('reads a prefixed Hebrew identifier', () => {
    expect(parseStrongsId('H430')).toEqual({ number: 430, language: 'hebrew' });
  });

  it('reads a prefixed Greek identifier', () => {
    expect(parseStrongsId('G2316')).toEqual({ number: 2316, language: 'greek' });
  });

  it('accepts lowercase prefixes and surrounding space', () => {
    expect(parseStrongsId(' g26 ')).toEqual({ number: 26, language: 'greek' });
  });

  it('accepts a space after the prefix', () => {
    expect(parseStrongsId('H 430')).toEqual({ number: 430, language: 'hebrew' });
  });

  it('strips leading zeros', () => {
    expect(parseStrongsId('H0430')).toEqual({ number: 430, language: 'hebrew' });
  });

  it('accepts a bare number when the language is given', () => {
    // 430 existe em hebraico e em grego, então o número puro é ambíguo.
    expect(parseStrongsId('430', 'greek')).toEqual({
      number: 430,
      language: 'greek',
    });
  });

  it('rejects a bare number with no language', () => {
    expect(parseStrongsId('430')).toBeNull();
  });

  it('rejects anything that is not an identifier', () => {
    expect(parseStrongsId('elohim')).toBeNull();
    expect(parseStrongsId('X430')).toBeNull();
    expect(parseStrongsId('')).toBeNull();
    expect(parseStrongsId('H')).toBeNull();
  });
});
