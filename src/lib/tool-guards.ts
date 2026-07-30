import type { BookDefinition } from '../data/books';
import { VERSIONS, type VersionDefinition } from '../data/versions';
import { lookupBook } from './books-lookup';
import {
  isLanguageAllowed,
  isVersionAllowed,
  type ConnectionContext,
} from './context';

/**
 * Validações compartilhadas pelas tools.
 *
 * Antes, `get_verse`, `get_chapter`, `get_passage`, `compare_passage` e
 * `search_bible` repetiam as mesmas checagens — versão existe, versão liberada
 * na conexão, idioma liberado, livro existe, capítulo dentro do livro — cada
 * uma com seu texto. As mensagens divergiram e metade ficou em português,
 * metade em inglês. Aqui a checagem existe uma vez, e o idioma das mensagens
 * é o inglês, que é o idioma oficial do repositório.
 */

export type Guard<T> = { ok: true; value: T } | { ok: false; message: string };

const fail = (message: string): Guard<never> => ({ ok: false, message });
const pass = <T>(value: T): Guard<T> => ({ ok: true, value });

/** Versão usada quando nem o argumento nem a conexão indicam uma. */
const FALLBACK_VERSION = 'nvi';

/**
 * Resolve a versão a usar: a pedida, senão a primeira liberada na conexão,
 * senão NVI. Confere que existe e que a conexão permite ela e o idioma dela.
 */
export function resolveVersion(
  ctx: ConnectionContext,
  input: unknown,
  opts: { required?: boolean } = {},
): Guard<VersionDefinition> {
  const requested = input ? String(input).toLowerCase().trim() : '';

  if (!requested && opts.required) {
    return fail('Missing required parameter: version.');
  }

  const slug = requested || ctx.allowedVersions?.[0] || FALLBACK_VERSION;
  const version = VERSIONS.find((v) => v.slug === slug);
  if (!version) {
    return fail(
      `Version "${slug}" not found. Call list_versions to see what is available.`,
    );
  }

  if (!isVersionAllowed(ctx, slug)) {
    const allowed = ctx.allowedVersions?.join(', ').toUpperCase() ?? '';
    return fail(
      `Version **${version.shortName}** is not enabled for this connection.\nAvailable versions: ${allowed}`,
    );
  }

  if (!isLanguageAllowed(ctx, version.language)) {
    const allowed = ctx.allowedLanguages?.join(', ') ?? '';
    return fail(
      `Version **${version.shortName}** uses language ${version.language}, which is not enabled for this connection.\nAvailable languages: ${allowed}`,
    );
  }

  return pass(version);
}

/** Resolve um livro a partir de nome, slug ou abreviação em qualquer locale. */
export function resolveBook(
  input: unknown,
  opts: { required?: boolean } = {},
): Guard<BookDefinition> {
  const raw = input ? String(input).trim() : '';

  if (!raw) {
    return opts.required
      ? fail('Missing required parameter: book.')
      : fail('No book given.');
  }

  const book = lookupBook(raw);
  if (!book) {
    return fail(
      `Book "${raw}" not found. Call list_books to see the accepted names.`,
    );
  }

  return pass(book);
}

/** Confere que o capítulo existe no livro. */
export function resolveChapter(
  book: BookDefinition,
  input: unknown,
): Guard<number> {
  const chapter = Number(input);

  if (!Number.isInteger(chapter) || chapter < 1) {
    return fail('Missing or invalid parameter: chapter must be 1 or greater.');
  }
  if (chapter > book.chapters) {
    return fail(
      `Invalid chapter: ${chapter}. ${book.names.en} has ${book.chapters} chapters.`,
    );
  }

  return pass(chapter);
}

/**
 * Confere um intervalo de versículos contra o capítulo já carregado. O total
 * vem do texto, não dos metadados, porque varia entre versões.
 */
export function resolveVerseRange(
  book: BookDefinition,
  chapter: number,
  totalVerses: number,
  start: number,
  end: number,
): Guard<{ start: number; end: number }> {
  if (!Number.isInteger(start) || start < 1) {
    return fail('Missing or invalid parameter: verse must be 1 or greater.');
  }
  if (start > totalVerses) {
    return fail(
      `Verse ${start} does not exist. ${book.names.en} ${chapter} has ${totalVerses} verses.`,
    );
  }
  if (end < start) {
    return fail(`Invalid range: ${start}-${end}. The end comes before the start.`);
  }
  if (end > totalVerses) {
    return fail(
      `Invalid range: ${start}-${end}. ${book.names.en} ${chapter} has ${totalVerses} verses.`,
    );
  }

  return pass({ start, end });
}

/** Mensagem padrão de capítulo ausente no R2 de uma versão. */
export function chapterNotFound(
  book: BookDefinition,
  version: VersionDefinition,
  chapter: number,
): string {
  return `Chapter not found: ${book.names.en} ${chapter} (${version.shortName}).`;
}
