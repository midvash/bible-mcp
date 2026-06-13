import { VERSIONS, type VersionDefinition } from '../data/versions';
import { formatVersionList } from '../lib/markdown';
import type { Tool } from '../mcp/types';

function textResult(text: string) {
  return { content: [{ type: 'text' as const, text }] };
}

/**
 * Normaliza um código de idioma vindo do query param para o formato
 * usado nos metadados de versão. "pt" → "pt-br".
 */
function normalizeLanguage(lang: string): string {
  const l = lang.toLowerCase().trim();
  if (l === 'pt') return 'pt-br';
  return l;
}

function matchesLanguage(version: VersionDefinition, lang: string): boolean {
  const target = normalizeLanguage(lang);
  if (target === 'pt-br') {
    return version.language === 'pt-br' || version.language === 'pt-pt';
  }
  return version.language === target;
}

export const listVersionsTool: Tool = {
  definition: {
    name: 'list_versions',
    description:
      'Lista as versões bíblicas disponíveis nesta conexão MCP. Filtra automaticamente pelas versões e idiomas configurados na URL.',
    inputSchema: {
      type: 'object',
      properties: {
        language: {
          type: 'string',
          description:
            'Filtra por idioma (ex.: "pt-br", "en", "es", "he", "la", "fr", "it", "gr"). Opcional.',
        },
      },
    },
  },

  async handler(args, ctx) {
    let filtered: VersionDefinition[] = VERSIONS;

    // Filtro do contexto da conexão (?v= na URL)
    if (ctx.allowedVersions && ctx.allowedVersions.length > 0) {
      const allowedSet = new Set(ctx.allowedVersions);
      filtered = filtered.filter((v) => allowedSet.has(v.slug));
    }

    // Filtro de idioma do contexto (?lang= na URL)
    if (ctx.allowedLanguages && ctx.allowedLanguages.length > 0) {
      filtered = filtered.filter((v) =>
        ctx.allowedLanguages!.some((lang) => matchesLanguage(v, lang)),
      );
    }

    // Filtro de idioma explícito do tool call
    if (args.language) {
      const lang = String(args.language);
      filtered = filtered.filter((v) => matchesLanguage(v, lang));
    }

    return textResult(formatVersionList(filtered));
  },
};
