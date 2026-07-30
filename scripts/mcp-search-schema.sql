-- Esquema do D1 `midvash-mcp-search` — o índice próprio do MCP.
--
-- Existe separado do `midvash-search` (do app web) por três motivos:
--   1. Atribuição de custo: o painel da Cloudflare reporta métricas por banco,
--      então as leituras do MCP deixam de se misturar com as do site.
--   2. Menor privilégio: binding de D1 entrega o banco inteiro, com escrita.
--      Aqui só há texto bíblico e material de estudo público — nada de usuário,
--      sessão ou credencial.
--   3. Independência: mudança no pipeline do site não quebra o MCP em silêncio.
--
-- As colunas espelham `midvash-search` **na mesma ordem**, de propósito:
--   - `wrangler d1 export` gera `INSERT INTO t VALUES(...)` sem lista de
--     colunas, então qualquer divergência de ordem ou contagem quebra a carga;
--   - as consultas em src/lib/search-index.ts e src/lib/study-index.ts
--     funcionam sem alteração nenhuma.
--
-- Sem triggers de sincronia: o Worker só lê. A carga é feita por
-- scripts/seed-mcp-search.sh, que reconstrói os índices no fim.

CREATE TABLE IF NOT EXISTS search_verses (
  rowid INTEGER PRIMARY KEY AUTOINCREMENT,
  locale TEXT NOT NULL,
  version TEXT NOT NULL,
  book_id INTEGER NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Índices não-únicos de propósito: um UNIQUE aqui faria a carga inteira falhar
-- caso a origem tenha qualquer duplicata. Este banco é derivado, não é a fonte.
CREATE INDEX IF NOT EXISTS idx_verses_locale ON search_verses(locale, version);
CREATE INDEX IF NOT EXISTS idx_verses_ref
  ON search_verses(version, book_id, chapter, verse);

CREATE TABLE IF NOT EXISTS search_metadata (
  rowid INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  locale TEXT NOT NULL,
  source_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  deeplink TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_metadata_locale_type ON search_metadata(locale, type);
CREATE INDEX IF NOT EXISTS idx_metadata_deeplink ON search_metadata(locale, deeplink);
CREATE INDEX IF NOT EXISTS idx_metadata_slug ON search_metadata(type, locale, slug);

-- Referências cruzadas ("que outros versículos falam disso?").
--
-- Cópia de `bible-config.verse_cross_refs`. O `bible-config` guarda, na mesma
-- base, usuários, sessões e credenciais de provedor de IA — **nunca** deve ser
-- ligado a este Worker público. Copiar é o caminho; custo igual, risco nenhum.
--
-- `votes` é a força da ligação no dataset de origem: quanto maior, mais fontes
-- concordam que os dois trechos se relacionam. É a ordenação natural.
CREATE TABLE IF NOT EXISTS verse_cross_refs (
  from_book INTEGER NOT NULL,
  from_ch INTEGER NOT NULL,
  from_v INTEGER NOT NULL,
  to_book INTEGER NOT NULL,
  to_ch INTEGER NOT NULL,
  to_v_start INTEGER NOT NULL,
  to_v_end INTEGER NOT NULL,
  votes INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_xrefs_from
  ON verse_cross_refs(from_book, from_ch, from_v, votes DESC);
