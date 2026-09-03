const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = __dirname;
const dist = path.join(root, 'dist');
const sourceDir = path.join(root, 'source');
const contentDir = path.join(root, 'content', 'informativos');

const practicePages = [
  'direito-civil-patrimonial-belo-horizonte.html',
  'direito-imobiliario-belo-horizonte.html',
  'familia-sucessoes-belo-horizonte.html',
  'inventario-belo-horizonte.html'
];

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

function improveHomeSeo() {
  const htmlPath = path.join(dist, 'index.html');
  if (!fs.existsSync(htmlPath)) return;
  let html = fs.readFileSync(htmlPath, 'utf8');

  html = html
    .replace('<title>Zappalá Advocacia &amp; Consultoria | Pessoas, famílias e negócios</title>', '<title>Zappalá Advocacia &amp; Consultoria | Advocacia em Belo Horizonte</title>')
    .replace('<meta name="description" content="Zappalá Advocacia &amp; Consultoria. Atuação jurídica para pessoas, famílias e negócios em questões pessoais, patrimoniais e empresariais.">', '<meta name="description" content="Escritório de advocacia em Belo Horizonte com atuação em Direito Civil e Imobiliário, Família e Sucessões, Empresarial, Tributário, Trabalhista e Previdenciário.">')
    .replace('<link rel="canonical" href="https://zappala.adv.br/index.html">', '<link rel="canonical" href="https://zappala.adv.br/">')
    .replace('<meta property="og:title" content="Zappalá Advocacia &amp; Consultoria">', '<meta property="og:title" content="Zappalá Advocacia &amp; Consultoria | Belo Horizonte">')
    .replace('<meta property="og:description" content="Advocacia para pessoas, famílias e negócios em questões pessoais, patrimoniais e empresariais.">', '<meta property="og:description" content="Atuação jurídica em Belo Horizonte para pessoas, famílias e empresas, em questões pessoais, patrimoniais e empresariais.">')
    .replace('<meta property="og:url" content="https://zappala.adv.br/index.html">', '<meta property="og:url" content="https://zappala.adv.br/">')
    .replace('<p class="hero__sub">Atuação processual em questões pessoais, patrimoniais e empresariais.</p>', '<p class="hero__sub">Atuação jurídica em Belo Horizonte, com atendimento presencial mediante agendamento e por videoconferência, em questões pessoais, patrimoniais e empresariais.</p>')
    .replace('<div class="practice-group__areas">Contratos · Responsabilidade civil · Cobranças · Relações de consumo · Imóveis</div>', '<div class="practice-group__areas">Contratos · Responsabilidade civil · Cobranças · Relações de consumo · Imóveis</div><a class="text-link" href="direito-civil-patrimonial-belo-horizonte.html">Direito Civil e Patrimonial</a><br><a class="text-link" href="direito-imobiliario-belo-horizonte.html">Direito Imobiliário</a>')
    .replace('<div class="practice-group__areas">Divórcio e união estável · Guarda e alimentos · Inventário e partilha · Planejamento sucessório</div>', '<div class="practice-group__areas">Divórcio e união estável · Guarda e alimentos · Inventário e partilha · Planejamento sucessório</div><a class="text-link" href="familia-sucessoes-belo-horizonte.html">Família e Sucessões</a><br><a class="text-link" href="inventario-belo-horizonte.html">Inventário e Partilha</a>')
    .replace('<p class="contact-alt">Atendimento presencial mediante agendamento e atendimento por vídeo.</p>', '<p class="contact-alt">Atendimento presencial em Belo Horizonte/MG, mediante agendamento, e atendimento por videoconferência.</p>')
    .replace('<div><div class="foot-title">Zappalá Advocacia &amp; Consultoria</div><p>Atuação jurídica para pessoas, famílias e empresas.</p></div>', '<div><div class="foot-title">Zappalá Advocacia &amp; Consultoria</div><p>Escritório de advocacia em Belo Horizonte/MG. Atendimento presencial mediante agendamento e por videoconferência.</p></div>');

  if (!html.includes('<meta name="robots"')) {
    html = html.replace('<meta name="viewport" content="width=device-width, initial-scale=1.0">', '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="robots" content="index, follow">');
  }

  const jsonLd = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Zappalá Advocacia & Consultoria',
    url: 'https://zappala.adv.br/',
    logo: 'https://zappala.adv.br/assets/logo-zappala-header.svg',
    telephone: '+55-31-98955-3592',
    email: 'luiza.zappala.adv@gmail.com',
    areaServed: { '@type': 'City', name: 'Belo Horizonte' },
    knowsAbout: [
      'Direito Civil',
      'Direito Imobiliário',
      'Direito de Família',
      'Direito das Sucessões',
      'Direito Empresarial',
      'Direito Tributário',
      'Direito do Trabalho',
      'Direito Previdenciário'
    ]
  })}</script>`;
  if (!html.includes('"@type":"LegalService"')) html = html.replace('</head>', `${jsonLd}\n</head>`);

  fs.writeFileSync(htmlPath, html);
}

function improveSecondarySeo() {
  const equipePath = path.join(dist, 'equipe.html');
  if (fs.existsSync(equipePath)) {
    let html = fs.readFileSync(equipePath, 'utf8');
    html = html
      .replace('<title>Equipe | Zappalá Advocacia &amp; Consultoria</title>', '<title>Equipe Jurídica em Belo Horizonte | Zappalá Advocacia</title>')
      .replace('<meta name="description" content="Conheça a equipe da Zappalá Advocacia &amp; Consultoria.">', '<meta name="description" content="Conheça a equipe da Zappalá Advocacia & Consultoria, escritório com atendimento jurídico em Belo Horizonte/MG e por videoconferência.">');
    if (!html.includes('<meta name="robots"')) html = html.replace('<meta name="viewport" content="width=device-width, initial-scale=1.0">', '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="robots" content="index, follow">');
    fs.writeFileSync(equipePath, html);
  }

  const infoPath = path.join(dist, 'informativos.html');
  if (fs.existsSync(infoPath)) {
    let html = fs.readFileSync(infoPath, 'utf8');
    html = html
      .replace('<title>Informativos | Zappalá Advocacia &amp; Consultoria</title>', '<title>Informativos Jurídicos | Zappalá Advocacia - Belo Horizonte</title>')
      .replace('<meta name="description" content="Notícias, artigos e guias jurídicos da Zappalá Advocacia &amp; Consultoria.">', '<meta name="description" content="Artigos, notícias e guias jurídicos da Zappalá Advocacia & Consultoria, com atuação em Belo Horizonte/MG.">');
    fs.writeFileSync(infoPath, html);
  }
}

materializeHtml('index.html');
materializeHtml('equipe.html');
for (const page of practicePages) materializeHtml(page);

for (const name of ['informativos.html', 'publicacao.html', '404.html', 'robots.txt']) {
  const src = path.join(root, name);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dist, name));
}

for (const dir of ['assets', 'admin']) {
  const src = path.join(root, dir);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(dist, dir), { recursive: true });
}

const brandedPages = ['index.html', 'equipe.html', 'informativos.html', 'publicacao.html', '404.html', ...practicePages];
for (const name of brandedPages) {
  injectStylesheet(name, 'assets/site-atmosphere.css');
  injectStylesheet(name, 'assets/brand-header.css');
  injectBrandLogo(name);
}

injectStylesheet('index.html', 'assets/team-section.css');
improveHomeSeo();
improveSecondarySeo();

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
  ...practicePages.map((page) => `${baseUrl}/${page}`),
  ...posts.map((post) => `${baseUrl}/publicacao.html?slug=${encodeURIComponent(post.slug)}`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url.replace(/&/g, '&amp;')}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);

console.log(`Build concluído: ${posts.length} publicação(ões) em Informativos e ${practicePages.length} página(s) de atuação.`);