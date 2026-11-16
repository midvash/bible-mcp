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

export function localeForVersion(version: VersionDefinition): Locale {
  const lang: string = version.language;
  if (lang === 'pt-pt') return 'pt-br';
  if (BOOK_LOCALES.has(lang)) return lang as Locale;
  return 'en';
}

/**
 * Link do leitor do midvash.com no endereço canônico do trecho. O site publica
 * cada versão no idioma dela (`/pt-br/onbv/joao/3`); o endereço sem idioma
 * responde, mas com a interface em inglês. Versão em inglês, ou de idioma fora
 * dos 9 do site, fica sem prefixo e com o slug em inglês. Versículo vai na
 * âncora `#v=16` ou `#v=16-18`, como o site redireciona.
 */
export function readerUrl(
  version: VersionDefinition,
  book: BookDefinition,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
): string {
  const locale = localeForVersion(version);
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const slug = encodeURIComponent(book.slugs[locale] || book.slugs.en);
  const base = `https://midvash.com${prefix}/${version.slug}/${slug}/${chapter}`;
  if (verseStart === undefined) return base;
  const end = verseEnd !== undefined && verseEnd > verseStart ? `-${verseEnd}` : '';
  return `${base}#v=${verseStart}${end}`;
}

function bookNameFor(book: BookDefinition, version: VersionDefinition): string {
  return book.names[localeForVersion(version)];
}

/**
 * Linha de crédito que a licença da versão exige (CC BY-SA etc.), em itálico.
 * `null` quando a versão não pede atribuição.
 */
export function attributionLine(version: VersionDefinition): string | null {
  return version.copyright ? `_${version.copyright}_` : null;
}

/**
 * Anexa o crédito das versões ao fim de um texto bíblico. Cada crédito sai uma
 * vez só, mesmo que a versão apareça em vários trechos do mesmo texto.
 */
export function withAttribution(
  text: string,
  versions: VersionDefinition | VersionDefinition[],
): string {
  const list = Array.isArray(versions) ? versions : [versions];
  const lines = Array.from(
    new Set(list.map(attributionLine).filter((l): l is string => l !== null)),
  );
  return lines.length === 0 ? text : [text, ...lines].join('\n\n');
}

/** Nome do livro no idioma da versão — ex.: (João, ONBV) → "João". */
export function bookNameForVersion(
  book: BookDefinition,
  version: VersionDefinition,
): string {
  return bookNameFor(book, version);
}

/**
 * Formata um único versículo (ou intervalo) em Markdown.
 *
 * Exemplo:
 *   **João 3:16** (ONBV)
 *   *"Porque Deus amou o mundo..."*
 */
export function formatVerse(
  book: BookDefinition,
  version: VersionDefinition,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  verses: string[],
  { attribution = true }: { attribution?: boolean } = {},
): string {
  const bookName = bookNameFor(book, version);
  const ref =
    verseEnd === verseStart
      ? `${bookName} ${chapter}:${verseStart}`
      : `${bookName} ${chapter}:${verseStart}-${verseEnd}`;

  const url = readerUrl(version, book, chapter, verseStart, verseEnd);
  const lines = [`**[${ref}](${url})** (${version.shortName})`];

  if (verses.length === 1) {
    lines.push(`*"${verses[0]}"*`);
  } else {
    for (let i = 0; i < verses.length; i++) {
      const verseNum = verseStart + i;
      lines.push(`*"${verses[i]}"* — **v.${verseNum}**`);
    }
  }

  const text = lines.join('\n');
  return attribution ? withAttribution(text, version) : text;
}

/**
 * Formata um capítulo completo em Markdown.
 *
 * Exemplo:
 *   ## João 3 (ONBV)
 *
 *   **1** No princípio era o Verbo...
 *   **2** Ele estava no princípio...
 */
export function formatChapter(
  book: BookDefinition,
  version: VersionDefinition,
  chapter: number,
  verses: string[],
  { attribution = true }: { attribution?: boolean } = {},
): string {
  const bookName = bookNameFor(book, version);
  const url = readerUrl(version, book, chapter);
  const lines: string[] = [`## [${bookName} ${chapter}](${url}) (${version.shortName})`, ''];

  for (let i = 0; i < verses.length; i++) {
    const text = verses[i];
    if (!text || text.trim() === '') continue;
    lines.push(`**${i + 1}** ${text}`);
  }

  const text = lines.join('\n');
  return attribution ? withAttribution(text, version) : text;
}

