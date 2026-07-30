import { BOOKS } from '../data/books';
import type { ConnectionContext } from '../lib/context';
import { normalizeText } from '../lib/search-index';
import { visibleVersions } from './resources';

/**
 * Autocompletar de argumentos (`completion/complete`).
 *
 * Nome de livro é a maior fonte de erro de parâmetro deste servidor: são 66
 * livros × 9 idiomas × nome, slug e abreviação. Sugerir em vez de recusar
 * elimina a ida e volta.
 */

/** Teto que a spec define para uma resposta de completions. */
const MAX_VALUES = 100;

interface CompletionResult {
  values: string[];
  total: number;
  hasMore: boolean;
}

function respond(all: string[]): CompletionResult {
  return {
    values: all.slice(0, MAX_VALUES),
    total: all.length,
    hasMore: all.length > MAX_VALUES,
  };
}

/**
 * Candidatos a nome de livro: nomes localizados e slugs em inglês, sem
 * repetição. Prefixo primeiro, depois substring — quem digita "cor" quer
 * "Coríntios" antes de "Coríntios" no meio de outra coisa.
 */
function bookNames(prefix: string): string[] {
  const needle = normalizeText(prefix);
  const seen = new Set<string>();
  const starts: string[] = [];
  const contains: string[] = [];

  for (const book of BOOKS) {
    for (const name of Object.values(book.names)) {
      if (seen.has(name)) continue;
      seen.add(name);

      const normalized = normalizeText(name);
      if (needle === '' || normalized.startsWith(needle)) starts.push(name);
      else if (normalized.includes(needle)) contains.push(name);
    }
  }

  return [...starts, ...contains];
}

function versionSlugs(ctx: ConnectionContext, prefix: string): string[] {
  const needle = normalizeText(prefix);
  return visibleVersions(ctx)
    .map((v) => v.slug)
    .filter((slug) => needle === '' || slug.startsWith(needle));
}

/**
 * Resolve um pedido de completions. Argumentos desconhecidos devolvem lista
 * vazia — a spec pede uma resposta bem formada, não um erro.
 */
export function completionsFor(
  params: unknown,
  ctx: ConnectionContext,
): CompletionResult {
  const p = (params ?? {}) as {
    argument?: { name?: string; value?: string };
  };

  const name = p.argument?.name ?? '';
  const value = p.argument?.value ?? '';

  if (name === 'book') return respond(bookNames(value));
  if (name === 'version') return respond(versionSlugs(ctx, value));

  return respond([]);
}
