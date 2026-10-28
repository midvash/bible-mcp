import { describe, expect, it } from 'vitest';
import type { ConnectionContext } from './context';
import {
  buildConnectionContext,
  isLanguageAllowed,
  isVersionAllowed,
} from './context';

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
    expect(isVersionAllowed(ctx(), 'onbv')).toBe(true);
    expect(isLanguageAllowed(ctx(), 'en')).toBe(true);
  });

  it('filters versions by slug', () => {
    const connection = ctx({ allowedVersions: ['onbv'] });

    expect(isVersionAllowed(connection, 'onbv')).toBe(true);
    expect(isVersionAllowed(connection, 'kjv')).toBe(false);
  });

  it('normalizes pt language filters to include Brazilian and Portugal Portuguese', () => {
    const connection = ctx({ allowedLanguages: ['pt'] });

    expect(isLanguageAllowed(connection, 'pt-br')).toBe(true);
    expect(isLanguageAllowed(connection, 'pt-pt')).toBe(true);
    expect(isLanguageAllowed(connection, 'en')).toBe(false);
  });

  it('maps a version that left (?v=nvi) to the free one that answers for it', () => {
    const c = buildConnectionContext(
      new URL('https://mcp.midvash.com/mcp/x?v=NVI,onbv,esv'),
      'x',
      {} as ConnectionContext['env'],
    );
    expect(c.allowedVersions).toEqual(['onbv', 'bsb']);
  });
});
