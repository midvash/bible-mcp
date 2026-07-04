import { VERSIONS } from '../data/versions';
import { isLanguageAllowed, isVersionAllowed } from '../lib/context';
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
      'Fetches a Bible passage from a natural-language reference such as "John 3:16-18", "João 3:16", "Romans 8:1-11", or "Psalm 23". This is the primary lookup tool when the user gives a citation instead of structured book/chapter/verse fields.',
    inputSchema: {
      type: 'object',
      properties: {
        reference: {
          type: 'string',
          description:
            'Free-form Bible reference. Accepts supported localized book names, abbreviations, numeric prefixes, whole chapters, and verse ranges. Examples: "John 3:16", "1 Coríntios 13", "Sl 23:1-6".',
        },
        version: {
          type: 'string',
          description:
            'Optional Bible version slug. If omitted, uses the first version enabled by the connection URL, or "nvi" when no version filter exists.',
        },
      },
      required: ['reference'],
    },
    annotations: {
      title: 'Get Bible passage',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
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
    if (!isLanguageAllowed(ctx, version.language)) {
      const allowed = ctx.allowedLanguages?.join(', ') ?? '';
      return textResult(
        `O idioma da versão **${version.shortName}** (${version.language}) não está habilitado nesta conexão.\nIdiomas disponíveis: ${allowed}`,
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
