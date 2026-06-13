/**
 * Footer drop-in compartilhado entre os sites do ecossistema Midvash
 * (api.midvash.com, mcp.midvash.com, wordpress.midvash.com). Mantém
 * marca + lista de produtos + lista de repos open source no mesmo
 * desenho em todos os locales.
 *
 * Replica a estrutura do arquivo midvash-footer.html (HTML referência
 * vivendo no repo midvash/bible-api). Cada worker tem cópia própria —
 * por design: o source HTML é declaradamente portátil e drop-in.
 *
 * Prefixo `mv-` em todas as classes pra não colidir com o tema da página.
 * Dark mode automático via prefers-color-scheme.
 */
import type { Locale, Translations } from './i18n';

export type ProductKey =
  | 'reader'
  | 'api'
  | 'mcp'
  | 'wordpress'
  | 'chrome'
  | 'ios'
  | 'android';

const PRODUCT_ORDER: ProductKey[] = [
  'reader',
  'api',
  'mcp',
  'wordpress',
  'chrome',
  'ios',
  'android',
];

const SOON_PRODUCTS: ReadonlySet<ProductKey> = new Set<ProductKey>(['ios', 'android']);

function productHref(key: ProductKey, locale: Locale): string | null {
  const suffix = locale === 'en' ? '' : `/${locale}`;
  switch (key) {
    case 'reader':
      return `https://midvash.com${suffix}`;
    case 'api':
      return `https://api.midvash.com${suffix}`;
    case 'mcp':
      return `https://mcp.midvash.com${suffix}`;
    case 'wordpress':
      return `https://wordpress.midvash.com${suffix}`;
    case 'chrome':
      return 'https://midvash.app/chrome-extension/';
    case 'ios':
    case 'android':
      return null;
  }
}

