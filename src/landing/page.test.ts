import { describe, expect, it } from 'vitest';
import { renderLandingPage, languageLabels } from './page';
import {
  SUPPORTED_LOCALES,
  TRANSLATIONS,
  LANDING_TOOLS,
  DEFAULT_VERSION_BY_LOCALE,
  pathForLocale,
} from './i18n';
import { VERSIONS } from '../data/versions';
import { TOOLS } from '../tools';

const languageCount = new Set(VERSIONS.map((v) => v.language)).size;

describe('landing: contagens batem com o código', () => {
  it('o catálogo tem 99 versões em 68 idiomas', () => {
    expect(VERSIONS).toHaveLength(99);
    expect(languageCount).toBe(68);
  });

  it('a lista de tools da landing é a mesma do servidor', () => {
    const served = TOOLS.map((t) => t.definition.name).sort();
    expect([...LANDING_TOOLS].sort()).toEqual(served);
  });

  it('a versão pré-marcada de cada idioma existe e é desse idioma', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const v = VERSIONS.find((x) => x.slug === DEFAULT_VERSION_BY_LOCALE[locale]);
      expect(v, locale).toBeDefined();
      expect(v!.language).toBe(locale);
    }
  });
});

describe.each(SUPPORTED_LOCALES)('landing %s', (locale) => {
  const html = renderLandingPage(locale);
  const t = TRANSLATIONS[locale];
  const copy = JSON.stringify({ ...t, footer: undefined });

  it('tem title e description de tamanho bom pra busca', () => {
    expect(t.meta.title.length).toBeLessThanOrEqual(60);
    expect(t.meta.description.length).toBeGreaterThanOrEqual(70);
    expect(t.meta.description.length).toBeLessThanOrEqual(160);
  });

  it('tem um único h1, canonical própria e hreflang dos 9 idiomas + x-default', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toContain(
      `<link rel="canonical" href="https://mcp.midvash.com${pathForLocale(locale)}">`,
    );
    for (const l of SUPPORTED_LOCALES) {
      expect(html).toContain(`hreflang="${l}" href="https://mcp.midvash.com${pathForLocale(l)}"`);
    }
    expect(html).toContain('hreflang="x-default"');
  });

  it('JSON-LD é JSON válido', () => {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    expect(blocks.length).toBeGreaterThan(0);
    for (const b of blocks) expect(() => JSON.parse(b[1])).not.toThrow();
  });

  it('copy cita as contagens certas e não tem travessão', () => {
    expect(copy).not.toContain('—');
    expect(copy).toMatch(/99/);
    expect(copy).toMatch(/68/);
  });

  it('não cita versões que saíram do catálogo', () => {
    for (const gone of ['NIV', 'ESV', 'NVI', 'ARA', 'NVT', 'NLT', 'NTV', 'RVR1960', 'ACF', 'ARC', 'KJF']) {
      expect(copy).not.toMatch(new RegExp(`\\b${gone}\\b`));
    }
  });

  it('dá nome legível a todos os idiomas do catálogo', () => {
    const labels = languageLabels(locale);
    expect(Object.keys(labels)).toHaveLength(languageCount);
  });
});
