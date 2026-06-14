# Bible MCP

> 🌐 [English](./README.md) · [Português (BR)](./README.pt-BR.md) · **Español**

Servidor [Model Context Protocol](https://modelcontextprotocol.io) gratuito y sin clave para
la API bíblica pública. Lee las Escrituras en **86 traducciones bíblicas en 32
idiomas** desde cualquier cliente MCP — Claude, Cursor y cualquier otro que hable
MCP. Servido desde el edge de Cloudflare. Impulsa
[mcp.midvash.com](https://mcp.midvash.com).

- **Sin clave de API, sin auth, sin registro.** Solo apunta tu cliente a la URL.
- **Transporte HTTP Streamable** (JSON-RPC sin estado sobre `POST`).
- Construido sobre Cloudflare Workers + R2, respaldado por el mismo contenido de
  [api.midvash.com](https://api.midvash.com).

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
| `list_versions` | Lista las versiones/traducciones bíblicas disponibles. |
| `list_books` | Lista los 66 libros, opcionalmente filtrados por testamento. |

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