const PRODUCT_ICONS: Record<ProductKey, string> = {
  reader:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z"/></svg>',
  api:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M251.31,180.69l-30-30a16,16,0,0,0-22.63,0L194,155.32V123.31a47.81,47.81,0,0,0-14.06-34l-43.87-43.87L141,40.49a16,16,0,0,0,0-22.63L131.31,8.18a16,16,0,0,0-22.62,0L74.34,42.52a16,16,0,0,0,0,22.63L84,74.83,40.13,118.69a47.81,47.81,0,0,0,0,67.88l29.3,29.3a47.81,47.81,0,0,0,67.88,0L181.17,172l9.69,9.69a16,16,0,0,0,22.62,0l34.34-34.35A16,16,0,0,0,251.31,180.69ZM120,40H136v16H120Zm-32,32H120V88H88ZM68,116l24-24,52,52-24,24Zm120,52L132.69,112.69a16,16,0,0,0-22.62,0L72.69,150.06a16,16,0,0,0,0,22.63L92,192H40V40H88Z"/></svg>',
  mcp:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16ZM104,128a12,12,0,1,1-12-12A12,12,0,0,1,104,128Zm72,0a12,12,0,1,1-12-12A12,12,0,0,1,176,128Z"/></svg>',
  wordpress:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24ZM43,98.65l32.05,87.78A88.16,88.16,0,0,1,43,98.65Zm87.59,89.34L102.34,109.78l27.07,1.21,21.6,59.4ZM89.62,97.32a44.86,44.86,0,0,1-7.62-1.36c12.18-1.62,24.07-2.64,32.93-3a51.12,51.12,0,0,1,9.43,2.07c.93,3.06,1.49,5.55,1.74,8.21Zm105.81-19a55.43,55.43,0,0,0-3.5,8.36c-1.4,4-3.27,9.43-3.27,16.83,0,3.7,1.42,9.7,4.66,17.7,7.66,18.93,12.91,32.05,12.91,52.79a86.86,86.86,0,0,1-3.27,23.92L181.42,127c8-12.13,12.6-23.45,12.6-32.41a64.55,64.55,0,0,0-1.91-15.27Zm-25.59,21.78c0,2.43.65,5,1.42,8.21H115.81L116,98.91c4.93-2.13,16.13-3.06,21.7-3.06a36.39,36.39,0,0,1,9,1.16Zm-65.55-39.4a87.84,87.84,0,0,1,93.07,11.93c-1.6.06-9.79.5-19,4.79-3.27,1.5-9.16,4.81-9.16,12.85,0,3,1.21,5.63,3.06,9.49a26.36,26.36,0,0,1,2.34,5.34A78.31,78.31,0,0,1,128,89.69c-19.81,0-37.6,2.16-39.62,2.41-1.55-3.69-1.66-5.5-1.66-7,0-7.43,5.34-9.84,11.61-12.43,3.74-1.55,8.18-2.66,8.18-2.66l-1.51-7.41,1-2A86.41,86.41,0,0,1,128,40,86.86,86.86,0,0,1,168.59,49.69ZM69.85,80.13c1.13-.16,5.79-3.83,11.78-3.83,9.65,0,17.32,7.16,17.32,16,0,9.13-9.07,15-19.13,17.16C66.79,113.49,57.34,123.05,57,123.36L52.55,107A89,89,0,0,1,69.85,80.13ZM128,216A87.85,87.85,0,0,1,77.34,200l54.94-79.81L153.5,193A88,88,0,0,1,128,216Z"/></svg>',
  chrome:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M220.27,158.54a8,8,0,0,0-7.7-.46,20,20,0,1,1,0-36.16A8,8,0,0,0,224,114.69V72a16,16,0,0,0-16-16H171.78a35.36,35.36,0,0,0,.22-4,36.11,36.11,0,0,0-11.36-26.24,36,36,0,0,0-60.55,23.62,36.56,36.56,0,0,0,.14,6.62H64A16,16,0,0,0,48,72v32.22a35.36,35.36,0,0,0-4-.22,36.12,36.12,0,0,0-26.24,11.36,35.7,35.7,0,0,0-9.69,27,36.08,36.08,0,0,0,33.31,33.6,35.68,35.68,0,0,0,6.62-.14V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V165.31A8,8,0,0,0,220.27,158.54ZM208,208H64V165.31a8,8,0,0,0-11.43-7.23,20,20,0,1,1,0-36.16A8,8,0,0,0,64,114.69V72h46.69a8,8,0,0,0,7.23-11.43,20,20,0,1,1,36.16,0A8,8,0,0,0,161.31,72H208v32.23a35.68,35.68,0,0,0-6.62-.14A36,36,0,0,0,204,176a35.36,35.36,0,0,0,4-.22Z"/></svg>',
  ios:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M223.3,169.59a8.07,8.07,0,0,0-2.8-3.4C203.53,154.53,200,134.64,200,120c0-17.67,13.47-33.06,21.5-40.67a8,8,0,0,0,0-11.62C208.82,55.74,187.82,48,168,48a72.2,72.2,0,0,0-40,12.13,71.56,71.56,0,0,0-90.71,9.09A74.63,74.63,0,0,0,16,123.4a127.06,127.06,0,0,0,40.14,89.73A39.8,39.8,0,0,0,83.59,224h87.68a39.84,39.84,0,0,0,29.12-12.57,125,125,0,0,0,17.82-24.6C225.23,174,224.33,172,223.3,169.59Zm-34.63,30.94a23.76,23.76,0,0,1-17.4,7.47H83.59a23.82,23.82,0,0,1-16.44-6.51A111.14,111.14,0,0,1,32,123,58.5,58.5,0,0,1,48.65,80.47,54.81,54.81,0,0,1,88,64h.78A55.45,55.45,0,0,1,123,76.28a8,8,0,0,0,10,0A55.44,55.44,0,0,1,168,64a70.64,70.64,0,0,1,36,10.35c-13,14.52-20,30.47-20,45.65,0,23.77,7.64,42.73,22.18,55.3A105.82,105.82,0,0,1,188.67,200.53ZM128.23,30A40,40,0,0,1,167,0h1a8,8,0,0,1,0,16h-1a24,24,0,0,0-23.24,18,8,8,0,1,1-15.5-4Z"/></svg>',
  android:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M176,148a12,12,0,1,1-12-12A12,12,0,0,1,176,148ZM92,136a12,12,0,1,0,12,12A12,12,0,0,0,92,136Zm148,24v24a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V161.13A113.38,113.38,0,0,1,51.4,78.72L26.34,53.66A8,8,0,0,1,37.66,42.34L63.82,68.5a111.43,111.43,0,0,1,128.55-.19l26-26a8,8,0,0,1,11.32,11.32L204.82,78.5c.75.71,1.5,1.43,2.24,2.17A111.25,111.25,0,0,1,240,160Zm-16,0a96,96,0,0,0-96-96h-.34C74.91,64.18,32,107.75,32,161.13V184H224Z"/></svg>',
};

const INSTAGRAM_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"/></svg>';

const GITHUB_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68Z"/></svg>';

const MIDVASH_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true">
  <path d="M100,16 L138.105,38 L138.105,82 L100,104 L61.895,82 L61.895,38 Z" fill="#F0CE8A"/>
  <path d="M61.895,59.56 L100,81.56 L100,125.56 L61.895,147.56 L23.79,125.56 L23.79,81.56 Z" fill="#E8B45A"/>
  <path d="M138.105,59.56 L176.21,81.56 L176.21,125.56 L138.105,147.56 L100,125.56 L100,81.56 Z" fill="#B17027"/>
