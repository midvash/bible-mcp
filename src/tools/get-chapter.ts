import { VERSIONS } from '../data/versions';
import { lookupBook } from '../lib/books-lookup';
import { isVersionAllowed } from '../lib/context';
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
      'Retorna um capítulo bíblico completo em Markdown com todos os versículos numerados. Use quando precisar do contexto inteiro de um capítulo.',
    inputSchema: {
      type: 'object',
      properties: {
        version: {
          type: 'string',
          description: 'Slug da versão bíblica (ex.: "nvi", "kjv", "ara").',
        },
        book: {
          type: 'string',
          description:
            'Nome ou slug do livro em português, inglês ou espanhol (ex.: "john", "João", "Salmos").',
        },
        chapter: {
          type: 'integer',
          minimum: 1,
          description: 'Número do capítulo.',
        },
      },
      required: ['version', 'book', 'chapter'],
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
