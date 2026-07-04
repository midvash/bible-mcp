import { describe, expect, it } from 'vitest';
import { lookupBook } from './books-lookup';

describe('lookupBook', () => {
  it('finds books by localized names and abbreviations', () => {
    expect(lookupBook('João')?.names.en).toBe('John');
    expect(lookupBook('Gen')?.names.en).toBe('Genesis');
    expect(lookupBook('1 Sm')?.names.en).toBe('1 Samuel');
    expect(lookupBook('Apocalipsis')?.names.en).toBe('Revelation');
  });

  it('normalizes accents, spaces, dots, and roman numeric prefixes', () => {
    expect(lookupBook('1João')?.names.en).toBe('1 John');
    expect(lookupBook('I John')?.names.en).toBe('1 John');
    expect(lookupBook('Êx.')?.names.en).toBe('Exodus');
  });

  it('returns null for unknown books', () => {
    expect(lookupBook('Not a book')).toBeNull();
  });
});
