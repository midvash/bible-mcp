import { VERSIONS } from '../data/versions';
import {
  TRANSLATIONS,
  SUPPORTED_LOCALES,
  LANDING_TOOLS,
  DEFAULT_VERSION_BY_LOCALE,
  pathForLocale,
  type Locale,
} from './i18n';
import { renderSiteFooter, SITE_FOOTER_CSS } from './site-footer';


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

function langSwitcherMarkup(currentLocale: Locale, ariaLabel: string): string {
  const items = SUPPORTED_LOCALES.map((l) => {
    const isActive = l === currentLocale;
    return `<li role="none"><a href="${pathForLocale(l)}" class="lang-item${isActive ? ' is-active' : ''}" hreflang="${l}" role="menuitem"${isActive ? ' aria-current="page"' : ''}><img class="lang-flag" src="${FLAG_BASE_URL}/${LOCALE_FLAGS[l]}.svg" alt="" width="20" height="20" loading="lazy"><span class="lang-name">${escapeHtml(LOCALE_NATIVE_NAMES[l])}</span></a></li>`;
  }).join('');

  return `<div class="lang-switcher" data-lang-switcher>
    <button type="button" class="lang-trigger" aria-haspopup="menu" aria-expanded="false" aria-controls="lang-menu" aria-label="${escapeHtml(ariaLabel)}">
      <span class="lang-trigger-icon">${GLOBE_ICON}</span>
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

/** Código BCP 47 de cada idioma do catálogo, pra Intl.DisplayNames. */
const LANGUAGE_TAGS: Record<string, string> = {
  gr: 'el',
  'pt-br': 'pt-BR',
  'pt-pt': 'pt-PT',
  nb: 'no',
};

/** Idiomas que o Intl.DisplayNames não conhece: o nome vem daqui. */
const LANGUAGE_FALLBACKS: Record<string, string> = {
  hne: 'Chhattisgarhi',
  luo: 'Dholuo',
};

/**
 * Nome de cada idioma do catálogo escrito no idioma da página
 * ("Hebraico" em /pt-br, "Hebrew" em /). Cai no código se o runtime não
 * tiver o dado.
 */
export function languageLabels(locale: Locale): Record<string, string> {
  const pageTag = locale === 'pt-br' ? 'pt-BR' : locale === 'zh' ? 'zh-Hans' : locale;
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames([pageTag], { type: 'language' });
  } catch {
    names = null;
  }
  const labels: Record<string, string> = {};
  for (const code of new Set<string>(VERSIONS.map((v) => v.language))) {
    let label = code;
    try {
      label = names?.of(LANGUAGE_TAGS[code] ?? code) ?? code;
    } catch {
      label = code;
    }
    if (label === code && LANGUAGE_FALLBACKS[code]) label = LANGUAGE_FALLBACKS[code];
    labels[code] = label.charAt(0).toLocaleUpperCase(pageTag) + label.slice(1);
  }
  return labels;
}

/** Idiomas do catálogo: o da página primeiro, depois em ordem alfabética. */
function orderedLanguages(locale: Locale, labels: Record<string, string>): string[] {
  const codes = Object.keys(labels);
  return codes.sort((a, b) => {
    if (a === locale) return -1;
    if (b === locale) return 1;
    return labels[a].localeCompare(labels[b], locale);
  });
}

/**
 * Renderiza a landing page do mcp.midvash.com no idioma solicitado.
 *
 * Identidade visual = a do midvash.com (DESIGN.md do monorepo):
 *  - Paleta OKLCH: neutros tintados em âmbar, mel raro (marca e links),
 *    oliveira pra agir (botão principal), tinta pra selecionar
 *  - Tipografia: Literata itálico no display, Literata no corpo, Figtree na UI
 *  - Plano: borda em vez de sombra, raio até 8px
 *  - Light + dark mode automático via prefers-color-scheme
 */
export function renderLandingPage(locale: Locale): string {
  const t = TRANSLATIONS[locale];
  const pageUrl = `${SITE_URL}${pathForLocale(locale)}`;
  const midvashHome = `https://midvash.com${locale === 'en' ? '' : `/${locale}`}`;
  const labels = languageLabels(locale);
  const languages = orderedLanguages(locale, labels);

  // Lista de versões serializada para o JS inline (filtros e seleção)
  const versionsJson = JSON.stringify(
    VERSIONS.map((v) => ({
      slug: v.slug,
      shortName: v.shortName,
      name: v.name,
      language: v.language,
    })),
  ).replace(/</g, '\\u003c');

  // Strings de UI passadas para o JS do navegador
  const uiStrings = JSON.stringify({
    needSelection: t.configure.needSelection,
    copyBtn: t.configure.copyBtn,
    copiedBtn: t.configure.copiedBtn,
    copyError: t.configure.copyError,
    defaultLangs: [locale],
    allLanguages: t.configure.allLanguages,
    defaultVersions: [DEFAULT_VERSION_BY_LOCALE[locale]],
    languages,
    labels,
  }).replace(/</g, '\\u003c');

  const alternates = SUPPORTED_LOCALES.map(
    (l) =>
      `<link rel="alternate" hreflang="${l}" href="${SITE_URL}${pathForLocale(l)}">`,
  ).join('\n');

  const ogAlternates = SUPPORTED_LOCALES.filter((l) => l !== locale)
    .map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALES[l]}">`)
    .join('\n');

  const langSwitcherHtml = langSwitcherMarkup(locale, SELECT_LANGUAGE_LABEL[locale]);

  const heroFacts = t.hero.facts
    .map((f) => `<li>${escapeHtml(f)}</li>`)
    .join('');

  const useCards = t.uses.items
    .map(
      (u) => `
      <figure class="use-card">
        <figcaption>${escapeHtml(u.who)}</figcaption>
        <blockquote>${escapeHtml(u.prompt)}</blockquote>
      </figure>`,
    )
    .join('');

  const howCards = t.how.cards
    .map(
      (card) => `
      <article class="step-card">
        <span class="step-num" aria-hidden="true">${escapeHtml(card.num)}</span>
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.body)}</p>
      </article>`,
    )
    .join('');

  const clientCards = [
    { key: 'chatgpt', ...t.clients.chatgpt, logo: chatgptLogo() },
    { key: 'claude', ...t.clients.claude, logo: claudeLogo() },
    { key: 'gemini', ...t.clients.gemini, logo: geminiLogo() },
    { key: 'cursor', ...t.clients.cursor, logo: cursorLogo() },
  ]
    .map(
      (c) => `
      <article class="client-card client-card--${c.key}">
        <header class="client-head">
          <div class="client-logo">${c.logo}</div>
          <div>
            <h3>${escapeHtml(c.name)}</h3>
            <p class="client-tier">${escapeHtml(c.tier)}</p>
          </div>
        </header>
        <ol class="client-steps">
          ${c.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
        </ol>
      </article>`,
    )
    .join('');

  const toolItems = LANDING_TOOLS.map(
    (name) => `
      <li class="tool-item">
        <code>${name}</code>
        <p>${escapeHtml(t.tools.items[name])}</p>
      </li>`,
  ).join('');

  const catalogItems = languages
    .map((code) => {
      const versions = VERSIONS.filter((v) => v.language === code)
        .map(
          (v) =>
            `<li><strong>${escapeHtml(v.shortName)}</strong> <span class="cat-name">${escapeHtml(v.name)}</span>${
              v.copyright ? ` <span class="cat-badge">${escapeHtml(t.versions.creditBadge)}</span>` : ''
            }</li>`,
        )
        .join('');
      return `
      <div class="cat-lang">
        <h3>${escapeHtml(labels[code])}</h3>
        <ul>${versions}</ul>
      </div>`;
    })
    .join('');

  const faqItems = t.faq.items
    .map(
      (f) => `
      <details class="faq-item">
        <summary><h3>${escapeHtml(f.q)}</h3></summary>
        <p>${escapeHtml(f.a)}</p>
      </details>`,
    )
    .join('');

  const moreCards = [
    { ...t.more.reader, href: midvashHome },
    { ...t.more.api, href: `https://api.midvash.com${pathForLocale(locale) === '/' ? '' : pathForLocale(locale)}` },
    { ...t.more.wordpress, href: `${midvashHome}/wordpress-plugin` },
  ]
    .map(
      (m) => `
      <a class="more-card" href="${escapeHtml(m.href)}">
        <h3>${escapeHtml(m.title)}</h3>
        <p>${escapeHtml(m.body)}</p>
        <span class="more-url">${escapeHtml(m.href.replace('https://', ''))}</span>
      </a>`,
    )
    .join('');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://midvash.com/#organization',
        name: 'Midvash',
        url: 'https://midvash.com',
        logo: 'https://midvash.com/brand/icon.svg',
        sameAs: ['https://instagram.com/midvash', 'https://github.com/midvash'],
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: t.htmlLang,
        about: { '@id': `${SITE_URL}/#app` },
        publisher: { '@id': 'https://midvash.com/#organization' },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#app`,
        name: 'Midvash Bible MCP',
        alternateName: ALTERNATE_NAMES[locale] ?? 'Midvash Bible MCP',
        description: t.meta.description,
        url: pageUrl,
        applicationCategory: 'ReferenceApplication',
        operatingSystem: 'Web',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: LANDING_TOOLS.map((name) => t.tools.items[name]),
        publisher: { '@id': 'https://midvash.com/#organization' },
        sameAs: ['https://github.com/midvash/bible-mcp'],
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        inLanguage: t.htmlLang,
        mainEntity: t.faq.items.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="${t.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(t.meta.title)}</title>
