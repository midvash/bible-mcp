/**
 * OAuth 2.1 "público" para o Midvash MCP.
 *
 * O servidor MCP é stateless e serve conteúdo bíblico público — não há
 * usuário, sessão nem dado privado. Mas a UI de conectores do Claude.ai
 * (e clientes que seguem a spec MCP 2025-06-18) exige metadata OAuth e
 * tenta Dynamic Client Registration antes de chamar /mcp.
 *
 * Implementamos um fluxo degenerado: registro aceita qualquer cliente,
 * /authorize redireciona com um code fixo, /token devolve um access_token
 * fixo. O endpoint /mcp/{nanoId} continua ignorando Authorization — não
 * há nada a proteger. Isso cumpre o handshake da spec sem introduzir
 * autenticação real.
 */
const PUBLIC_TOKEN = 'public';
const PUBLIC_CLIENT_ID = 'public';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
} as const;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
      ...CORS_HEADERS,
    },
  });
}

/**
 * RFC 8414 — OAuth 2.0 Authorization Server Metadata.
 * Anunciado em /.well-known/oauth-authorization-server.
 */
function authServerMetadata(origin: string): Record<string, unknown> {
  return {
    issuer: origin,
    authorization_endpoint: `${origin}/oauth/authorize`,
    token_endpoint: `${origin}/oauth/token`,
    registration_endpoint: `${origin}/oauth/register`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code'],
    code_challenge_methods_supported: ['S256', 'plain'],
    token_endpoint_auth_methods_supported: ['none'],
    scopes_supported: ['mcp'],
  };
}

/**
 * RFC 9728 — OAuth 2.0 Protected Resource Metadata.
 * Anunciado em /.well-known/oauth-protected-resource.
 */
function protectedResourceMetadata(origin: string): Record<string, unknown> {
  return {
    resource: origin,
    authorization_servers: [origin],
    bearer_methods_supported: ['header'],
    scopes_supported: ['mcp'],
  };
}

/**
 * Tenta tratar a rota como parte do fluxo OAuth público. Devolve null
 * se a rota não for OAuth — o router principal segue com 404.
 */
export async function handleOAuth(
  request: Request,
  url: URL,
): Promise<Response | null> {
  const path = url.pathname;
  const origin = url.origin;

  if (request.method === 'OPTIONS' && isOAuthPath(path)) {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (path === '/.well-known/oauth-authorization-server') {
    return json(authServerMetadata(origin));
  }

  if (path === '/.well-known/oauth-protected-resource') {
    return json(protectedResourceMetadata(origin));
  }

  if (path === '/oauth/register' && request.method === 'POST') {
    return handleRegister(request);
  }

  if (path === '/oauth/authorize' && request.method === 'GET') {
    return handleAuthorize(url);
  }

  if (path === '/oauth/token' && request.method === 'POST') {
    return handleToken(request);
  }

  return null;
}

function isOAuthPath(path: string): boolean {
  return (
    path === '/.well-known/oauth-authorization-server' ||
    path === '/.well-known/oauth-protected-resource' ||
    path === '/oauth/register' ||
    path === '/oauth/authorize' ||
    path === '/oauth/token'
  );
}

/**
 * RFC 7591 — Dynamic Client Registration.
 * Aceita qualquer payload e ecoa redirect_uris. client_id é fixo.
 */
async function handleRegister(request: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    // payload vazio é aceitável — alguns clientes mandam GET-like POST
  }

  const redirectUris = Array.isArray(body.redirect_uris)
    ? (body.redirect_uris as string[]).filter((u) => typeof u === 'string')
    : [];

  return json(
    {
      client_id: PUBLIC_CLIENT_ID,
      client_id_issued_at: 0,
      redirect_uris: redirectUris,
      grant_types: ['authorization_code'],
      response_types: ['code'],
      token_endpoint_auth_method: 'none',
      client_name:
        typeof body.client_name === 'string' ? body.client_name : 'Midvash MCP Client',
    },
    201,
  );
}

