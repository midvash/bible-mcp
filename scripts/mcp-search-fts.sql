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

INSERT INTO search_verses_fts(search_verses_fts) VALUES('rebuild');
INSERT INTO search_verses_tri(search_verses_tri) VALUES('rebuild');
INSERT INTO search_metadata_fts(search_metadata_fts) VALUES('rebuild');
