/**
 * Bindings disponíveis no Worker MCP.
 * Dados de livros/versões são compilados no bundle e o cache do texto
 * bíblico é feito via Cache API do Cloudflare.
 */
export interface Env {
  R2_BUCKET: R2Bucket;
  // Índice FTS5 de versículos (D1 `midvash-search`), usado por search_bible.
  // Opcional = a busca cai no modo varredura se o binding não existir.
  SEARCH_DB?: D1Database;
  // Rate limit nativo por IP (auditoria de segurança). Opcional = fail-open
  // se o binding ainda não estiver provisionado no deploy.
  RATE_LIMIT_MCP?: RateLimit;
}
