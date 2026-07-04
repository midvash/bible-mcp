import { describe, expect, it } from 'vitest';
import type { ConnectionContext } from './context';
import { isLanguageAllowed, isVersionAllowed } from './context';

function ctx(overrides: Partial<ConnectionContext> = {}): ConnectionContext {
  return {
    allowedVersions: null,
    allowedLanguages: null,
    nanoId: 'test',
    env: {} as ConnectionContext['env'],
    ...overrides,
  };
}

describe('connection context filters', () => {
  it('allows every version and language by default', () => {
    expect(isVersionAllowed(ctx(), 'nvi')).toBe(true);
    expect(isLanguageAllowed(ctx(), 'en')).toBe(true);
  });

  it('filters versions by slug', () => {
    const connection = ctx({ allowedVersions: ['nvi'] });

    expect(isVersionAllowed(connection, 'nvi')).toBe(true);
    expect(isVersionAllowed(connection, 'kjv')).toBe(false);
  });

  it('normalizes pt language filters to include Brazilian and Portugal Portuguese', () => {
    const connection = ctx({ allowedLanguages: ['pt'] });

    expect(isLanguageAllowed(connection, 'pt-br')).toBe(true);
    expect(isLanguageAllowed(connection, 'pt-pt')).toBe(true);
    expect(isLanguageAllowed(connection, 'en')).toBe(false);
  });
});
