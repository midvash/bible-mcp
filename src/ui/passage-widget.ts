/**
 * Tela do trecho bíblico para clientes que desenham UI (ChatGPT, Claude e
 * qualquer host do padrão MCP Apps).
 *
 * O host lê este HTML via `resources/read` e o abre num iframe isolado ao lado
 * da resposta. A tela recebe o `structuredContent` da tool por `postMessage`
 * (`ui/notifications/tool-result`) e desenha os versículos com um botão que
 * abre o trecho no midvash.com.
 *
 * HTML e JS vão inline, sem build: o worker não tem bundler e a tela é pequena.
 * Mudou o HTML de forma incompatível? Suba a versão do URI — os hosts guardam
 * o template em cache pelo endereço.
 */

export const PASSAGE_WIDGET_URI = 'ui://midvash/passage-v1.html';

/** Tipo MIME do padrão MCP Apps. */
export const MCP_APP_MIME = 'text/html;profile=mcp-app';

/**
 * `_meta` que liga uma tool à tela. `ui.resourceUri` é o padrão MCP Apps;
 * `openai/outputTemplate` é o apelido que o ChatGPT também lê.
 */
export const PASSAGE_TOOL_META = {
  ui: { resourceUri: PASSAGE_WIDGET_URI },
  'openai/outputTemplate': PASSAGE_WIDGET_URI,
  'openai/toolInvocation/invoking': 'Opening the Bible…',
  'openai/toolInvocation/invoked': 'Passage ready.',
} as const;

/** Fontes da marca (Gloock + Literata + Figtree) vêm do Google Fonts. */
const FONT_DOMAINS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

export function passageWidgetResource() {
  return {
    uri: PASSAGE_WIDGET_URI,
    mimeType: MCP_APP_MIME,
    text: PASSAGE_WIDGET_HTML,
    _meta: {
      ui: {
        prefersBorder: true,
        csp: { connectDomains: [], resourceDomains: FONT_DOMAINS },
      },
      'openai/widgetDescription':
        'Shows the Bible passage with numbered verses and a button to read it on Midvash.',
      'openai/widgetPrefersBorder': true,
      'openai/widgetCSP': { connect_domains: [], resource_domains: FONT_DOMAINS },
    },
  };
}

export function passageWidgetListing() {
  return {
    uri: PASSAGE_WIDGET_URI,
    name: 'Bible passage view',
    description: 'Interactive view for get_passage, get_verse and get_chapter.',
    mimeType: MCP_APP_MIME,
  };
}

