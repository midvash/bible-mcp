import { describe, expect, it } from 'vitest';
import { foldArabic, normalizeText, parseQuery } from './search-index';

// A SVD como está no banco: João 3:16 todo vocalizado, com alef wasla.
const JOHN_3_16 =
  'لِأَنَّهُ هَكَذَا أَحَبَّ ٱللهُ ٱلْعَالَمَ حَتَّى بَذَلَ ٱبْنَهُ ٱلْوَحِيدَ';

describe('árabe sem sinais de vogal', () => {
  it('dobra o texto vocalizado na forma que se digita', () => {
    expect(foldArabic(JOHN_3_16)).toContain('الله');
    expect(foldArabic(JOHN_3_16)).toContain('العالم');
    expect(foldArabic('مُوسَى')).toBe('موسي');
  });

  it('a query vira token inteiro, com ou sem vogais', () => {
    expect(parseQuery('الله')?.match).toBe('"الله"');
    expect(parseQuery('ٱللهُ')?.match).toBe('"الله"');
    expect(normalizeText(JOHN_3_16)).toContain('الله');
  });

  it('não mexe em outras escritas', () => {
    expect(foldArabic('Coração ἀγάπη בְּרֵאשִׁית')).toBe('Coração ἀγάπη בְּרֵאשִׁית');
  });

  it('o seed dobra igual ao Worker', async () => {
    // @ts-expect-error script .mjs sem tipos
    const seed = await import('../../scripts/seed-mcp-versions.mjs');
    expect(seed.foldArabic(JOHN_3_16)).toBe(foldArabic(JOHN_3_16));
  });
});
