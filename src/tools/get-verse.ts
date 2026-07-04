import { VERSIONS } from '../data/versions';
import { lookupBook } from '../lib/books-lookup';
import { isLanguageAllowed, isVersionAllowed } from '../lib/context';
import { fetchChapter } from '../lib/r2';
import { formatVerse } from '../lib/markdown';
import type { Tool } from '../mcp/types';

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text' as const, text }], isError };
}

export const getVerseTool: Tool = {
  definition: {
    name: 'get_verse',
    description:
      'Fetches one exact Bible verse or a contiguous verse range from a specific version. Use this when the book, chapter, verse, and version are already known. For natural references such as "John 3:16-18", prefer get_passage.',
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
        verse: {
          type: 'integer',
          minimum: 1,
          description: 'Starting verse number. Must exist in the selected chapter.',
        },
        verse_end: {
          type: 'integer',
          minimum: 1,
          description:
            'Optional ending verse number for a range. Must be greater than or equal to verse and within the same chapter.',
        },
      },
      required: ['version', 'book', 'chapter', 'verse'],
    },
    annotations: {
      title: 'Get Bible verse',
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
    const verseStart = Number(args.verse);
    const verseEnd = args.verse_end != null ? Number(args.verse_end) : verseStart;

    if (!versionSlug || !bookInput || !chapter || !verseStart) {
      return textResult(
        'Parâmetros obrigatórios faltando: version, book, chapter, verse.',
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

    if (verseStart < 1 || verseStart > verses.length) {
      return textResult(
        `Versículo ${verseStart} não existe. ${book.names.en} ${chapter} tem ${verses.length} versículos.`,
        true,
      );
    }
    if (verseEnd > verses.length || verseEnd < verseStart) {
      return textResult(
        `Intervalo inválido: ${verseStart}-${verseEnd}. O capítulo tem ${verses.length} versículos.`,
        true,
      );
    }

    const slice = verses.slice(verseStart - 1, verseEnd);
    return textResult(formatVerse(book, version, chapter, verseStart, verseEnd, slice));
  },
};
