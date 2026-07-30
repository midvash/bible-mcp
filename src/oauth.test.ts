import { describe, expect, it } from 'vitest';
import { handleOAuth } from './oauth';

async function authorize(redirectUri: string | null, state?: string) {
  const url = new URL('https://mcp.midvash.com/oauth/authorize');
  if (redirectUri !== null) url.searchParams.set('redirect_uri', redirectUri);
  if (state) url.searchParams.set('state', state);

  const response = await handleOAuth(new Request(url, { method: 'GET' }), url);
  if (!response) throw new Error('handleOAuth did not handle /oauth/authorize');
  return response;
}

describe('/oauth/authorize redirect allowlist', () => {
  it('allows loopback on any port — native MCP clients', async () => {
    const response = await authorize('http://localhost:33418/callback');
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toContain('localhost:33418');
  });

  it('allows 127.0.0.1', async () => {
    expect((await authorize('http://127.0.0.1:9000/cb')).status).toBe(302);
  });

  it('allows known web clients and their subdomains', async () => {
    expect((await authorize('https://claude.ai/api/mcp/auth_callback')).status).toBe(
      302,
    );
    expect((await authorize('https://app.claude.com/cb')).status).toBe(302);
  });

  it('allows desktop app schemes', async () => {
    expect((await authorize('cursor://anysphere.cursor/oauth')).status).toBe(302);
  });

  it('passes code and state through to an allowed destination', async () => {
    const location = (await authorize('http://localhost:1234/cb', 'xyz')).headers.get(
      'location',
    )!;
    const target = new URL(location);
    expect(target.searchParams.get('code')).toBe('public');
    expect(target.searchParams.get('state')).toBe('xyz');
  });

  // ─── O que o open redirect permitia ────────────────────────────────────

  it('rejects an arbitrary host', async () => {
    const response = await authorize('https://example.com/');
    expect(response.status).toBe(400);
    expect(response.headers.get('location')).toBeNull();
  });

  it('rejects a host that merely ends with an allowed name', async () => {
    // `notclaude.ai` termina com "claude.ai" em texto, mas não é subdomínio.
    expect((await authorize('https://notclaude.ai/cb')).status).toBe(400);
  });

  it('rejects an allowed host used as a subdomain of an attacker domain', async () => {
    expect((await authorize('https://claude.ai.attacker.com/cb')).status).toBe(400);
  });

  it('rejects a fake loopback subdomain', async () => {
    expect((await authorize('http://evil.localhost/cb')).status).toBe(400);
  });

  it('rejects an unknown scheme', async () => {
    expect((await authorize('ftp://localhost/cb')).status).toBe(400);
  });

  it('rejects javascript: URIs', async () => {
    expect((await authorize('javascript:alert(1)')).status).toBe(400);
  });

  it('still rejects a missing or malformed redirect_uri', async () => {
    expect((await authorize(null)).status).toBe(400);
    expect((await authorize('not-a-url')).status).toBe(400);
  });
});
