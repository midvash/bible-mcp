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

function send(method: string) {
  return handleMcpMessage({ jsonrpc: '2.0', id: 1, method }, connectionCtx, executionCtx);
}

/**
 * Só expomos tools, mas scanners de diretório sondam resources e prompts de
 * qualquer jeito e tratam o -32601 como aviso. Lista vazia mantém o relatório
 * limpo sem mentir sobre o que o servidor tem.
 */
describe('métodos de catálogo vazio', () => {
  it('resources/list devolve lista vazia em vez de erro', async () => {
    expect(await send('resources/list')).toEqual({
      jsonrpc: '2.0',
      id: 1,
      result: { resources: [] },
    });
  });

  it('prompts/list devolve lista vazia em vez de erro', async () => {
    expect(await send('prompts/list')).toEqual({
      jsonrpc: '2.0',
      id: 1,
      result: { prompts: [] },
    });
  });

  it('método desconhecido continua sendo -32601', async () => {
    const res = await send('resources/read');
    expect(res).not.toBeNull();
    expect(res).toHaveProperty('error.code', JSON_RPC_ERRORS.METHOD_NOT_FOUND);
  });
});
