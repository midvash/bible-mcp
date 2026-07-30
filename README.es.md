# Bible MCP

[![bible-mcp MCP server](https://glama.ai/mcp/servers/midvash/bible-mcp/badges/card.svg)](https://glama.ai/mcp/servers/midvash/bible-mcp)
[![bible-mcp MCP score](https://glama.ai/mcp/servers/midvash/bible-mcp/badges/score.svg)](https://glama.ai/mcp/servers/midvash/bible-mcp)

> 🌐 [English](./README.md) · [Português (BR)](./README.pt-BR.md) · **Español**

Servidor [Model Context Protocol](https://modelcontextprotocol.io) gratuito y sin clave para
la API bíblica pública. Lee las Escrituras en **35+ versiones bíblicas en 9
familias de idioma** desde cualquier cliente MCP — Claude, Cursor y cualquier otro que hable
MCP. Servido desde el edge de Cloudflare. Impulsa
[mcp.midvash.com](https://mcp.midvash.com).

- **Sin clave de API, sin auth, sin registro.** Solo apunta tu cliente a la URL.
- **Transporte HTTP Streamable** (JSON-RPC sin estado sobre `POST`).
- Construido sobre Cloudflare Workers + R2, respaldado por el mismo contenido de
  [api.midvash.com](https://api.midvash.com).
- Catálogo actual del MCP: versiones en portugués, inglés, español, hebreo,
  latín, francés, italiano, griego y portugués de Portugal.

## Conectando un cliente

Genera tu URL de conexión personal en
[mcp.midvash.com](https://mcp.midvash.com) y agrégala a tu cliente MCP. Las URLs
tienen este formato:

```
https://mcp.midvash.com/mcp/{id}?v=nvi,kjv&lang=pt-br,en
```

- `v` — slugs de versión separados por comas a exponer (opcional; omite para todas).
- `lang` — idiomas separados por comas a exponer (opcional; omite para todos).

Ejemplo (Claude Desktop / `mcp.json`):

```json
{
  "mcpServers": {
    "bible": {
      "url": "https://mcp.midvash.com/mcp/{id}?v=nvi,kjv&lang=pt-br,en"
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
| `search_bible` | Busca palabras o una frase exacta en el texto bíblico, ordenada por relevancia (BM25) sobre un índice FTS5. Ignora mayúsculas y acentos, con filtro opcional por libro o testamento. |
| `compare_passage` | Compara el mismo pasaje en múltiples versiones bíblicas. |
| `list_versions` | Lista las versiones/traducciones bíblicas disponibles. |
| `list_books` | Lista los 66 libros, opcionalmente filtrados por testamento. |
| `search_study` | Busca en la biblioteca de estudio — comentarios de capítulo, personajes bíblicos, entradas de diccionario y artículos de teología — en 9 idiomas. |
| `get_commentary` | Obtiene el comentario del capítulo al que apunta una referencia. Los 1.189 capítulos, en 9 idiomas. |

Las herramientas de estudio devuelven un resumen de hasta 500 caracteres y el
enlace al artículo completo en [midvash.com](https://midvash.com).

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
[`src/data/versions.ts`](./src/data/versions.ts): 35 versiones en los códigos de
idioma `pt-br`, `en`, `es`, `he`, `la`, `fr`, `it`, `gr` y `pt-pt`.

La URL pública puede limitar ese catálogo por conexión:

```
https://mcp.midvash.com/mcp/{id}?v=nvi,kjv&lang=pt-br,en
```

## De dónde vienen los datos

| Almacenamiento | Contenido |
|---|---|
| Bucket R2 `bible` | Texto de los capítulos, `{versión}/{libro}/{capítulo}.json`, con caché en el edge |
| D1 `midvash-mcp-search` | Índice FTS5: 278.682 versículos y 18.792 documentos de estudio |

La base D1 es exclusiva de este MCP. Es una copia, reconstruida por
[`scripts/seed-mcp-search.sh`](./scripts/seed-mcp-search.sh), y el Worker solo
lee de ella. Mantenerla separada hace que el panel de Cloudflare reporte el uso
de este servidor por separado, y que un binding de D1 — que da acceso a la base
completa — no alcance nada más que contenido bíblico público.

## Benchmark

El ecosistema de MCPs bíblicos muestra tres patrones útiles:

| Servidor | Fortalezas | Qué debería aprender Midvash |
|---|---|---|
| [`tuxr/bible-mcp`](https://glama.ai/mcp/servers/tuxr/bible-mcp) | Lookup remoto, búsqueda, navegación, múltiples traducciones y Apocrypha. | Agregar búsqueda bíblica nativa y mejores helpers de navegación. |
| [`molpass/mcp-bible`](https://glama.ai/mcp/servers/molpass/mcp-bible) | Lookup multi-versión, búsqueda keyword/semántica, referencias cruzadas, estudios de palabras y léxicos de lenguas originales. | Agregar búsqueda semántica/keyword, referencias cruzadas y capas opcionales de estudio. |
| [`djayatillake/studybible-mcp`](https://glama.ai/mcp/servers/djayatillake/studybible-mcp) | Léxicos, morfología, referencias cruzadas, notas contextuales y flujo de estudio profundo. | Mantener Midvash simple por defecto, pero exponer herramientas avanzadas cuando haya datos confiables. |
| [`ytssamuel/FHL-MCP-Server`](https://glama.ai/mcp/servers/ytssamuel/FHL-MCP-Server) | Recursos fuertes para estudio bíblico en chino, comentarios, análisis de lenguas originales, Apocrypha y estudios por tema. | Tratar comunidades lingüísticas como audiencias de primera clase, no solo como filtros de traducción. |

La ventaja de Midvash es la simplicidad: remoto, sin clave, sin cuenta, rápido en
Cloudflare y conectado a un ecosistema abierto de lector, API, apps, plugins y
datos. Las próximas mejoras deberían preservar esa experiencia sin fricción y
agregar las herramientas de descubrimiento y estudio que los usuarios esperan de
MCPs bíblicos.

## Roadmap

- Expandir el catálogo del MCP para acompañar la cobertura más amplia de los datos/API Midvash.
- Extender el índice de búsqueda a las versiones restantes y a los textos en
  hebreo, griego y latín, que aún recurren a un barrido limitado a un libro.
- Mejorar `compare_passage` con formato más rico para pasajes largos.
- Agregar herramientas de referencias cruzadas usando
  [`bible-cross-references`](https://github.com/midvash/bible-cross-references).
- Agregar herramientas de estudio para lenguas originales, léxicos y morfología
  cuando haya datos abiertos confiables.
- Agregar pruebas automatizadas para parser de referencias, filtros de catálogo y llamadas de herramientas.

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

Parte de [**Midvash**](https://midvash.com) — una plataforma gratuita de lectura y estudio bíblico. Todo es abierto y se interconecta:

| | |
|---|---|
| 📖 **Lector (web)** | [midvash.com](https://midvash.com) — 9 idiomas |
| 📱 **App iOS** | [midvash.app/ios](https://midvash.app/ios) |
| 🔌 **API** | [api.midvash.com](https://api.midvash.com) · [`bible-api`](https://github.com/midvash/bible-api) |
| 🤖 **Servidor MCP** | [mcp.midvash.com](https://mcp.midvash.com) · [`bible-mcp`](https://github.com/midvash/bible-mcp) |
| 🧩 **Plugin de WordPress** | [midvash.app/wordpress-plugin](https://midvash.app/wordpress-plugin) · [`bible-wordpress-plugin`](https://github.com/midvash/bible-wordpress-plugin) |
| 🧩 **Plugin de EmDash** | [midvash.app/emdash-plugin](https://midvash.app/emdash-plugin) · [`emdash-plugin-bible`](https://github.com/midvash/emdash-plugin-bible) |
| 🌐 **Extensión de Chrome** | [midvash.app/chrome-extension](https://midvash.app/chrome-extension) · [`bible-chrome-extension`](https://github.com/midvash/bible-chrome-extension) |
| 📦 **Datos abiertos** | [`bible-data`](https://github.com/midvash/bible-data) · [`bible-data-js`](https://github.com/midvash/bible-data-js) · [`bible-cross-references`](https://github.com/midvash/bible-cross-references) |

<sub>Gratuito y abierto, hecho por [Midvash](https://midvash.com) · [midvash.com](https://midvash.com) · [midvash.app](https://midvash.app)</sub>
