import { describe, expect, it } from 'vitest';
import type { ConnectionContext } from './context';
import { toolCacheKey } from './tool-cache';

function ctx(overrides: Partial<ConnectionContext> = {}): ConnectionContext {
  return {
    allowedVersions: null,
    allowedLanguages: null,
    nanoId: 'test',
    env: {} as ConnectionContext['env'],
    ...overrides,
  };
}

const key = (...args: Parameters<typeof toolCacheKey>) =>
  toolCacheKey(...args).then((r) => r.url);

describe('toolCacheKey', () => {
  it('is stable for the same call', async () => {
    const a = await key('search_bible', { query: 'love' }, ctx());
    const b = await key('search_bible', { query: 'love' }, ctx());
    expect(a).toBe(b);
  });

  it('ignores argument ordering', async () => {
    const a = await key('search_bible', { query: 'love', limit: 5 }, ctx());
    const b = await key('search_bible', { limit: 5, query: 'love' }, ctx());
    expect(a).toBe(b);
  });

  it('separates different arguments', async () => {
    const a = await key('search_bible', { query: 'love' }, ctx());
    const b = await key('search_bible', { query: 'hope' }, ctx());
    expect(a).not.toBe(b);
  });

  it('separates different tools', async () => {
    const a = await key('search_bible', { query: 'love' }, ctx());
    const b = await key('search_study', { query: 'love' }, ctx());
    expect(a).not.toBe(b);
  });

  it('separates connections with different version filters', async () => {
    // Sem isso, uma conexão restrita a NVI receberia a resposta gerada para
    // uma conexão sem restrição.
    const open = await key('list_versions', {}, ctx());
    const narrow = await key(
      'list_versions',
      {},
      ctx({ allowedVersions: ['nvi'] }),
    );
    expect(open).not.toBe(narrow);
  });

  it('separates connections with different language filters', async () => {
    const open = await key('list_versions', {}, ctx());
    const narrow = await key(
      'list_versions',
      {},
      ctx({ allowedLanguages: ['pt-br'] }),
    );
    expect(open).not.toBe(narrow);
  });

  it('ignores the nanoId, which only labels logs', async () => {
    const a = await key('search_bible', { query: 'love' }, ctx({ nanoId: 'a' }));
    const b = await key('search_bible', { query: 'love' }, ctx({ nanoId: 'b' }));
    expect(a).toBe(b);
  });

  it('produces a namespaced, versioned URL', async () => {
    // A versão faz parte da chave: subir CACHE_VERSION invalida tudo de uma
    // vez, o que é o que impede uma resposta do código anterior de ser servida
    // por até 24 horas depois de um deploy que mude a saída.
    const url = await key('search_bible', { query: 'love' }, ctx());
    expect(url).toMatch(
      /^https:\/\/mcp\.midvash\.com\/_toolcache\/v\d+\/search_bible\/[0-9a-f]{64}$/,
    );
  });
});