<meta name="description" content="${escapeHtml(t.meta.description)}">
<link rel="canonical" href="${pageUrl}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${SITE_URL}/">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">
<meta property="og:title" content="${escapeHtml(t.meta.title)}">
<meta property="og:description" content="${escapeHtml(t.meta.description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${pageUrl}">
<meta property="og:site_name" content="Midvash">
<meta property="og:locale" content="${OG_LOCALES[locale]}">
${ogAlternates}
<meta property="og:image" content="https://midvash.com/brand/og-mcp.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escapeHtml(t.meta.title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(t.meta.title)}">
<meta name="twitter:description" content="${escapeHtml(t.meta.description)}">
<meta name="twitter:image" content="https://midvash.com/brand/og-mcp.jpg">
<meta name="theme-color" content="#FBFAF7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0F0D0A" media="(prefers-color-scheme: dark)">
<link rel="icon" href="https://midvash.com/brand/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="https://midvash.com/brand/icon.svg">
<link rel="apple-touch-icon" href="https://midvash.com/brand/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Literata:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">
<style>
:root {
  /* Paleta do midvash.com (DESIGN.md do monorepo): neutros tintados em âmbar,
     mel raro, oliveira pra agir, tinta pra selecionar. */
  --primary: oklch(0.55 0.15 62);
  --primary-hover: oklch(0.49 0.14 60);
  --primary-soft: oklch(0.955 0.025 82);
  --text: oklch(0.22 0.020 65);
  --text-soft: oklch(0.38 0.018 65);
  --text-muted: oklch(0.52 0.015 65);
  --bg: oklch(0.985 0.003 82);
  --bg-soft: oklch(0.965 0.006 80);
  --bg-card: oklch(0.995 0.003 82);
  --bg-code: oklch(0.22 0.020 65);
  --code-text: oklch(0.92 0.018 85);
  --border: oklch(0.91 0.008 80);
  --border-strong: oklch(0.84 0.012 78);
  --accent: oklch(0.74 0.14 75);
  --success: oklch(0.48 0.078 161);
  --method-get: oklch(0.48 0.078 161);
  --action: oklch(0.48 0.078 161);
  --action-hover: oklch(0.43 0.075 161);
  --on-action: oklch(0.995 0.003 82);
  --control: oklch(0.22 0.020 65);
  --on-control: oklch(0.995 0.003 82);
  --on-primary: oklch(0.995 0.003 82);
  --shadow-sm: none;
  --shadow-md: none;
  --shadow-lg: none;
  --radius: 6px;
  --radius-lg: 8px;
  --font-sans: 'Figtree', ui-sans-serif, system-ui, sans-serif;
  --font-serif: 'Literata', ui-serif, Georgia, serif;
  --font-display: 'Literata', ui-serif, Georgia, serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root {
    --primary: oklch(0.84 0.13 82);
    --primary-hover: oklch(0.88 0.11 84);
    --primary-soft: oklch(0.22 0.025 74);
    --text: oklch(0.92 0.018 85);
    --text-soft: oklch(0.80 0.018 82);
    --text-muted: oklch(0.66 0.018 80);
    --bg: oklch(0.14 0.008 74);
    --bg-soft: oklch(0.16 0.009 74);
    --bg-card: oklch(0.18 0.010 74);
    --bg-code: oklch(0.11 0.008 74);
    --code-text: oklch(0.92 0.018 85);
    --border: oklch(0.27 0.010 74);
    --border-strong: oklch(0.34 0.012 74);
    --accent: oklch(0.84 0.13 82);
    --success: oklch(0.72 0.069 160);
    --method-get: oklch(0.72 0.069 160);
    --action: oklch(0.72 0.069 160);
    --action-hover: oklch(0.77 0.066 160);
    --on-action: oklch(0.14 0.008 74);
    --control: oklch(0.92 0.018 85);
    --on-control: oklch(0.14 0.008 74);
    --on-primary: oklch(0.14 0.008 74);
    color-scheme: dark;
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
.container { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
.skip-link {
  position: absolute; left: -9999px; top: 0;
  background: var(--control); color: var(--on-control);
  padding: 12px 18px; z-index: 100;
}
.skip-link:focus { left: 16px; top: 16px; }

/* HEADER — como o do midvash.com: plano, sem vidro, wordmark + produto */
.site-header {
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 50;
}
.header-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
.brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--text); }
.brand-logo { display: block; height: 40px; width: auto; }
.brand-logo-dark { display: none; }
@media (prefers-color-scheme: dark) {
  .brand-logo-light { display: none; }
  .brand-logo-dark { display: block; }
}
.brand-product {
  font-size: 14px; font-weight: 600; color: var(--text-muted);
  padding-left: 12px; border-left: 1px solid var(--border); line-height: 20px;
}
@media (max-width: 480px) { .brand-logo { height: 32px; } }
.lang-switcher { position: relative; }
.lang-trigger {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; padding: 0;
  background: transparent; border: none; border-radius: 8px;
  color: var(--text-soft); cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.lang-trigger:hover, .lang-trigger[aria-expanded="true"] { background: var(--bg-soft); color: var(--text); }
.lang-trigger-icon { display: inline-flex; }
.lang-trigger-icon svg { width: 22px; height: 22px; }
.lang-menu {
  position: absolute; top: calc(100% + 6px); right: 0;
  min-width: 200px; max-height: 70vh; overflow-y: auto;
  margin: 0; padding: 6px;
  background: var(--bg-card); color: var(--text);
  border: 1px solid var(--border); border-radius: 8px;
  list-style: none;
  box-shadow: 0 8px 24px oklch(0.22 0.02 65 / 0.12);
  z-index: 60;
}
.lang-menu li { margin: 0; }
.lang-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 6px;
  text-decoration: none; color: var(--text-soft);
  font-size: 14px; font-weight: 500;
}
.lang-item:hover { background: var(--bg-soft); color: var(--text); }
.lang-item.is-active { background: var(--control); color: var(--on-control); font-weight: 600; }
.lang-flag {
  width: 20px; height: 20px; border-radius: 50%;
  object-fit: cover; flex-shrink: 0;
  box-shadow: inset 0 0 0 1px oklch(0.22 0.02 65 / 0.1);
}
.lang-name { line-height: 1.2; }

/* HERO — editorial, alinhado à esquerda, como /open-source no site */
.hero { padding: 72px 0 64px; }
.hero-inner > * { max-width: 760px; }
.eyebrow {
  display: block; color: var(--text-muted);
  font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  margin-bottom: 20px;
}
.hero h1 {
  font-family: var(--font-display); font-style: italic;
  font-size: clamp(2.4rem, 5.4vw, 3.6rem);
  font-weight: 500; letter-spacing: -0.01em;
  line-height: 1.05; color: var(--primary); margin-bottom: 20px;
}
.hero h1 .accent { color: var(--text); font-weight: 400; }
.hero p.hero-sub {
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 1.8vw, 1.3rem);
  color: var(--text); margin: 0 0 32px; line-height: 1.55;
}
.hero .cta {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--action); color: var(--on-action);
  padding: 12px 22px; border-radius: var(--radius);
  font-weight: 600; font-size: 0.95rem; text-decoration: none;
  transition: background-color 0.15s ease;
}
.hero .cta:hover { background: var(--action-hover); }
.hero .cta::after { content: '→'; font-size: 1.1em; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.hero .cta-secondary {
  display: inline-flex; align-items: center;
  background: var(--bg-card); color: var(--text);
  border: 1px solid var(--border); border-radius: var(--radius);
  padding: 11px 22px; font-weight: 600; font-size: 0.95rem; text-decoration: none;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.hero .cta-secondary:hover { border-color: var(--primary); color: var(--primary); }
.hero-facts {
  list-style: none; display: flex; flex-wrap: wrap;
  gap: 8px 28px; margin-top: 32px; font-size: 0.9rem; color: var(--text-soft); font-weight: 500;
}
.hero-facts li::before { content: '✓'; color: var(--action); margin-right: 8px; font-weight: 700; }

/* SEÇÕES — régua fina no topo, título Literata à esquerda */
section.block { padding: 72px 0; border-top: 1px solid var(--border); }
.section-head { margin-bottom: 40px; max-width: 720px; }
.section-head h2 {
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 3.6vw, 2.6rem);
  font-weight: 500; letter-spacing: -0.01em; line-height: 1.12;
  color: var(--text); margin-bottom: 12px;
}
.section-head p { font-size: 1.05rem; color: var(--text-soft); max-width: 640px; }
section[id] { scroll-margin-top: 72px; }

/* HOW IT WORKS */
.steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 32px; }
.step-card { border-top: 1px solid var(--border-strong); padding-top: 20px; }
.step-num {
  display: block; color: var(--primary);
  font-family: var(--font-display); font-style: italic;
  font-size: 2rem; font-weight: 500; line-height: 1; margin-bottom: 14px;
}
.step-card h3 { font-family: var(--font-serif); font-size: 1.25rem; font-weight: 600; color: var(--text); margin-bottom: 8px; }
.step-card p { font-size: 0.975rem; color: var(--text-soft); line-height: 1.6; }

