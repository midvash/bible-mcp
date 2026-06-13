import { BOOKS, type BookDefinition, type Locale } from '../data/books';

/**
 * Normaliza um termo de busca: lowercase, sem acentos, sem espaços extras,
 * sem pontos. "1Sm.", "1 Sm", "1sm" → "1sm".
 */
function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, '')
    .trim();
}

/**
 * Variantes de prefixo numérico que aparecem em referências bíblicas em
 * múltiplos idiomas e estilos. Ex.: "1 João", "I João", "1João", "i john".
 */
function numericPrefixVariants(name: string): string[] {
  const match = name.match(/^([123])\s*(.+)$/);
  if (!match) return [name];

  const [, num, rest] = match;
  const roman = num === '1' ? 'i' : num === '2' ? 'ii' : 'iii';
  return [
    `${num} ${rest}`,
    `${num}${rest}`,
    `${roman} ${rest}`,
    `${roman}${rest}`,
  ];
}

/**
 * Map global de lookup. Construído uma única vez no carregamento do módulo.
 * Chave: forma normalizada (sem acento, lowercase, sem espaço/ponto).
 * Valor: BookDefinition correspondente.
 */
const BOOK_LOOKUP: Map<string, BookDefinition> = (() => {
  const map = new Map<string, BookDefinition>();
  const locales: Locale[] = ['en', 'pt-br', 'es', 'fr', 'de', 'it', 'zh', 'ru', 'ko'];

  for (const book of BOOKS) {
    const variants = new Set<string>();

    for (const locale of locales) {
      // Slug original (já normalizado, sem acento)
      variants.add(book.slugs[locale]);
      // Slug sem hífen (1-samuel → 1samuel)
      variants.add(book.slugs[locale].replace(/-/g, ''));
      // Slug com espaço (1-samuel → 1 samuel)
      variants.add(book.slugs[locale].replace(/-/g, ' '));

      // Nome completo + variantes de prefixo numérico
      for (const variant of numericPrefixVariants(book.names[locale])) {
        variants.add(variant);
      }

      // Abreviação
      variants.add(book.abbrev[locale]);
      for (const variant of numericPrefixVariants(book.abbrev[locale])) {
        variants.add(variant);
      }
    }

    for (const variant of variants) {
      const key = normalize(variant);
      if (key && !map.has(key)) {
        map.set(key, book);
      }
    }
  }

  return map;
})();

/**
 * Localiza um livro a partir de um slug, nome ou abreviação em qualquer
 * idioma. Retorna null se não encontrado.
 *
 * Ex.: lookupBook("john"), lookupBook("João"), lookupBook("1 Sm"),
 *      lookupBook("Salmos"), lookupBook("Rev")
 */
export function lookupBook(input: string): BookDefinition | null {
  if (!input) return null;
  const key = normalize(input);
  return BOOK_LOOKUP.get(key) ?? null;
}
