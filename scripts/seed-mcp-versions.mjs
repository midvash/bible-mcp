#!/usr/bin/env node
/**
 * Carrega as versões bíblicas que faltam no índice `midvash-mcp-search`.
 *
 * O índice nasceu com 9 versões — uma de referência por idioma, herdadas do
 * `midvash-search` do app web. Com todas as 35 do catálogo dentro, cada versão
 * ganha ranking BM25 próprio, e o hebraico, o grego e o latim deixam de cair na
 * varredura lenta do R2.
 *
 * Cada banco `bible-{slug}` tem `verses(id, book_id, chapter, number, text)`;
 * o destino tem `search_verses(locale, version, book_id, chapter, verse, text)`.
 * O `d1 export` emite uma linha por versículo, então a conversão é feita linha
 * a linha, sem carregar o arquivo inteiro na memória.
 *
 *   node scripts/seed-mcp-versions.mjs            # o que faltar
 *   node scripts/seed-mcp-versions.mjs nvi kjv    # só estas
 *
 * Idempotente por versão: apaga as linhas da versão antes de recarregá-la.
 * Ao final, reconstrói os índices FTS5 — eles são derivados, e reconstruir uma
 * vez no fim custa muito menos linhas escritas que manter triggers durante a
 * carga.
 */

import { execFileSync } from 'node:child_process';
import { createReadStream, createWriteStream, mkdtempSync, rmSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

const TARGET_DB = 'midvash-mcp-search';

/** Lê o catálogo direto do fonte, para não duplicar a lista. */
function loadVersions() {
  const src = readFileSync(new URL('../src/data/versions.ts', import.meta.url), 'utf8');
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

/** Converte o dump de uma versão para INSERTs na tabela do índice. */
async function transform(inputPath, outputPath, version, locale) {
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
    const text = pick('text');

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

/**
 * Popula os índices FTS5.
 *
 * Não usa `VALUES('rebuild')` para os versículos: reindexar 1,2 milhão de linhas
 * numa instrução faz o D1 devolver `internal error [code: 7500]`, e o índice
 * fica vazio sem que nada acuse — `COUNT(*)` numa tabela FTS5 de conteúdo
 * externo conta a tabela de conteúdo, não o índice.
 *
 * Em vez disso, insere versão por versão (~31 mil linhas por instrução), o que
 * também torna a falha localizada: uma versão que não entra é nomeada e pode
 * ser refeita sozinha.
 */
function reindex() {
  console.log('Reconstruindo índices FTS5…');

  // Este é pequeno e cabe num rebuild.
  wrangler(
    ['d1', 'execute', TARGET_DB, '--remote', '--command',
     "INSERT INTO search_metadata_fts(search_metadata_fts) VALUES('rebuild');"],
    { quiet: true },
  );

  const versions = query('SELECT DISTINCT version AS v FROM search_verses ORDER BY v;')
    .map((r) => r.v);

  for (const table of ['search_verses_fts', 'search_verses_tri']) {
    wrangler(
      ['d1', 'execute', TARGET_DB, '--remote', '--command',
       `INSERT INTO ${table}(${table}) VALUES('delete-all');`],
      { quiet: true },
    );

    const failed = [];
    for (const v of versions) {
      try {
        wrangler(
          ['d1', 'execute', TARGET_DB, '--remote', '--command',
           `INSERT INTO ${table}(rowid,text,locale,version,book_id,chapter,verse) ` +
           `SELECT rowid,text,locale,version,book_id,chapter,verse FROM search_verses WHERE version='${v}';`],
          { quiet: true },
        );
      } catch {
        failed.push(v);
      }
    }

    console.log(
      `  ${table}: ${versions.length - failed.length}/${versions.length} versões` +
        (failed.length ? ` — FALHARAM: ${failed.join(', ')}` : ''),
    );
  }
}

async function main() {
  const requested = process.argv.slice(2).filter((a) => a !== '--reindex');

  if (process.argv.includes('--reindex')) {
    reindex();
    return;
  }

  const catalog = loadVersions();

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
            'd1', 'export', `bible-${version.slug}`, '--remote',
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

        // Idempotência: recarregar não duplica.
        query(`DELETE FROM search_verses WHERE version='${version.slug}';`);

        console.log(`${label} carregando ${rows} versículos…`);
        wrangler(
          ['d1', 'execute', TARGET_DB, '--remote', '--file', converted],
          { quiet: true },
        );

        loaded++;
        console.log(`${label} OK`);
      } catch (err) {
        // Uma versão que falha não derruba as outras.
        console.log(`${label} FALHOU: ${String(err).split('\n')[0]}`);
      } finally {
        rmSync(dump, { force: true });
        rmSync(converted, { force: true });
      }
    }
  } finally {
    rmSync(workdir, { recursive: true, force: true });
  }

  console.log(`\n${loaded}/${todo.length} versões carregadas.`);
  reindex();

  console.table(
    query(
      'SELECT version, COUNT(*) AS verses FROM search_verses GROUP BY version ORDER BY version;',
    ),
  );
}

await main();
