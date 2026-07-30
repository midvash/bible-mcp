import { TOOLS, getToolByName } from '../tools';
import type { ConnectionContext } from '../lib/context';
import { readToolCache, toolCacheKey, writeToolCache } from '../lib/tool-cache';
import {
  listResourceTemplates,
  listResources,
  readResource,
  ResourceError,
  visibleVersions,
} from './resources';
import { listPrompts, PROMPT_BY_NAME } from './prompts';
import { completionsFor } from './completions';
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
  tools: { listChanged: false },
  // Declarados desde que passaram a ter conteúdo de verdade. Antes as duas
  // listas voltavam vazias só para não deixar aviso no relatório dos scanners
  // de diretório, e declarar teria feito clientes desenharem seções vazias.
  resources: { listChanged: false, subscribe: false },
  prompts: { listChanged: false },
  completions: {},
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
            'Midvash MCP gives AI clients fast, no-key access to Scripture in 35+ Bible versions across 9 language families. Use get_passage for natural references, search_bible to find verses, and compare_passage to compare translations.',
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

      // Este servidor só expõe tools — não anunciamos `resources` nem `prompts`
      // em SERVER_CAPABILITIES, então um cliente que segue a spec nem chega
      // aqui. Mas scanners de diretório (Smithery, por exemplo) sondam os dois
      // métodos de qualquer forma e registram um -32601 como aviso no relatório
      // do servidor. Responder lista vazia é a resposta honesta — nenhum
      // resource, nenhum prompt — e mantém o relatório limpo.
      case 'resources/list': {
        return success(id, { resources: listResources(connectionCtx) });
      }

      case 'resources/templates/list': {
        return success(id, { resourceTemplates: listResourceTemplates() });
      }

      case 'resources/read': {
        const uri = String(
          (message.params as { uri?: unknown } | undefined)?.uri ?? '',
        );
        if (!uri) {
          return error(id, JSON_RPC_ERRORS.INVALID_PARAMS, 'Missing resource uri.');
        }
        try {
          const contents = await readResource(uri, connectionCtx, executionCtx);
          return success(id, { contents: [contents] });
        } catch (err) {
          if (err instanceof ResourceError) {
            return error(id, JSON_RPC_ERRORS.INVALID_PARAMS, err.message);
          }
          throw err;
        }
      }

      case 'prompts/list': {
        return success(id, { prompts: listPrompts() });
      }

      case 'prompts/get': {
        const params = (message.params ?? {}) as {
          name?: string;
          arguments?: Record<string, string>;
        };
        const prompt = params.name ? PROMPT_BY_NAME.get(params.name) : undefined;
        if (!prompt) {
          return error(
            id,
            JSON_RPC_ERRORS.INVALID_PARAMS,
            `Unknown prompt: ${params.name ?? '(none)'}`,
          );
        }

        const args = params.arguments ?? {};
        const missing = prompt.arguments
          .filter((a) => a.required && !args[a.name])
          .map((a) => a.name);
        if (missing.length > 0) {
          return error(
            id,
            JSON_RPC_ERRORS.INVALID_PARAMS,
            `Missing required argument(s): ${missing.join(', ')}.`,
          );
        }

        return success(id, {
          description: prompt.description,
          messages: [
            {
              role: 'user',
              content: { type: 'text', text: prompt.build(args) },
            },
          ],
        });
      }

      case 'completion/complete': {
        return success(id, {
          completion: completionsFor(message.params, connectionCtx),
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
            `Tool not found: ${toolName}`,
          );
        }

        // Tools são determinísticas e servem conteúdo público, então a
        // resposta pode vir do cache do edge — chamada repetida não toca
        // D1 nem R2.
        const args = params.arguments ?? {};
        const cacheKey = await toolCacheKey(toolName, args, connectionCtx);
        const cached = await readToolCache(cacheKey);
        if (cached) return success(id, cached);

        const result = await tool.handler(args, connectionCtx, executionCtx);
        writeToolCache(cacheKey, result, executionCtx);
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
