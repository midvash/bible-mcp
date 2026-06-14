# Bible MCP

> 🌐 [English](./README.md) · **Português (BR)** · [Español](./README.es.md)

Servidor [Model Context Protocol](https://modelcontextprotocol.io) gratuito e sem chave para
a API bíblica pública. Leia as Escrituras em **86 traduções bíblicas em 32
idiomas** a partir de qualquer cliente MCP — Claude, Cursor e qualquer outro que fale
MCP. Servido a partir da edge da Cloudflare. Alimenta
[mcp.midvash.com](https://mcp.midvash.com).

- **Sem chave de API, sem auth, sem cadastro.** Basta apontar seu cliente para a URL.
- **Transporte HTTP Streamable** (JSON-RPC sem estado sobre `POST`).
- Construído sobre Cloudflare Workers + R2, apoiado no mesmo conteúdo de
  [api.midvash.com](https://api.midvash.com).

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
| `list_versions` | Lista as versões/traduções bíblicas disponíveis. |
| `list_books` | Lista os 66 livros, opcionalmente filtrados por testamento. |

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
