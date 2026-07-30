/**
 * Midvash MCP Server
 *
 * Cloudflare Worker que expõe o conteúdo bíblico do Midvash via Model
 * Context Protocol (MCP) usando HTTP Streamable transport.
 *
 * Rotas:
 *   GET  /                  → landing page (inglês — idioma oficial)
 *   GET  /es                → landing page em espanhol
 *   GET  /pt-br             → landing page em português
 *   POST /mcp/{nanoId}      → endpoint MCP (JSON-RPC sobre HTTP)
 *   GET  /mcp/{nanoId}      → 405 (somente POST suportado neste servidor stateless)
 *   DELETE /mcp/{nanoId}    → 200 (encerramento de sessão; no-op aqui)
 */

import type { Env } from './env';
import { buildConnectionContext } from './lib/context';
import { handleMcpMessage } from './mcp/server';
import { JSON_RPC_ERRORS, type JsonRpcRequest, type JsonRpcResponse } from './mcp/types';
import { renderLandingPage } from './landing/page';
import { localeFromPath, SUPPORTED_LOCALES, pathForLocale } from './landing/i18n';
import { handleOAuth } from './oauth';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, MCP-Protocol-Version, Mcp-Session-Id',
  'Access-Control-Max-Age': '86400',
} as const;

function jsonRpcError(
  id: string | number | null,
  code: number,
  message: string,
): JsonRpcResponse {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

/**
 * Tamanho máximo de um lote JSON-RPC.
 *
 * Uma `tools/call` pode ler até 150 capítulos do R2 e o Worker tem teto de
 * 1.000 subrequests por requisição: 5 × 150 = 750 cabe, 10 × 150 não. Clientes
 * MCP reais mandam uma ou duas mensagens por requisição — o lote grande só
 * serve pra amplificar abuso.
 */
const MAX_BATCH = 5;

function tooManyRequests(): Response {
  return jsonResponse(
    jsonRpcError(null, -32000, 'Rate limit exceeded — try again shortly.'),
    429,
  );
}

/** Chave fixa do teto agregado — um contador por localidade da Cloudflare. */
const GLOBAL_LIMIT_KEY = 'mcp-global';

/**
 * Cobra `units` dos dois limitadores: o do IP e o agregado. Cada um conta uma
 * unidade por chamada, então um lote de N `tools/call` precisa custar N — sem
 * isso o lote multiplicaria o teto por até MAX_BATCH.
 *
 * O agregado existe porque o limite por IP não segura abuso distribuído: mil
 * IPs abaixo de 60/min cada somam 60 mil chamadas por minuto.
 */
async function chargeRateLimit(
  env: Env,
  ipKey: string,
  units: number,
): Promise<boolean> {
  const charges: Array<Promise<{ success: boolean }>> = [];

  for (let i = 0; i < units; i++) {
    if (env.RATE_LIMIT_MCP) charges.push(env.RATE_LIMIT_MCP.limit({ key: ipKey }));
    if (env.RATE_LIMIT_GLOBAL) {
      charges.push(env.RATE_LIMIT_GLOBAL.limit({ key: GLOBAL_LIMIT_KEY }));
    }
  }

  const results = await Promise.all(charges);
  return results.every((r) => r.success);
}

/** Quantas mensagens do payload são `tools/call` — as que custam I/O. */
function countToolCalls(payload: unknown): number {
  const messages = Array.isArray(payload) ? payload : [payload];
  return messages.filter(
    (m) => (m as { method?: unknown } | null)?.method === 'tools/call',
  ).length;
}

async function handleMcpRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  nanoId: string,
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method === 'DELETE') {
    // Encerramento de sessão — servidor stateless, no-op
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method === 'GET') {
    // SSE/streaming server-initiated não é suportado neste servidor stateless
    return new Response('Method Not Allowed (stateless server, use POST)', {
      status: 405,
      headers: { Allow: 'POST, DELETE, OPTIONS', ...CORS_HEADERS },
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  // Rate limit — defesa contra abuso/DoS (POST não é cacheado). Uma unidade
  // antes de ler o corpo, pra proteger o próprio parse.
  const clientIp = request.headers.get('CF-Connecting-IP');
  if (clientIp && !(await chargeRateLimit(env, clientIp, 1))) {
    return tooManyRequests();
  }

  // Parse do corpo JSON-RPC
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      jsonRpcError(null, JSON_RPC_ERRORS.PARSE_ERROR, 'Invalid JSON.'),
      400,
    );
  }

  // Tamanho do lote antes de cobrar as unidades: um lote gigante deve ser
  // recusado de graça, não gerar uma cobrança por mensagem primeiro.
  if (Array.isArray(payload) && payload.length > MAX_BATCH) {
    return jsonResponse(
      jsonRpcError(
        null,
        JSON_RPC_ERRORS.INVALID_REQUEST,
        `Batch too large (maximum ${MAX_BATCH} messages).`,
      ),
      400,
    );
  }

  // `tools/call` é o que gasta dinheiro (leituras de R2 e D1). Sem limiter,
  // recusa — fail-closed. Handshake, ping e discovery seguem funcionando, então
  // um binding quebrado degrada o serviço em vez de abrir a torneira em silêncio.
  const toolCalls = countToolCalls(payload);
  if (toolCalls > 0) {
    if (!clientIp || !env.RATE_LIMIT_MCP) {
      console.error(
        '[MCP] RATE_LIMIT_MCP indisponível — tools/call recusado (fail-closed).',
      );
      return jsonResponse(
        jsonRpcError(
          null,
          -32000,
          'Tool calls are temporarily unavailable (rate limiter offline).',
        ),
        503,
      );
    }
    // A primeira unidade já foi cobrada acima.
    if (
      toolCalls > 1 &&
      !(await chargeRateLimit(env, clientIp, toolCalls - 1))
    ) {
      return tooManyRequests();
    }
  }

  const url = new URL(request.url);
  const connectionCtx = buildConnectionContext(url, nanoId, env);

  // Log para observabilidade (Cloudflare Logs)
  console.log(
    `[MCP] nanoId=${nanoId} versions=${
      connectionCtx.allowedVersions?.join(',') ?? 'all'
    } langs=${connectionCtx.allowedLanguages?.join(',') ?? 'all'}`,
  );

  // JSON-RPC permite batch (array de mensagens). Tamanho já validado acima.
  if (Array.isArray(payload)) {
    const responses: JsonRpcResponse[] = [];
    for (const msg of payload) {
      if (!isValidJsonRpcRequest(msg)) {
        responses.push(
          jsonRpcError(
            null,
            JSON_RPC_ERRORS.INVALID_REQUEST,
            'Invalid JSON-RPC request.',
          ),
        );
        continue;
      }
      const response = await handleMcpMessage(msg, connectionCtx, ctx);
      if (response) responses.push(response);
    }
    // Se todas eram notificações, devolve 204
    if (responses.length === 0) {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    return jsonResponse(responses);
  }

  // Mensagem única
  if (!isValidJsonRpcRequest(payload)) {
    return jsonResponse(
      jsonRpcError(
        null,
        JSON_RPC_ERRORS.INVALID_REQUEST,
        'Invalid JSON-RPC request.',
      ),
      400,
    );
  }

  const response = await handleMcpMessage(payload, connectionCtx, ctx);
  if (!response) {
    // Era uma notificação — sem resposta, mas a especificação MCP HTTP
    // Streamable pede 202 Accepted para notificações.
    return new Response(null, { status: 202, headers: CORS_HEADERS });
  }
  return jsonResponse(response);
}

function isValidJsonRpcRequest(value: unknown): value is JsonRpcRequest {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (v.jsonrpc !== '2.0') return false;
  if (typeof v.method !== 'string') return false;
  return true;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight global
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // OAuth público (metadata + DCR + authorize + token). O servidor MCP
    // não tem auth real — esses endpoints existem só para satisfazer
    // clientes que seguem o handshake do MCP 2025-06-18 (ex.: connector
    // UI do Claude.ai). Detalhes em src/oauth.ts.
    const oauthResponse = await handleOAuth(request, url);
    if (oauthResponse) return oauthResponse;

    // SEO: robots.txt + sitemap.xml
    if (path === '/robots.txt') {
      return new Response(
        `User-agent: *\nAllow: /\nDisallow: /mcp/\nDisallow: /oauth/\nSitemap: https://mcp.midvash.com/sitemap.xml\n`,
        { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } },
      );
    }

    if (path === '/sitemap.xml') {
      const SITE = 'https://mcp.midvash.com';
      const alternates = SUPPORTED_LOCALES.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${pathForLocale(l)}"/>`,
      ).join('\n');
      const urls = SUPPORTED_LOCALES.map((l) => pathForLocale(l));
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls
        .map(
          (u) => `  <url>\n    <loc>${SITE}${u}</loc>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>\n    <changefreq>weekly</changefreq>\n  </url>`,
        )
        .join('\n')}\n</urlset>\n`;
      return new Response(xml, {
        status: 200,
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
      });
    }

    // /mcp/{nanoId} — checa antes do match de locale para não confundir
    const mcpMatch = path.match(/^\/mcp\/([A-Za-z0-9_-]+)\/?$/);
    if (mcpMatch) {
      const nanoId = mcpMatch[1];
      return handleMcpRequest(request, env, ctx, nanoId);
    }

    // Landing page — /, /es, /pt-br
    const locale = localeFromPath(path);
    if (locale) {
      return new Response(renderLandingPage(locale), {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=300',
          'Content-Language': locale,
          'Vary': 'Accept-Language',
          ...CORS_HEADERS,
        },
      });
    }

    // /mcp sem nanoId — orienta o usuário
    if (path === '/mcp' || path === '/mcp/') {
      return new Response(
        'Midvash MCP Server\n\nUse /mcp/{nanoId}?v=nvi,kjv&lang=pt-br,en\n\nGere sua URL em https://mcp.midvash.com/',
        {
          status: 400,
          headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CORS_HEADERS },
        },
      );
    }

    return new Response('Not Found', {
      status: 404,
      headers: CORS_HEADERS,
    });
  },
};
