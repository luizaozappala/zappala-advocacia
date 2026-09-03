const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = __dirname;
const dist = path.join(root, 'dist');
const sourceDir = path.join(root, 'source');
const contentDir = path.join(root, 'content', 'informativos');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

function materializeHtml(name) {
  const direct = path.join(root, name);
  const packed = path.join(sourceDir, `${name}.gz.b64`);
  const target = path.join(dist, name);
  if (fs.existsSync(direct)) {
    fs.copyFileSync(direct, target);
    return;
  }
  if (!fs.existsSync(packed)) throw new Error(`Arquivo-fonte ausente: ${name}`);
  const compressed = Buffer.from(fs.readFileSync(packed, 'utf8').trim(), 'base64');
  fs.writeFileSync(target, zlib.gunzipSync(compressed));
}

function materializeBinary(targetName) {
  const packed = path.join(sourceDir, `${path.basename(targetName)}.b64`);
  const target = path.join(dist, targetName);
  if (!fs.existsSync(packed)) throw new Error(`Asset-fonte ausente: ${path.basename(targetName)}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, Buffer.from(fs.readFileSync(packed, 'utf8').trim(), 'base64'));
}

function injectStylesheet(htmlName, href) {
  const htmlPath = path.join(dist, htmlName);
  if (!fs.existsSync(htmlPath)) return;
  let html = fs.readFileSync(htmlPath, 'utf8');
  const tag = `<link rel="stylesheet" href="${href}">`;
  if (!html.includes(href)) html = html.replace('</head>', `${tag}\n</head>`);
  fs.writeFileSync(htmlPath, html);
}

function injectBrandLogo(htmlName) {
  const htmlPath = path.join(dist, htmlName);
  if (!fs.existsSync(htmlPath)) return;
  let html = fs.readFileSync(htmlPath, 'utf8');
  const logo = '<img src="/assets/logo-zappala-header.svg" alt="Zappalá Advocacia &amp; Consultoria" width="300" height="88">';
  html = html.replace(/(<a\b[^>]*class="[^"]*\bbrand\b[^"]*"[^>]*>)[\s\S]*?(<\/a>)/g, `$1${logo}$2`);
  fs.writeFileSync(htmlPath, html);
}

materializeHtml('index.html');
materializeHtml('equipe.html');

for (const name of ['informativos.html', 'publicacao.html', '404.html', 'robots.txt']) {
  const src = path.join(root, name);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dist, name));
}

for (const dir of ['assets', 'admin']) {
  const src = path.join(root, dir);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(dist, dir), { recursive: true });
}

for (const name of ['index.html', 'equipe.html', 'informativos.html', 'publicacao.html', '404.html']) {
  injectStylesheet(name, 'assets/site-atmosphere.css');
  injectStylesheet(name, 'assets/brand-header.css');
  injectBrandLogo(name);
}

injectStylesheet('index.html', 'assets/team-section.css');

materializeBinary('assets/gleice-zappala.webp');
materializeBinary('assets/luiza-zappala.webp');

let posts = [];
if (fs.existsSync(contentDir)) {
  for (const file of fs.readdirSync(contentDir).filter((f) => f.endsWith('.json'))) {
    try {
      const post = JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf8'));
      if (post.published === false) continue;
      post.slug = file.replace(/\.json$/i, '');
      posts.push(post);
    } catch (error) {
      console.warn(`Ignorando ${file}: ${error.message}`);
    }
  }
}
posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

const dataDir = path.join(dist, 'data');
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, 'informativos.json'), JSON.stringify(posts, null, 2));

const baseUrl = 'https://zappala.adv.br';
const urls = [
  `${baseUrl}/`,
  `${baseUrl}/equipe.html`,
  `${baseUrl}/informativos.html`,
  ...posts.map((post) => `${baseUrl}/publicacao.html?slug=${encodeURIComponent(post.slug)}`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url.replace(/&/g, '&amp;')}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);

console.log(`Build concluído: ${posts.length} publicação(ões) em Informativos.`);
