import { describe, expect, it } from 'vitest';
import type { ConnectionContext } from '../lib/context';
import { getCommentaryTool } from './get-commentary';
import { resolveStudyLocale, searchStudyTool } from './search-study';

function ctx(overrides: Partial<ConnectionContext> = {}): ConnectionContext {
  return {
    allowedVersions: null,
    allowedLanguages: null,
    nanoId: 'test',
    env: {} as ConnectionContext['env'],
    ...overrides,
  };
}

async function call(tool: typeof searchStudyTool, args: Record<string, unknown>, c = ctx()) {
  const result = await tool.handler(args, c, {} as ExecutionContext);
  return { text: result.content[0].text, isError: result.isError === true };
}

describe('resolveStudyLocale', () => {
  it('defaults to English with no connection filter', () => {
    expect(resolveStudyLocale(ctx())).toEqual({ ok: true, locale: 'en' });
  });

  it('follows the first usable connection language', () => {
    expect(
      resolveStudyLocale(ctx({ allowedLanguages: ['he', 'pt-br'] })),
    ).toEqual({ ok: true, locale: 'pt-br' });
  });

  it('honours an explicit language', () => {
    expect(resolveStudyLocale(ctx(), 'ko')).toEqual({ ok: true, locale: 'ko' });
  });

  it('maps Portuguese variants onto pt-br', () => {
    expect(resolveStudyLocale(ctx(), 'pt-pt')).toEqual({
      ok: true,
      locale: 'pt-br',
    });
  });

  it('rejects a language the study library does not cover', () => {
    const resolved = resolveStudyLocale(ctx(), 'he');
    expect(resolved.ok).toBe(false);
    expect(resolved.ok === false && resolved.message).toContain('not available');
  });

  it('rejects a language the connection does not allow', () => {
    const resolved = resolveStudyLocale(ctx({ allowedLanguages: ['en'] }), 'ru');
    expect(resolved.ok).toBe(false);
    expect(resolved.ok === false && resolved.message).toContain('not enabled');
  });
});

describe('search_study', () => {
  it('rejects an empty query', async () => {
    const { isError } = await call(searchStudyTool, { query: '  ' });
    expect(isError).toBe(true);
  });

  it('rejects a query with no searchable words', async () => {
    const { text, isError } = await call(searchStudyTool, { query: '!!!' });
    expect(isError).toBe(true);
    expect(text).toContain('no searchable words');
  });

  it('reports the library as unavailable without the binding', async () => {
    const { text, isError } = await call(searchStudyTool, { query: 'moses' });
    expect(isError).toBe(true);
    expect(text).toContain('unavailable');
  });

  it('offers the four study types', () => {
    const type = searchStudyTool.definition.inputSchema.properties.type as {
      enum: string[];
    };
    expect(type.enum).toEqual([
      'commentary',
      'character',
      'dictionary',
      'theology',
    ]);
  });
});

describe('get_commentary', () => {
  it('rejects a missing reference', async () => {
    const { isError } = await call(getCommentaryTool, { reference: '' });
    expect(isError).toBe(true);
  });

  it('rejects an unparseable reference', async () => {
    const { isError } = await call(getCommentaryTool, {
      reference: 'Livro Que Não Existe 5',
    });
    expect(isError).toBe(true);
  });

  it('reports the library as unavailable without the binding', async () => {
    const { text, isError } = await call(getCommentaryTool, {
      reference: 'John 3:16',
    });
    expect(isError).toBe(true);
    expect(text).toContain('unavailable');
  });
});
