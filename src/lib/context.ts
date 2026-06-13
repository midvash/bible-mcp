import type { Env } from '../env';

/**
 * Contexto de uma conexão MCP — derivado dos query params da URL
 * (?v=nvi,kjv&lang=pt-br,en) e disponível em todas as tools.
 */
export interface ConnectionContext {
  /** Versões habilitadas nesta conexão. null = todas as 35 versões. */
  allowedVersions: string[] | null;
  /** Idiomas habilitados nesta conexão. null = todos os idiomas. */
  allowedLanguages: string[] | null;
  /** NanoID extraído da URL — apenas para observabilidade nos logs. */
  nanoId: string;
  env: Env;
}

/**
 * Constrói o ConnectionContext a partir da URL da request MCP.
 * URL esperada: /mcp/{nanoId}?v=nvi,kjv&lang=pt-br,en
 */
export function buildConnectionContext(
  url: URL,
  nanoId: string,
  env: Env,
): ConnectionContext {
  const vParam = url.searchParams.get('v');
  const langParam = url.searchParams.get('lang');

  return {
    allowedVersions: vParam
      ? vParam
          .split(',')
          .map((v) => v.trim().toLowerCase())
          .filter(Boolean)
      : null,
    allowedLanguages: langParam
      ? langParam
          .split(',')
          .map((l) => l.trim().toLowerCase())
          .filter(Boolean)
      : null,
    nanoId,
    env,
  };
}

/**
 * Verifica se uma versão (slug) está habilitada nesta conexão.
 * Se nenhuma restrição foi configurada, todas são permitidas.
 */
export function isVersionAllowed(
  ctx: ConnectionContext,
  versionSlug: string,
): boolean {
  if (!ctx.allowedVersions) return true;
  return ctx.allowedVersions.includes(versionSlug.toLowerCase());
}
