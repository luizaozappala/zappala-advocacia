const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = __dirname;
const dist = path.join(root, 'dist');
const contentDir = path.join(root, 'content', 'informativos');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

function materializeHtml(name) {
  const direct = path.join(root, name);
  const packed = path.join(root, 'source', `${name}.gz.b64`);
  const target = path.join(dist, name);
  if (fs.existsSync(direct)) {
    fs.copyFileSync(direct, target);
    return;
  }
  if (!fs.existsSync(packed)) throw new Error(`Arquivo-fonte ausente: ${name}`);
  const compressed = Buffer.from(fs.readFileSync(packed, 'utf8').trim(), 'base64');
  fs.writeFileSync(target, zlib.gunzipSync(compressed));
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
