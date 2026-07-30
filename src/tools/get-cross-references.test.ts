import { describe, expect, it } from 'vitest';
import type { ConnectionContext } from '../lib/context';
import { getCrossReferencesTool } from './get-cross-references';

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

async function call(args: Record<string, unknown>, c = ctx()) {
  const result = await getCrossReferencesTool.handler(
    args,
    c,
    {} as ExecutionContext,
  );
  return { text: result.content[0].text, isError: result.isError === true };
}

describe('get_cross_references', () => {
  it('rejects a missing reference', async () => {
    expect((await call({ reference: '' })).isError).toBe(true);
  });

  it('rejects an unparseable reference', async () => {
    const { text, isError } = await call({ reference: 'Nowhere 1:1' });
    expect(isError).toBe(true);
    expect(text).toContain('Book not found');
  });

  it('rejects a whole chapter, which is too broad', async () => {
    const { text, isError } = await call({ reference: 'John 3' });
    expect(isError).toBe(true);
    expect(text).toContain('single verse');
  });

  it('rejects a range that crosses chapters', async () => {
    const { isError } = await call({ reference: 'Romans 8:1-9:5' });
    expect(isError).toBe(true);
  });

  it('suggests the fallback in the language of the version', async () => {
    // Responder "João 3" com "John 3:1" seria trocar o idioma no meio.
    const { text } = await call({ reference: 'João 3', version: 'nvi' });
    expect(text).toContain('João 3:1');
  });

  it('reports cross-references as unavailable without the binding', async () => {
    const { text, isError } = await call({ reference: 'John 3:16' });
    expect(isError).toBe(true);
    expect(text).toContain('unavailable');
  });

  it('offers include_text so callers can ask for references only', () => {
    const props = getCrossReferencesTool.definition.inputSchema.properties;
    expect(props.include_text).toBeDefined();
  });
});
