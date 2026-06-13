import type { BookDefinition, Locale } from '../data/books';
import type { VersionDefinition } from '../data/versions';

/**
 * Escolhe o locale de exibição mais adequado para uma versão bíblica.
 * Mapeia o idioma da versão para um dos 9 locales suportados nos dados
 * dos livros; idiomas-fonte sem locale equivalente (he, gr, la, etc.)
 * caem em 'en'.
 */
const BOOK_LOCALES = new Set<string>([
  'en',
  'pt-br',
  'es',
  'fr',
  'de',
  'it',
  'zh',
  'ru',
  'ko',
]);

function localeForVersion(version: VersionDefinition): Locale {
  const lang: string = version.language;
  if (lang === 'pt-pt') return 'pt-br';
  if (BOOK_LOCALES.has(lang)) return lang as Locale;
  return 'en';
}

function bookNameFor(book: BookDefinition, version: VersionDefinition): string {
  return book.names[localeForVersion(version)];
}

/**
 * Formata um único versículo (ou intervalo) em Markdown.
 *
 * Exemplo:
 *   **João 3:16** (NVI)
 *   *"Porque Deus amou o mundo..."*
 */
export function formatVerse(
  book: BookDefinition,
  version: VersionDefinition,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  verses: string[],
): string {
  const bookName = bookNameFor(book, version);
  const ref =
    verseEnd === verseStart
      ? `${bookName} ${chapter}:${verseStart}`
      : `${bookName} ${chapter}:${verseStart}-${verseEnd}`;

  const lines = [`**${ref}** (${version.shortName})`];

  if (verses.length === 1) {
    lines.push(`*"${verses[0]}"*`);
  } else {
    for (let i = 0; i < verses.length; i++) {
      const verseNum = verseStart + i;
      lines.push(`*"${verses[i]}"* — **v.${verseNum}**`);
    }
  }

  return lines.join('\n');
}

/**
 * Formata um capítulo completo em Markdown.
 *
 * Exemplo:
 *   ## João 3 (NVI)
 *
 *   **1** No princípio era o Verbo...
 *   **2** Ele estava no princípio...
 */
export function formatChapter(
  book: BookDefinition,
  version: VersionDefinition,
  chapter: number,
  verses: string[],
): string {
  const bookName = bookNameFor(book, version);
  const lines: string[] = [`## ${bookName} ${chapter} (${version.shortName})`, ''];

  for (let i = 0; i < verses.length; i++) {
    const text = verses[i];
    if (!text || text.trim() === '') continue;
    lines.push(`**${i + 1}** ${text}`);
  }

  return lines.join('\n');
}

/**
 * Formata uma lista de versões em Markdown.
 *
 * Exemplo:
 *   ## Versões disponíveis nesta conexão
 *
 *   - **NVI** — Nova Versão Internacional (pt-br)
 *   - **KJV** — King James Version (en)
 */
export function formatVersionList(versions: VersionDefinition[]): string {
  if (versions.length === 0) {
    return '## Versões disponíveis\n\nNenhuma versão habilitada nesta conexão.';
  }

  const lines: string[] = [
    '## Versões disponíveis nesta conexão',
    '',
  ];

  // Agrupa por idioma para legibilidade
  const byLang = new Map<string, VersionDefinition[]>();
  for (const v of versions) {
    if (!byLang.has(v.language)) byLang.set(v.language, []);
    byLang.get(v.language)!.push(v);
  }

  const langOrder = Array.from(byLang.keys()).sort();
  for (const lang of langOrder) {
    lines.push(`### ${lang}`);
    for (const v of byLang.get(lang)!) {
      const scope = v.hasOldTestament && v.hasNewTestament
        ? 'AT + NT'
        : v.hasOldTestament
        ? 'somente AT'
        : 'somente NT';
      lines.push(`- **${v.shortName}** (\`${v.slug}\`) — ${v.name} · ${scope}`);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

/**
 * Formata a lista de livros em Markdown, agrupados por testamento.
 */
export function formatBookList(
  books: BookDefinition[],
  locale: Locale = 'en',
): string {
  const ot = books.filter((b) => b.testament === 'old');
  const nt = books.filter((b) => b.testament === 'new');

  const lines: string[] = ['## Livros da Bíblia', ''];

  if (ot.length > 0) {
    lines.push(`### Antigo Testamento (${ot.length} livros)`);
    for (const b of ot) {
      lines.push(
        `- **${b.names[locale]}** (\`${b.slugs[locale]}\`, ${b.abbrev[locale]}) — ${b.chapters} capítulos`,
      );
    }
    lines.push('');
  }

  if (nt.length > 0) {
    lines.push(`### Novo Testamento (${nt.length} livros)`);
    for (const b of nt) {
      lines.push(
        `- **${b.names[locale]}** (\`${b.slugs[locale]}\`, ${b.abbrev[locale]}) — ${b.chapters} capítulos`,
      );
    }
  }

  return lines.join('\n').trimEnd();
}
