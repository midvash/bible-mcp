import { VERSIONS } from '../data/versions';
import {
  TRANSLATIONS,
  SUPPORTED_LOCALES,
  pathForLocale,
  type Locale,
} from './i18n';
import { FOOTER_CSS, renderFooter } from './footer';

const FOOTER_BRAND_NAME = 'Bible MCP';

/**
 * Escapa caracteres HTML perigosos. Necessário porque interpolamos
 * conteúdo dinâmico (traduções) dentro do template HTML.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SITE_URL = 'https://mcp.midvash.com';

const ALTERNATE_NAMES: Partial<Record<Locale, string>> = {
  en: 'Midvash Bible MCP',
  'pt-br': 'MCP da Bíblia Midvash',
  es: 'MCP de la Biblia Midvash',
  fr: 'MCP de la Bible Midvash',
  de: 'Midvash Bibel-MCP',
  it: 'MCP della Bibbia Midvash',
  zh: 'Midvash 圣经 MCP',
  ru: 'MCP Библии Midvash',
  ko: 'Midvash 성경 MCP',
};

const LOCALE_NATIVE_NAMES: Record<Locale, string> = {
  en: 'English',
  'pt-br': 'Português',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  zh: '中文',
  ru: 'Русский',
  ko: '한국어',
};

// Mapeia locale → slug do SVG em midvash.com/flags/. Mesmas bandeiras
// redondas usadas no Header do app principal (apps/web/components/Header.tsx).
const LOCALE_FLAGS: Record<Locale, string> = {
  en: 'us',
  'pt-br': 'br',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  zh: 'cn',
  ru: 'ru',
  ko: 'kr',
};

const FLAG_BASE_URL = 'https://midvash.com/flags';

const OG_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  'pt-br': 'pt_BR',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  it: 'it_IT',
  zh: 'zh_CN',
  ru: 'ru_RU',
  ko: 'ko_KR',
};

const SELECT_LANGUAGE_LABEL: Record<Locale, string> = {
  en: 'Select language',
  'pt-br': 'Selecionar idioma',
  es: 'Seleccionar idioma',
  fr: 'Choisir la langue',
  de: 'Sprache wählen',
  it: 'Seleziona la lingua',
  zh: '选择语言',
  ru: 'Выбрать язык',
  ko: '언어 선택',
};

const GLOBE_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false"><path d="M128,24A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm88,104a87.61,87.61,0,0,1-3.33,24H174.16a157.44,157.44,0,0,0,0-48h38.51A87.61,87.61,0,0,1,216,128ZM102,168H154a112.1,112.1,0,0,1-26,45A112,112,0,0,1,102,168Zm-3.9-16a140.84,140.84,0,0,1,0-48h59.88a140.84,140.84,0,0,1,0,48ZM40,128a87.61,87.61,0,0,1,3.33-24H81.84a157.44,157.44,0,0,0,0,48H43.33A87.61,87.61,0,0,1,40,128ZM154,88H102a112.1,112.1,0,0,1,26-45A112,112,0,0,1,154,88Zm52.33,0H170.71a135.28,135.28,0,0,0-22.3-45.6A88.29,88.29,0,0,1,206.37,88ZM107.59,42.4A135.28,135.28,0,0,0,85.29,88H49.63A88.29,88.29,0,0,1,107.59,42.4ZM49.63,168H85.29a135.28,135.28,0,0,0,22.3,45.6A88.29,88.29,0,0,1,49.63,168Zm98.78,45.6a135.28,135.28,0,0,0,22.3-45.6h35.66A88.29,88.29,0,0,1,148.41,213.6Z"/></svg>';

const CARET_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>';

function langSwitcherMarkup(currentLocale: Locale, ariaLabel: string): string {
  const items = SUPPORTED_LOCALES.map((l) => {
    const isActive = l === currentLocale;
    return `<li role="none"><a href="${pathForLocale(l)}" class="lang-item${isActive ? ' is-active' : ''}" hreflang="${l}" role="menuitem"${isActive ? ' aria-current="page"' : ''}><img class="lang-flag" src="${FLAG_BASE_URL}/${LOCALE_FLAGS[l]}.svg" alt="" width="20" height="20" loading="lazy"><span class="lang-name">${escapeHtml(LOCALE_NATIVE_NAMES[l])}</span></a></li>`;
  }).join('');

  return `<div class="lang-switcher" data-lang-switcher>
    <button type="button" class="lang-trigger" aria-haspopup="menu" aria-expanded="false" aria-controls="lang-menu" aria-label="${escapeHtml(ariaLabel)}">
      <span class="lang-trigger-icon">${GLOBE_ICON}</span>
      <span class="lang-trigger-label">${escapeHtml(LOCALE_NATIVE_NAMES[currentLocale])}</span>
      <span class="lang-trigger-caret">${CARET_ICON}</span>
    </button>
    <ul id="lang-menu" class="lang-menu" role="menu" hidden>
      ${items}
    </ul>
  </div>`;
}

const LANG_SWITCHER_SCRIPT = `(function(){
  document.querySelectorAll('[data-lang-switcher]').forEach(function(root){
    var btn = root.querySelector('.lang-trigger');
    var menu = root.querySelector('.lang-menu');
    if(!btn||!menu) return;
    function close(){ btn.setAttribute('aria-expanded','false'); menu.hidden = true; }
    function open(){ btn.setAttribute('aria-expanded','true'); menu.hidden = false; }
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      if(menu.hidden) open(); else close();
    });
    document.addEventListener('click', function(e){
      if(!root.contains(e.target)) close();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') close();
    });
  });
})();`;

/**
 * Renderiza a landing page do mcp.midvash.com no idioma solicitado.
 *
 * Identidade visual segue o Midvash:
 *  - Paleta honey: primary #B17027 (deep), accent #E8B45A (base), bg honey-tinted off-white
 *  - Tipografia: Figtree (sans) + Literata (serif corpo) + Gloock (display)
 *  - Light + dark mode automático via prefers-color-scheme
 */