/* CONFIGURATOR */
.config-block {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 40px;
  max-width: 880px;
}
.config-step { margin-bottom: 32px; }
.config-step:last-of-type { margin-bottom: 0; }
.config-label { font-family: var(--font-serif); font-size: 1.125rem; font-weight: 600; color: var(--text); margin-bottom: 14px; }
.lang-select {
  appearance: none; -webkit-appearance: none;
  width: 100%; max-width: 360px; height: 42px; padding: 0 36px 0 12px;
  background-color: var(--bg);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' fill='%23857a6b'%3E%3Cpath d='M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center; background-size: 14px;
  border: 1px solid var(--border); border-radius: 6px;
  color: var(--text); font: inherit; font-size: 0.95rem; cursor: pointer;
}
.lang-select:hover { border-color: var(--border-strong); }
.lang-select:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.versions-toolbar { display: flex; gap: 12px; margin-bottom: 12px; font-size: 0.8125rem; }
.toolbar-btn {
  background: transparent; border: none; color: var(--primary); font-weight: 600;
  cursor: pointer; padding: 4px 8px; border-radius: 6px; font-family: inherit;
}
.toolbar-btn:hover { background: var(--bg-soft); }
.versions-helper { font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 14px; }
.versions-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px;
  max-height: 320px; overflow-y: auto; padding: 4px;
  border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg-soft);
}
.versions-grid::-webkit-scrollbar { width: 8px; }
.versions-grid::-webkit-scrollbar-track { background: transparent; }
.versions-grid::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 999px; }
.version-item {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 6px;
  cursor: pointer; font-size: 0.875rem; transition: border-color 0.15s ease;
}
.version-item:hover { border-color: var(--border-strong); }
.version-item input { accent-color: var(--action); cursor: pointer; }
.version-item .v-name { color: var(--text-muted); font-size: 0.7375rem; line-height: 1.3; }
.version-item strong { color: var(--text); font-weight: 600; }
.generate-btn {
  width: 100%; background: var(--action); color: var(--on-action); border: none;
  padding: 16px; border-radius: var(--radius); font-family: inherit;
  font-weight: 600; font-size: 1.0625rem; cursor: pointer; margin-top: 32px;
  transition: background-color 0.15s ease;
}
.generate-btn:hover { background: var(--action-hover); }
.generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* RESULT */
.result { display: none; margin-top: 40px; padding-top: 36px; border-top: 1px solid var(--border); }
.result.visible { display: block; }
.result-block { margin-bottom: 24px; }
.result-block:last-child { margin-bottom: 0; }
.result-label { display: block; font-family: var(--font-serif); font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 10px; }
.code-box {
  position: relative; background: var(--bg-soft); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 20px 24px;
  font-family: var(--font-mono); font-size: 0.8125rem; color: var(--text);
  overflow-x: auto; word-break: break-all; line-height: 1.5;
}
.code-box > span { display: block; white-space: pre-wrap; padding-right: 72px; }
.copy-btn {
  position: absolute; top: 10px; right: 10px;
  background: var(--bg-card); border: 1px solid var(--border); color: var(--text-soft);
  padding: 6px 14px; border-radius: 6px;
  font-family: var(--font-sans); font-size: 0.75rem; font-weight: 600; cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.copy-btn:hover { color: var(--text); border-color: var(--border-strong); }
.copy-btn.copied { color: var(--success); border-color: var(--success); }

/* CLIENT CARDS */
/* 4 clientes: 2x2 no desktop, 1 coluna no celular (nunca um sozinho na linha) */
.clients-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; }
@media (min-width: 760px) { .clients-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.client-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 22px; }
.client-head { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
.client-logo {
  width: 44px; height: 44px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-soft); border: 1px solid var(--border); color: var(--text);
}
.client-logo svg { width: 24px; height: 24px; display: block; }
.client-card h3 { font-family: var(--font-serif); font-size: 1.25rem; font-weight: 600; color: var(--text); line-height: 1.2; }
.client-tier { font-size: 0.8125rem; color: var(--text-muted); font-weight: 500; line-height: 1.4; margin-top: 2px; }
.client-steps { list-style: none; counter-reset: step; }
.client-steps li {
  counter-increment: step; position: relative; padding: 8px 0 8px 34px;
  font-size: 0.9rem; color: var(--text-soft); line-height: 1.5; border-bottom: 1px solid var(--border);
}
.client-steps li:last-child { border-bottom: none; }
.client-steps li::before {
  content: counter(step); position: absolute; left: 0; top: 8px;
  width: 22px; height: 22px; border-radius: 999px;
  background: var(--bg-soft); border: 1px solid var(--border); color: var(--text);
  font-weight: 700; font-size: 0.72rem; display: flex; align-items: center; justify-content: center;
}