</svg>`;

interface OssRepo {
  name: string;
  href: string;
}

const OSS_REPOS: OssRepo[] = [
  { name: 'bible-api', href: 'https://github.com/midvash/bible-api' },
  { name: 'bible-data', href: 'https://github.com/midvash/bible-data' },
  { name: 'bible-data-js', href: 'https://github.com/midvash/bible-data-js' },
  { name: 'bible-cross-references', href: 'https://github.com/midvash/bible-cross-references' },
  { name: 'bible-by-midvash', href: 'https://github.com/midvash/bible-by-midvash' },
  { name: 'emdash-plugin-bible', href: 'https://github.com/midvash/emdash-plugin-bible' },
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const FOOTER_CSS = `
/* ─── MIDVASH FOOTER ─── tokens próprios, sem conflito com o tema da página */
.mv-footer {
  --mv-primary: #B17027;
  --mv-primary-soft: #FBF5E8;
  --mv-text: #30281D;
  --mv-text-soft: #5C5343;
  --mv-text-muted: #827B6E;
  --mv-bg-soft: #F5EFE2;
  --mv-bg-card: #FFFDF7;
  --mv-border: #E6DFD0;
  --mv-radius: 12px;
  --mv-font-sans: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --mv-font-serif: 'Literata', Georgia, serif;
  --mv-font-mono: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;

  padding: 56px 0 40px;
  border-top: 1px solid var(--mv-border);
  background: var(--mv-bg-soft);
  color: var(--mv-text-soft);
  font-family: var(--mv-font-sans);
  font-size: 16px;
  line-height: 1.6;
}
@media (prefers-color-scheme: dark) {
  .mv-footer {
    --mv-primary: #ECC779;
    --mv-primary-soft: #302A21;
    --mv-text: #EDE4D3;
    --mv-text-soft: #C7BCA5;
    --mv-text-muted: #B4A994;
    --mv-bg-soft: #302A21;
    --mv-bg-card: #302A21;
    --mv-border: #4A4235;
  }
}
.mv-footer *,
.mv-footer *::before,
.mv-footer *::after { box-sizing: border-box; }
.mv-footer-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

.mv-footer-top { display: grid; grid-template-columns: 1fr; gap: 40px; }
@media (min-width: 768px) {
  .mv-footer-top {
    grid-template-columns: minmax(190px, 240px) 1fr;
    gap: 56px;
    align-items: start;
  }
}

.mv-footer-brand { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.mv-footer-brand-mark { width: 38px; height: 38px; flex-shrink: 0; display: inline-flex; }
.mv-footer-brand-mark svg { width: 100%; height: 100%; display: block; }
.mv-footer-brand-id { display: flex; flex-direction: column; gap: 2px; }
.mv-footer-brand-name {
  font-family: var(--mv-font-serif);
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--mv-text);
  line-height: 1;
}
.mv-footer-brand-by {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mv-text-muted);
  line-height: 1;
}
.mv-footer-social { display: flex; gap: 16px; width: 100%; margin-top: 4px; }
.mv-footer-social-icon {
  display: inline-flex;
  width: 22px;
  height: 22px;
  color: var(--mv-text-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}
.mv-footer-social-icon:hover { color: var(--mv-primary); }
.mv-footer-social-icon svg { width: 100%; height: 100%; }

.mv-footer-cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(165px, 1fr));
  gap: 28px 40px;
}
.mv-footer-col-title {
  font-family: var(--mv-font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--mv-text-muted);
  margin: 0 0 12px;
}
.mv-footer-col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.mv-footer-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 6px 0;
  color: var(--mv-text-soft);
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.14s ease;
}
a.mv-footer-link:hover { color: var(--mv-primary); }
a.mv-footer-link:hover .mv-footer-link-icon { color: var(--mv-primary); }
.mv-footer-link.is-current { color: var(--mv-primary); font-weight: 600; }
.mv-footer-link.is-current .mv-footer-link-icon { color: var(--mv-primary); }
.mv-footer-link.is-soon { color: var(--mv-text-muted); cursor: default; }
.mv-footer-link-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  display: inline-flex;
  opacity: 0.9;
  transition: color 0.14s ease;
}
.mv-footer-link-icon svg { width: 100%; height: 100%; }
.mv-footer-link-text { line-height: 1.3; }
.mv-footer-repo-name { font-family: var(--mv-font-mono); font-size: 0.82rem; }
.mv-footer-all-repos { color: var(--mv-primary); font-weight: 600; font-size: 0.82rem; }
.mv-soon-badge {
  margin-left: auto;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--mv-bg-card);
  color: var(--mv-text-muted);
  border: 1px solid var(--mv-border);
  white-space: nowrap;
}

