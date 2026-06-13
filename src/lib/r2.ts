import type { Env } from '../env';

/**
 * Busca um capítulo do R2 com cache no edge (Cache API do Cloudflare).
 *
 * Estrutura no R2: {version}/{bookId}/{chapter}.json
 * Formato esperado: array de strings (verso N está no índice N-1).
 *
 * Estratégia:
 *  1. Cache API hit → retorna em ~1ms (zero R2)
 *  2. Cache miss → lê do R2 via binding (zero egress, ~50ms),
 *     normaliza o JSON, armazena no Cache API com TTL longo.
 */
export async function fetchChapter(
  env: Env,
  version: string,
  bookId: number,
  chapter: number,
  ctx: ExecutionContext,
): Promise<string[] | null> {
  const cache = caches.default;
  const cacheKey = new Request(
    `https://mcp.midvash.com/_cache/${version}/${bookId}/${chapter}`,
    { method: 'GET' },
  );

  // 1. Tenta o Cache API primeiro
  try {
    const cached = await cache.match(cacheKey);
    if (cached) {
      const text = await cached.text();
      return JSON.parse(text) as string[];
    }
  } catch (err) {
    console.warn('[Cache] match error:', err);
  }

  // 2. Cache miss — busca no R2
  try {
    const key = `${version}/${bookId}/${chapter}.json`;
    const object = await env.R2_BUCKET.get(key);
    if (!object) return null;

    const raw = await object.text();
    const data = JSON.parse(raw);

    // Normaliza para array de strings (suporta os 3 formatos legados)
    let verses: string[] = [];
    if (Array.isArray(data)) {
      verses = data.map((v) => (typeof v === 'string' ? v : String(v ?? '')));
    } else if (data && Array.isArray(data.verses)) {
      verses = data.verses.map((v: unknown) =>
        typeof v === 'string'
          ? v
          : v && typeof v === 'object' && 'text' in (v as Record<string, unknown>)
          ? String((v as { text: unknown }).text ?? '')
          : String(v ?? ''),
      );
    } else if (data && typeof data === 'object') {
      verses = Object.entries(data)
        .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
        .map(([, v]) => String(v));
    }

    // 3. Salva no Cache API (fire-and-forget, TTL 1 ano)
    const response = new Response(JSON.stringify(verses), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
    ctx.waitUntil(
      cache.put(cacheKey, response).catch((err) => {
        console.warn('[Cache] put error:', err);
      }),
    );

    return verses;
  } catch (error) {
    console.error(`[R2] Error fetching ${version}/${bookId}/${chapter}:`, error);
    return null;
  }
}
