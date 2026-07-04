import { describe, expect, it } from 'vitest';
import type { ConnectionContext } from '../lib/context';
import { listVersionsTool } from './list-versions';

function ctx(overrides: Partial<ConnectionContext> = {}): ConnectionContext {
  return {
    allowedVersions: null,
    allowedLanguages: null,
    nanoId: 'test',
    env: {} as ConnectionContext['env'],
    ...overrides,
  };
}

async function callListVersions(
  args: Record<string, unknown>,
  overrides: Partial<ConnectionContext> = {},
): Promise<string> {
  const result = await listVersionsTool.handler(
    args,
    ctx(overrides),
    {} as ExecutionContext,
  );
  return result.content[0].text;
}

describe('list_versions', () => {
  it('filters by explicit language', async () => {
    const text = await callListVersions({ language: 'en' });

    expect(text).toContain('### en');
    expect(text).toContain('King James Version');
    expect(text).not.toContain('### pt-br');
  });

  it('normalizes pt to include Brazilian and Portugal Portuguese', async () => {
    const text = await callListVersions({ language: 'pt' });

    expect(text).toContain('### pt-br');
    expect(text).toContain('### pt-pt');
  });

  it('respects versions enabled by connection URL', async () => {
    const text = await callListVersions(
      {},
      { allowedVersions: ['nvi', 'kjv'] },
    );

    expect(text).toContain('Nova Versão Internacional');
    expect(text).toContain('King James Version');
    expect(text).not.toContain('Almeida Revista e Atualizada');
  });

  it('respects language filters enabled by connection URL', async () => {
    const text = await callListVersions({}, { allowedLanguages: ['es'] });

    expect(text).toContain('### es');
    expect(text).toContain('Reina-Valera');
    expect(text).not.toContain('### en');
  });
});
