#!/usr/bin/env node
/**
 * Carrega no índice `midvash-mcp-search` as versões bíblicas do catálogo
 * (src/data/versions.ts) — e só elas.
 *
 * Cada versão é buscada em si mesma, com ranking BM25 próprio: o índice tem uma
 * cópia do texto de cada versão do catálogo, vinda do banco `bible-{slug}`.
 * Versão que sai do catálogo (ex.: sem licença pra redistribuir) tem que sair
 * do índice também — é o que o `--prune` faz.
 *
 * Cada banco `bible-{slug}` tem `verses(id, book_id, chapter, number, text)`;
 * o destino tem `search_verses(locale, version, book_id, chapter, verse, text)`.
 * O `d1 export` emite uma linha por versículo, então a conversão é feita linha
 * a linha, sem carregar o arquivo inteiro na memória.
 *
 *   node scripts/seed-mcp-versions.mjs            # o que faltar
 *   node scripts/seed-mcp-versions.mjs onbv kjv   # só estas
 *
 *   node scripts/seed-mcp-versions.mjs --prune   # tira as fora do catálogo
 *   node scripts/seed-mcp-versions.mjs --reindex # confere e completa o FTS5
 *
 * Idempotente por versão: apaga as linhas da versão antes de recarregá-la.
 * Os índices FTS5 são mantidos versão por versão, junto com a carga (ver
 * syncIndex): nunca se apaga nem reconstrói o índice inteiro.
 */

import { execFileSync } from 'node:child_process';
import { createReadStream, createWriteStream, mkdtempSync, rmSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

const TARGET_DB = 'midvash-mcp-search';

/**
 * Banco D1 de cada versão. O padrão é `bible-{slug}`; estas fogem dele (mesmo
 * `database_name` dos bindings em apps/api/wrangler.jsonc do monorepo).
 */
const DB_NAME_BY_SLUG = {
  'bg': 'bible-gdanska',
  'bkr': 'bible-kralicka',
  'bnb': 'bible-tagalog',
  'kar': 'bible-karoli',
  'kgy': 'bible-kougo',
  'kp': 'bible-kulish',
  'lsb': 'bible-esperanto',
  'nb1930': 'bible-norsk',
  'suv': 'bible-swahili-suv',
  'vdc': 'bible-cornilescu',
  'ycv': 'bible-turkish',
};

export const databaseFor = (slug) => DB_NAME_BY_SLUG[slug] ?? `bible-${slug}`;

/**
 * Lê o catálogo direto do fonte, para não duplicar a lista. Linhas comentadas
 * são versões fora do ar e não entram — sem tirar os comentários, a regex
 * pegaria a kjf e a rvr1960 de volta.
 */
export function loadVersions() {
  const src = readFileSync(new URL('../src/data/versions.ts', import.meta.url), 'utf8')
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n');
  const out = [];
  for (const m of src.matchAll(/\{\s*slug:\s*'([^']+)'[^}]*?language:\s*'([^']+)'/g)) {
    out.push({ slug: m[1], language: m[2] });
  }
  return out;
}

function wrangler(args, opts = {}) {
  return execFileSync('npx', ['wrangler', ...args], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 64,
    stdio: opts.quiet ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });
}

function query(sql) {
  const raw = execFileSync(
    'npx',
    ['wrangler', 'd1', 'execute', TARGET_DB, '--remote', '--command', sql, '--json'],
    { encoding: 'utf8', maxBuffer: 1024 * 1024 * 64 },
  );
  return JSON.parse(raw.slice(raw.indexOf('[')))[0].results;
}

/**
 * Divide a lista de valores de um INSERT em campos, respeitando aspas simples
 * e o escape `''` do SQLite. Um split ingênuo por vírgula quebraria em qualquer
 * versículo que contenha vírgula — ou seja, quase todos.
 */
function splitValues(body) {
  const fields = [];
  let current = '';
  let inString = false;

  for (let i = 0; i < body.length; i++) {
    const ch = body[i];

    if (inString) {
      if (ch === "'") {
        if (body[i + 1] === "'") {
          current += "''";
          i++;
        } else {
          inString = false;
          current += ch;
        }
      } else {
        current += ch;
      }
      continue;
    }

    if (ch === "'") {
      inString = true;
      current += ch;
    } else if (ch === ',') {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }

  fields.push(current);
  return fields.map((f) => f.trim());
}

const INSERT_RE = /^INSERT INTO "verses"\s*\(([^)]*)\)\s*VALUES\((.*)\);\s*$/;

/**
 * Mesmas regras de `foldArabic` e `foldHebrew` em src/lib/search-index.ts (o
 * teste src/lib/script-fold.test.ts confere que batem). Árabe e hebraico
 * entram no índice sem sinais de vogal pra casar com a query digitada sem
 * eles; o texto que o usuário lê vem do R2, intacto.
 */
export function foldArabic(input) {
  return input
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[\u0671\u0622\u0623\u0625]/g, '\u0627')
    .replace(/\u0649/g, '\u064A');
}