/* USES */
.uses-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 32px; }
.use-card { border-top: 1px solid var(--border-strong); padding-top: 18px; }
.use-card figcaption {
  font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--text-muted); margin-bottom: 10px;
}
.use-card blockquote { font-family: var(--font-serif); font-style: italic; font-size: 1.05rem; line-height: 1.55; color: var(--text); }

/* CONFIG EXTRAS */
.config-error { color: oklch(0.55 0.15 35); font-size: 0.875rem; margin-top: 12px; }
.config-error:empty { display: none; }
.result-helper { font-size: 0.875rem; color: var(--text-muted); margin: -4px 0 10px; }

/* TOOLS */
.tools-list { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0 32px; }
.tool-item { border-top: 1px solid var(--border); padding: 16px 0; }
.tool-item code { font-family: var(--font-mono); font-size: 0.8125rem; font-weight: 600; color: var(--primary); }
.tool-item p { font-size: 0.925rem; color: var(--text-soft); margin-top: 6px; line-height: 1.5; }
.tools-note { color: var(--text-soft); margin-top: 28px; }

/* VERSIONS */
.versions-intro { max-width: 720px; margin: 0 0 32px; color: var(--text-soft); }
.versions-intro p + p { margin-top: 12px; font-size: 0.925rem; color: var(--text-muted); }
/* Colunas (não grade): cada idioma tem altura diferente, e a grade deixava buracos. */
.catalog { columns: 3 260px; column-gap: 16px; }
.cat-lang { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; break-inside: avoid; margin-bottom: 16px; }
.cat-lang h3 { font-family: var(--font-serif); font-size: 1rem; font-weight: 600; margin-bottom: 8px; }
.cat-lang ul { list-style: none; font-size: 0.875rem; line-height: 1.45; color: var(--text-soft); }
.cat-lang li + li { margin-top: 6px; }
.cat-lang strong { color: var(--text); font-weight: 600; }
.cat-name { color: var(--text-muted); }
.cat-badge {
  display: inline-block; font-size: 0.6875rem; font-weight: 600; padding: 1px 8px; border-radius: 999px;
  background: var(--bg-soft); color: var(--text-soft); border: 1px solid var(--border); vertical-align: 1px;
}
.api-link { display: inline-block; margin-top: 32px; color: var(--primary); font-weight: 600; text-decoration: none; }
.api-link:hover { text-decoration: underline; }

