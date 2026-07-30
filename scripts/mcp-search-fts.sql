-- Índices FTS5 do `midvash-mcp-search`, criados DEPOIS da carga.
--
-- Ordem importa: com as tabelas FTS já existentes, cada INSERT na tabela de
-- conteúdo escreveria também no índice. Carregar primeiro e reconstruir no
-- fim gasta muito menos linhas escritas.
--
-- `content=` aponta para a tabela de conteúdo (external content): o texto não
-- é duplicado, o FTS guarda só o índice invertido.

-- Versículos: termos e frases, insensível a acento e caixa, ranking BM25.
CREATE VIRTUAL TABLE IF NOT EXISTS search_verses_fts USING fts5(
  text,
  locale UNINDEXED,
  version UNINDEXED,
  book_id UNINDEXED,
  chapter UNINDEXED,
  verse UNINDEXED,
  content='search_verses',
  content_rowid='rowid',
  tokenize='unicode61 remove_diacritics 2'
);

-- Versículos: substring e prefixo (`ressurrei` → `ressurreição`).
CREATE VIRTUAL TABLE IF NOT EXISTS search_verses_tri USING fts5(
  text,
  locale UNINDEXED,
  version UNINDEXED,
  book_id UNINDEXED,
  chapter UNINDEXED,
  verse UNINDEXED,
  content='search_verses',
  content_rowid='rowid',
  tokenize='trigram remove_diacritics 1'
);

-- Material de estudo: título e resumo.
CREATE VIRTUAL TABLE IF NOT EXISTS search_metadata_fts USING fts5(
  title,
  body,
  type UNINDEXED,
  locale UNINDEXED,
  slug UNINDEXED,
  content='search_metadata',
  content_rowid='rowid',
  tokenize='unicode61 remove_diacritics 2'
);

-- ATENÇÃO: este arquivo só CRIA as tabelas. A população dos índices ficou
-- fora daqui de propósito.
--
-- `INSERT INTO t(t) VALUES('rebuild')` reindexa a tabela inteira numa única
-- instrução. Com 278 mil versículos isso passava; com 1,2 milhão o D1 devolve
-- `internal error [code: 7500]` e nada é indexado — a busca fica silenciosamente
-- vazia, porque `COUNT(*)` numa tabela FTS5 de conteúdo externo conta as linhas
-- da tabela de conteúdo, não do índice. O contador bate mesmo com o índice vazio.
--
-- O `rebuild` do índice de metadados e o do `search_verses_fts` ainda cabem numa
-- instrução; o de trigrama, não — ele é várias vezes maior.
--
-- A população é feita por scripts/seed-mcp-versions.mjs, uma versão por
-- instrução (~31 mil linhas cada). Depois de carregar dados novos, rode:
--
--   node scripts/seed-mcp-versions.mjs --reindex
--
-- e confira com uma consulta de verdade, não com COUNT(*):
--
--   SELECT COUNT(*) FROM search_verses_fts
--    WHERE search_verses_fts MATCH '"amor"' AND version='nvi';
