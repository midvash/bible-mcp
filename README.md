# Bible MCP

[![bible-mcp MCP server](https://glama.ai/mcp/servers/midvash/bible-mcp/badges/card.svg)](https://glama.ai/mcp/servers/midvash/bible-mcp)
[![bible-mcp MCP score](https://glama.ai/mcp/servers/midvash/bible-mcp/badges/score.svg)](https://glama.ai/mcp/servers/midvash/bible-mcp)

> 🌐 **English** · [Português (BR)](./README.pt-BR.md) · [Español](./README.es.md)

Free, no-key [Model Context Protocol](https://modelcontextprotocol.io) server by
[Midvash](https://midvash.com). Read, search and study Scripture across **62 free
Bible versions in 31 languages** (public domain or openly licensed, the same
catalog as [api.midvash.com](https://api.midvash.com)) from ChatGPT, Claude,
Gemini, Cursor and any other MCP client. Served from Cloudflare's edge. Powers
[mcp.midvash.com](https://mcp.midvash.com).

- **No API key, no auth, no signup.** Just point your client at the URL.
- **HTTP Streamable transport** (stateless JSON-RPC over `POST`).
- Built on Cloudflare Workers + R2, backed by the same content as
  [api.midvash.com](https://api.midvash.com).
- Search works in every catalog language, including Hebrew and Arabic typed
  without vowel marks.
- Versions under licenses such as CC BY-SA carry their credit line at the end of
  every text.

## Connecting a client

Generate your personal connection URL at
[mcp.midvash.com](https://mcp.midvash.com) and add it to your MCP client. URLs
look like:

```
https://mcp.midvash.com/mcp/{id}?v=bsb,kjv&lang=en
```

- `v`: comma-separated version slugs to expose (optional; omit for all). The
  first one is the connection's default version; with no `v`, the default is
  the BSB (English).
- `lang`: comma-separated languages to expose (optional; omit for all).

**claude.ai / ChatGPT:** add the URL as a custom connector (Claude: Customize ›
Connectors; ChatGPT: Settings › Apps with Developer mode on). **Gemini CLI:**
`gemini mcp add --transport http midvash "<url>"`.

Example (Cursor and other editors, `mcp.json`):

```json
{
  "mcpServers": {
    "bible": {
      "url": "https://mcp.midvash.com/mcp/{id}?v=bsb,kjv&lang=en"
    }
  }
}
```

## ChatGPT plugin

ChatGPT plugins are MCP servers, so this same server is the plugin. The
endpoint registered in the OpenAI plugin portal is:

```
https://mcp.midvash.com/mcp/chatgpt
```

`get_passage`, `get_verse` and `get_chapter` point at an interactive view
(`ui://midvash/passage-v1.html`, [MCP Apps](https://github.com/modelcontextprotocol/ext-apps)
standard) that shows the numbered verses and a button to read the passage on
midvash.com. Hosts without UI support keep getting the Markdown. Submission
data lives in [docs/chatgpt-plugin.md](docs/chatgpt-plugin.md).

## Tools

| Tool | Description |
|---|---|
| `get_verse` | Fetch a single verse or a verse range. |
| `get_chapter` | Fetch a full chapter. |
| `get_passage` | Fetch a passage from a free-form reference (e.g. "John 3:16-18") — the most natural way to cite scripture. |
| `search_bible` | Search the Bible text for words or an exact phrase, ranked by relevance (BM25) over an FTS5 index. Ignores case, accents and Hebrew/Arabic vowel marks; optionally filtered by book or testament. |
| `compare_passage` | Compare the same passage across multiple Bible versions. |
| `list_versions` | List available Bible versions/translations. |
| `list_books` | List the 66 books, optionally filtered by testament. |
| `search_study` | Search the study library — chapter commentaries, Bible characters, dictionary entries and theology articles — in 9 languages. |
| `get_commentary` | Fetch the commentary for the chapter a reference points to. All 1,189 chapters, in 9 languages. |
| `get_cross_references` | Find other passages that relate to a verse, ranked by how widely the link is attested. 343,546 links. |
| `get_strongs` | Look up a word in Strong's lexicon by number ("H430") or by the word itself. 14,197 entries, definitions in 9 languages. |

Study tools return a summary of up to 500 characters plus a link to the full
article on [midvash.com](https://midvash.com).
Beyond tools, the server exposes **Resources** — `bible://{version}/{book}/{chapter}`
addresses the text directly — and four study **Prompts**: sermon preparation, a
devotional, a word study, and a translation comparison. Book and version
arguments support autocompletion.

Tools that return data also return `structuredContent` alongside the Markdown,
so a client does not have to parse formatted text.


## Limits

The server is public and unauthenticated, so every request is metered:

| Limit | Value |
|---|---|
| Tool calls per IP | 60 per minute |
| JSON-RPC batch size | 5 messages |
| Aggregate tool calls | 1,200 per minute per Cloudflare location |

A batch costs one unit per `tools/call`, so batching cannot raise the per-IP
ceiling. Tool responses are deterministic and public, so they are cached at the
edge for 24 hours — a repeated call costs nothing and returns in a fraction of
the time.

## Current catalog

The MCP currently exposes the version catalog compiled in
[`src/data/versions.ts`](./src/data/versions.ts): 62 versions, all public domain or
openly licensed, across 31 language codes: `ar`, `cs`, `da`, `de`, `en`, `eo`, `es`, `fi`, `fr`, `gr` (Greek), `he`, `hu`, `id`, `it`, `ja`, `ko`, `la`, `nb`, `nl`, `pl`, `pt-br`, `ro`, `ru`, `sr`, `sv`, `sw`, `tl`, `tr`, `uk`, `vi`, `zh`. Versions whose license asks for attribution (CC BY-SA and similar) carry a
`copyright` line, printed at the end of every text the tools return.

The public URL can narrow that catalog per connection:

```
https://mcp.midvash.com/mcp/{id}?v=bsb,kjv&lang=en
```

## Where the data comes from

| Store | Contents |
|---|---|
| R2 bucket `bible` | Chapter text, `{version}/{book}/{chapter}.json`, cached at the edge |
| D1 `midvash-mcp-search` | FTS5 index: the text of every catalog version and 18,792 study documents |

The D1 database belongs to this MCP alone. It is a copy, rebuilt by
[`scripts/seed-mcp-search.sh`](./scripts/seed-mcp-search.sh), and the Worker
only ever reads from it. Keeping it separate means the Cloudflare dashboard
reports this server's usage on its own, and a D1 binding — which grants access
to an entire database — reaches nothing but public Bible content.

Search is ranked per version for every catalog version. Hebrew and Arabic are
indexed without vowel marks, so a word typed without them still matches.

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
- Improve `compare_passage` with richer formatting for long passages.
- Add study-oriented tools for original-language, lexicon, and morphology data
  where reliable open data is available.

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

Part of [**Midvash: Bible & Devotional**](https://midvash.com), a free Bible reading and study platform. Everything is open and interlinks:

| | |
|---|---|
| 📖 **Reader (web)** | [midvash.com](https://midvash.com) — 9 languages |
| 📱 **iOS and Android apps** | [App Store](https://apps.apple.com/app/id6775930176) · [Google Play](https://play.google.com/store/apps/details?id=com.midvash.mobile) |
| 🔌 **API** | [api.midvash.com](https://api.midvash.com) · [`bible-api`](https://github.com/midvash/bible-api) |
| 🤖 **MCP server** | [mcp.midvash.com](https://mcp.midvash.com) · [`bible-mcp`](https://github.com/midvash/bible-mcp) |
| 🧩 **WordPress plugin** | [midvash.com/wordpress-plugin](https://midvash.com/wordpress-plugin) · [`bible-wordpress-plugin`](https://github.com/midvash/bible-wordpress-plugin) |
| 🧩 **EmDash plugin** | [midvash.com/emdash-plugin](https://midvash.com/emdash-plugin) · [`emdash-plugin-bible`](https://github.com/midvash/emdash-plugin-bible) |
| 🌐 **Chrome extension** | [midvash.com/chrome-extension](https://midvash.com/chrome-extension) · [`bible-chrome-extension`](https://github.com/midvash/bible-chrome-extension) |
| 📦 **Open data** | [`bible-data`](https://github.com/midvash/bible-data) · [`bible-data-js`](https://github.com/midvash/bible-data-js) · [`bible-cross-references`](https://github.com/midvash/bible-cross-references) |

<sub>Free & open, built by [Midvash](https://midvash.com) · [midvash.com](https://midvash.com)</sub>