/**
 * Hosts autorizados a receber o redirect do /authorize, e seus subdomínios.
 *
 * Sem essa lista o endpoint é um open redirect: qualquer pessoa monta
 * `mcp.midvash.com/oauth/authorize?redirect_uri=https://site-falso/` e usa o
 * nosso domínio como trampolim de phishing — o que também queima a reputação
 * de midvash.com. Checar que a URI é absoluta não protege contra isso.
 *
 * Clientes MCP nativos fazem callback em loopback; clientes web, no próprio
 * domínio. Host recusado sai no log (`[OAuth] redirect_uri rejeitado`), então
 * um cliente legítimo que falte aqui aparece e pode ser adicionado.
 */
const ALLOWED_REDIRECT_HOSTS = [
  'localhost',
  '127.0.0.1',
  '[::1]',
  'claude.ai',
  'claude.com',
  'anthropic.com',
  'cursor.com',
  'cursor.sh',
  'openai.com',
  'chatgpt.com',
  'smithery.ai',
  'glama.ai',
  'midvash.com',
];

/**
 * Esquemas de app desktop. Não são navegáveis a partir de uma página web, então
 * não servem de vetor de phishing — o SO entrega ao app registrado.
 */
const ALLOWED_REDIRECT_SCHEMES = new Set([
  'cursor:',
  'vscode:',
  'vscode-insiders:',
  'windsurf:',
  'zed:',
  'claude:',
]);

function isAllowedRedirect(target: URL): boolean {
  if (ALLOWED_REDIRECT_SCHEMES.has(target.protocol)) return true;
  if (target.protocol !== 'http:' && target.protocol !== 'https:') return false;

  const host = target.hostname.toLowerCase();
  return ALLOWED_REDIRECT_HOSTS.some(
    (allowed) =>
      host === allowed ||
      // Subdomínio só de host com ponto — evita liberar `evil.localhost`.
      (allowed.includes('.') && host.endsWith(`.${allowed}`)),
  );
}

/**
 * /oauth/authorize — redireciona pro redirect_uri com um code fixo,
 * preservando state. Não há tela de consentimento porque não há usuário nem
 * permissões a conceder, mas o destino é restrito à lista acima.
 */
function handleAuthorize(url: URL): Response {
  const redirectUri = url.searchParams.get('redirect_uri');
  const state = url.searchParams.get('state');

  if (!redirectUri) {
    return new Response('Missing redirect_uri', {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  let target: URL;
  try {
    target = new URL(redirectUri);
  } catch {
    return new Response('Invalid redirect_uri', {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  if (!isAllowedRedirect(target)) {
    console.warn(
      `[OAuth] redirect_uri rejeitado: ${target.protocol}//${target.hostname}`,
    );
    return new Response(
      'redirect_uri host is not allowed for this server.\n\n' +
        'Native MCP clients should use a loopback address (http://localhost:PORT/...).\n' +
        'If you are a known MCP client and need your host allowed, open an issue at\n' +
        'https://github.com/midvash/bible-mcp/issues\n',
      {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CORS_HEADERS },
      },
    );
  }

  target.searchParams.set('code', PUBLIC_TOKEN);
  if (state) target.searchParams.set('state', state);

  return Response.redirect(target.toString(), 302);
}

/**
 * /oauth/token — devolve sempre o mesmo access_token público.
 * Aceita authorization_code e ignora o code/PKCE — não há sessão a casar.
 */
async function handleToken(request: Request): Promise<Response> {
  // Consome o body pra não estourar o limite de tamanho, mas não valida.
  try {
    await request.text();
  } catch {
    // ignora
  }

  return json({
    access_token: PUBLIC_TOKEN,
    token_type: 'Bearer',
    expires_in: 31536000,
    scope: 'mcp',
  });
}