/* FAQ */
.faq-list { max-width: 760px; }
.faq-item { border-bottom: 1px solid var(--border); padding: 18px 0; }
.faq-item summary { cursor: pointer; list-style: none; display: flex; justify-content: space-between; gap: 16px; }
.faq-item summary::-webkit-details-marker { display: none; }
.faq-item summary::after { content: '+'; color: var(--text-muted); font-size: 1.4rem; line-height: 1; }
.faq-item[open] summary::after { content: '−'; }
.faq-item summary h3 { font-family: var(--font-serif); font-size: 1.075rem; font-weight: 600; color: var(--text); }
.faq-item p { margin-top: 10px; color: var(--text-soft); }

/* MORE */
.more-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.more-card {
  display: block; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 24px; text-decoration: none; color: inherit; transition: border-color 0.15s ease;
}
.more-card:hover { border-color: var(--border-strong); }
.more-card h3 { font-family: var(--font-serif); font-size: 1.2rem; font-weight: 600; color: var(--text); margin-bottom: 8px; }
.more-card p { color: var(--text-soft); font-size: 0.95rem; }
.more-url { display: inline-block; margin-top: 14px; color: var(--primary); font-weight: 600; font-size: 0.875rem; }
${SITE_FOOTER_CSS}

@media (max-width: 640px) {
  .hero { padding: 56px 0 40px; }
  section.block { padding: 56px 0; }
  .config-block { padding: 24px 18px; }
  .code-box > span { padding-right: 0; padding-top: 28px; }
}
</style>
<script type="application/ld+json">
${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}
</script>
</head>
<body>
<a href="#main" class="skip-link">${escapeHtml(t.nav.skipToContent)}</a>

