import { describe, expect, it } from 'vitest';
import type { ConnectionContext } from '../lib/context';
import { searchBibleTool } from './search-bible';

function ctx(overrides: Partial<ConnectionContext> = {}): ConnectionContext {
  return {
    allowedVersions: null,
    allowedLanguages: null,
    nanoId: 'test',
    // Sem SEARCH_DB: exercita as guardas que rodam antes de qualquer I/O.
    env: {} as ConnectionContext['env'],
    ...overrides,
  };
}

async function callSearch(
  args: Record<string, unknown>,
  overrides: Partial<ConnectionContext> = {},
) {
  const result = await searchBibleTool.handler(
    args,
    ctx(overrides),
    {} as ExecutionContext,
  );
  return { text: result.content[0].text, isError: result.isError === true };
}

describe('search_bible', () => {
  it('no longer requires version — query alone is enough', () => {
    expect(searchBibleTool.definition.inputSchema.required).toEqual(['query']);
  });

  it('rejects an empty query', async () => {
    const { text, isError } = await callSearch({ query: '   ' });
    expect(isError).toBe(true);
    expect(text).toContain('query');
  });

  it('rejects a query with no searchable words', async () => {
    const { text, isError } = await callSearch({ query: '??? !!!' });
    expect(isError).toBe(true);
    expect(text).toContain('no searchable words');
  });

  it('rejects an unknown version', async () => {
    const { text, isError } = await callSearch({
      query: 'amor',
      version: 'nope',
    });
    expect(isError).toBe(true);
    expect(text).toContain('not found');
  });

  it('rejects a version the connection does not allow', async () => {
    const { text, isError } = await callSearch(
      { query: 'love', version: 'kjv' },
      { allowedVersions: ['nvi'] },
    );
    expect(isError).toBe(true);
    expect(text).toContain('not enabled');
  });

  it('rejects an unknown book', async () => {
    const { text, isError } = await callSearch({
      query: 'amor',
      book: 'Livro Inexistente',
    });
    expect(isError).toBe(true);
    expect(text).toContain('not found');
  });

  it('asks for a book filter when the language has no index', async () => {
    // WLC é hebraico — fora do índice FTS5, então varredura exige livro.
    const { text, isError } = await callSearch({
      query: 'bereshit',
      version: 'wlc',
    });
    expect(isError).toBe(true);
    expect(text).toContain('book');
  });

  it('asks for a book filter when the index binding is missing', async () => {
    const { text, isError } = await callSearch({
      query: 'amor',
      version: 'nvi',
    });
    expect(isError).toBe(true);
    expect(text).toContain('unavailable');
  });
});
