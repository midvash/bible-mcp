import type { Env } from '../env';

/**
 * Contexto de uma conexão MCP — derivado dos query params da URL
 * (?v=nvi,kjv&lang=pt-br,en) e disponível em todas as tools.
 */
export interface ConnectionContext {
  /** Versões habilitadas nesta conexão. null = todas as versões disponíveis. */
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

function normalizeLanguage(lang: string): string {
  const l = lang.toLowerCase().trim();
  if (l === 'pt') return 'pt-br';
  return l;
}

export function isLanguageAllowed(
  ctx: ConnectionContext,
  language: string,
): boolean {
  if (!ctx.allowedLanguages) return true;
  const target = normalizeLanguage(language);

  return ctx.allowedLanguages.some((allowed) => {
    const normalized = normalizeLanguage(allowed);
    if (normalized === 'pt-br') {
      return target === 'pt-br' || target === 'pt-pt';
    }
    return normalized === target;
  });
}
