# Bible MCP

[![bible-mcp MCP server](https://glama.ai/mcp/servers/midvash/bible-mcp/badges/card.svg)](https://glama.ai/mcp/servers/midvash/bible-mcp)
[![bible-mcp MCP score](https://glama.ai/mcp/servers/midvash/bible-mcp/badges/score.svg)](https://glama.ai/mcp/servers/midvash/bible-mcp)

> 🌐 [English](./README.md) · **Português (BR)** · [Español](./README.es.md)

Servidor [Model Context Protocol](https://modelcontextprotocol.io) gratuito e sem
chave do [Midvash](https://midvash.com). Leia, busque e estude as Escrituras em
**61 versões bíblicas livres em 31 idiomas** (domínio público ou licença aberta,
o mesmo catálogo da [api.midvash.com](https://api.midvash.com)) no ChatGPT,
Claude, Gemini, Cursor e qualquer outro cliente MCP. Servido a partir da edge da
Cloudflare. Alimenta [mcp.midvash.com](https://mcp.midvash.com).

- **Sem chave de API, sem auth, sem cadastro.** Basta apontar seu cliente para a URL.
- **Transporte HTTP Streamable** (JSON-RPC sem estado sobre `POST`).
- Construído sobre Cloudflare Workers + R2, apoiado no mesmo conteúdo de
  [api.midvash.com](https://api.midvash.com).
- A busca funciona em todos os idiomas do catálogo, inclusive hebraico e árabe
  digitados sem sinais de vogal.
- Versões com licenças como CC BY-SA levam a linha de crédito no fim de todo texto.

## Conectando um cliente

Gere sua URL de conexão pessoal em
[mcp.midvash.com](https://mcp.midvash.com) e adicione-a ao seu cliente MCP. As URLs
têm este formato:

```
https://mcp.midvash.com/mcp/{id}?v=bsb,kjv&lang=en
```

- `v`: slugs de versão separados por vírgula a expor (opcional; omita para
  todas). A primeira é a versão padrão da conexão; sem `v`, a padrão é a BSB
  (inglês).
- `lang`: idiomas separados por vírgula a expor (opcional; omita para todos).

**claude.ai / ChatGPT:** adicione a URL como conector personalizado (Claude:
Personalizar › Conectores; ChatGPT: Configurações › Aplicativos com o Modo
desenvolvedor ligado). **Gemini CLI:** `gemini mcp add --transport http midvash "<url>"`.

Exemplo (Cursor e outros editores, `mcp.json`):

```json
{
  "mcpServers": {
    "bible": {
      "url": "https://mcp.midvash.com/mcp/{id}?v=bsb,kjv&lang=en"
    }
  }
}
```

## Ferramentas

| Ferramenta | Descrição |
|---|---|
| `get_verse` | Busca um único versículo ou um intervalo de versículos. |
| `get_chapter` | Busca um capítulo completo. |
| `get_passage` | Busca uma passagem a partir de uma referência em texto livre (ex.: "John 3:16-18") — a forma mais natural de citar as Escrituras. |
| `search_bible` | Busca palavras ou uma frase exata no texto bíblico, ranqueada por relevância (BM25) sobre um índice FTS5. Ignora caixa, acentos e sinais de vogal do hebraico e do árabe, com filtro opcional por livro ou testamento. |
| `compare_passage` | Compara a mesma passagem em múltiplas versões bíblicas. |
| `list_versions` | Lista as versões/traduções bíblicas disponíveis. |
| `list_books` | Lista os 66 livros, opcionalmente filtrados por testamento. |
| `search_study` | Busca na biblioteca de estudo — comentários de capítulo, personagens bíblicos, verbetes de dicionário e artigos de teologia — em 9 idiomas. |
| `get_commentary` | Busca o comentário do capítulo a que uma referência aponta. Os 1.189 capítulos, em 9 idiomas. |
| `get_cross_references` | Encontra outras passagens relacionadas a um versículo, ordenadas pela força da ligação. 343.546 ligações. |
| `get_strongs` | Consulta uma palavra no léxico Strong por número ("H430") ou pela própria palavra. 14.197 verbetes, definições em 9 idiomas. |

As ferramentas de estudo devolvem um resumo de até 500 caracteres e o link para
o artigo completo em [midvash.com](https://midvash.com).
Além das ferramentas, o servidor expõe **Resources** — `bible://{versão}/{livro}/{capítulo}`
endereça o texto diretamente — e quatro **Prompts** de estudo: preparo de sermão,
devocional, estudo de palavra e comparação de traduções. Argumentos de livro e
versão têm autocompletar.

As ferramentas que devolvem dados também devolvem `structuredContent` junto do
Markdown, para o cliente não precisar interpretar texto formatado.


## Limites

O servidor é público e sem autenticação, então toda requisição é medida:

| Limite | Valor |
|---|---|
| Chamadas de tool por IP | 60 por minuto |
| Tamanho do lote JSON-RPC | 5 mensagens |
| Teto agregado de chamadas | 1.200 por minuto por localidade da Cloudflare |

Um lote custa uma unidade por `tools/call`, então agrupar mensagens não eleva o
teto por IP. As respostas são determinísticas e públicas, e ficam em cache no
edge por 24 horas — uma chamada repetida não custa nada e responde numa fração
do tempo.

## Catálogo atual

O MCP expõe hoje o catálogo compilado em
[`src/data/versions.ts`](./src/data/versions.ts): 61 versões, todas em domínio
público ou com licença livre, em 31 códigos de idioma: `ar`, `cs`, `da`, `de`, `en`, `eo`, `es`, `fi`, `fr`, `gr` (grego), `he`, `hu`, `id`, `it`, `ja`, `ko`, `la`, `nb`, `nl`, `pl`, `pt-br`, `ro`, `ru`, `sr`, `sv`, `sw`, `tl`, `tr`, `uk`, `vi`, `zh`. As versões cuja licença pede atribuição (CC BY-SA e afins) têm
uma linha `copyright`, impressa no fim de todo texto que as tools devolvem.

A URL pública pode limitar esse catálogo por conexão:

```
https://mcp.midvash.com/mcp/{id}?v=bsb,kjv&lang=en
```

## De onde vêm os dados

| Armazenamento | Conteúdo |
|---|---|
| Bucket R2 `bible` | Texto dos capítulos, `{versão}/{livro}/{capítulo}.json`, com cache no edge |
| D1 `midvash-mcp-search` | Índice FTS5: o texto de cada versão do catálogo e 18.792 documentos de estudo |

O banco D1 é exclusivo deste MCP. É uma cópia, reconstruída por
[`scripts/seed-mcp-search.sh`](./scripts/seed-mcp-search.sh), e o Worker apenas
lê dela. Mantê-lo separado faz o painel da Cloudflare reportar o uso deste
servidor isoladamente, e faz com que um binding de D1 — que dá acesso ao banco
inteiro — não alcance nada além de conteúdo bíblico público.

A busca é ranqueada por versão em todas as versões do catálogo. Hebraico e árabe
são indexados sem sinais de vogal, então uma palavra digitada sem eles também
é encontrada.

## Benchmark

O ecossistema de MCPs bíblicos mostra três padrões úteis:

| Servidor | Pontos fortes | O que o Midvash deve aprender |
|---|---|---|
| [`tuxr/bible-mcp`](https://glama.ai/mcp/servers/tuxr/bible-mcp) | Lookup remoto, busca, navegação, múltiplas traduções e Apocrypha. | Adicionar busca bíblica nativa e helpers melhores de navegação. |
| [`molpass/mcp-bible`](https://glama.ai/mcp/servers/molpass/mcp-bible) | Lookup multi-versão, busca keyword/semântica, referências cruzadas, estudos de palavras e léxicos de línguas originais. | Adicionar busca semântica/keyword, referências cruzadas e camadas opcionais de estudo. |
| [`djayatillake/studybible-mcp`](https://glama.ai/mcp/servers/djayatillake/studybible-mcp) | Léxicos, morfologia, referências cruzadas, notas contextuais e fluxo de estudo profundo. | Manter o Midvash simples por padrão, mas expor ferramentas avançadas quando houver dados confiáveis. |
| [`ytssamuel/FHL-MCP-Server`](https://glama.ai/mcp/servers/ytssamuel/FHL-MCP-Server) | Recursos fortes para estudo bíblico em chinês, comentários, análise de línguas originais, Apocrypha e estudos por tópico. | Tratar comunidades linguísticas como públicos de primeira classe, não só como filtros de tradução. |

A vantagem do Midvash é a simplicidade: remoto, sem chave, sem conta, rápido na
Cloudflare e conectado a um ecossistema aberto de leitor, API, apps, plugins e
dados. As próximas melhorias devem preservar essa experiência sem fricção e
adicionar as ferramentas de descoberta e estudo que usuários esperam de MCPs
bíblicos.

## Roadmap

- Expandir o catálogo do MCP para acompanhar a cobertura mais ampla dos dados/API Midvash.
- Melhorar `compare_passage` com formatação mais rica para passagens longas.
- Adicionar ferramentas de estudo para línguas originais, léxicos e morfologia
  quando houver dados abertos confiáveis.

## Desenvolvimento

```bash
npm install
npm run dev        # wrangler dev (local)
npm run typecheck  # tsc --noEmit
```

## Deploy

Faz deploy no Cloudflare Worker `midvash-mcp` (domínio personalizado
`mcp.midvash.com`) via **GitHub Actions** ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) —
cada push para `main` passa por verificação de tipos e é deployado automaticamente. Requer os
secrets de repositório `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`. Deploy
manual:

```bash
npm run deploy     # npx wrangler deploy
```

## Licença

[MIT](./LICENSE) © Midvash

## O ecossistema Midvash

Faz parte do [**Midvash: Bíblia & Devocional**](https://midvash.com), uma plataforma gratuita de leitura e estudo bíblico. Tudo é aberto e se interliga:

| | |
|---|---|
| 📖 **Leitor (web)** | [midvash.com](https://midvash.com) — 9 idiomas |
| 📱 **Apps iOS e Android** | [App Store](https://apps.apple.com/app/id6775930176) · [Google Play](https://play.google.com/store/apps/details?id=com.midvash.mobile) |
| 🔌 **API** | [api.midvash.com](https://api.midvash.com) · [`bible-api`](https://github.com/midvash/bible-api) |
| 🤖 **Servidor MCP** | [mcp.midvash.com](https://mcp.midvash.com) · [`bible-mcp`](https://github.com/midvash/bible-mcp) |
| 🧩 **Plugin WordPress** | [midvash.com/wordpress-plugin](https://midvash.com/wordpress-plugin) · [`bible-wordpress-plugin`](https://github.com/midvash/bible-wordpress-plugin) |
| 🧩 **Plugin EmDash** | [midvash.com/emdash-plugin](https://midvash.com/emdash-plugin) · [`emdash-plugin-bible`](https://github.com/midvash/emdash-plugin-bible) |
| 🌐 **Extensão Chrome** | [midvash.com/chrome-extension](https://midvash.com/chrome-extension) · [`bible-chrome-extension`](https://github.com/midvash/bible-chrome-extension) |
| 📦 **Dados abertos** | [`bible-data`](https://github.com/midvash/bible-data) · [`bible-data-js`](https://github.com/midvash/bible-data-js) · [`bible-cross-references`](https://github.com/midvash/bible-cross-references) |

<sub>Gratuito e aberto, feito pela [Midvash](https://midvash.com) · [midvash.com](https://midvash.com)</sub>
