import { describe, expect, it } from 'vitest';
import worker from './index';
import type { Env } from './env';

/**
 * Limiter falso que registra quantas unidades foram cobradas — é isso que
 * garante que um lote não multiplique o teto por IP.
 */
function fakeLimiter(allow = true) {
  const calls: string[] = [];
  return {
    calls,
    binding: {
      limit: async ({ key }: { key: string }) => {
        calls.push(key);
        return { success: allow };
      },
    } as unknown as RateLimit,
  };
}

function env(limiter?: RateLimit): Env {
  return { R2_BUCKET: {} as R2Bucket, RATE_LIMIT_MCP: limiter } as Env;
}

const ctx = {
  waitUntil: () => {},
  passThroughOnException: () => {},
} as unknown as ExecutionContext;

/** `tools/call` com uma tool inexistente: exercita o rate limit sem tocar I/O. */
function toolCall(id: number) {
  return {
    jsonrpc: '2.0',
    id,
    method: 'tools/call',
    params: { name: 'does_not_exist', arguments: {} },
  };
}

async function post(body: unknown, e: Env, ip: string | null = '203.0.113.7') {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (ip) headers['CF-Connecting-IP'] = ip;

  return worker.fetch(
    new Request('https://mcp.midvash.com/mcp/test', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }),
    e,
    ctx,
  );
}

describe('rate limiting on /mcp', () => {
  it('charges one unit per tools/call in a batch', async () => {
    const limiter = fakeLimiter();
    const response = await post(
      [toolCall(1), toolCall(2), toolCall(3)],
      env(limiter.binding),
    );

    expect(response.status).toBe(200);
    // 3 tools/call = 3 unidades, não 1. Sem isso o lote multiplicava o teto.
    expect(limiter.calls).toHaveLength(3);
  });

  it('charges a single unit for a single tools/call', async () => {
    const limiter = fakeLimiter();
    await post(toolCall(1), env(limiter.binding));
    expect(limiter.calls).toHaveLength(1);
  });

  it('does not charge extra units for cheap methods', async () => {
    const limiter = fakeLimiter();
    await post(
      [
        { jsonrpc: '2.0', id: 1, method: 'tools/list' },
        { jsonrpc: '2.0', id: 2, method: 'ping' },
      ],
      env(limiter.binding),
    );
    expect(limiter.calls).toHaveLength(1);
  });

  it('returns 429 when the limiter refuses', async () => {
    const limiter = fakeLimiter(false);
    const response = await post(toolCall(1), env(limiter.binding));
    expect(response.status).toBe(429);
  });

  it('rejects a batch larger than the cap', async () => {
    const limiter = fakeLimiter();
    const response = await post(
      Array.from({ length: 6 }, (_, i) => toolCall(i)),
      env(limiter.binding),
    );
    expect(response.status).toBe(400);
    expect(await response.text()).toContain('Batch too large');
  });

  // ─── Fail-closed ───────────────────────────────────────────────────────

  it('refuses tools/call when the limiter binding is missing', async () => {
    const response = await post(toolCall(1), env(undefined));
    expect(response.status).toBe(503);
    expect(await response.text()).toContain('rate limiter offline');
  });

  it('refuses tools/call when the client IP is unknown', async () => {
    const limiter = fakeLimiter();
    const response = await post(toolCall(1), env(limiter.binding), null);
    expect(response.status).toBe(503);
  });

  it('still serves the handshake without a limiter', async () => {
    const response = await post(
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      env(undefined),
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as { result?: { serverInfo?: unknown } };
    expect(body.result?.serverInfo).toBeDefined();
  });
});
