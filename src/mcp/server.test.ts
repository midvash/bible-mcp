import { describe, expect, it } from 'vitest';
import { handleMcpMessage } from './server';
import type { ConnectionContext } from '../lib/context';
import type { Env } from '../env';
import { JSON_RPC_ERRORS } from './types';

const connectionCtx: ConnectionContext = {
  allowedVersions: null,
  allowedLanguages: null,
  nanoId: 'test',
  env: {} as Env,
};

const executionCtx = {
  waitUntil: () => {},
  passThroughOnException: () => {},
} as unknown as ExecutionContext;

function send(method: string, params?: unknown) {
  return handleMcpMessage(
    { jsonrpc: '2.0', id: 1, method, params },
    connectionCtx,
    executionCtx,
  );
}

async function result(method: string, params?: unknown) {
  const response = await send(method, params);
  if (!response || !('result' in response)) {
    throw new Error(`${method} did not return a result: ${JSON.stringify(response)}`);
  }
  return response.result as Record<string, unknown>;
}

/**
 * As duas listas começaram vazias, só para que scanners de diretório não
 * registrassem -32601 como aviso. Agora têm conteúdo de verdade, e as
 * capabilities passaram a ser declaradas — o motivo de não declarar era não
 * fazer clientes desenharem seções vazias.
 */
describe('catálogos', () => {
  it('resources/list traz as versões visíveis na conexão', async () => {
    const resources = (await result('resources/list')).resources as Array<{
      uri: string;
    }>;
    const bible = resources.filter((r) => r.uri.startsWith('bible://'));
    expect(bible.length).toBeGreaterThan(0);
    // Além das versões, só a tela do trecho.
    expect(resources.length - bible.length).toBe(1);
  });

  it('resources/list respeita o filtro de versões da conexão', async () => {
    const narrow = await handleMcpMessage(
      { jsonrpc: '2.0', id: 1, method: 'resources/list' },
      { ...connectionCtx, allowedVersions: ['onbv'] },
      executionCtx,
    );
    const resources = (narrow as { result: { resources: Array<{ uri: string }> } })
      .result.resources;
    expect(resources.filter((r) => r.uri.startsWith('bible://'))).toHaveLength(1);
  });

  it('resources/templates/list descreve o padrão de URI', async () => {
    const templates = (await result('resources/templates/list'))
      .resourceTemplates as Array<{ uriTemplate: string }>;
    expect(templates.map((t) => t.uriTemplate)).toContain(
      'bible://{version}/{book}/{chapter}',
    );
  });

  it('prompts/list traz os fluxos de estudo', async () => {
    const prompts = (await result('prompts/list')).prompts as Array<{
      name: string;
    }>;
    expect(prompts.map((p) => p.name).sort()).toEqual([
      'compare-translations',
      'devotional',
      'sermon-prep',
      'word-study',
    ]);
  });

  it('método desconhecido continua sendo -32601', async () => {
    const res = await send('resources/subscribe');
    expect(res).toHaveProperty('error.code', JSON_RPC_ERRORS.METHOD_NOT_FOUND);
  });
});

describe('prompts/get', () => {
  it('monta a mensagem com o argumento recebido', async () => {
    const res = await result('prompts/get', {
      name: 'sermon-prep',
      arguments: { reference: 'Romanos 8:1-11' },
    });
    const messages = res.messages as Array<{
      role: string;
      content: { text: string };
    }>;
    expect(messages[0].role).toBe('user');
    expect(messages[0].content.text).toContain('Romanos 8:1-11');
  });

  it('recusa argumento obrigatório faltando', async () => {
    const res = await send('prompts/get', { name: 'sermon-prep', arguments: {} });
    expect(res).toHaveProperty('error.code', JSON_RPC_ERRORS.INVALID_PARAMS);
  });

  it('recusa prompt desconhecido', async () => {
    const res = await send('prompts/get', { name: 'nao-existe' });
    expect(res).toHaveProperty('error.code', JSON_RPC_ERRORS.INVALID_PARAMS);
  });

  it('não promete alinhamento palavra↔Strong, que não existe', async () => {
    // O texto osmh no R2 chega sem morfologia; o prompt precisa dizer isso em
    // vez de induzir o modelo a inventar o mapeamento.
    const res = await result('prompts/get', {
      name: 'word-study',
      arguments: { word: 'agape' },
    });
    const text = (res.messages as Array<{ content: { text: string } }>)[0]
      .content.text;
    expect(text).toContain('no word-by-word alignment');
  });
});

