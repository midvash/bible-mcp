# Bible MCP

[![bible-mcp MCP server](https://glama.ai/mcp/servers/midvash/bible-mcp/badges/card.svg)](https://glama.ai/mcp/servers/midvash/bible-mcp)
[![bible-mcp MCP score](https://glama.ai/mcp/servers/midvash/bible-mcp/badges/score.svg)](https://glama.ai/mcp/servers/midvash/bible-mcp)
[![CI](https://github.com/midvash/bible-mcp/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/midvash/bible-mcp/actions/workflows/ci.yml)

> 🌐 [English](./README.md) · [Português (BR)](./README.pt-BR.md) · **Español**

Servidor [Model Context Protocol](https://modelcontextprotocol.io) gratuito y sin
clave de [Midvash](https://midvash.com). Lee, busca y estudia las Escrituras en
**119 versiones bíblicas libres en 69 idiomas** (dominio público o licencia
abierta, el mismo catálogo de [api.midvash.com](https://api.midvash.com)) en
ChatGPT, Claude, Gemini, Cursor y cualquier otro cliente MCP. Servido desde el
edge de Cloudflare. Impulsa [mcp.midvash.com](https://mcp.midvash.com).

- **Sin clave de API, sin auth, sin registro.** Solo apunta tu cliente a la URL.
- **Transporte HTTP Streamable** (JSON-RPC sin estado sobre `POST`).
- Construido sobre Cloudflare Workers + R2, respaldado por el mismo contenido de
  [api.midvash.com](https://api.midvash.com).
- La búsqueda funciona en todos los idiomas del catálogo, incluso hebreo y árabe
  escritos sin signos vocálicos.
- Las versiones con licencias como CC BY-SA llevan la línea de crédito al final
  de cada texto.

## Conectando un cliente

Genera tu URL de conexión personal en
[mcp.midvash.com](https://mcp.midvash.com) y agrégala a tu cliente MCP. Las URLs
tienen este formato:

```
https://mcp.midvash.com/mcp/{id}?v=bsb,kjv&lang=en
```

- `v`: slugs de versión separados por comas a exponer (opcional; omite para
  todas). La primera es la versión predeterminada de la conexión; sin `v`, la
  predeterminada es la BSB (inglés).
- `lang`: idiomas separados por comas a exponer (opcional; omite para todos).

**claude.ai / ChatGPT:** añade la URL como conector personalizado (Claude:
Personalizar › Conectores; ChatGPT: Configuración › Aplicaciones con el Modo
desarrollador activado). **Gemini CLI:** `gemini mcp add --transport http midvash "<url>"`.

Ejemplo (Cursor y otros editores, `mcp.json`):

```json
{
  "mcpServers": {
    "bible": {
      "url": "https://mcp.midvash.com/mcp/{id}?v=bsb,kjv&lang=en"
    }
  }
}
```

## Herramientas

| Herramienta | Descripción |
|---|---|
| `get_verse` | Obtiene un único versículo o un rango de versículos. |
| `get_chapter` | Obtiene un capítulo completo. |
| `get_passage` | Obtiene un pasaje a partir de una referencia en texto libre (ej.: "John 3:16-18") — la forma más natural de citar las Escrituras. |
| `search_bible` | Busca palabras o una frase exacta en el texto bíblico, ordenada por relevancia (BM25) sobre un índice FTS5. Ignora mayúsculas, acentos y signos vocálicos del hebreo y el árabe, con filtro opcional por libro o testamento. |
| `compare_passage` | Compara el mismo pasaje en múltiples versiones bíblicas. |
| `list_versions` | Lista las versiones/traducciones bíblicas disponibles. |
| `list_books` | Lista los 66 libros, opcionalmente filtrados por testamento. |
| `search_study` | Busca en la biblioteca de estudio — comentarios de capítulo, personajes bíblicos, entradas de diccionario y artículos de teología — en 9 idiomas. |
| `get_commentary` | Obtiene el comentario del capítulo al que apunta una referencia. Los 1.189 capítulos, en 9 idiomas. |
| `get_cross_references` | Encuentra otros pasajes relacionados con un versículo, ordenados por la fuerza del vínculo. 343.546 vínculos. |
| `get_strongs` | Consulta una palabra en el léxico Strong por número ("H430") o por la palabra misma. 14.197 entradas, definiciones en 9 idiomas. |

Las herramientas de estudio devuelven un resumen de hasta 500 caracteres y el
enlace al artículo completo en [midvash.com](https://midvash.com).
Además de las herramientas, el servidor expone **Resources** — `bible://{versión}/{libro}/{capítulo}`
direcciona el texto directamente — y cuatro **Prompts** de estudio: preparación de
sermón, devocional, estudio de palabra y comparación de traducciones. Los
argumentos de libro y versión tienen autocompletado.

Las herramientas que devuelven datos también devuelven `structuredContent` junto
al Markdown, para que el cliente no tenga que interpretar texto formateado.


## Límites

El servidor es público y sin autenticación, así que cada solicitud se mide:

| Límite | Valor |
|---|---|
| Llamadas de herramienta por IP | 60 por minuto |
| Tamaño del lote JSON-RPC | 5 mensajes |
| Techo agregado de llamadas | 1.200 por minuto por localidad de Cloudflare |

Un lote cuesta una unidad por `tools/call`, así que agrupar mensajes no eleva el
techo por IP. Las respuestas son deterministas y públicas, y se almacenan en
caché en el edge durante 24 horas — una llamada repetida no cuesta nada y
responde en una fracción del tiempo.

## Catálogo actual

El MCP expone hoy el catálogo compilado en
[`src/data/versions.ts`](./src/data/versions.ts): 119 versiones, todas de dominio
público o con licencia libre, en 69 códigos de idioma: `ar`, `as`, `bn`, `ceb`, `ckb`, `cs`, `da`, `de`, `ee`, `en`, `eo`, `es`, `fa`, `fi`, `fr`, `gr` (griego), `gu`, `ha`, `haw`, `he`, `hi`, `hil`, `hne`, `ht`, `hu`, `id`, `ig`, `ilo`, `it`, `ja`, `ki`, `kn`, `ko`, `la`, `lg`, `mg`, `ln`, `luo`, `ml`, `mr`, `my`, `nb`, `nd`, `ne`, `nl`, `ny`, `om`, `or`, `pa`, `pl`, `pt-br`, `ro`, `ru`, `sn`, `sr`, `sv`, `sw`, `ta`, `te`, `tl`, `to`, `tr`, `tw`, `ug`, `uk`, `ur`, `vi`, `yo`, `zh`. Las versiones cuya licencia pide atribución (CC BY-SA y similares)
llevan una línea `copyright`, impresa al final de todo texto que devuelven las tools.

La URL pública puede limitar ese catálogo por conexión:

```
https://mcp.midvash.com/mcp/{id}?v=bsb,kjv&lang=en
```

## De dónde vienen los datos

| Almacenamiento | Contenido |
|---|---|
| Bucket R2 `bible` | Texto de los capítulos, `{versión}/{libro}/{capítulo}.json`, con caché en el edge |
| D1 `midvash-mcp-search` | Índice FTS5: el texto de cada versión del catálogo y 18.792 documentos de estudio |

La base D1 es exclusiva de este MCP. Es una copia, reconstruida por
[`scripts/seed-mcp-search.sh`](./scripts/seed-mcp-search.sh), y el Worker solo
lee de ella. Mantenerla separada hace que el panel de Cloudflare reporte el uso
de este servidor por separado, y que un binding de D1 — que da acceso a la base
completa — no alcance nada más que contenido bíblico público.

La búsqueda está ordenada por versión en todas las versiones del catálogo. El
hebreo y el árabe se indexan sin signos vocálicos, así que una palabra escrita
sin ellos también se encuentra.

## Desarrollo

```bash
npm install
npm run dev        # wrangler dev (local)
npm run typecheck  # tsc --noEmit
```

## Despliegue

Despliega en el Cloudflare Worker `midvash-mcp` (dominio personalizado
`mcp.midvash.com`) vía **GitHub Actions** ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) —
cada push a `main` se verifica de tipos y se despliega automáticamente. Requiere los
secrets de repositorio `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`. Despliegue
manual:

```bash
npm run deploy     # npx wrangler deploy
```

## Licencia

[MIT](./LICENSE) © Midvash

## El ecosistema Midvash

Parte de [**Midvash: Biblia y Devocional**](https://midvash.com), una plataforma gratuita de lectura y estudio bíblico. Todo es abierto y se interconecta:

| | |
|---|---|
| 📖 **Lector (web)** | [midvash.com](https://midvash.com) — 9 idiomas |
| 📱 **Apps iOS y Android** | [App Store](https://apps.apple.com/app/id6775930176) · [Google Play](https://play.google.com/store/apps/details?id=com.midvash.mobile) |
| 🔌 **API** | [api.midvash.com](https://api.midvash.com) · [`bible-api`](https://github.com/midvash/bible-api) |
| 🤖 **Servidor MCP** | [mcp.midvash.com](https://mcp.midvash.com) · [`bible-mcp`](https://github.com/midvash/bible-mcp) |
| 🧩 **Plugin de WordPress** | [midvash.com/wordpress-plugin](https://midvash.com/wordpress-plugin) · [`bible-wordpress-plugin`](https://github.com/midvash/bible-wordpress-plugin) |
| 🧩 **Plugin de EmDash** | [midvash.com/emdash-plugin](https://midvash.com/emdash-plugin) · [`bible-emdash-plugin`](https://github.com/midvash/bible-emdash-plugin) |
| 🌐 **Extensión de Chrome** | [midvash.com/chrome-extension](https://midvash.com/chrome-extension) · [`bible-chrome-extension`](https://github.com/midvash/bible-chrome-extension) |
| 📦 **Datos abiertos** | [`bible-data`](https://github.com/midvash/bible-data) · [`bible-data-js`](https://github.com/midvash/bible-data-js) · [`bible-cross-references`](https://github.com/midvash/bible-cross-references) |

<sub>Gratuito y abierto, hecho por [Midvash](https://midvash.com) · [midvash.com](https://midvash.com)</sub>
