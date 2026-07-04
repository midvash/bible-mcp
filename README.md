# Bible MCP

> 🌐 **English** · [Português (BR)](./README.pt-BR.md) · [Español](./README.es.md)

Free, no-key [Model Context Protocol](https://modelcontextprotocol.io) server for
the public Bible API. Read scripture across **35+ Bible versions in 9 language
families** from any MCP client — Claude, Cursor, and anything else that speaks
MCP. Served from Cloudflare's edge. Powers
[mcp.midvash.com](https://mcp.midvash.com).

- **No API key, no auth, no signup.** Just point your client at the URL.
- **HTTP Streamable transport** (stateless JSON-RPC over `POST`).
- Built on Cloudflare Workers + R2, backed by the same content as
  [api.midvash.com](https://api.midvash.com).
- Current MCP catalog: Portuguese, English, Spanish, Hebrew, Latin, French,
  Italian, Greek, and Portuguese (Portugal) versions.

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

## Current catalog

The MCP currently exposes the version catalog compiled in
[`src/data/versions.ts`](./src/data/versions.ts): 35 versions across the
language codes `pt-br`, `en`, `es`, `he`, `la`, `fr`, `it`, `gr`, and `pt-pt`.

The public URL can narrow that catalog per connection:

```
https://mcp.midvash.com/mcp/{id}?v=nvi,kjv&lang=pt-br,en
```

## Benchmark

The Bible MCP landscape has three useful patterns:

| Server | Strengths | What Midvash should learn from it |
|---|---|---|
| [`tuxr/bible-mcp`](https://glama.ai/mcp/servers/tuxr/bible-mcp) | Remote-capable lookup, search, navigation, multiple translations, Apocrypha. | Add first-class Bible search and richer navigation helpers. |
| [`molpass/mcp-bible`](https://glama.ai/mcp/servers/molpass/mcp-bible) | Multi-version lookup, keyword/semantic search, cross-references, word studies, original-language lexicon data. | Add semantic/keyword search, cross-references, and optional study layers. |
| [`djayatillake/studybible-mcp`](https://glama.ai/mcp/servers/djayatillake/studybible-mcp) | Lexicons, morphology, cross-references, contextual notes, deeper study workflow. | Keep Midvash simple by default, but expose advanced study tools when data is available. |
| [`ytssamuel/FHL-MCP-Server`](https://glama.ai/mcp/servers/ytssamuel/FHL-MCP-Server) | Strong Chinese Bible study resources, commentaries, original-language analysis, Apocrypha, topical studies. | Treat language communities as first-class audiences, not just translation filters. |

Midvash's edge is simplicity: remote, no key, no account, fast Cloudflare
delivery, and an open ecosystem around the reader, API, apps, plugins, and data.
The next improvements should preserve that low-friction experience while adding
the discovery and study tools users expect from Bible-focused MCP servers.

## Roadmap

- Expand the MCP catalog to match the broader Midvash data/API coverage.
- Add `search_bible` for keyword search across selected versions and books.
- Add passage comparison across multiple versions.
- Add cross-reference tools powered by
  [`bible-cross-references`](https://github.com/midvash/bible-cross-references).
- Add study-oriented tools for original-language, lexicon, and morphology data
  where reliable open data is available.
- Add automated tests for reference parsing, catalog filters, and tool calls.

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
