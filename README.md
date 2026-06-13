# Bible MCP

Free, no-key [Model Context Protocol](https://modelcontextprotocol.io) server for
the public Bible API. Read scripture across **35+ public-domain translations in 8
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
`mcp.midvash.com`) via **Cloudflare Workers Builds** — every push to `main` is
built and deployed automatically. Manual deploy:

```bash
npm run deploy     # npx wrangler deploy
```

## License

[MIT](./LICENSE) © Midvash
