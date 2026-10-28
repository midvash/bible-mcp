# Contributing

Thanks for helping. Issues and pull requests are welcome.

## Before you start

- Open an issue first for anything bigger than a small fix, so we can agree on the approach.
- The catalog only holds versions that may be redistributed (public domain or an open license).
  A pull request that adds a version must say where its text comes from and under which license.

## Local setup

```bash
npm ci
npm run dev        # wrangler dev
npm run typecheck
npm test
```

A pull request needs `npm run typecheck` and `npm test` green. CI runs both.

## Style

- Code and comments in this repository mix English and Portuguese; tool output, error messages
  and docs facing MCP clients are in English.
- Keep tools deterministic: the same call must return the same text, because responses are cached
  at the edge.

## Releases

Merging to `main` deploys `mcp.midvash.com` through GitHub Actions. Do not deploy by hand.
