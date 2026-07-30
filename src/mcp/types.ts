import type { ConnectionContext } from '../lib/context';

/**
 * Tipos do protocolo MCP (Model Context Protocol).
 *
 * Implementação manual do JSON-RPC 2.0 para evitar dependências Node.js
 * que podem ser incompatíveis com o runtime do Cloudflare Workers.
 */

// ─── JSON-RPC 2.0 ─────────────────────────────────────────────────────────

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: unknown;
}

export interface JsonRpcSuccessResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result: unknown;
}

export interface JsonRpcErrorResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse;

// Códigos de erro padrão JSON-RPC
export const JSON_RPC_ERRORS = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
} as const;

// ─── MCP Tool Schema ─────────────────────────────────────────────────────

export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, unknown>;
  required?: string[];
}

/**
 * Schema do resultado estruturado, quando a tool devolve um.
 *
 * Pela spec 2025-06-18, declarar `outputSchema` é um contrato: a resposta
 * precisa trazer `structuredContent` que valide contra ele. Só as tools que
 * realmente devolvem estrutura declaram.
 */
export interface ToolOutputSchema {
  type: 'object';
  properties: Record<string, unknown>;
  required?: string[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
  outputSchema?: ToolOutputSchema;
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
}

export interface ToolContent {
  type: 'text';
  text: string;
}

export interface ToolResult {
  content: ToolContent[];
  /**
   * Mesma resposta em forma de dados, para clientes programáticos não terem de
   * parsear Markdown. O `content` em texto continua sendo enviado, como a spec
   * exige, para clientes que só mostram texto.
   */
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
}

export type ToolHandler = (
  args: Record<string, unknown>,
  ctx: ConnectionContext,
  executionCtx: ExecutionContext,
) => Promise<ToolResult>;

export interface Tool {
  definition: ToolDefinition;
  handler: ToolHandler;
}
