# Bible MCP

> 🌐 [English](./README.md) · **Português (BR)** · [Español](./README.es.md)

Servidor [Model Context Protocol](https://modelcontextprotocol.io) gratuito e sem chave para
a API bíblica pública. Leia as Escrituras em **35+ versões bíblicas em 9
famílias de idioma** a partir de qualquer cliente MCP — Claude, Cursor e qualquer outro que fale
MCP. Servido a partir da edge da Cloudflare. Alimenta
[mcp.midvash.com](https://mcp.midvash.com).

- **Sem chave de API, sem auth, sem cadastro.** Basta apontar seu cliente para a URL.
- **Transporte HTTP Streamable** (JSON-RPC sem estado sobre `POST`).
- Construído sobre Cloudflare Workers + R2, apoiado no mesmo conteúdo de
  [api.midvash.com](https://api.midvash.com).
- Catálogo atual do MCP: versões em português, inglês, espanhol, hebraico,
  latim, francês, italiano, grego e português de Portugal.

## Conectando um cliente

Gere sua URL de conexão pessoal em
[mcp.midvash.com](https://mcp.midvash.com) e adicione-a ao seu cliente MCP. As URLs
têm este formato:

```
https://mcp.midvash.com/mcp/{id}?v=nvi,kjv&lang=pt-br,en
```

- `v` — slugs de versão separados por vírgula a expor (opcional; omita para todas).
- `lang` — idiomas separados por vírgula a expor (opcional; omita para todos).

Exemplo (Claude Desktop / `mcp.json`):

```json
{
  "mcpServers": {
    "bible": {
      "url": "https://mcp.midvash.com/mcp/{id}?v=nvi,kjv&lang=pt-br,en"
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
| `search_bible` | Busca uma palavra-chave ou frase exata em uma versão bíblica, com filtro opcional por livro ou testamento. |
| `compare_passage` | Compara a mesma passagem em múltiplas versões bíblicas. |
| `list_versions` | Lista as versões/traduções bíblicas disponíveis. |
| `list_books` | Lista os 66 livros, opcionalmente filtrados por testamento. |

## Catálogo atual

O MCP expõe hoje o catálogo compilado em
[`src/data/versions.ts`](./src/data/versions.ts): 35 versões nos códigos de
idioma `pt-br`, `en`, `es`, `he`, `la`, `fr`, `it`, `gr` e `pt-pt`.

A URL pública pode limitar esse catálogo por conexão:

```
https://mcp.midvash.com/mcp/{id}?v=nvi,kjv&lang=pt-br,en
```

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
- Melhorar `search_bible` com um índice pré-gerado para buscas amplas mais rápidas.
- Melhorar `compare_passage` com formatação mais rica para passagens longas.
- Adicionar ferramentas de referências cruzadas usando
  [`bible-cross-references`](https://github.com/midvash/bible-cross-references).
- Adicionar ferramentas de estudo para línguas originais, léxicos e morfologia
  quando houver dados abertos confiáveis.
- Adicionar testes automatizados para parser de referências, filtros de catálogo e chamadas das ferramentas.

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

Faz parte do [**Midvash**](https://midvash.com) — uma plataforma gratuita de leitura e estudo bíblico. Tudo é aberto e se interliga:

| | |
|---|---|
| 📖 **Leitor (web)** | [midvash.com](https://midvash.com) — 9 idiomas |
| 📱 **App iOS** | [midvash.app/ios](https://midvash.app/ios) |
| 🔌 **API** | [api.midvash.com](https://api.midvash.com) · [`bible-api`](https://github.com/midvash/bible-api) |
| 🤖 **Servidor MCP** | [mcp.midvash.com](https://mcp.midvash.com) · [`bible-mcp`](https://github.com/midvash/bible-mcp) |
| 🧩 **Plugin WordPress** | [midvash.app/wordpress-plugin](https://midvash.app/wordpress-plugin) · [`bible-wordpress-plugin`](https://github.com/midvash/bible-wordpress-plugin) |
| 🧩 **Plugin EmDash** | [midvash.app/emdash-plugin](https://midvash.app/emdash-plugin) · [`emdash-plugin-bible`](https://github.com/midvash/emdash-plugin-bible) |
| 🌐 **Extensão Chrome** | [midvash.app/chrome-extension](https://midvash.app/chrome-extension) · [`bible-chrome-extension`](https://github.com/midvash/bible-chrome-extension) |
| 📦 **Dados abertos** | [`bible-data`](https://github.com/midvash/bible-data) · [`bible-data-js`](https://github.com/midvash/bible-data-js) · [`bible-cross-references`](https://github.com/midvash/bible-cross-references) |

<sub>Gratuito e aberto, feito pela [Midvash](https://midvash.com) · [midvash.com](https://midvash.com) · [midvash.app](https://midvash.app)</sub>
