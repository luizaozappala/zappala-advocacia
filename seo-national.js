const fs = require('fs');
const path = require('path');

const root = __dirname;
const dist = path.join(root, 'dist');
const nationalPages = [
  'direito-civil-patrimonial.html',
  'direito-imobiliario.html',
  'familia-sucessoes.html',
  'inventario-partilha.html'
];
const oldLocalPages = [
  'direito-civil-patrimonial-belo-horizonte.html',
  'direito-imobiliario-belo-horizonte.html',
  'familia-sucessoes-belo-horizonte.html',
  'inventario-belo-horizonte.html'
];

function injectStylesheet(html, href) {
  const tag = `<link rel="stylesheet" href="${href}">`;
  return html.includes(href) ? html : html.replace('</head>', `${tag}\n</head>`);
}

function injectBrandLogo(html) {
  const logo = '<img src="/assets/logo-zappala-header.svg" alt="Zappalá Advocacia &amp; Consultoria" width="300" height="88">';
  return html.replace(/(<a\b[^>]*class="[^"]*\bbrand\b[^"]*"[^>]*>)[\s\S]*?(<\/a>)/g, `$1${logo}$2`);
}

for (const page of nationalPages) {
  let html = fs.readFileSync(path.join(root, page), 'utf8');
  html = injectStylesheet(html, 'assets/site-atmosphere.css');
  html = injectStylesheet(html, 'assets/brand-header.css');
  html = injectBrandLogo(html);
  fs.writeFileSync(path.join(dist, page), html);
}
for (const page of oldLocalPages) {
  fs.rmSync(path.join(dist, page), { force: true });
}

const homePath = path.join(dist, 'index.html');
let home = fs.readFileSync(homePath, 'utf8');
home = home
  .replace('<title>Zappalá Advocacia &amp; Consultoria | Advocacia em Belo Horizonte</title>', '<title>Zappalá Advocacia &amp; Consultoria | Direito Civil, Família e Negócios</title>')
  .replace('<meta name="description" content="Escritório de advocacia em Belo Horizonte com atuação em Direito Civil e Imobiliário, Família e Sucessões, Empresarial, Tributário, Trabalhista e Previdenciário.">', '<meta name="description" content="Escritório de advocacia com atendimento online para clientes em todo o Brasil e presencial em Belo Horizonte/MG. Atuação em Direito Civil, Imobiliário, Família, Sucessões e áreas empresariais.">')
  .replace('<meta property="og:title" content="Zappalá Advocacia &amp; Consultoria | Belo Horizonte">', '<meta property="og:title" content="Zappalá Advocacia &amp; Consultoria">')
  .replace('<meta property="og:description" content="Atuação jurídica em Belo Horizonte para pessoas, famílias e empresas, em questões pessoais, patrimoniais e empresariais.">', '<meta property="og:description" content="Atuação jurídica para pessoas, famílias e empresas, com atendimento online em todo o Brasil e presencial em Belo Horizonte/MG.">')
  .replace('<p class="hero__sub">Atuação jurídica em Belo Horizonte, com atendimento presencial mediante agendamento e por videoconferência, em questões pessoais, patrimoniais e empresariais.</p>', '<p class="hero__sub">Atuação jurídica em questões pessoais, patrimoniais e empresariais, com atendimento por videoconferência para clientes em todo o Brasil e presencial em Belo Horizonte/MG, mediante agendamento.</p>')
  .replaceAll('direito-civil-patrimonial-belo-horizonte.html', 'direito-civil-patrimonial.html')
  .replaceAll('direito-imobiliario-belo-horizonte.html', 'direito-imobiliario.html')
  .replaceAll('familia-sucessoes-belo-horizonte.html', 'familia-sucessoes.html')
  .replaceAll('inventario-belo-horizonte.html', 'inventario-partilha.html')
  .replace('<p class="contact-alt">Atendimento presencial em Belo Horizonte/MG, mediante agendamento, e atendimento por videoconferência.</p>', '<p class="contact-alt">Atendimento por videoconferência para clientes em todo o Brasil e presencial em Belo Horizonte/MG, mediante agendamento.</p>')
  .replace('<div><div class="foot-title">Zappalá Advocacia &amp; Consultoria</div><p>Escritório de advocacia em Belo Horizonte/MG. Atendimento presencial mediante agendamento e por videoconferência.</p></div>', '<div><div class="foot-title">Zappalá Advocacia &amp; Consultoria</div><p>Atendimento online para clientes em todo o Brasil e presencial em Belo Horizonte/MG, mediante agendamento.</p></div>');

const legalService = `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'Zappalá Advocacia & Consultoria',
  url: 'https://zappala.adv.br/',
  logo: 'https://zappala.adv.br/assets/logo-zappala-header.svg',
  telephone: '+55-31-98955-3592',
  email: 'luiza.zappala.adv@gmail.com',
  areaServed: { '@type': 'Country', name: 'Brasil' },
  address: { '@type': 'PostalAddress', addressLocality: 'Belo Horizonte', addressRegion: 'MG', addressCountry: 'BR' },
  knowsAbout: ['Direito Civil','Direito Imobiliário','Direito de Família','Direito das Sucessões','Direito Empresarial','Direito Tributário','Direito do Trabalho','Direito Previdenciário']
})}</script>`;
home = home.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, legalService);
fs.writeFileSync(homePath, home);

const equipePath = path.join(dist, 'equipe.html');
let equipe = fs.readFileSync(equipePath, 'utf8');
equipe = equipe
  .replace('<title>Equipe Jurídica em Belo Horizonte | Zappalá Advocacia</title>', '<title>Equipe | Zappalá Advocacia &amp; Consultoria</title>')
  .replace('<meta name="description" content="Conheça a equipe da Zappalá Advocacia & Consultoria, escritório com atendimento jurídico em Belo Horizonte/MG e por videoconferência.">', '<meta name="description" content="Conheça a equipe da Zappalá Advocacia & Consultoria. Atendimento jurídico online para clientes em todo o Brasil e presencial em Belo Horizonte/MG.">');
fs.writeFileSync(equipePath, equipe);

const infoPath = path.join(dist, 'informativos.html');
let info = fs.readFileSync(infoPath, 'utf8');
info = info
  .replace('<title>Informativos Jurídicos | Zappalá Advocacia - Belo Horizonte</title>', '<title>Informativos Jurídicos | Zappalá Advocacia &amp; Consultoria</title>')
  .replace('<meta name="description" content="Artigos, notícias e guias jurídicos da Zappalá Advocacia & Consultoria, com atuação em Belo Horizonte/MG.">', '<meta name="description" content="Artigos, notícias e guias jurídicos da Zappalá Advocacia & Consultoria sobre Direito Civil, Imobiliário, Família, Sucessões e temas empresariais.">');
fs.writeFileSync(infoPath, info);

let posts = [];
const postsPath = path.join(dist, 'data', 'informativos.json');
if (fs.existsSync(postsPath)) posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
const baseUrl = 'https://zappala.adv.br';
const urls = [
  `${baseUrl}/`,
  `${baseUrl}/equipe.html`,
  `${baseUrl}/informativos.html`,
  ...nationalPages.map((page) => `${baseUrl}/${page}`),
  ...posts.map((post) => `${baseUrl}/publicacao.html?slug=${encodeURIComponent(post.slug)}`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url.replace(/&/g, '&amp;')}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);

console.log('SEO nacional aplicado: atendimento online Brasil + presença local em Belo Horizonte.');