<header class="site-header">
  <div class="container header-inner">
    <a href="${pathForLocale(locale)}" class="brand" aria-label="Midvash Bible MCP">
      <img class="brand-logo brand-logo-light" src="https://midvash.com/brand/logo-midvash.svg" alt="Midvash" width="133" height="40">
      <img class="brand-logo brand-logo-dark" src="https://midvash.com/brand/logo-midvash-dark.svg" alt="" width="133" height="40">
      <span class="brand-product">Bible MCP</span>
    </a>
    ${langSwitcherHtml}
  </div>
</header>

<main id="main">

<section class="hero">
  <div class="container hero-inner">
    <span class="eyebrow">${escapeHtml(t.hero.eyebrow)}</span>
    <h1>${escapeHtml(t.hero.title)} <span class="accent">${escapeHtml(t.hero.titleAccent)}</span></h1>
    <p class="hero-sub">${escapeHtml(t.hero.subtitle)}</p>
    <div class="hero-actions">
      <a href="#configure" class="cta">${escapeHtml(t.hero.cta)}</a>
      <a href="#uses" class="cta-secondary">${escapeHtml(t.hero.ctaSecondary)}</a>
    </div>
    <ul class="hero-facts">${heroFacts}</ul>
  </div>
</section>

<section id="uses" class="block alt">
  <div class="container">
    <div class="section-head">
      <h2>${escapeHtml(t.uses.title)}</h2>
      <p>${escapeHtml(t.uses.subtitle)}</p>
    </div>
    <div class="uses-grid">
      ${useCards}
    </div>
  </div>
