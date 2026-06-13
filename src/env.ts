/**
 * Bindings disponíveis no Worker MCP.
 * Apenas R2 — dados de livros/versões são compilados no bundle
 * e o cache é feito via Cache API do Cloudflare.
 */
export interface Env {
  R2_BUCKET: R2Bucket;
  // Rate limit nativo por IP (auditoria de segurança). Opcional = fail-open
  // se o binding ainda não estiver provisionado no deploy.
  RATE_LIMIT_MCP?: RateLimit;
}