/**
 * Formata uma lista de versões em Markdown.
 *
 * Exemplo:
 *   ## Versions available on this connection
 *
 *   - **ONBV** — Open Nova Bíblia Viva (pt-br)
 *   - **KJV** — King James Version (en)
 */
export function formatVersionList(versions: VersionDefinition[]): string {
  if (versions.length === 0) {
    return '## Available versions\n\nNo versions are enabled on this connection.';
  }

  const lines: string[] = [
    '## Versions available on this connection',
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
        ? 'OT + NT'
        : v.hasOldTestament
        ? 'OT only'
        : 'NT only';
      lines.push(`- **${v.shortName}** (\`${v.slug}\`) — ${v.name} · ${scope}`);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

/**
 * Formata a lista de livros em Markdown, agrupados por testamento.
 */
interface BookListLabels {
  title: string;
  old: string;
  new: string;
  /** "39 livros" */
  books: (n: number) => string;
  /** "50 capítulos" / "1 capítulo" */
  chapters: (n: number) => string;
}

const plural = (one: string, other: string) => (n: number) => `${n} ${n === 1 ? one : other}`;

/** Rótulos do `list_books` nos 9 locales; o padrão é inglês. */
const BOOK_LIST_LABELS: Record<Locale, BookListLabels> = {
  en: { title: 'Books of the Bible', old: 'Old Testament', new: 'New Testament', books: plural('book', 'books'), chapters: plural('chapter', 'chapters') },
  'pt-br': { title: 'Livros da Bíblia', old: 'Antigo Testamento', new: 'Novo Testamento', books: plural('livro', 'livros'), chapters: plural('capítulo', 'capítulos') },
  es: { title: 'Libros de la Biblia', old: 'Antiguo Testamento', new: 'Nuevo Testamento', books: plural('libro', 'libros'), chapters: plural('capítulo', 'capítulos') },
  fr: { title: 'Livres de la Bible', old: 'Ancien Testament', new: 'Nouveau Testament', books: plural('livre', 'livres'), chapters: plural('chapitre', 'chapitres') },
  de: { title: 'Bücher der Bibel', old: 'Altes Testament', new: 'Neues Testament', books: plural('Buch', 'Bücher'), chapters: plural('Kapitel', 'Kapitel') },
  it: { title: 'Libri della Bibbia', old: 'Antico Testamento', new: 'Nuovo Testamento', books: plural('libro', 'libri'), chapters: plural('capitolo', 'capitoli') },
  zh: { title: '圣经书卷', old: '旧约', new: '新约', books: (n) => `${n} 卷`, chapters: (n) => `${n} 章` },
  ru: {
    title: 'Книги Библии',
    old: 'Ветхий Завет',
    new: 'Новый Завет',
    books: (n) => `${n} ${ruPlural(n, 'книга', 'книги', 'книг')}`,
    chapters: (n) => `${n} ${ruPlural(n, 'глава', 'главы', 'глав')}`,
  },
  ko: { title: '성경 목록', old: '구약', new: '신약', books: (n) => `${n}권`, chapters: (n) => `${n}장` },
};

function ruPlural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function formatBookList(
  books: BookDefinition[],
  locale: Locale = 'en',
): string {
  const labels = BOOK_LIST_LABELS[locale] ?? BOOK_LIST_LABELS.en;
  const ot = books.filter((b) => b.testament === 'old');
  const nt = books.filter((b) => b.testament === 'new');

  const lines: string[] = [`## ${labels.title}`, ''];
  const pushGroup = (heading: string, group: BookDefinition[]) => {
    lines.push(`### ${heading} (${labels.books(group.length)})`);
    for (const b of group) {
      lines.push(
        `- **${b.names[locale]}** (\`${b.slugs[locale]}\`, ${b.abbrev[locale]}) — ${labels.chapters(b.chapters)}`,
      );
    }
    lines.push('');
  };

  if (ot.length > 0) pushGroup(labels.old, ot);
  if (nt.length > 0) pushGroup(labels.new, nt);

  return lines.join('\n').trimEnd();
}
