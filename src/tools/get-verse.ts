import { VERSIONS } from '../data/versions';
import { lookupBook } from '../lib/books-lookup';
import { isVersionAllowed } from '../lib/context';
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
      'Retorna um versículo específico (ou um intervalo de versículos) da Bíblia em Markdown formatado. Use para citações diretas e precisas.',
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
            'Nome ou slug do livro em português, inglês ou espanhol (ex.: "john", "João", "Salmos", "1 Sm").',
        },
        chapter: {
          type: 'integer',
          minimum: 1,
          description: 'Número do capítulo.',
        },
        verse: {
          type: 'integer',
          minimum: 1,
          description: 'Número do versículo inicial.',
        },
        verse_end: {
          type: 'integer',
          minimum: 1,
          description: 'Versículo final (opcional, para intervalos).',
        },
      },
      required: ['version', 'book', 'chapter', 'verse'],
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
