import { describe, expect, it } from 'vitest';
import { BOOKS } from '../data/books';
import { VERSIONS } from '../data/versions';
import { formatChapter, formatVerse, withAttribution } from './markdown';

const JOHN = BOOKS.find((b) => b.id === 43)!;
const KJV = VERSIONS.find((v) => v.slug === 'kjv')!;
const ONBV = VERSIONS.find((v) => v.slug === 'onbv')!;
const NVA = VERSIONS.find((v) => v.slug === 'nva')!;

describe('attribution', () => {
  it('ends the text of a CC BY-SA version with its credit, in italics', () => {
    const text = formatVerse(JOHN, ONBV, 3, 16, 16, ['Porque Deus amou o mundo']);
    expect(text.split('\n').at(-1)).toBe(`_${ONBV.copyright}_`);
  });

  it('adds nothing to a version that does not ask for credit', () => {
    const text = formatChapter(JOHN, KJV, 3, ['In the beginning']);
    expect(text).not.toContain('_');
  });

  it('can be left out, for callers that credit once at the end', () => {
    const text = formatChapter(JOHN, ONBV, 3, ['x'], { attribution: false });
    expect(text).not.toContain(ONBV.copyright!);
  });

  it('prints each credit once, even when a version repeats', () => {
    const text = withAttribution('body', [ONBV, KJV, ONBV, NVA]);
    expect(text).toBe(`body\n\n_${ONBV.copyright}_\n\n_${NVA.copyright}_`);
  });
});
