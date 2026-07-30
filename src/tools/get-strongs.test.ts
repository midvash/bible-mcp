import { describe, expect, it } from 'vitest';
import type { ConnectionContext } from '../lib/context';
import { getStrongsTool } from './get-strongs';

function ctx(overrides: Partial<ConnectionContext> = {}): ConnectionContext {
  return {
    allowedVersions: null,
    allowedLanguages: null,
    nanoId: 'test',
    env: {} as ConnectionContext['env'],
    ...overrides,
  };
}

async function call(args: Record<string, unknown>, c = ctx()) {
  const result = await getStrongsTool.handler(args, c, {} as ExecutionContext);
  return { text: result.content[0].text, isError: result.isError === true };
}

describe('get_strongs', () => {
  it('requires either a number or a word', async () => {
    const { text, isError } = await call({});
    expect(isError).toBe(true);
    expect(text).toContain('number');
    expect(text).toContain('word');
  });

  it('rejects an unreadable identifier', async () => {
    const { text, isError } = await call({ number: 'X9' });
    expect(isError).toBe(true);
    expect(text).toContain("Could not read");
  });

  it('rejects a bare number without a language', async () => {
    // 430 é ambíguo: existe em hebraico e em grego.
    const { isError } = await call({ number: '430' });
    expect(isError).toBe(true);
  });

  it('accepts a bare number once the language is given', async () => {
    // Passa da validação e só falha por falta do binding.
    const { text } = await call({ number: '430', language: 'hebrew' });
    expect(text).toContain('unavailable');
  });

  it('reports the lexicon as unavailable without the binding', async () => {
    const { text, isError } = await call({ number: 'H430' });
    expect(isError).toBe(true);
    expect(text).toContain('unavailable');
  });

  it('rejects a translation language the study data does not cover', async () => {
    const { text, isError } = await call({
      number: 'H430',
      translation_language: 'sw',
    });
    expect(isError).toBe(true);
    expect(text).toContain('not available');
  });

  it('offers only hebrew and greek as language', () => {
    const language = getStrongsTool.definition.inputSchema.properties
      .language as { enum: string[] };
    expect(language.enum).toEqual(['hebrew', 'greek']);
  });

  it('does not claim to map words inside a verse', () => {
    // O texto osmh no R2 vem sem morfologia, então não há alinhamento
    // palavra↔Strong confiável. A descrição não deve prometer isso.
    const description = getStrongsTool.definition.description.toLowerCase();
    expect(description).not.toContain('each word');
    expect(description).not.toContain('word by word');
  });
});
