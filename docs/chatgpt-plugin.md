# Plugin do ChatGPT — dados de envio

O plugin é este próprio servidor MCP. Este arquivo junta o que o portal de
plugins da OpenAI pede, pronto pra copiar. Os textos que vão pro formulário
ficam em inglês (é o que o revisor lê).

## Passo a passo (feito pelo dono da conta)

1. Entrar em <https://platform.openai.com> → **Plugins** → **New plugin** → **With MCP**.
2. **MCP URL:** `https://mcp.midvash.com/mcp/chatgpt`
3. **Auth:** nenhuma (servidor público). Se o portal insistir em OAuth, o
   servidor já responde o handshake (`src/oauth.ts`) sem pedir login.
4. Clicar em **Scan tools**. Devem aparecer 11 tools, todas `readOnlyHint: true`.
5. **Verificar domínio** `mcp.midvash.com` (o portal dá um token; vira uma rota
   ou um registro DNS — pedir ao agente pra adicionar).
6. **CSP:** `connect_domains` vazio; `resource_domains`:
   `https://fonts.googleapis.com`, `https://fonts.gstatic.com`.
7. Colar os dados abaixo, os 8 casos de teste, e **Submit for review**.

## Ficha

| Campo | Valor |
|---|---|
| Name | Midvash |
| Subtitle (≤ 30) | Read and study the Bible |
| Category | Education (ou Lifestyle, se não houver Religion) |
| Privacy policy | https://midvash.com/privacy |
| Terms | https://midvash.com/terms |
| Support | contact@midvash.com |
| Website | https://midvash.com |

**Description**

> Read, search and study Scripture without leaving the chat. Midvash brings 60+ free Bible
> versions in 30+ languages, side-by-side translation comparison, chapter
> commentaries, 340,000+ cross-references and Strong's Hebrew and Greek lexicon.
> Passages open in a clean reading view with a button to continue on
> midvash.com.

## Casos de teste

**Positivos (5)**

1. *"Show me John 3:16-18."* → `get_passage` com `reference: "John 3:16-18"` (sem versão cai na BSB, em inglês). A tela mostra os 3 versículos e o botão "Read on Midvash".
2. *"Read Psalm 23 in Portuguese."* → `get_passage` com `version: "onbv"`. A tela mostra o salmo inteiro.
3. *"Compare Romans 8:28 in the BSB, KJV and WEB."* → `compare_passage` com as três versões.
4. *"Where does the Bible talk about forgiving seventy times seven?"* → `search_bible`; o primeiro resultado é Mateus 18:22.
5. *"What does the Greek word agape mean?"* → `get_strongs` com `word: "agape"`; devolve G26.

**Negativos (3)**

1. *"What's the weather in São Paulo today?"* → nenhuma tool do Midvash é chamada.
2. *"Write a Python function to sort a list."* → nenhuma tool do Midvash é chamada.
3. *"Book a flight to Jerusalem."* → nenhuma tool do Midvash é chamada.

## Notas pro revisor (campo livre)

> All tools are read-only and require no account. Bible text is fetched from
> Midvash's own storage; nothing the user types is stored. Rate limit: 60 tool
> calls per minute per IP.
