import { beforeEach, describe, expect, it } from 'vitest';
import type { ConnectionContext } from '../lib/context';
import { comparePassageTool } from './compare-passage';

const PSALM23 = ['v1 texto', 'v2 texto', 'v3 texto'];

function ctx(): ConnectionContext {
  return {
    allowedVersions: null,
    allowedLanguages: null,
    nanoId: 'test',
    env: {
      R2_BUCKET: {
        async get() {
          return { text: async () => JSON.stringify(PSALM23) };
        },
      },
    } as unknown as ConnectionContext['env'],
  };
}

beforeEach(() => {
  (globalThis as Record<string, unknown>).caches = {
    default: { match: async () => undefined, put: async () => {} },
  };
});

async function call(args: Record<string, unknown>) {
  const result = await comparePassageTool.handler(args, ctx(), {
    waitUntil: () => {},
  } as unknown as ExecutionContext);
  return result.content[0].text;
}

describe('compare_passage', () => {
  it('escreve o nome do livro no idioma de cada versão', async () => {
    const text = await call({ reference: 'Salmos 23:1', versions: ['nva', 'bsb'] });
    expect(text).toContain('## Comparison: Salmos 23:1');
    expect(text).toMatch(/### NVA[^\n]*\n\*\*Salmos 23:1\*\*/);
    expect(text).toMatch(/### BSB[^\n]*\n\*\*Psalms 23:1\*\*/);
  });
});
