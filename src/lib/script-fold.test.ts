import { describe, expect, it } from 'vitest';
import { foldArabic, foldHebrew, normalizeText, parseQuery } from './search-index';

// A SVD como está no banco: João 3:16 todo vocalizado, com alef wasla.
// WLC, Gênesis 1:1, com niqqud e sof pasuq.
const GENESIS_1_1 = 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ ׃';

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

});

describe('hebraico sem niqqud', () => {
  it('dobra o texto na forma que se digita', () => {
    expect(foldHebrew(GENESIS_1_1).trim()).toBe('בראשית ברא אלהים את השמים ואת הארץ');
    expect(foldHebrew('כָּל־הָאָרֶץ')).toBe('כל הארץ');
  });

  it('a query vira token inteiro, com ou sem niqqud', () => {
    expect(parseQuery('אלהים')?.match).toBe('"אלהים"');
    expect(parseQuery('אֱלֹהִים')?.match).toBe('"אלהים"');
  });
});

describe('seed e Worker', () => {
  it('dobram igual', async () => {
    // @ts-expect-error script .mjs sem tipos
    const seed = await import('../../scripts/seed-mcp-versions.mjs');
    expect(seed.foldArabic(JOHN_3_16)).toBe(foldArabic(JOHN_3_16));
    expect(seed.foldHebrew(GENESIS_1_1)).toBe(foldHebrew(GENESIS_1_1));
  });
});
