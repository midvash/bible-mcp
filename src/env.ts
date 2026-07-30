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
  // Rate limit nativo por IP. Opcional no tipo porque o binding é `unsafe`;
  // em runtime, `tools/call` é recusado se ele faltar (fail-closed).
  RATE_LIMIT_MCP?: RateLimit;
  // Teto agregado por localidade da Cloudflare, com chave fixa — cobre o
  // abuso distribuído por muitos IPs, que o limite por IP não pega.
  RATE_LIMIT_GLOBAL?: RateLimit;
}