</section>

<section id="how" class="block">
  <div class="container">
    <div class="section-head">
      <h2>${escapeHtml(t.how.title)}</h2>
    </div>
    <div class="steps">
      ${howCards}
    </div>
  </div>
</section>

<section id="configure" class="block alt">
  <div class="container">
    <div class="section-head">
      <h2>${escapeHtml(t.configure.title)}</h2>
      <p>${escapeHtml(t.configure.subtitle)}</p>
    </div>
    <div class="config-block">
      <div class="config-step">
        <h3 class="config-label" id="lang-filters-label">${escapeHtml(t.configure.languagesLabel)}</h3>
        <select class="lang-select" id="lang-filters" aria-labelledby="lang-filters-label"></select>
      </div>

      <div class="config-step">
        <h3 class="config-label" id="versions-label">${escapeHtml(t.configure.versionsLabel)}</h3>
        <div class="versions-toolbar">
          <button type="button" class="toolbar-btn" id="select-all-btn">${escapeHtml(t.configure.selectAll)}</button>
          <button type="button" class="toolbar-btn" id="clear-all-btn">${escapeHtml(t.configure.clearAll)}</button>
        </div>
        <p class="versions-helper">${escapeHtml(t.configure.versionsHelper)}</p>
        <div class="versions-grid" id="versions-grid" role="group" aria-labelledby="versions-label"></div>
      </div>

      <button type="button" class="generate-btn" id="generate-btn">${escapeHtml(t.configure.generateBtn)}</button>
      <p class="config-error" id="config-error" role="alert"></p>

      <div class="result" id="result">
        <div class="result-block">
          <h3 class="result-label">${escapeHtml(t.configure.urlLabel)}</h3>
          <p class="result-helper">${escapeHtml(t.configure.urlHelper)}</p>
          <div class="code-box">
            <button type="button" class="copy-btn" data-target="url-output">${escapeHtml(t.configure.copyBtn)}</button>
            <span id="url-output"></span>
          </div>
        </div>
        <div class="result-block">
          <h3 class="result-label">${escapeHtml(t.configure.jsonLabel)}</h3>
          <div class="code-box">
            <button type="button" class="copy-btn" data-target="json-output">${escapeHtml(t.configure.copyBtn)}</button>
            <span id="json-output"></span>
          </div>
        </div>
        <div class="result-block">
          <h3 class="result-label">${escapeHtml(t.configure.geminiLabel)}</h3>
          <div class="code-box">
            <button type="button" class="copy-btn" data-target="gemini-output">${escapeHtml(t.configure.copyBtn)}</button>
            <span id="gemini-output"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="clients" class="block">
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

<section id="tools" class="block alt">
  <div class="container">
    <div class="section-head">
      <h2>${escapeHtml(t.tools.title)}</h2>
      <p>${escapeHtml(t.tools.subtitle)}</p>
    </div>
    <ul class="tools-list">
      ${toolItems}
    </ul>
    <p class="tools-note">${escapeHtml(t.tools.prompts)}</p>
  </div>
</section>

<section id="versions" class="block">
  <div class="container">
    <div class="section-head">
      <h2>${escapeHtml(t.versions.title)}</h2>
    </div>
    <div class="versions-intro">
      <p>${escapeHtml(t.versions.body)}</p>
      <p>${escapeHtml(t.versions.creditNote)}</p>
    </div>
    <div class="catalog">
      ${catalogItems}
    </div>
    <a class="api-link" href="https://api.midvash.com${pathForLocale(locale) === '/' ? '' : pathForLocale(locale)}">${escapeHtml(t.versions.apiCta)} →</a>
  </div>
</section>

