// SEO invariants for Cloudflare Workers' extensionless HTML URLs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dist = path.resolve(__dirname, '..', 'dist');
const base = 'https://zappala.adv.br';
const indexablePages = [
  'index.html', 'equipe.html',
  'direito-civil-patrimonial.html', 'direito-imobiliario.html',
  'familia-sucessoes.html', 'inventario-partilha.html',
  'direito-trabalho.html', 'direito-previdenciario.html', 'direito-consumidor.html', 'direito-transito.html', 'isencao-ipva-autismo-pcd.html',
  'suspensao-cnh.html', 'cassacao-cnh.html', 'lei-seca.html', 'recusa-bafometro.html', 'recurso-multas-transito.html', 'pontos-cnh.html', 'acidente-transito-indenizacao.html', 'transferencia-veiculo-multas.html', 'divorcio-partilha.html', 'guarda-convivencia.html', 'pensao-alimenticia.html', 'uniao-estavel.html', 'usucapiao.html', 'cobranca-indevida-negativacao.html', 'golpe-pix.html'
];
const posts = JSON.parse(fs.readFileSync(path.join(dist, 'data', 'informativos.json'), 'utf8'));
const publishedPages = posts.length ? [...indexablePages, 'informativos.html'] : indexablePages;
const siteUrls = [];

for (const page of publishedPages) {
  const html = fs.readFileSync(path.join(dist, page), 'utf8');
  const expected = base + (page === 'index.html' ? '/' : '/' + page.replace(/\.html$/, ''));
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  assert.equal(canonical, expected, `Canonical must match Workers route: ${page}`);
  assert.match(html, /<title>[^<]+<\/title>/i, `Missing title: ${page}`);
  assert.match(html, /<meta\s+name="description"\s+content="[^"]+"/i,
    `Missing description: ${page}`);
  assert.doesNotMatch(html, /<meta\s+name="robots"\s+content="[^"]*noindex/i,
    `Indexable page marked noindex: ${page}`);
  assert.doesNotMatch(html, /href="(?:\.\/|\/)?(?:index|equipe|informativos|direito-civil-patrimonial|direito-imobiliario|familia-sucessoes|inventario-partilha|direito-trabalho|direito-previdenciario|direito-consumidor|direito-transito|isencao-ipva-autismo-pcd|suspensao-cnh|cassacao-cnh|lei-seca|recusa-bafometro|recurso-multas-transito|pontos-cnh|acidente-transito-indenizacao|transferencia-veiculo-multas|divorcio-partilha|guarda-convivencia|pensao-alimenticia|uniao-estavel|usucapiao|cobranca-indevida-negativacao|golpe-pix)\.html(?:#|")/,
    `Internal link still points to a redirected .html URL: ${page}`);
  siteUrls.push(expected);
}

const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(x => x[1].replace(/&amp;/g, '&'));
for (const url of siteUrls) {
  assert.ok(sitemapUrls.includes(url), `Indexable page absent from sitemap: ${url}`);
}
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'Duplicate sitemap URLs');
assert.ok(sitemapUrls.every(url => url.startsWith(base + '/')), 'External URL in sitemap');
if (!posts.length) {
  const listing = fs.readFileSync(path.join(dist, 'informativos.html'), 'utf8');
  assert.match(listing, /<meta\s+name="robots"\s+content="noindex,follow"/i,
    'Empty listing must not be indexable');
  assert.ok(!sitemapUrls.includes(base + '/informativos'),
    'Empty collection must not be listed in sitemap');
  assert.ok(!fs.existsSync(path.join(dist, 'publicacao.html')),
    'Empty article template should be 404, not soft 404');
}
console.log(`SEO structure OK: ${publishedPages.length} canonical pages, ${sitemapUrls.length} sitemap URLs, ${posts.length} published articles.`);