describe('resources/read', () => {
  it('recusa URI vazio', async () => {
    const res = await send('resources/read', {});
    expect(res).toHaveProperty('error.code', JSON_RPC_ERRORS.INVALID_PARAMS);
  });

  it('recusa esquema desconhecido', async () => {
    const res = await send('resources/read', { uri: 'https://example.com' });
    expect(res).toHaveProperty('error.code', JSON_RPC_ERRORS.INVALID_PARAMS);
  });

  it('recusa versão inexistente', async () => {
    const res = await send('resources/read', { uri: 'bible://naoexiste' });
    expect(res).toHaveProperty('error.code', JSON_RPC_ERRORS.INVALID_PARAMS);
  });

  it('lista os livros de uma versão sem tocar no R2', async () => {
    const res = await result('resources/read', { uri: 'bible://onbv' });
    const contents = res.contents as Array<{ text: string; mimeType: string }>;
    expect(contents[0].mimeType).toBe('text/markdown');
    expect(contents[0].text).toContain('Gênesis');
  });

  it('recusa capítulo fora do livro', async () => {
    const res = await send('resources/read', { uri: 'bible://onbv/john/99' });
    expect(res).toHaveProperty('error.code', JSON_RPC_ERRORS.INVALID_PARAMS);
  });
});

describe('completion/complete', () => {
  it('sugere nomes de livro em qualquer idioma', async () => {
    const res = await result('completion/complete', {
      argument: { name: 'book', value: 'cor' },
    });
    const values = (res.completion as { values: string[] }).values;
    expect(values.some((v) => v.includes('Coríntios'))).toBe(true);
  });

  it('sugere slugs de versão', async () => {
    const res = await result('completion/complete', {
      argument: { name: 'version', value: 'on' },
    });
    expect((res.completion as { values: string[] }).values).toContain('onbv');
  });

  it('devolve lista vazia para argumento desconhecido, não erro', async () => {
    const res = await result('completion/complete', {
      argument: { name: 'qualquer', value: 'x' },
    });
    expect((res.completion as { values: string[] }).values).toEqual([]);
  });
});

/**
 * Tela do trecho (padrão MCP Apps, que o ChatGPT desenha). O contrato é: as
 * tools de leitura apontam para o `ui://`, o servidor anuncia a extensão, e o
 * `resources/read` devolve o HTML com o MIME do padrão.
 */
describe('tela do trecho (MCP Apps)', () => {
  it('initialize anuncia a extensão de UI', async () => {
    const init = await result('initialize');
    const caps = init.capabilities as {
      extensions?: Record<string, { mimeTypes: string[] }>;
    };
    expect(caps.extensions?.['io.modelcontextprotocol/ui']?.mimeTypes).toEqual([
      'text/html;profile=mcp-app',
    ]);
  });

  it('as tools de leitura apontam para a tela', async () => {
    const tools = (await result('tools/list')).tools as Array<{
      name: string;
      _meta?: Record<string, unknown>;
    }>;
    const withUi = tools
      .filter((t) => (t._meta?.ui as { resourceUri?: string } | undefined)?.resourceUri)
      .map((t) => t.name)
      .sort();
    expect(withUi).toEqual(['get_chapter', 'get_passage', 'get_verse']);
    for (const t of tools.filter((t) => withUi.includes(t.name))) {
      expect(t._meta?.['openai/outputTemplate']).toBe(
        (t._meta?.ui as { resourceUri: string }).resourceUri,
      );
    }
  });

  it('resources/read devolve o HTML da tela', async () => {
    const read = await result('resources/read', {
      uri: 'ui://midvash/passage-v1.html',
    });
    const [contents] = read.contents as Array<{
      mimeType: string;
      text: string;
      _meta?: { ui?: { csp?: unknown } };
    }>;
    expect(contents.mimeType).toBe('text/html;profile=mcp-app');
    expect(contents.text).toContain('ui/notifications/tool-result');
    expect(contents._meta?.ui?.csp).toBeDefined();
  });
});
