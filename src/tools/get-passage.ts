import { VERSIONS } from '../data/versions';
import { isVersionAllowed } from '../lib/context';
import { fetchChapter } from '../lib/r2';
import { formatVerse, formatChapter } from '../lib/markdown';
import { parseReference } from '../lib/reference-parser';
import type { Tool } from '../mcp/types';

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text' as const, text }], isError };
}

export const getPassageTool: Tool = {
  definition: {
    name: 'get_passage',
    description:
      'Retorna uma passagem bíblica a partir de uma referência em linguagem natural (ex.: "João 3:16-18", "Romanos 8:1-11", "Sl 23"). Mais conveniente que get_verse quando a referência já está em formato de citação.',
    inputSchema: {
      type: 'object',
      properties: {
        reference: {
          type: 'string',
          description:
            'Referência bíblica em texto livre. Aceita PT/EN/ES, abreviações e prefixos numéricos. Ex.: "John 3:16", "1 Coríntios 13", "Sl 23:1-6".',
        },
        version: {
          type: 'string',
          description:
            'Slug da versão bíblica. Se omitido, usa a primeira versão habilitada nesta conexão.',
        },
      },
      required: ['reference'],
    },
  },

  async handler(args, ctx, executionCtx) {
    const referenceInput = String(args.reference ?? '').trim();
    if (!referenceInput) {
      return textResult('Parâmetro obrigatório faltando: reference.', true);
    }

    // Resolve a versão a usar — explícita ou primeira permitida
    let versionSlug = args.version ? String(args.version).toLowerCase().trim() : '';
    if (!versionSlug) {
      if (ctx.allowedVersions && ctx.allowedVersions.length > 0) {
        versionSlug = ctx.allowedVersions[0];
      } else {
        versionSlug = 'nvi';
      }
    }

    const version = VERSIONS.find((v) => v.slug === versionSlug);
    if (!version) {
      return textResult(`Versão "${versionSlug}" não encontrada.`, true);
    }
    if (!isVersionAllowed(ctx, versionSlug)) {
      const allowed = ctx.allowedVersions?.join(', ').toUpperCase() ?? '';
      return textResult(
        `A versão **${version.shortName}** não está habilitada nesta conexão.\nVersões disponíveis: ${allowed}`,
        true,
      );
    }

    const parsed = parseReference(referenceInput);
    if (!parsed.ok) {
      return textResult(parsed.error, true);
    }

    const { book, chapter, verseStart, verseEnd } = parsed.reference;

    const verses = await fetchChapter(ctx.env, versionSlug, book.id, chapter, executionCtx);
    if (!verses || verses.length === 0) {
      return textResult(
        `Capítulo não encontrado: ${book.names.en} ${chapter} (${version.shortName}).`,
        true,
      );
    }

    // Sem versículo → capítulo inteiro
    if (verseStart === undefined) {
      return textResult(formatChapter(book, version, chapter, verses));
    }

    const end = verseEnd ?? verseStart;
    if (verseStart < 1 || verseStart > verses.length || end > verses.length) {
      return textResult(
        `Versículos solicitados fora do alcance. ${book.names.en} ${chapter} tem ${verses.length} versículos.`,
        true,
      );
    }

    const slice = verses.slice(verseStart - 1, end);
    return textResult(formatVerse(book, version, chapter, verseStart, end, slice));
  },
};