.mv-footer-bottom {
  margin-top: 44px;
  padding-top: 24px;
  border-top: 1px solid var(--mv-border);
  text-align: center;
}
.mv-footer-bottom p { margin: 0; }
.mv-footer-tagline { font-size: 0.8125rem; color: var(--mv-text-soft); }
.mv-footer-copyright { margin-top: 6px; font-size: 0.75rem; opacity: 0.85; }
.mv-footer-credit { margin-top: 2px; font-size: 0.75rem; opacity: 0.85; color: var(--mv-text-muted); }
.mv-footer-credit a {
  color: var(--mv-primary);
  font-weight: 600;
  text-decoration: none;
}
.mv-footer-credit a:hover { text-decoration: underline; }

@media (max-width: 640px) {
  .mv-footer-cols { gap: 24px 28px; }
}
`;

export interface RenderFooterOpts {
  brandName: string;
  currentProduct: ProductKey;
}

export function renderFooter(t: Translations, locale: Locale, opts: RenderFooterOpts): string {
  const { brandName, currentProduct } = opts;
  const products = PRODUCT_ORDER.map((key) => {
    const label = t.footer.productLabels[key];
    const href = productHref(key, locale);
    const isSoon = SOON_PRODUCTS.has(key);
    const isCurrent = key === currentProduct;
    const icon = `<span class="mv-footer-link-icon" aria-hidden="true">${PRODUCT_ICONS[key]}</span>`;
    const text = `<span class="mv-footer-link-text">${escapeHtml(label)}</span>`;
    if (isSoon || !href) {
      const badge = `<span class="mv-soon-badge">${escapeHtml(t.footer.soonBadge)}</span>`;
      return `<li><span class="mv-footer-link is-soon">${icon}${text}${badge}</span></li>`;
    }
    const classes = `mv-footer-link${isCurrent ? ' is-current' : ''}`;
    const aria = isCurrent ? ' aria-current="page"' : '';
    return `<li><a class="${classes}" href="${escapeHtml(href)}"${aria}>${icon}${text}</a></li>`;
  }).join('');

  const repos = OSS_REPOS.map(
    (r) =>
      `<li><a class="mv-footer-link mv-footer-repo" href="${escapeHtml(
        r.href,
      )}" target="_blank" rel="noopener"><span class="mv-footer-repo-name">${escapeHtml(
        r.name,
      )}</span></a></li>`,
  ).join('');

  return `<footer class="mv-footer">
  <div class="mv-footer-container">
    <div class="mv-footer-top">
      <div class="mv-footer-brand">
        <span class="mv-footer-brand-mark" aria-hidden="true">${MIDVASH_LOGO_SVG}</span>
        <span class="mv-footer-brand-id">
          <span class="mv-footer-brand-name">${escapeHtml(brandName)}</span>
          <span class="mv-footer-brand-by">${escapeHtml(t.footer.brandBy)}</span>
        </span>
        <div class="mv-footer-social" aria-label="${escapeHtml(t.footer.socialLabel)}">
          <a href="https://instagram.com/midvash" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(
            t.footer.instagramLabel,
          )}" class="mv-footer-social-icon">${INSTAGRAM_ICON}</a>
          <a href="https://github.com/midvash" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(
            t.footer.githubLabel,
          )}" class="mv-footer-social-icon">${GITHUB_ICON}</a>
        </div>
      </div>

      <nav class="mv-footer-cols" aria-label="${escapeHtml(t.footer.productsTitle)}">
        <div class="mv-footer-col">
          <h2 class="mv-footer-col-title">${escapeHtml(t.footer.productsTitle)}</h2>
          <ul>${products}</ul>
        </div>
        <div class="mv-footer-col">
          <h2 class="mv-footer-col-title">${escapeHtml(t.footer.openSourceTitle)}</h2>
          <ul>${repos}
            <li><a class="mv-footer-link mv-footer-all-repos" href="https://github.com/midvash" target="_blank" rel="noopener">${escapeHtml(
              t.footer.allReposLabel,
            )}</a></li>
          </ul>
        </div>
      </nav>
    </div>

    <div class="mv-footer-bottom">
      <p class="mv-footer-tagline">${escapeHtml(t.footer.tagline)}</p>
      <p class="mv-footer-copyright">${escapeHtml(t.footer.copyright)}</p>
      <p class="mv-footer-credit">${escapeHtml(
        t.footer.creditPrefix,
      )} <a href="https://netogregorio.com" target="_blank" rel="noopener">Neto Gregório</a></p>
    </div>
  </div>
</footer>`;
}
