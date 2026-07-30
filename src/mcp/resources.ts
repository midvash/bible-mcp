import { BOOKS, type BookDefinition } from '../data/books';
import { VERSIONS, type VersionDefinition } from '../data/versions';
import { lookupBook } from '../lib/books-lookup';
import { isLanguageAllowed, isVersionAllowed, type ConnectionContext } from '../lib/context';
import { formatChapter, localeForVersion } from '../lib/markdown';
import { fetchChapter } from '../lib/r2';

/**
 * Resources do MCP: o texto bíblico como conteúdo endereçável, além das tools.
 *
 * A hierarquia é `bible://{versão}` → `bible://{versão}/{livro}` →
 * `bible://{versão}/{livro}/{capítulo}`.
 *
 * `resources/list` devolve só o primeiro nível — as versões liberadas na
 * conexão. Listar tudo seria 35 versões × 1.189 capítulos, mais de 41 mil
 * entradas: é para isso que existe `resources/templates/list`, que descreve o
 * padrão de URI e deixa o cliente montar o endereço que quiser.
 */

export interface Resource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface ResourceTemplate {
  uriTemplate: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface ResourceContents {
  uri: string;
  mimeType: string;
  text: string;
}

const MIME = 'text/markdown';

/** Versões que a conexão pode ver — mesma regra das tools. */
export function visibleVersions(ctx: ConnectionContext): VersionDefinition[] {
  return VERSIONS.filter(
    (v) => isVersionAllowed(ctx, v.slug) && isLanguageAllowed(ctx, v.language),
  );
}

export function listResources(ctx: ConnectionContext): Resource[] {
  return visibleVersions(ctx).map((version) => ({
    uri: `bible://${version.slug}`,
    name: `${version.shortName} — ${version.name}`,
    description: `Book list for ${version.name} (${version.language}). Append /{book}/{chapter} to read a chapter.`,
    mimeType: MIME,
  }));
}

export function listResourceTemplates(): ResourceTemplate[] {
  return [
    {
      uriTemplate: 'bible://{version}',
      name: 'Bible version',
      description: 'The 66 books available in one version.',
      mimeType: MIME,
    },
    {
      uriTemplate: 'bible://{version}/{book}',
      name: 'Bible book',
      description:
        'One book in one version, with its chapter count. `book` accepts a localized name, slug or abbreviation.',
      mimeType: MIME,
    },
    {
      uriTemplate: 'bible://{version}/{book}/{chapter}',
      name: 'Bible chapter',
      description: 'The full text of one chapter, in Markdown with numbered verses.',
      mimeType: MIME,
    },
  ];
}

export class ResourceError extends Error {}

function requireVersion(
  ctx: ConnectionContext,
  slug: string,
): VersionDefinition {
  const version = VERSIONS.find((v) => v.slug === slug.toLowerCase());
  if (!version) throw new ResourceError(`Unknown version "${slug}".`);
  if (!isVersionAllowed(ctx, version.slug) || !isLanguageAllowed(ctx, version.language)) {
    throw new ResourceError(
      `Version "${version.shortName}" is not enabled for this connection.`,
    );
  }
  return version;
}

function requireBook(input: string): BookDefinition {
  const book = lookupBook(decodeURIComponent(input));
  if (!book) throw new ResourceError(`Unknown book "${input}".`);
  return book;
}

function versionOverview(version: VersionDefinition): string {
  const locale = localeForVersion(version);
  const lines = [`# ${version.name} (${version.shortName})`, ''];

  for (const testament of ['old', 'new'] as const) {
    const books = BOOKS.filter((b) => b.testament === testament);
    if (books.length === 0) continue;
    lines.push(
      testament === 'old' ? '## Old Testament' : '## New Testament',
      '',
    );
    for (const book of books) {
      lines.push(
        `- ${book.names[locale]} — ${book.chapters} chapters — \`bible://${version.slug}/${book.slugs.en}/1\``,
      );
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

function bookOverview(
  version: VersionDefinition,
  book: BookDefinition,
): string {
  const locale = localeForVersion(version);
  const chapters = Array.from(
    { length: book.chapters },
    (_, i) => `bible://${version.slug}/${book.slugs.en}/${i + 1}`,
  );

  return [
    `# ${book.names[locale]} (${version.shortName})`,
    '',
    `${book.chapters} chapters. ${
      book.testament === 'old' ? 'Old Testament' : 'New Testament'
    }.`,
    '',
    ...chapters.map((uri, i) => `- Chapter ${i + 1} — \`${uri}\``),
  ].join('\n');
}

/**
 * Resolve um `bible://` URI. Lança `ResourceError` com mensagem própria quando
 * o endereço não existe ou a conexão não o permite.
 */
export async function readResource(
  uri: string,
  ctx: ConnectionContext,
  executionCtx: ExecutionContext,
): Promise<ResourceContents> {
  const match = /^bible:\/\/([^/]+)(?:\/([^/]+))?(?:\/(\d+))?\/?$/.exec(uri);
  if (!match) {
    throw new ResourceError(
      `Unsupported resource URI "${uri}". Use bible://{version}/{book}/{chapter}.`,
    );
  }

  const [, versionSlug, bookPart, chapterPart] = match;
  const version = requireVersion(ctx, versionSlug);

  if (!bookPart) {
    return { uri, mimeType: MIME, text: versionOverview(version) };
  }

  const book = requireBook(bookPart);

  if (!chapterPart) {
    return { uri, mimeType: MIME, text: bookOverview(version, book) };
  }

  const chapter = parseInt(chapterPart, 10);
  if (chapter < 1 || chapter > book.chapters) {
    throw new ResourceError(
      `Invalid chapter ${chapter}. ${book.names.en} has ${book.chapters} chapters.`,
    );
  }

  const verses = await fetchChapter(
    ctx.env,
    version.slug,
    book.id,
    chapter,
    executionCtx,
  );
  if (!verses || verses.length === 0) {
    throw new ResourceError(
      `${book.names.en} ${chapter} is not available in ${version.shortName}.`,
    );
  }

  return {
    uri,
    mimeType: MIME,
    text: formatChapter(book, version, chapter, verses),
  };
}
