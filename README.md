# Bible MCP

Free, no-key [Model Context Protocol](https://modelcontextprotocol.io) server for
the public Bible API. Read scripture across **86 Bible translations in 32
languages** from any MCP client — Claude, Cursor, and anything else that speaks
MCP. Served from Cloudflare's edge. Powers
[mcp.midvash.com](https://mcp.midvash.com).

- **No API key, no auth, no signup.** Just point your client at the URL.
- **HTTP Streamable transport** (stateless JSON-RPC over `POST`).
- Built on Cloudflare Workers + R2, backed by the same content as
  [api.midvash.com](https://api.midvash.com).

## Connecting a client

Generate your personal connection URL at
[mcp.midvash.com](https://mcp.midvash.com) and add it to your MCP client. URLs
look like:

```
https://mcp.midvash.com/mcp/{id}?v=nvi,kjv&lang=pt-br,en
```

- `v` — comma-separated version slugs to expose (optional; omit for all).
- `lang` — comma-separated languages to expose (optional; omit for all).

Example (Claude Desktop / `mcp.json`):

```json
{
  "mcpServers": {
    "bible": {
      "url": "https://mcp.midvash.com/mcp/{id}?v=nvi,kjv&lang=pt-br,en"
    }
  }
}
```

## Tools

| Tool | Description |
|---|---|
| `get_verse` | Fetch a single verse or a verse range. |
| `get_chapter` | Fetch a full chapter. |
| `get_passage` | Fetch a passage from a free-form reference (e.g. "John 3:16-18") — the most natural way to cite scripture. |
| `list_versions` | List available Bible versions/translations. |
| `list_books` | List the 66 books, optionally filtered by testament. |

## Development

```bash
npm install
npm run dev        # wrangler dev (local)
npm run typecheck  # tsc --noEmit
```

## Deployment

Deploys to the Cloudflare Worker `midvash-mcp` (custom domain
`mcp.midvash.com`) via **GitHub Actions** ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) —
every push to `main` is type-checked and deployed automatically. Requires the
repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Manual
deploy:

```bash
npm run deploy     # npx wrangler deploy
```

## License

[MIT](./LICENSE) © Midvash

## The Midvash ecosystem

Part of [**Midvash**](https://midvash.com) — a free Bible reading & study platform. Everything is open and interlinks:

| | |
|---|---|
| 📖 **Reader (web)** | [midvash.com](https://midvash.com) — 9 languages |
| 📱 **iOS app** | [midvash.app/ios](https://midvash.app/ios) |
| 🔌 **API** | [api.midvash.com](https://api.midvash.com) · [`bible-api`](https://github.com/midvash/bible-api) |
| 🤖 **MCP server** | [mcp.midvash.com](https://mcp.midvash.com) · [`bible-mcp`](https://github.com/midvash/bible-mcp) |
| 🧩 **WordPress plugin** | [midvash.app/wordpress-plugin](https://midvash.app/wordpress-plugin) · [`bible-wordpress-plugin`](https://github.com/midvash/bible-wordpress-plugin) |
| 🧩 **EmDash plugin** | [midvash.app/emdash-plugin](https://midvash.app/emdash-plugin) · [`emdash-plugin-bible`](https://github.com/midvash/emdash-plugin-bible) |
| 🌐 **Chrome extension** | [midvash.app/chrome-extension](https://midvash.app/chrome-extension) · [`bible-chrome-extension`](https://github.com/midvash/bible-chrome-extension) |
| 📦 **Open data** | [`bible-data`](https://github.com/midvash/bible-data) · [`bible-data-js`](https://github.com/midvash/bible-data-js) · [`bible-cross-references`](https://github.com/midvash/bible-cross-references) |

<sub>Free & open, built by [Midvash](https://midvash.com) · [midvash.com](https://midvash.com) · [midvash.app](https://midvash.app)</sub>

