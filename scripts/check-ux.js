// UX regression checks run after the Cloudflare build (no test dependencies).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const pages = [
  'index.html',
  'equipe.html',
  'informativos.html',
  'publicacao.html',
  '404.html',
  'direito-civil-patrimonial.html',
  'direito-imobiliario.html',
  'familia-sucessoes.html',
  'inventario-partilha.html'
];
let checked = 0;
for (const page of pages) {
  const filename = path.join(dist, page);
  assert.ok(fs.existsSync(filename), `Missing built page: ${page}`);
  const html = fs.readFileSync(filename, 'utf8');
  assert.match(html, /class="skip-link"[^>]*href="#conteudo"/,
    `Skip link absent: ${page}`);
  assert.match(html, /<main\b[^>]*\bid="conteudo"/,
    `Skip link has no target: ${page}`);
  assert.match(html, /<main\b[^>]*\btabindex="-1"/,
    `Skip target is not focusable: ${page}`);
  if (html.includes('class="masthead"')) {
    assert.match(html, /class="menu-toggle"[^>]*aria-expanded="false"/,
      `Mobile menu button missing: ${page}`);
    assert.match(html, /class="mobile-nav"[^>]*id="mobile-navigation"[^>]*hidden/,
      `Mobile nav missing or open at load: ${page}`);
    assert.match(html, /aria-controls="mobile-navigation"/,
      `Button not linked to mobile nav: ${page}`);
    assert.match(html, /e\.key==='Escape'/,
      `Escape handler missing: ${page}`);
  }
  checked++;
}
const css = fs.readFileSync(path.join(dist, 'assets', 'zappala-v2.css'), 'utf8');
assert.match(css, /@media\s*\(max-width:1080px\)/,
  'Missing responsive menu breakpoint');
assert.match(css, /\.mobile-nav:not\(\[hidden\]\)/,
  'Menu expanded state missing');
assert.match(css, /\.skip-link:focus\s*\{/,
  'Skip-link keyboard focus state missing');
console.log(`UX structure OK: ${checked} pages, mobile menu and skip-link contracts.`);
