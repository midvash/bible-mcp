#!/usr/bin/env bash
#
# Popula o D1 `midvash-mcp-search` — o índice próprio do MCP:
#   - `search_metadata` (material de estudo), copiado do `midvash-search`;
#   - `verse_cross_refs`, copiado do `bible-config`;
#   - `search_verses`, montado a partir do banco `bible-{slug}` de cada versão
#     do catálogo (src/data/versions.ts), via scripts/seed-mcp-versions.mjs.
#
# Os versículos NÃO vêm mais do `midvash-search`: lá estão as versões de
# referência do app web (naa, niv, nvies…), com direitos reservados e sem
# licença pra redistribuir. O MCP só busca versões do próprio catálogo (a busca
# filtra por `version` = slug do catálogo), então o índice guarda o texto delas
# e de nenhuma outra.
#
# Por que um banco separado: ver o cabeçalho de scripts/mcp-search-schema.sql.
#
# O MCP só lê. Este script é o único caminho de escrita, e é manual de
# propósito: rode quando o conteúdo da origem mudar.
#
#   ./scripts/seed-mcp-search.sh
#
# Leva ~15 minutos e é idempotente: apaga o conteúdo antes de recarregar.
# Precisa do wrangler logado na conta dos bancos (WRANGLER_HOME /
# CLOUDFLARE_ACCOUNT_ID).
# Não usa `wrangler d1 import` porque o comando não existe no wrangler 4.x —
# a carga é `d1 execute --file`, que fatia o arquivo em lotes sozinho.
#
# Só trocou o catálogo (versão entrou ou saiu)? Não precisa disto tudo:
#   node scripts/seed-mcp-versions.mjs           # carrega as que faltam
#   node scripts/seed-mcp-versions.mjs --prune   # tira as que saíram

set -euo pipefail

SOURCE_DB="midvash-search"
# Só as referências cruzadas vêm daqui. Este banco guarda também usuários,
# sessões e credenciais de provedor de IA: é lido pelo CLI com as credenciais
# de quem roda o script, e NUNCA deve ganhar um binding no Worker.
XREF_SOURCE_DB="bible-config"
TARGET_DB="midvash-mcp-search"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

cd "$(dirname "$0")/.."

echo "==> 1/6  Esquema (tabelas de conteúdo, ainda sem FTS)"
npx wrangler d1 execute "$TARGET_DB" --remote --file scripts/mcp-search-schema.sql

echo "==> 2/6  Limpando destino"
# Os índices FTS são derivados: recriados do zero nos passos 5 e 6.
npx wrangler d1 execute "$TARGET_DB" --remote --command "
  DROP TABLE IF EXISTS search_verses_fts;
  DROP TABLE IF EXISTS search_verses_tri;
  DROP TABLE IF EXISTS search_metadata_fts;
  DELETE FROM search_verses;
  DELETE FROM search_metadata;
  DELETE FROM verse_cross_refs;
"

echo "==> 3/6  Exportando das origens (estudo e referências cruzadas)"
npx wrangler d1 export "$SOURCE_DB" --remote \
  --table search_metadata --no-schema --output "$WORKDIR/search_metadata.sql"
npx wrangler d1 export "$XREF_SOURCE_DB" --remote \
  --table verse_cross_refs --no-schema --output "$WORKDIR/verse_cross_refs.sql"

echo "==> 4/6  Carregando em $TARGET_DB"
# O export traz a lista de colunas em cada INSERT, então a ordem das colunas
# no destino não precisa bater — só os nomes precisam existir.
for table in search_metadata verse_cross_refs; do
  npx wrangler d1 execute "$TARGET_DB" --remote --file "$WORKDIR/$table.sql"
done

echo "==> 5/6  Criando as tabelas FTS5 (vazias)"
# Depois da carga, de propósito: com as tabelas FTS já criadas, cada INSERT
# escreveria também no índice, multiplicando as linhas escritas.
npx wrangler d1 execute "$TARGET_DB" --remote --file scripts/mcp-search-fts.sql

echo "==> 6/6  Versículos: uma versão do catálogo por vez, de bible-{slug}"
# Com `search_verses` vazio, carrega todas as versões do catálogo. Cada uma vira
# `search_verses(locale, version, …)` com locale = idioma da versão (pt-br, en,
# es, he…), 1 INSERT por versículo — longe do limite de 100KB por instrução.
# No fim, popula os índices FTS5 (versículos versão a versão — o `rebuild` de
# uma vez estoura no D1, ver scripts/mcp-search-fts.sql — e o de estudo).
node scripts/seed-mcp-versions.mjs

echo
echo "==> Conferência"
# COUNT(*) numa tabela FTS5 de conteúdo externo conta a tabela de conteúdo, não
# o índice: só uma consulta MATCH de verdade prova que o índice tem dados.
npx wrangler d1 execute "$TARGET_DB" --remote --command "
  SELECT
    (SELECT COUNT(DISTINCT version) FROM search_verses) AS versions,
    (SELECT COUNT(*) FROM search_verses)    AS verses,
    (SELECT COUNT(*) FROM search_metadata)  AS metadata,
    (SELECT COUNT(*) FROM verse_cross_refs) AS cross_refs,
    (SELECT COUNT(*) FROM search_verses_fts
      WHERE search_verses_fts MATCH 'amor' AND version = 'onbv')    AS onbv_amor,
    (SELECT COUNT(*) FROM search_verses_fts
      WHERE search_verses_fts MATCH 'love' AND version = 'bsb')     AS bsb_love,
    (SELECT COUNT(*) FROM search_verses_fts
      WHERE search_verses_fts MATCH 'amor' AND version = 'rvr1909') AS rvr1909_amor;
"
echo "Pronto. versions = tamanho do catálogo (16), e as três buscas > 0."
