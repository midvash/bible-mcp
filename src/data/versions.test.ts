import { describe, expect, it } from 'vitest';
import { VERSION_ALIASES, VERSIONS } from './versions';

describe('VERSION_ALIASES', () => {
  const slugs = new Set(VERSIONS.map((v) => v.slug));

  it('points every alias at a version the server has', () => {
    for (const [from, to] of Object.entries(VERSION_ALIASES)) {
      expect(slugs.has(from), `${from} should not be live`).toBe(false);
      expect(slugs.has(to), `${from} → ${to}`).toBe(true);
    }
  });
});