export function foldHebrew(input) {
  return input.replace(/\u05BE/g, ' ').replace(/[\u0591-\u05C7]/g, '');
}

const FOLD_BY_LOCALE = { ar: foldArabic, he: foldHebrew };

/** Converte o dump de uma versão para INSERTs na tabela do índice. */
export async function transform(inputPath, outputPath, version, locale) {
  const output = createWriteStream(outputPath);
  const reader = createInterface({
    input: createReadStream(inputPath),
    crlfDelay: Infinity,
  });

  const literal = `'${locale}','${version}'`;
  let rows = 0;
  let skipped = 0;

  for await (const line of reader) {
    const match = INSERT_RE.exec(line);
    if (!match) continue;

    const columns = match[1].split(',').map((c) => c.trim().replace(/"/g, ''));
    const values = splitValues(match[2]);
    if (columns.length !== values.length) {
      skipped++;
      continue;
    }

    const pick = (name) => values[columns.indexOf(name)];
    const bookId = pick('book_id');
    const chapter = pick('chapter');
    const verse = pick('number');
    const raw = pick('text');
    const fold = FOLD_BY_LOCALE[locale];
    const text = fold && raw !== undefined ? fold(raw) : raw;

    if (!bookId || !chapter || !verse || text === undefined) {
      skipped++;
      continue;
    }

    output.write(
      `INSERT INTO search_verses (locale,version,book_id,chapter,verse,text) VALUES(${literal},${bookId},${chapter},${verse},${text});\n`,
    );
    rows++;
  }

  await new Promise((resolve) => output.end(resolve));
  return { rows, skipped };
}

const FTS_TABLES = ['search_verses_fts', 'search_verses_tri'];
const FTS_COLUMNS = 'text,locale,version,book_id,chapter,verse';

/**
 * Manutenção dos índices FTS5, sempre por versão — nunca a tabela inteira.
 *
 * Com 2,9 milhões de versículos, `VALUES('delete-all')` e `VALUES('rebuild')`
 * estouram o tempo do D1 (`code: 7429`, out/2026), e o pior: o `delete-all`
 * chegou a valer mesmo com o erro, e a busca por trecho ficou vazia em
 * produção. Então nada aqui toca o índice todo de uma vez:
 *
 *  - versão nova: indexa só as linhas dela;
 *  - versão recarregada ou podada: tira do índice só as linhas dela, com o
 *    comando `'delete'` do FTS5 (que precisa dos valores antigos, por isso
 *    roda antes de apagar da tabela de conteúdo).
 *
 * Um timeout pode ter gravado mesmo dando erro. Por isso, antes de repetir, o
 * estado é conferido no `_docsize` (que tem uma linha por versículo indexado;
 * o `COUNT(*)` da tabela FTS5 conta a tabela de conteúdo e não serve). Repetir
 * um `'delete'` que já valeu corromperia o índice. Se a versão inteira não
 * passa, vai livro por livro.
 */
function scopeWhere(version, bookId) {
  return `version='${version}'` + (bookId ? ` AND book_id=${bookId}` : '');
}

/** Versículos do escopo na tabela de conteúdo e no índice. */
function counts(table, version, bookId) {
  const where = scopeWhere(version, bookId);
  const [r] = query(
    `SELECT (SELECT COUNT(*) FROM search_verses WHERE ${where}) AS rows, ` +
      `(SELECT COUNT(*) FROM ${table}_docsize WHERE id IN ` +
      `(SELECT rowid FROM search_verses WHERE ${where})) AS indexed;`,
  );
  return r;
}

function ftsStatement(table, op, version, bookId) {
  const where = scopeWhere(version, bookId);
  return op === 'insert'
    ? `INSERT INTO ${table}(rowid,${FTS_COLUMNS}) ` +
        `SELECT rowid,${FTS_COLUMNS} FROM search_verses WHERE ${where};`
    : `INSERT INTO ${table}(${table},rowid,${FTS_COLUMNS}) ` +
        `SELECT 'delete',rowid,${FTS_COLUMNS} FROM search_verses WHERE ${where};`;
}

/**
 * Leva o escopo ao estado pedido: todo indexado (`insert`) ou fora do índice
 * (`delete`). Devolve true se chegou lá.
 */
function applyScope(table, op, version, bookId, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    const { rows, indexed } = counts(table, version, bookId);
    if (op === 'insert' && indexed === rows) return true;
    if (op === 'delete' && indexed === 0) return true;
    // Meio indexado: a instrução não é atômica com isto, então não dá pra
    // repetir por cima. Só livro por livro resolve.
    if (indexed !== 0 && indexed !== rows) return false;
    try {
      wrangler(
        ['d1', 'execute', TARGET_DB, '--remote', '--command', ftsStatement(table, op, version, bookId)],
        { quiet: true },
      );
    } catch {
      // Confere de novo na próxima volta: o erro pode ter gravado.
    }
  }
  const { rows, indexed } = counts(table, version, bookId);
  return op === 'insert' ? indexed === rows : indexed === 0;
}

/** Aplica `op` a uma versão nos dois índices. Lança se não conseguir. */
function syncIndex(op, version) {
  for (const table of FTS_TABLES) {
    if (applyScope(table, op, version)) continue;

    const books = query(
      `SELECT DISTINCT book_id AS b FROM search_verses WHERE version='${version}' ORDER BY b;`,
    ).map((r) => r.b);
    const failed = books.filter((b) => !applyScope(table, op, version, b));
    if (failed.length > 0) {
      throw new Error(
        `${table} ${op} ${version}: falhou nos livros ${failed.join(', ')}. ` +
          'Livro meio indexado precisa de conserto manual.',
      );
    }
  }
}

/**
 * Confere e completa os índices, versão por versão. Não apaga nada: versão já
 * indexada passa direto, a que falta (ou falta em parte) é completada. Serve
 * pra consertar depois de uma carga que caiu no meio.
 */
function reindex() {
  console.log('Conferindo índices FTS5…');

  // Os metadados são poucos e cabem num rebuild.
  wrangler(
    ['d1', 'execute', TARGET_DB, '--remote', '--command',
     "INSERT INTO search_metadata_fts(search_metadata_fts) VALUES('rebuild');"],
    { quiet: true },
  );

  const versions = query('SELECT DISTINCT version AS v FROM search_verses ORDER BY v;')
    .map((r) => r.v);

  const failed = [];
  for (const v of versions) {
    try {
      syncIndex('insert', v);
    } catch (err) {
      failed.push(v);
      console.log(`  ${String(err.message ?? err)}`);
    }
  }

  const [total] = query(
    'SELECT (SELECT COUNT(*) FROM search_verses) AS rows, ' +
      FTS_TABLES.map((t) => `(SELECT COUNT(*) FROM ${t}_docsize) AS ${t}`).join(', ') + ';',
  );
  console.log(
    `  ${versions.length - failed.length}/${versions.length} versões ok` +
      (failed.length ? ` — FALHARAM: ${failed.join(', ')}` : ''),
  );
  console.table([total]);
}

/**
 * Apaga do índice toda versão que não está no catálogo. Sem isso, o texto de
 * uma versão retirada (sem licença) continuaria guardado no banco do MCP.
 */
function prune(catalog) {
  const keep = new Set(catalog.map((v) => v.slug));
  const present = query('SELECT DISTINCT version FROM search_verses;').map((r) => r.version);
  const gone = present.filter((v) => !keep.has(v));

  if (gone.length === 0) {
    console.log('Nada a podar — o índice só tem versões do catálogo.');
    return;
  }

  console.log(`Podando ${gone.length} versões fora do catálogo: ${gone.join(', ')}`);
  for (const v of gone) {
    // Primeiro o FTS5: o 'delete' precisa das linhas da tabela de conteúdo.
    syncIndex('delete', v);
    query(`DELETE FROM search_verses WHERE version='${v}';`);
  }
}

async function main() {
  const flags = new Set(['--reindex', '--prune']);
  const requested = process.argv.slice(2).filter((a) => !flags.has(a));

  if (process.argv.includes('--reindex')) {
    reindex();
    return;
  }

  const catalog = loadVersions();

  if (process.argv.includes('--prune')) {
    prune(catalog);
    return;
  }

  const present = new Set(
    query('SELECT DISTINCT version FROM search_verses;').map((r) => r.version),
  );

  const todo = catalog.filter(
    (v) => (requested.length === 0 ? !present.has(v.slug) : requested.includes(v.slug)),
  );

  if (todo.length === 0) {
    console.log('Nada a fazer — todas as versões pedidas já estão no índice.');
    return;
  }

  console.log(`Versões a carregar (${todo.length}): ${todo.map((v) => v.slug).join(', ')}\n`);

  const workdir = mkdtempSync(join(tmpdir(), 'mcp-versions-'));
  let loaded = 0;

  try {
    for (const [i, version] of todo.entries()) {
      const label = `[${i + 1}/${todo.length}] ${version.slug}`;
      const dump = join(workdir, `${version.slug}-raw.sql`);
      const converted = join(workdir, `${version.slug}.sql`);

      try {
        console.log(`${label} exportando…`);
        wrangler(
          [
            'd1', 'export', databaseFor(version.slug), '--remote',
            '--table', 'verses', '--no-schema', '--output', dump,
          ],
          { quiet: true },
        );

        const { rows, skipped } = await transform(
          dump, converted, version.slug, version.language,
        );
        if (rows === 0) {
          console.log(`${label} SEM LINHAS — pulando`);
          continue;
        }
        if (skipped > 0) console.log(`${label} ${skipped} linhas ignoradas`);

        // Idempotência: recarregar não duplica. O índice sai antes do
        // conteúdo, porque o 'delete' do FTS5 precisa das linhas antigas.
        syncIndex('delete', version.slug);
        query(`DELETE FROM search_verses WHERE version='${version.slug}';`);

        console.log(`${label} carregando ${rows} versículos…`);
        wrangler(
          ['d1', 'execute', TARGET_DB, '--remote', '--file', converted],
          { quiet: true },
        );

        console.log(`${label} indexando…`);
        syncIndex('insert', version.slug);

        loaded++;
        console.log(`${label} OK`);
      } catch (err) {
        // Uma versão que falha não derruba as outras. `--reindex` completa o
        // índice de quem ficou pela metade.
        console.log(`${label} FALHOU: ${String(err.message ?? err).split('\n')[0]}`);
      } finally {
        rmSync(dump, { force: true });
        rmSync(converted, { force: true });
      }
    }
  } finally {
    rmSync(workdir, { recursive: true, force: true });
  }

  console.log(`\n${loaded}/${todo.length} versões carregadas.`);

  console.table(
    query(
      'SELECT version, COUNT(*) AS verses FROM search_verses GROUP BY version ORDER BY version;',
    ),
  );
}

// Importável (para testar loadVersions/transform) sem disparar a carga.
if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