<section id="faq" class="block alt">
  <div class="container">
    <div class="section-head">
      <h2>${escapeHtml(t.faq.title)}</h2>
    </div>
    <div class="faq-list">
      ${faqItems}
    </div>
  </div>
</section>

<section id="more" class="block">
  <div class="container">
    <div class="section-head">
      <h2>${escapeHtml(t.more.title)}</h2>
    </div>
    <div class="more-grid">
      ${moreCards}
    </div>
  </div>
</section>

</main>

${renderSiteFooter(locale)}

<script>
const VERSIONS = ${versionsJson};
const UI = ${uiStrings};

const selectedLangs = new Set(UI.defaultLangs);
// Ordem de marcação importa: a primeira versão do link vira a padrão da conexão.
const selectedVersions = new Set(UI.defaultVersions.filter(s => VERSIONS.some(v => v.slug === s)));

function nanoid() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const arr = new Uint8Array(10);
  crypto.getRandomValues(arr);
  let id = '';
  for (let i = 0; i < 10; i++) id += alphabet[arr[i] % alphabet.length];
  return id;
}

// Um seletor no lugar de um botão por idioma: com quase 70 idiomas, os botões
// viravam um paredão. Opção vazia = todos os idiomas.
function renderLangFilters() {
  const root = document.getElementById('lang-filters');
  const count = (lang) => VERSIONS.filter(v => v.language === lang).length;
  const all = document.createElement('option');
  all.value = '';
  all.textContent = UI.allLanguages + ' (' + VERSIONS.length + ')';
  root.appendChild(all);
  for (const lang of UI.languages) {
    const opt = document.createElement('option');
    opt.value = lang;
    opt.textContent = (UI.labels[lang] || lang) + ' (' + count(lang) + ')';
    opt.selected = selectedLangs.has(lang);
    root.appendChild(opt);
  }
  root.addEventListener('change', () => {
    selectedLangs.clear();
    if (root.value) selectedLangs.add(root.value);
    renderVersions();
  });
}

function visibleVersions() {
  return VERSIONS.filter(v => selectedLangs.size === 0 || selectedLangs.has(v.language));
}

function renderVersions() {
  const root = document.getElementById('versions-grid');
  root.innerHTML = '';
  for (const v of visibleVersions()) {
    const item = document.createElement('label');
    item.className = 'version-item';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = selectedVersions.has(v.slug);
    input.addEventListener('change', (e) => {
      if (e.target.checked) selectedVersions.add(v.slug);
      else selectedVersions.delete(v.slug);
    });
    const text = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = v.shortName;
    const name = document.createElement('div');
    name.className = 'v-name';
    name.textContent = v.name;
    text.append(strong, name);
    item.append(input, text);
    root.appendChild(item);
  }
}

function selectAllVisible() {
  for (const v of visibleVersions()) selectedVersions.add(v.slug);
  renderVersions();
}
function clearAll() {
  selectedVersions.clear();
  renderVersions();
}

function generate() {
  const error = document.getElementById('config-error');
  if (selectedVersions.size === 0) {
    error.textContent = UI.needSelection;
    return;
  }
  error.textContent = '';
  const slugs = [...selectedVersions];
  // Idiomas derivados das versões marcadas: um filtro de idioma que não cobre
  // uma versão do link bloquearia essa versão no servidor.
  const langs = [...new Set(slugs.map(s => (VERSIONS.find(v => v.slug === s) || {}).language).filter(Boolean))];
  const url = 'https://mcp.midvash.com/mcp/' + nanoid() + '?v=' + slugs.join(',') + '&lang=' + langs.join(',');

  const json = { mcpServers: { midvash: { url: url } } };

  document.getElementById('url-output').textContent = url;
  document.getElementById('json-output').textContent = JSON.stringify(json, null, 2);
  document.getElementById('gemini-output').textContent = 'gemini mcp add --scope user --transport http midvash "' + url + '"';
  const result = document.getElementById('result');
  result.classList.add('visible');
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
      document.getElementById('config-error').textContent = UI.copyError;
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

// ─── Logos dos clientes de IA ────────────────────────────────────────────
// Paths do Simple Icons (CC0, simpleicons.org), só pra dizer "funciona no X".
// ChatGPT e Cursor são marcas monocromáticas: pintam em `currentColor` e
// acompanham o tema. Claude e Gemini levam a cor da marca.

function chatgptLogo(): string {
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>`;
}

function claudeLogo(): string {
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#D97757" d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>`;
}

function geminiLogo(): string {
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="gemini-grad" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4285F4"/><stop offset="0.5" stop-color="#9B72CB"/><stop offset="1" stop-color="#D96570"/></linearGradient></defs><path fill="url(#gemini-grad)" d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/></svg>`;
}

function cursorLogo(): string {
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"/></svg>`;
}
