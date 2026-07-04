import { VERSIONS } from '../data/versions';
import { lookupBook } from '../lib/books-lookup';
import { isLanguageAllowed, isVersionAllowed } from '../lib/context';
import { fetchChapter } from '../lib/r2';
import { formatChapter } from '../lib/markdown';
import type { Tool } from '../mcp/types';

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text' as const, text }], isError };
}

export const getChapterTool: Tool = {
  definition: {
    name: 'get_chapter',
    description:
      'Fetches a full Bible chapter from a specific version, formatted in Markdown with numbered verses. Use this when the user needs chapter-level context instead of an isolated verse.',
    inputSchema: {
      type: 'object',
      properties: {
        version: {
          type: 'string',
          description:
            'Bible version slug to read from, such as "nvi", "kjv", "ara", or "rvr1960". Must be enabled by the connection URL filters.',
        },
        book: {
          type: 'string',
          description:
            'Bible book name, slug, or abbreviation. Accepts supported localized names such as "John", "João", "Salmos", or "1 Sm".',
        },
        chapter: {
          type: 'integer',
          minimum: 1,
          description: 'Chapter number within the selected book. Must be 1 or greater.',
        },
      },
      required: ['version', 'book', 'chapter'],
    },
    annotations: {
      title: 'Get Bible chapter',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },

  async handler(args, ctx, executionCtx) {
    const versionSlug = String(args.version ?? '').toLowerCase().trim();
    const bookInput = String(args.book ?? '').trim();
    const chapter = Number(args.chapter);

    if (!versionSlug || !bookInput || !chapter) {
      return textResult(
        'Parâmetros obrigatórios faltando: version, book, chapter.',
        true,
      );
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

    const book = lookupBook(bookInput);
    if (!book) {
      return textResult(`Livro "${bookInput}" não encontrado.`, true);
    }
    if (chapter < 1 || chapter > book.chapters) {
      return textResult(
        `Capítulo inválido: ${chapter}. ${book.names.en} tem ${book.chapters} capítulos.`,
        true,
      );
    }

    const verses = await fetchChapter(ctx.env, versionSlug, book.id, chapter, executionCtx);
    if (!verses || verses.length === 0) {
      return textResult(
        `Capítulo não encontrado: ${book.names.en} ${chapter} (${version.shortName}).`,
        true,
      );
    }

    return textResult(formatChapter(book, version, chapter, verses));
  },
};