const PASSAGE_WIDGET_HTML = /* html */ `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@500;600&family=Gloock&family=Literata:opsz,wght@7..72,400;7..72,500&display=swap" rel="stylesheet">
<style>
  :root {
    --paper: oklch(0.995 0.003 82);
    --ink: oklch(0.22 0.020 65);
    --muted: oklch(0.52 0.015 65);
    --border: oklch(0.91 0.008 80);
    --honey: oklch(0.55 0.15 62);
    --button: oklch(0.48 0.078 161);
    --button-ink: oklch(0.995 0.003 82);
    color-scheme: light;
  }
  :root[data-theme="dark"] {
    --paper: oklch(0.18 0.010 74);
    --ink: oklch(0.92 0.018 85);
    --muted: oklch(0.70 0.015 80);
    --border: oklch(0.27 0.010 74);
    --honey: oklch(0.84 0.13 82);
    --button: oklch(0.72 0.069 160);
    --button-ink: oklch(0.18 0.010 74);
    color-scheme: dark;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: var(--paper); color: var(--ink); }
  body { font: 15px/1.5 Figtree, ui-sans-serif, system-ui, sans-serif; padding: 20px 20px 16px; }
  .top { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .brand { font: 600 12px/1 Figtree, ui-sans-serif, system-ui, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--honey); }
  .version { font-size: 12px; color: var(--muted); border: 1px solid var(--border); border-radius: 999px; padding: 2px 10px; white-space: nowrap; }
  h2 { font: 400 26px/1.15 Gloock, Georgia, serif; margin: 10px 0 12px; }
  h3 { font: 400 19px/1.2 Gloock, Georgia, serif; margin: 20px 0 8px; }
  .text { font: 400 17px/1.7 Literata, ui-serif, Georgia, serif; margin: 0; }
  .text sup { font: 600 11px/1 Figtree, ui-sans-serif, system-ui, sans-serif; color: var(--honey); margin-right: 3px; vertical-align: super; }
  .more { margin-top: 8px; background: none; border: 0; padding: 0; color: var(--honey); font: 600 14px/1.4 Figtree, ui-sans-serif, system-ui, sans-serif; cursor: pointer; }
  .actions { display: flex; align-items: center; gap: 12px; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border); }
  .open { background: var(--button); color: var(--button-ink); border: 0; border-radius: 999px; padding: 9px 18px; font: 600 14px/1.2 Figtree, ui-sans-serif, system-ui, sans-serif; cursor: pointer; }
  .open:focus-visible, .more:focus-visible { outline: 2px solid var(--honey); outline-offset: 2px; }
  .hint { font-size: 13px; color: var(--muted); }
  .empty { color: var(--muted); }
</style>
</head>
<body>
<div id="root"><p class="empty">…</p></div>
<script>
(function () {
  var COPY = {
    'en':    { open: 'Read on Midvash', more: 'Show all verses', hint: 'Bible & Devotional' },
    'pt-br': { open: 'Ler no Midvash', more: 'Mostrar todos os versículos', hint: 'Bíblia & Devocional' },
    'es':    { open: 'Leer en Midvash', more: 'Mostrar todos los versículos', hint: 'Biblia y Devocional' },
    'de':    { open: 'Auf Midvash lesen', more: 'Alle Verse anzeigen', hint: 'Bibel & Andacht' },
    'fr':    { open: 'Lire sur Midvash', more: 'Afficher tous les versets', hint: 'Bible & Méditation' },
    'it':    { open: 'Leggi su Midvash', more: 'Mostra tutti i versetti', hint: 'Bibbia e Devozionale' },
    'zh':    { open: '在 Midvash 阅读', more: '显示全部经文', hint: '圣经与灵修' },
    'ru':    { open: 'Читать в Midvash', more: 'Показать все стихи', hint: 'Библия и размышления' },
    'ko':    { open: 'Midvash에서 읽기', more: '모든 구절 보기', hint: '성경과 묵상' }
  };
  var PREVIEW = 8;
  var locale = 'en';
  var data = null;
  var expanded = false;
  var nextId = 1;
  var pending = {};

  function pickLocale(raw) {
    var l = String(raw || '').toLowerCase();
    if (l.indexOf('pt') === 0) return 'pt-br';
    var short = l.split('-')[0];
    return COPY[short] ? short : 'en';
  }

  function setTheme(theme) {
    if (theme === 'dark' || theme === 'light') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  function send(msg) { window.parent.postMessage(msg, '*'); }

  function request(method, params) {
    var id = nextId++;
    send({ jsonrpc: '2.0', id: id, method: method, params: params });
    return new Promise(function (resolve, reject) {
      pending[id] = { resolve: resolve, reject: reject };
      setTimeout(function () {
        if (pending[id]) { delete pending[id]; reject(new Error('timeout')); }
      }, 5000);
    });
  }

  function reportSize() {
    send({
      jsonrpc: '2.0',
      method: 'ui/notifications/size-changed',
      // O body, não o documento: scrollHeight do documento nunca fica menor
      // que o iframe, e a tela não encolheria depois de crescer.
      params: {
        width: Math.ceil(document.body.getBoundingClientRect().width),
        height: Math.ceil(document.body.getBoundingClientRect().height)
      }
    });
  }

  function openLink(url) {
    if (window.openai && typeof window.openai.openExternal === 'function') {
      window.openai.openExternal({ href: url });
      return;
    }
    request('ui/open-link', { url: url }).catch(function () { window.open(url, '_blank', 'noopener'); });
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  /** Agrupa os versículos por livro e capítulo, na ordem em que vieram. */
  function groups(verses) {
    var out = [];
    verses.forEach(function (v) {
      var last = out[out.length - 1];
      if (last && last.book === v.book && last.chapter === v.chapter) last.verses.push(v);
      else out.push({ book: v.book, chapter: v.chapter, verses: [v] });
    });
    return out;
  }

  function label(g) {
    var first = g.verses[0].verse;
    var last = g.verses[g.verses.length - 1].verse;
    return g.book + ' ' + g.chapter + ':' + (first === last ? first : first + '-' + last);
  }

  function render() {
    var root = document.getElementById('root');
    root.textContent = '';
    if (!data || !data.verses || !data.verses.length) {
      root.appendChild(el('p', 'empty', '…'));
      reportSize();
      return;
    }
    var copy = COPY[locale];
    var all = groups(data.verses);

    var top = el('div', 'top');
    top.appendChild(el('span', 'brand', 'Midvash'));
    top.appendChild(el('span', 'version', data.version_name || String(data.version || '').toUpperCase()));
    root.appendChild(top);

    var shown = 0;
    var truncated = false;
    all.forEach(function (g, i) {
      if (truncated) return;
      root.appendChild(el(i === 0 ? 'h2' : 'h3', null, label(g)));
      var p = el('p', 'text');
      g.verses.forEach(function (v) {
        if (!expanded && shown >= PREVIEW) { truncated = true; return; }
        p.appendChild(el('sup', null, String(v.verse)));
        p.appendChild(document.createTextNode(v.text + ' '));
        shown++;
      });
      root.appendChild(p);
    });

    if (truncated) {
      var more = el('button', 'more', copy.more);
      more.type = 'button';
      more.onclick = function () { expanded = true; render(); };
      root.appendChild(more);
    }

    if (data.reader_url) {
      var actions = el('div', 'actions');
      var open = el('button', 'open', copy.open);
      open.type = 'button';
      open.onclick = function () { openLink(data.reader_url); };
      actions.appendChild(open);
      actions.appendChild(el('span', 'hint', copy.hint));
      root.appendChild(actions);
    }
    reportSize();
  }

  function setData(structured) {
    if (!structured || !structured.verses) return;
    data = structured;
    expanded = false;
    render();
  }

  function applyHostContext(ctx) {
    if (!ctx) return;
    if (ctx.theme) setTheme(ctx.theme);
    if (ctx.locale) { locale = pickLocale(ctx.locale); render(); }
  }

  window.addEventListener('message', function (event) {
    if (event.source !== window.parent) return;
    var msg = event.data;
    if (!msg || msg.jsonrpc !== '2.0') return;

    if (msg.id != null && pending[msg.id] && (msg.result !== undefined || msg.error !== undefined)) {
      var p = pending[msg.id];
      delete pending[msg.id];
      if (msg.error) p.reject(msg.error); else p.resolve(msg.result);
      return;
    }
    if (msg.method === 'ui/notifications/tool-result') {
      setData(msg.params && msg.params.structuredContent);
    } else if (msg.method === 'ui/notifications/host-context-changed') {
      applyHostContext(msg.params);
    }
  });

  // Extensão do ChatGPT: os dados já podem estar em window.openai.
  window.addEventListener('openai:set_globals', function () {
    if (!window.openai) return;
    if (window.openai.theme) setTheme(window.openai.theme);
    if (window.openai.toolOutput) setData(window.openai.toolOutput);
  });

  locale = pickLocale((window.openai && window.openai.locale) || navigator.language);
  if (window.openai) {
    if (window.openai.theme) setTheme(window.openai.theme);
    if (window.openai.toolOutput) setData(window.openai.toolOutput);
  }

  request('ui/initialize', {
    protocolVersion: '2026-01-26',
    appInfo: { name: 'midvash-passage', version: '1.0.0' },
    appCapabilities: { availableDisplayModes: ['inline'] }
  }).then(function (result) {
    applyHostContext(result && result.hostContext);
    send({ jsonrpc: '2.0', method: 'ui/notifications/initialized' });
  }).catch(function () {});

  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(reportSize).observe(document.body);
  }
  render();
})();
</script>
</body>
</html>`;
