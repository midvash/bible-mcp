import { TOOLS, getToolByName } from '../tools';
import type { ConnectionContext } from '../lib/context';
import {
  JSON_RPC_ERRORS,
  type JsonRpcRequest,
  type JsonRpcResponse,
} from './types';

/**
 * Versão do protocolo MCP suportada por este servidor.
 * Cliente envia a sua versão em initialize; respondemos com a nossa.
 */
const PROTOCOL_VERSION = '2025-06-18';

const SERVER_INFO = {
  name: 'midvash',
  title: 'Midvash',
  version: '1.0.0',
} as const;

const SERVER_CAPABILITIES = {
  tools: {
    listChanged: false,
  },
} as const;

function success(id: string | number | null, result: unknown): JsonRpcResponse {
  return { jsonrpc: '2.0', id, result };
}

function error(
  id: string | number | null,
  code: number,
  message: string,
  data?: unknown,
): JsonRpcResponse {
  return { jsonrpc: '2.0', id, error: { code, message, data } };
}

/**
 * Despacha uma mensagem JSON-RPC do MCP. Retorna a resposta a enviar
 * ou `null` se for uma notificação (sem id, sem resposta).
 */
export async function handleMcpMessage(
  message: JsonRpcRequest,
  connectionCtx: ConnectionContext,
  executionCtx: ExecutionContext,
): Promise<JsonRpcResponse | null> {
  const id = message.id ?? null;
  const isNotification = message.id === undefined || message.id === null;
  const method = message.method;

  // Notificações não recebem resposta
  if (isNotification) {
    // Aceita silenciosamente notifications/initialized e similares
    return null;
  }

  try {
    switch (method) {
      case 'initialize': {
        return success(id, {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: SERVER_CAPABILITIES,
          serverInfo: SERVER_INFO,
          instructions:
            'Midvash MCP — acesso ao texto bíblico em 35+ versões e 8 idiomas. Use get_passage para a forma mais natural de citar versículos.',
        });
      }

      case 'ping': {
        return success(id, {});
      }

      case 'tools/list': {
        return success(id, {
          tools: TOOLS.map((t) => t.definition),
        });
      }

      case 'tools/call': {
        const params = (message.params ?? {}) as {
          name?: string;
          arguments?: Record<string, unknown>;
        };
        const toolName = params.name;
        if (!toolName) {
          return error(id, JSON_RPC_ERRORS.INVALID_PARAMS, 'Missing tool name.');
        }
        const tool = getToolByName(toolName);
        if (!tool) {
          return error(
            id,
            JSON_RPC_ERRORS.METHOD_NOT_FOUND,
            `Tool não encontrada: ${toolName}`,
          );
        }
        const result = await tool.handler(
          params.arguments ?? {},
          connectionCtx,
          executionCtx,
        );
        return success(id, result);
      }

      default:
        return error(
          id,
          JSON_RPC_ERRORS.METHOD_NOT_FOUND,
          `Método não suportado: ${method}`,
        );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[MCP] Error handling ${method}:`, err);
    return error(id, JSON_RPC_ERRORS.INTERNAL_ERROR, `Erro interno: ${msg}`);
  }
}