export function renderLandingPage(locale: Locale): string {
  const t = TRANSLATIONS[locale];

  // Lista de versões serializada para o JS inline (filtros e seleção)
  const versionsJson = JSON.stringify(
    VERSIONS.map((v) => ({
      slug: v.slug,
      shortName: v.shortName,
      name: v.name,
      language: v.language,
    })),
  );

  // Default de idiomas selecionados — apenas o idioma da página atual.
  // EN → ['en'], ES → ['es'], PT-BR → ['pt-br'].
  const defaultLangs = [locale];

  // Strings de UI passadas para o JS do navegador
  const uiStrings = JSON.stringify({
    needSelection: t.configure.needSelection,
    copyBtn: t.configure.copyBtn,
    copiedBtn: t.configure.copiedBtn,
    copyError: t.configure.copyError,
    defaultLangs,
  });

  const alternates = SUPPORTED_LOCALES.map(
    (l) =>
      `<link rel="alternate" hreflang="${l}" href="${SITE_URL}${pathForLocale(l)}">`,
  ).join('\n');

  const langSwitcherHtml = langSwitcherMarkup(locale, SELECT_LANGUAGE_LABEL[locale]);

  const howCards = t.how.cards
    .map(
      (card) => `
      <article class="step-card">
        <span class="step-num">${escapeHtml(card.num)}</span>
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.body)}</p>
      </article>`,
    )
    .join('');

  const clientCards = [
    {
      key: 'chatgpt',
      ...t.clients.chatgpt,
      logo: chatgptLogo(),
    },
    {
      key: 'claude',
      ...t.clients.claude,
      logo: claudeLogo(),
    },
    {
      key: 'gemini',
      ...t.clients.gemini,
      logo: geminiLogo(),
    },
  ]
    .map(
      (c) => `
      <article class="client-card client-card--${c.key}">
        <div class="client-logo">${c.logo}</div>
        <h3>${escapeHtml(c.name)}</h3>
        <p class="client-tier">${escapeHtml(c.tier)}</p>
        <ol class="client-steps">
          ${c.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
        </ol>
      </article>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="${t.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(t.meta.title)}</title>
<meta name="description" content="${escapeHtml(t.meta.description)}">
<meta property="og:title" content="${escapeHtml(t.meta.title)}">
<meta property="og:description" content="${escapeHtml(t.meta.description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_URL}${pathForLocale(locale)}">
<meta property="og:site_name" content="Midvash">
<meta property="og:locale" content="${OG_LOCALES[locale]}">
<meta property="og:image" content="https://midvash.com/brand/og-mcp.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="600">
<meta property="og:image:alt" content="${escapeHtml(t.meta.title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(t.meta.title)}">
<meta name="twitter:description" content="${escapeHtml(t.meta.description)}">
<meta name="twitter:image" content="https://midvash.com/brand/og-mcp.jpg">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">
<meta name="theme-color" content="#B17027">
<link rel="icon" href="https://midvash.com/brand/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="https://midvash.com/brand/icon.svg">
<link rel="apple-touch-icon" href="https://midvash.com/brand/apple-touch-icon.png">
<link rel="canonical" href="${SITE_URL}${pathForLocale(locale)}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${SITE_URL}/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Gloock&family=JetBrains+Mono:wght@400;500;600&family=Literata:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<style>
:root {
  --primary: #B17027;
  --primary-hover: #985F1F;
  --primary-soft: #FBF5E8;
  --text: #30281D;
  --text-soft: #5C5343;
  --text-muted: #827B6E;
  --bg: #FBF5E8;
  --bg-soft: #F5EFE2;
  --bg-card: #FFFDF7;
  --border: #E6DFD0;
  --border-strong: #CFC4AC;
  --accent: #E8B45A;
  --success: #5C7A3F;
  --shadow-sm: 0 1px 2px rgba(48, 40, 29, 0.04);
  --shadow-md: 0 4px 16px rgba(177, 112, 39, 0.10);
  --shadow-lg: 0 12px 32px rgba(177, 112, 39, 0.16);
  --radius: 12px;
  --radius-lg: 16px;
  --font-sans: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-serif: 'Literata', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  --font-display: 'Gloock', 'Literata', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, ui-monospace, monospace;
}
@media (prefers-color-scheme: dark) {
  :root {
    --primary: #ECC779;
    --primary-hover: #F0CE8A;
    --primary-soft: #302A21;
    --text: #EDE4D3;
    --text-soft: #C7BCA5;
    --text-muted: #B4A994;
    --bg: #27221B;
    --bg-soft: #302A21;
    --bg-card: #302A21;
    --border: #4A4235;
    --border-strong: #5C5343;
    --accent: #E8B45A;
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.30);
    --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.35);
    --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.45);
  }
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.container { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--primary);
  color: #fff;
  padding: 12px 18px;
  z-index: 100;
}
.skip-link:focus { left: 16px; top: 16px; }

/* HEADER */
.site-header {
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 50;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text);
}
.brand-mark {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.brand-mark svg { width: 100%; height: 100%; display: block; }
.brand-name {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text);
  line-height: 1;
}
.lang-switcher { position: relative; }
.lang-trigger {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 10px 6px 12px; height: 36px;
  background: var(--bg-soft); border: 1px solid var(--border);
  border-radius: 999px; color: var(--text);
  font: inherit; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.15s ease;
}
.lang-trigger:hover { border-color: var(--primary); }
.lang-trigger[aria-expanded="true"] { border-color: var(--primary); }
.lang-trigger-icon { display: inline-flex; }
.lang-trigger-icon svg { width: 18px; height: 18px; color: var(--primary); }
.lang-trigger-caret { display: inline-flex; transition: transform 0.15s ease; }
.lang-trigger-caret svg { width: 14px; height: 14px; color: var(--text-muted); }
.lang-trigger[aria-expanded="true"] .lang-trigger-caret { transform: rotate(180deg); }
.lang-trigger-label { line-height: 1; }
@media (max-width: 480px) {
  .lang-trigger-label { display: none; }
  .lang-trigger { padding: 6px; }
}
.lang-menu {
  position: absolute; top: calc(100% + 6px); right: 0;
  min-width: 200px; max-height: 70vh; overflow-y: auto;
  margin: 0; padding: 6px;
  background: var(--bg, #fff); color: var(--text);
  border: 1px solid var(--border); border-radius: 12px;
  list-style: none;
  box-shadow: 0 12px 32px rgba(0,0,0,0.18);
  z-index: 60;
}
.lang-menu li { margin: 0; }
.lang-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 8px;
  text-decoration: none; color: var(--text-muted);
  font-size: 14px; font-weight: 500;
}
.lang-item:hover { background: var(--bg-soft); color: var(--text); }
.lang-item.is-active { background: var(--bg-soft); color: var(--text); font-weight: 700; }
.lang-flag {
  width: 20px; height: 20px; border-radius: 50%;
  object-fit: cover; flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
}
.lang-name { line-height: 1.2; }

/* HERO */
.hero {
  padding: 96px 0 72px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(177, 112, 39, 0.10), transparent 60%),
    linear-gradient(180deg, var(--bg-soft) 0%, transparent 100%);
  pointer-events: none;
}
.hero-inner { position: relative; z-index: 1; }
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--primary-soft);
  color: var(--primary);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 24px;
}
.eyebrow::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--primary);
}
.hero h1 {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.08;
  color: var(--text);
  margin-bottom: 24px;
}
.hero h1 .accent {
  color: var(--primary);
  font-style: italic;
}
.hero p.hero-sub {
  font-size: clamp(1.05rem, 1.6vw, 1.2rem);
  color: var(--text-soft);
  max-width: 640px;
  margin: 0 auto 36px;
  line-height: 1.6;
}
.hero .cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--primary);
  color: #fff;
  padding: 16px 32px;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: var(--shadow-md);
  transition: all 0.18s ease;
}
.hero .cta:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}
.hero .cta::after { content: '→'; font-size: 1.1em; }

/* SECTIONS */
section.block {
  padding: 88px 0;
}
section.alt { background: var(--bg-soft); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.section-head { text-align: center; margin-bottom: 56px; }
.section-head h2 {
  font-family: var(--font-display);
  font-size: clamp(1.875rem, 3.5vw, 2.5rem);
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--text);
  margin-bottom: 12px;
}
.section-head p {
  font-size: 1.05rem;
  color: var(--text-soft);
  max-width: 580px;
  margin: 0 auto;
}

/* HOW IT WORKS */
.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
.step-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 36px 32px;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}
.step-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--primary-soft);
  color: var(--primary);
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 20px;
}
.step-card h3 {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 10px;
}
.step-card p {
  font-size: 0.975rem;
  color: var(--text-soft);
  line-height: 1.6;
}

/* CONFIGURATOR */
.config-block {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 48px;
  box-shadow: var(--shadow-md);
  max-width: 880px;
  margin: 0 auto;
}
.config-step { margin-bottom: 36px; }
.config-step:last-of-type { margin-bottom: 0; }
.config-label {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 14px;
}
.lang-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.lang-chip {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text-soft);
  padding: 10px 18px;
  border-radius: 999px;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
}
.lang-chip:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.lang-chip.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  font-weight: 600;
}
.versions-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.8125rem;
}
.toolbar-btn {
  background: transparent;
  border: none;
  color: var(--primary);
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: inherit;
}
.toolbar-btn:hover { background: var(--primary-soft); }
.versions-helper {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 14px;
}
.versions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px;
  max-height: 320px;
  overflow-y: auto;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-soft);
}
.versions-grid::-webkit-scrollbar { width: 8px; }
.versions-grid::-webkit-scrollbar-track { background: transparent; }
.versions-grid::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 999px; }
.version-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.15s ease;
}
.version-item:hover { border-color: var(--primary); }
.version-item input { accent-color: var(--primary); cursor: pointer; }
.version-item .v-name { color: var(--text-muted); font-size: 0.7375rem; line-height: 1.3; }
.version-item strong { color: var(--text); font-weight: 600; }
.generate-btn {
  width: 100%;
  background: var(--primary);
  color: #fff;
  border: none;
  padding: 18px;
  border-radius: var(--radius);
  font-family: inherit;
  font-weight: 600;
  font-size: 1.0625rem;
  cursor: pointer;
  margin-top: 36px;
  box-shadow: var(--shadow-md);
  transition: all 0.18s ease;
}
.generate-btn:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}
.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: var(--shadow-sm);
}

/* RESULT */
.result {
  display: none;
  margin-top: 40px;
  padding-top: 36px;
  border-top: 1px solid var(--border);
}
.result.visible { display: block; }
.result-block { margin-bottom: 24px; }
.result-block:last-child { margin-bottom: 0; }
.result-block label {
  display: block;
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 10px;
}
.code-box {
  position: relative;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 24px;
  font-family: 'SF Mono', Menlo, Consolas, ui-monospace, monospace;
  font-size: 0.8125rem;
  color: var(--text);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
}
.copy-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-soft);
  padding: 6px 14px;
  border-radius: 6px;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.copy-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
  background: var(--primary-soft);
}
.copy-btn.copied {
  color: var(--success);
  border-color: var(--success);
  background: rgba(22, 163, 74, 0.08);
}

/* CLIENT CARDS */
.clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
.client-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 36px 32px;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}
.client-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.client-logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  color: var(--text);
}
.client-logo svg { width: 32px; height: 32px; }
.client-card h3 {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}
.client-tier {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 20px;
  font-weight: 500;
}
.client-steps {
  list-style: none;
  counter-reset: step;
}
.client-steps li {
  counter-increment: step;
  position: relative;
  padding: 10px 0 10px 36px;
  font-size: 0.925rem;
  color: var(--text-soft);
  line-height: 1.5;
  border-bottom: 1px solid var(--border);
}
.client-steps li:last-child { border-bottom: none; }
.client-steps li::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: 10px;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 700;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

${FOOTER_CSS}

@media (max-width: 640px) {
  .hero { padding: 64px 0 48px; }
  section.block { padding: 64px 0; }
  .config-block { padding: 28px 20px; }
  .header-inner { height: 64px; }
  .brand-name { font-size: 17px; }
}
</style>
<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Midvash Bible MCP',
  alternateName: ALTERNATE_NAMES[locale] ?? 'Midvash Bible MCP',
  description: t.meta.description,
  url: `${SITE_URL}${pathForLocale(locale)}`,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Cross-platform',
  inLanguage: SUPPORTED_LOCALES as readonly string[],
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  provider: {
    '@type': 'Organization',
    name: 'Midvash',
    url: 'https://midvash.com',
    logo: 'https://midvash.com/brand/icon.svg',
  },
})}
</script>
<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Midvash', item: 'https://midvash.com' + (locale === 'en' ? '' : '/' + locale) },
    {
      '@type': 'ListItem',
      position: 2,
      name: locale === 'pt-br' ? 'MCP da Bíblia' : locale === 'es' ? 'MCP de la Biblia' : 'Bible MCP',
      item: `${SITE_URL}${pathForLocale(locale)}`,
    },
  ],
})}
</script>
</head>
<body>
<a href="#configure" class="skip-link">${escapeHtml(t.nav.skipToContent)}</a>

<header class="site-header">
  <div class="container header-inner">
    <a href="${pathForLocale(locale)}" class="brand" aria-label="Bible MCP">
      <span class="brand-mark">${midvashLogo()}</span>
      <span class="brand-name">Bible MCP</span>
    </a>
    ${langSwitcherHtml}
  </div>
</header>

<main>

<section class="hero">
  <div class="container hero-inner">
    <span class="eyebrow">${escapeHtml(t.hero.eyebrow)}</span>
    <h1>${escapeHtml(t.hero.title)} <span class="accent">${escapeHtml(t.hero.titleAccent)}</span></h1>
    <p class="hero-sub">${escapeHtml(t.hero.subtitle)}</p>
    <a href="#configure" class="cta">${escapeHtml(t.hero.cta)}</a>
  </div>
</section>

<section class="block alt">
  <div class="container">
    <div class="section-head">
      <h2>${escapeHtml(t.how.title)}</h2>
    </div>
    <div class="steps">
      ${howCards}
    </div>
  </div>
</section>

<section id="configure" class="block">
  <div class="container">
    <div class="section-head">
      <h2>${escapeHtml(t.configure.title)}</h2>
      <p>${escapeHtml(t.configure.subtitle)}</p>
    </div>
    <div class="config-block">
      <div class="config-step">
        <div class="config-label">${escapeHtml(t.configure.languagesLabel)}</div>
        <div class="lang-filters" id="lang-filters"></div>
      </div>

      <div class="config-step">
        <div class="config-label">${escapeHtml(t.configure.versionsLabel)}</div>
        <div class="versions-toolbar">
          <button type="button" class="toolbar-btn" id="select-all-btn">${escapeHtml(t.configure.selectAll)}</button>
          <button type="button" class="toolbar-btn" id="clear-all-btn">${escapeHtml(t.configure.clearAll)}</button>
        </div>
        <div class="versions-helper">${escapeHtml(t.configure.versionsHelper)}</div>
        <div class="versions-grid" id="versions-grid"></div>
      </div>

      <button class="generate-btn" id="generate-btn">${escapeHtml(t.configure.generateBtn)}</button>

      <div class="result" id="result">
        <div class="result-block">
          <label>${escapeHtml(t.configure.urlLabel)}</label>
          <div class="code-box">
            <button class="copy-btn" data-target="url-output">${escapeHtml(t.configure.copyBtn)}</button>
            <span id="url-output"></span>
          </div>
        </div>
        <div class="result-block">
          <label>${escapeHtml(t.configure.jsonLabel)}</label>
          <div class="code-box">
            <button class="copy-btn" data-target="json-output">${escapeHtml(t.configure.copyBtn)}</button>
            <span id="json-output"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="block alt">
  <div class="container">
    <div class="section-head">
      <h2>${escapeHtml(t.clients.title)}</h2>
      <p>${escapeHtml(t.clients.subtitle)}</p>
    </div>
    <div class="clients-grid">
      ${clientCards}
    </div>
  </div>
</section>

</main>

${renderFooter(t, locale, { brandName: FOOTER_BRAND_NAME, currentProduct: 'mcp' })}

<script>
const VERSIONS = ${versionsJson};
const UI = ${uiStrings};
const LANG_LABELS = {
  'pt-br': 'Português', 'en': 'English', 'es': 'Español',
  'he': 'עברית', 'gr': 'Ελληνικά', 'la': 'Latina',
  'fr': 'Français', 'it': 'Italiano', 'pt-pt': 'Português (PT)'
};

const selectedLangs = new Set(UI.defaultLangs);
const selectedVersions = new Set();

function nanoid() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const arr = new Uint8Array(10);
  crypto.getRandomValues(arr);
  let id = '';
  for (let i = 0; i < 10; i++) id += alphabet[arr[i] % alphabet.length];
  return id;
}

function renderLangFilters() {
  const allLangs = [...new Set(VERSIONS.map(v => v.language))].sort();
  const root = document.getElementById('lang-filters');
  root.innerHTML = '';
  for (const lang of allLangs) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'lang-chip' + (selectedLangs.has(lang) ? ' active' : '');
    chip.textContent = LANG_LABELS[lang] || lang;
    chip.addEventListener('click', () => {
      if (selectedLangs.has(lang)) selectedLangs.delete(lang);
      else selectedLangs.add(lang);
      renderLangFilters();
      renderVersions();
    });
    root.appendChild(chip);
  }
}

function renderVersions() {
  const root = document.getElementById('versions-grid');
  root.innerHTML = '';
  const filtered = VERSIONS.filter(v => selectedLangs.size === 0 || selectedLangs.has(v.language));

  for (const v of filtered) {
    const item = document.createElement('label');
    item.className = 'version-item';
    item.innerHTML =
      '<input type="checkbox" data-slug="' + v.slug + '"' +
      (selectedVersions.has(v.slug) ? ' checked' : '') + '>' +
      '<div><strong>' + v.shortName + '</strong><div class="v-name">' + v.name + '</div></div>';
    item.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) selectedVersions.add(v.slug);
      else selectedVersions.delete(v.slug);
    });
    root.appendChild(item);
  }
}

function selectAllVisible() {
  const filtered = VERSIONS.filter(v => selectedLangs.size === 0 || selectedLangs.has(v.language));
  for (const v of filtered) selectedVersions.add(v.slug);
  renderVersions();
}
function clearAll() {
  selectedVersions.clear();
  renderVersions();
}

function generate() {
  if (selectedVersions.size === 0) {
    alert(UI.needSelection);
    return;
  }
  const id = nanoid();
  const v = [...selectedVersions].join(',');
  const lang = [...selectedLangs].join(',');
  const url = 'https://mcp.midvash.com/mcp/' + id + '?v=' + v + (lang ? '&lang=' + lang : '');

  const json = {
    mcpServers: {
      midvash: {
        type: 'streamable-http',
        url: url
      }
    }
  };

  document.getElementById('url-output').textContent = url;
  document.getElementById('json-output').textContent = JSON.stringify(json, null, 2);
  document.getElementById('result').classList.add('visible');
  document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('generate-btn').addEventListener('click', generate);
document.getElementById('select-all-btn').addEventListener('click', selectAllVisible);
document.getElementById('clear-all-btn').addEventListener('click', clearAll);

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const target = document.getElementById(btn.dataset.target);
    try {
      await navigator.clipboard.writeText(target.textContent);
      const original = btn.textContent;
      btn.textContent = UI.copiedBtn;
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1500);
    } catch (err) {
      alert(UI.copyError);
    }
  });
});

renderLangFilters();
renderVersions();
</script>
<script>${LANG_SWITCHER_SCRIPT}</script>
</body>
</html>`;
}

// ─── Logo oficial do Midvash (inline) ────────────────────────────────────
// Mesmo SVG de apps/web/public/icons/icon-midvash.svg — três hexágonos honey
// embarcados no Worker para evitar request externo.
function midvashLogo(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true">
    <path d="M100,16 L138.105,38 L138.105,82 L100,104 L61.895,82 L61.895,38 Z" fill="#F0CE8A"/>
    <path d="M61.895,59.56 L100,81.56 L100,125.56 L61.895,147.56 L23.79,125.56 L23.79,81.56 Z" fill="#E8B45A"/>
    <path d="M138.105,59.56 L176.21,81.56 L176.21,125.56 L138.105,147.56 L100,125.56 L100,81.56 Z" fill="#B17027"/>
  </svg>`;
}

// ─── Inline SVG marks for the AI clients ─────────────────────────────────
// Marcas geométricas simples (não são logos reais das marcas). Pintam em
// `currentColor` (var(--text) via .client-logo) para manter neutralidade
// e funcionar em light/dark mode.

function chatgptLogo(): string {
  return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M28.7 13.1a7.6 7.6 0 0 0-.7-6.3 7.8 7.8 0 0 0-8.4-3.7 7.8 7.8 0 0 0-13.2 2.8 7.8 7.8 0 0 0-5.2 3.8 7.8 7.8 0 0 0 1 9.2 7.6 7.6 0 0 0 .6 6.3 7.8 7.8 0 0 0 8.4 3.7 7.7 7.7 0 0 0 5.8 2.6 7.8 7.8 0 0 0 7.4-5.4 7.8 7.8 0 0 0 5.2-3.8 7.8 7.8 0 0 0-1-9.2zM17.2 27.9a5.8 5.8 0 0 1-3.7-1.3l.2-.1 6.1-3.5a1 1 0 0 0 .5-.9V13.6l2.6 1.5v7.1a5.8 5.8 0 0 1-5.7 5.7zM4.9 22.7a5.8 5.8 0 0 1-.7-3.9l.2.1 6.1 3.5a1 1 0 0 0 1 0l7.4-4.3v3l-7.5 4.3a5.8 5.8 0 0 1-6.5-2.7zM3.3 9.7a5.8 5.8 0 0 1 3-2.5v7.2a1 1 0 0 0 .5.9l7.4 4.3-2.6 1.5L5.5 17.6a5.8 5.8 0 0 1-2.2-7.9zm21 4.9-7.5-4.3 2.6-1.5 6.1 3.5a5.8 5.8 0 0 1-.9 10.5v-7.3a1 1 0 0 0-.3-.9zm2.6-3.9-.2-.1-6.1-3.6a1 1 0 0 0-1 0l-7.4 4.3v-3l7.4-4.3a5.8 5.8 0 0 1 8.7 6.7zM11.7 16.1l-2.6-1.5V7.5a5.8 5.8 0 0 1 9.5-4.5l-.2.1L12.3 6.7a1 1 0 0 0-.5.9zm1.4-3 3.3-1.9 3.3 1.9V17l-3.3 1.9-3.3-1.9z" fill="currentColor"/>
  </svg>`;
}

function claudeLogo(): string {
  return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9 20.5l4-10.5h2.2l4 10.5h-2.4l-.9-2.5h-3.6l-.9 2.5H9zm4-4.4h2.4l-1.2-3.4-1.2 3.4z" fill="currentColor"/>
    <path d="M21 9.8h2.2v10.7H21zM4 9.8h2.2v10.7H4z" fill="currentColor"/>
    <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="1.5" fill="none"/>
  </svg>`;
}

function geminiLogo(): string {
  return `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16 2 L18.5 13.5 L30 16 L18.5 18.5 L16 30 L13.5 18.5 L2 16 L13.5 13.5 Z" fill="currentColor"/>
  </svg>`;
}
