import type { ConnectionContext } from './context';
import type { ToolResult } from '../mcp/types';

/**
 * Cache de respostas de `tools/call` no Cache API do edge.
 *
 * Toda tool deste servidor é determinística e pública: mesma entrada, mesma
 * saída, sem usuário e sem dado privado. Guardar a resposta derruba o custo
 * marginal de uma chamada repetida a zero — nem D1, nem R2, quase nada de CPU.
 *
 * Isso importa porque o endpoint é aberto: o padrão de abuso mais provável é
 * repetir a mesma consulta muitas vezes, e é exatamente esse que o cache anula.
 * O limite por IP continua sendo a defesa contra consultas sempre diferentes.
 */

/**
 * Faz parte da chave: mudar aqui invalida todo o cache de uma vez, sem purge.
 *
 * **Suba este número em todo deploy que mude a saída de alguma tool.** O TTL é
 * de 24 horas, então sem isso um cliente continua recebendo a resposta gerada
 * pelo código anterior por até um dia depois do deploy — com o Markdown antigo,
 * as mensagens antigas e sem os campos novos.
 *
 * v1 → v2: saída em inglês, `structuredContent`, e o ranking por versão.
 */
const CACHE_VERSION = 'v2';

/** Um dia. O texto bíblico não muda; o teto existe só para limitar staleness. */
const CACHE_TTL_SECONDS = 86400;

/**
 * `JSON.stringify` com chaves ordenadas — sem isso, `{a,b}` e `{b,a}` geram
 * chaves de cache diferentes para a mesma chamada.
 */
function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;

  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${JSON.stringify(k)}:${canonicalize(v)}`);

  return `{${entries.join(',')}}`;
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Chave de cache de uma chamada. Inclui os filtros da conexão (`?v=`, `?lang=`)
 * porque eles mudam a saída — sem isso, uma conexão restrita a NVI receberia a
 * resposta gerada para uma conexão sem restrição.
 */
export async function toolCacheKey(
  toolName: string,
  args: Record<string, unknown>,
  ctx: ConnectionContext,
): Promise<Request> {
  const fingerprint = canonicalize({
    tool: toolName,
    args,
    versions: ctx.allowedVersions,
    languages: ctx.allowedLanguages,
  });
  const hash = await sha256Hex(fingerprint);

  return new Request(
    `https://mcp.midvash.com/_toolcache/${CACHE_VERSION}/${toolName}/${hash}`,
    { method: 'GET' },
  );
}

/** Resposta guardada para esta chamada, ou null. Nunca lança. */
export async function readToolCache(key: Request): Promise<ToolResult | null> {
  try {
    const hit = await caches.default.match(key);
    if (!hit) return null;
    return (await hit.json()) as ToolResult;
  } catch (err) {
    console.warn('[ToolCache] match error:', err);
    return null;
  }
}

/**
 * Guarda a resposta em segundo plano. Resultados de erro ficam de fora: são
 * baratos de recalcular e podem ser transitórios.
 */
export function writeToolCache(
  key: Request,
  result: ToolResult,
  executionCtx: ExecutionContext,
): void {
  if (result.isError) return;

  const body = new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
    },
  });

  executionCtx.waitUntil(
    caches.default.put(key, body).catch((err) => {
      console.warn('[ToolCache] put error:', err);
    }),
  );
}
