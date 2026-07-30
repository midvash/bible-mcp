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
| You want related passages ("what else speaks to this?") | `get_cross_references` |
| You need background on a chapter, a person, or a term | `search_study`, `get_commentary` |
| The question is what an original-language word means | `get_strongs` |

`get_passage` is the usual entry point — it parses natural references and
accepts book names in the user's own language, so it saves a lookup step. It
also takes ranges that cross chapters ("Romans 8:1-9:5") and several references
at once ("John 3:16; Romans 8:1"), so a passage list is one call, not five.

For study, the natural order is: read the passage, call `get_commentary` for the
chapter's context, then `get_cross_references` on the verse that carries the
weight. The server also ships ready-made prompts — sermon preparation, a
devotional, a word study, a translation comparison — if the client exposes them.

## Original languages

`get_strongs` takes a Strong's number ("H430", "G2316") or the word itself, in
the original script or transliterated ("elohim", "θεός"), and returns the lemma,
the senses, and how the KJV renders it, translated into the requested language.

**There is no word-by-word mapping between a verse and its Strong's numbers.**
The morphological source this server has access to arrives without those tags.
If you are not certain which entry a given word in a verse maps to, say so
instead of asserting one.

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

`search_bible` matches words in any order and ignores case and accents. Wrap
the query in double quotes only when the exact wording matters — a phrase that
exists in one translation may not appear in another. Results come back ranked
by relevance, so the strongest match is usually first.

`version` is optional; without it the search uses the connection's default.
Ranking is computed on one reference translation per language, so for other
versions the footer says which index ranked the results and lists references
that matched there but are worded differently in the version shown. If a search
returns nothing, try a distinctive single keyword before concluding the verse
does not exist.
