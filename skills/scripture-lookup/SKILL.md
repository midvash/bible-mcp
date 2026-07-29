---
name: scripture-lookup
description: Look up, compare, and cite Bible passages accurately across translations and languages. Use whenever a Bible reference needs to be quoted, checked, compared between versions, or found by keyword — including sermon prep, study notes, devotionals, and verifying a half-remembered verse.
---

# Scripture lookup

Retrieve Scripture from the Bible MCP server instead of quoting from memory.
Recalled verse text drifts between translations and misnumbers verses; the tools
return the exact wording of the version you name.

## Picking the right tool

| Situation | Tool |
|---|---|
| You have a reference in any language ("João 3:16", "Psalm 23") | `get_passage` |
| You know book, chapter and verse numbers exactly | `get_verse` |
| You need a whole chapter | `get_chapter` |
| You remember wording but not where it is | `search_bible` |
| You need the same passage in several versions | `compare_passage` |
| You need to know what is available | `list_versions`, `list_books` |

`get_passage` is the usual entry point — it parses natural references and
accepts book names in the user's own language, so it saves a lookup step.

## Rules

**Never paraphrase a verse and present it as a quotation.** Fetch it. If a tool
call fails, say the text could not be retrieved rather than filling the gap from
memory.

**Always name the translation** alongside a quote — wording is
translation-specific, and a citation without a version is not verifiable.
Write it as `John 3:16 (KJV)`.

**Match the user's language.** Someone writing in Portuguese expects a
Portuguese translation, not an English one. Call `list_versions` with
`language` when unsure which are available.

**Verify before correcting someone.** If a user misquotes a verse, look it up
before saying so — the wording may be right in a translation you did not expect.

## Comparing translations

Use `compare_passage` when the exact wording carries the weight: a contested
verse, a word-study, or a passage where translations genuinely diverge. Report
what actually differs rather than restating each rendering in turn, and avoid
implying one translation is the correct one — that is a judgment for the reader.

## Searching

`search_bible` requires a `version`, because it matches the wording of that
specific translation. A phrase that exists in one translation may not appear in
another. If a search returns nothing, try a distinctive keyword instead of a
full phrase, or search a different version, before concluding the verse does
not exist.
