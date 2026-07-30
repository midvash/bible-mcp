#!/usr/bin/env bash
#
# Popula o D1 `midvash-mcp-search` — o índice próprio do MCP — copiando
# `search_verses` e `search_metadata` do `midvash-search` (do app web).
#
# Por que um banco separado: ver o cabeçalho de scripts/mcp-search-schema.sql.
#
# O MCP só lê. Este script é o único caminho de escrita, e é manual de
# propósito: rode quando o conteúdo da origem mudar.
#
#   ./scripts/seed-mcp-search.sh
#
# Leva ~10 minutos e é idempotente: apaga o conteúdo antes de recarregar.
# Não usa `wrangler d1 import` porque o comando não existe no wrangler 4.x —
# a carga é `d1 execute --file`, que fatia o arquivo em lotes sozinho.

set -euo pipefail

SOURCE_DB="midvash-search"
TARGET_DB="midvash-mcp-search"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

cd "$(dirname "$0")/.."

echo "==> 1/5  Esquema (tabelas de conteúdo, ainda sem FTS)"
npx wrangler d1 execute "$TARGET_DB" --remote --file scripts/mcp-search-schema.sql

echo "==> 2/5  Limpando destino"
# Os índices FTS são derivados: recriados do zero no passo 5.
npx wrangler d1 execute "$TARGET_DB" --remote --command "
  DROP TABLE IF EXISTS search_verses_fts;
  DROP TABLE IF EXISTS search_verses_tri;
  DROP TABLE IF EXISTS search_metadata_fts;
  DELETE FROM search_verses;
  DELETE FROM search_metadata;
"

echo "==> 3/5  Exportando de $SOURCE_DB"
for table in search_verses search_metadata; do
  npx wrangler d1 export "$SOURCE_DB" --remote \
    --table "$table" --no-schema --output "$WORKDIR/$table.sql"
done

echo "==> 4/5  Carregando em $TARGET_DB"
# O export traz a lista de colunas em cada INSERT, então a ordem das colunas
# no destino não precisa bater — só os nomes precisam existir.
for table in search_verses search_metadata; do
  npx wrangler d1 execute "$TARGET_DB" --remote --file "$WORKDIR/$table.sql"
done

echo "==> 5/5  Construindo os índices FTS5"
# Depois da carga, de propósito: com as tabelas FTS já criadas, cada INSERT
# escreveria também no índice, multiplicando as linhas escritas.
npx wrangler d1 execute "$TARGET_DB" --remote --file scripts/mcp-search-fts.sql

echo
echo "==> Conferência"
npx wrangler d1 execute "$TARGET_DB" --remote --command "
  SELECT
    (SELECT COUNT(*) FROM search_verses)   AS verses,
    (SELECT COUNT(*) FROM search_metadata) AS metadata,
    (SELECT COUNT(*) FROM search_verses_fts)   AS verses_fts,
    (SELECT COUNT(*) FROM search_metadata_fts) AS metadata_fts;
"
echo "Pronto. verses e verses_fts devem bater; metadata e metadata_fts também."
