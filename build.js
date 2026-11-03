// Build do site zappala.adv.br (Cloudflare Workers, pasta dist/).
// Copia as páginas, aplica cabeçalho e rodapé únicos da identidade v2,
// gera o índice dos informativos e o sitemap.
const fs = require('fs');
const path = require('path');

const root = __dirname;
const dist = path.join(root, 'dist');
const sourceDir = path.join(root, 'source');
const contentDir = path.join(root, 'content', 'informativos');
const baseUrl = 'https://zappala.adv.br';
const localAddress = Object.freeze({
  '@type': 'PostalAddress',
  streetAddress: 'Rua Maquiné, 261',
  addressLocality: 'Belo Horizonte',
  addressRegion: 'MG',
  addressCountry: 'BR'
});
const localBusinessId = `${baseUrl}/#escritorio`;

const canonicalPath = (filename) => filename === 'index.html' ? '/' : '/' + filename.replace(/\.html$/, '');
const canonicalUrl = (filename) => baseUrl + canonicalPath(filename);


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
const practicePages = pages.slice(5);

const nav = [
  ['/#areas', 'Em que ajudamos', null],
  ['/#atendimento', 'Como funciona', null],
  ['/equipe.html', 'Equipe', 'equipe.html'],
  ['/informativos.html', 'Informativos', 'informativos.html']
];

function header(page) {
  const links = nav
    .map(([href, label, owner]) => `<a href="${href}"${owner === page ? ' class="is-current" aria-current="page"' : ''}>${label}</a>`)
    .join('');
  return `<header class="masthead"><div class="masthead__inner">` +
    `<a class="brand" href="/"><img src="/assets/logo-zappala-escuro.svg" alt="Zappalá advocacia &amp; consultoria" width="236" height="73"></a>` +
    `<div class="masthead__right"><nav class="nav" aria-label="Navegação principal">${links}</nav>` +
    `<button class="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobile-navigation">Menu</button>` +
    `<a class="masthead__cta" href="/#contato">Falar com o escritório</a></div></div>` +
    `<nav class="mobile-nav" id="mobile-navigation" aria-label="Navegação para celular" hidden>${links}<a class="mobile-nav__cta" href="/#contato">Falar com o escritório</a></nav></header>` +
    `<script>(function(){var h=document.querySelector('.masthead');var button=h.querySelector('.menu-toggle');var menu=h.querySelector('#mobile-navigation');function solid(){h.classList.toggle('is-solid',window.scrollY>24||!menu.hidden)}function close(){menu.hidden=true;button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Abrir menu');solid()}button.addEventListener('click',function(){if(menu.hidden){menu.hidden=false;button.setAttribute('aria-expanded','true');button.setAttribute('aria-label','Fechar menu');solid()}else{close()}});menu.addEventListener('click',function(e){if(e.target.closest('a'))close()});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden){close();button.focus()}});document.addEventListener('click',function(e){if(!menu.hidden&&!h.contains(e.target))close()});window.addEventListener('resize',function(){if(window.innerWidth>1080&&!menu.hidden)close()});solid();window.addEventListener('scroll',solid,{passive:true});})();</script>`;
}

const footer = `<footer><div class="wrap">
<div class="foot-grid">
<div><a class="foot-logo" href="/"><img src="/assets/logo-zappala-escuro.svg" alt="Zappalá advocacia &amp; consultoria" width="200" height="62"></a>
<p class="foot-assinatura">Uma advocacia que começa pela atenção aos detalhes.</p></div>
<div><h4>Contato</h4><p>WhatsApp <a href="https://wa.me/5531992377158">(31) 99237-7158</a><br>Ligações <a href="tel:+5531992377158">(31) 99237-7158</a><br><a href="mailto:luiza.zappala.adv@gmail.com">luiza.zappala.adv@gmail.com</a><br>Instagram <a href="https://www.instagram.com/zappala.adv/" target="_blank" rel="noopener">@zappala.adv</a></p>
<p class="foot-address" style="margin-top:14px">Endereço para atendimento agendado:<br>Rua Maquiné, 261 — Belo Horizonte/MG<br><a href="https://www.google.com/maps/search/?api=1&amp;query=Rua%20Maquin%C3%A9%2C%20261%2C%20Belo%20Horizonte%2C%20MG">Consultar endereço no mapa</a></p>
<p style="margin-top:14px">Atendimento presencial somente com hora marcada.<br>Por vídeo em todo o Brasil.</p></div>
<div><h4>Navegação</h4><p><a href="/#areas">Em que ajudamos</a><br><a href="/#retorno">Acompanhamento do caso</a><br><a href="/#atendimento">Como funciona</a><br><a href="/equipe.html">Equipe</a><br><a href="/informativos.html">Informativos</a></p></div>
</div>
<div class="foot-legal">Gleice Zappalá, advogada inscrita na OAB/MG sob o nº 145.047. Zappalá Advocacia &amp; Consultoria.<br><br>Conteúdo informativo, de acordo com o Código de Ética e Disciplina da OAB e o Provimento CFOAB nº 205/2021. As informações deste site não são promessa de resultado e não substituem a análise do seu caso.<br><br>As informações que você enviar por WhatsApp ou e-mail são usadas para verificar disponibilidade, conflito de interesses e uma eventual contratação, de acordo com a Lei Geral de Proteção de Dados.</div>
</div></footer>`;

const legalService = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'Zappalá Advocacia & Consultoria',
  url: `${baseUrl}/`,
  logo: `${baseUrl}/assets/logo-zappala.svg`,
  telephone: '+55-31-99237-7158',
  email: 'luiza.zappala.adv@gmail.com',
  sameAs: ['https://www.instagram.com/zappala.adv/'],
  areaServed: [{ '@type': 'City', name: 'Belo Horizonte' }, { '@type': 'Country', name: 'Brasil' }],
  '@id': localBusinessId,
  address: localAddress,
  knowsAbout: [
    'Direito do Trabalho', 'Direito Previdenciário', 'Direito de Família', 'Direito das Sucessões',
    'Direito do Consumidor', 'Direito de Trânsito', 'Direito Civil', 'Direito Imobiliário', 'Direito Tributário'
  ]
};

const oldStyles = /<link[^>]+href="(?:\/)?assets\/(?:site-atmosphere|brand-header|team-section|practice-page|site-motion)\.css"[^>]*>\s*/g;
const googleFonts = /<link[^>]+(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>\s*/g;
const oldScripts = /<script[^>]+src="(?:\/)?assets\/site-motion\.js"[^>]*><\/script>\s*/g;

function transform(page, html) {
  html = html.replace(googleFonts, '').replace(oldStyles, '').replace(oldScripts, '');
  if (!html.includes('zappala-v2.css')) {
    html = html.replace('</head>', '<link rel="stylesheet" href="/assets/zappala-v2.css">\n</head>');
  } else {
    html = html.replace('href="assets/zappala-v2.css"', 'href="/assets/zappala-v2.css"');
  }
  if (!html.includes('rel="icon"')) {
    html = html.replace('</head>', '<link rel="icon" href="/assets/simbolo-zappala.svg" type="image/svg+xml">\n</head>');
  }
  // Atalho para leitores de tela/teclado em todas as páginas.
  html = html.replace(/<body([^>]*)>/i, '<body$1><a class="skip-link" href="#conteudo">Pular para o conteúdo</a>');
  html = html.replace(/<main\b(?![^>]*\bid\s*=)/i, '<main id="conteudo"');
  html = html.replace(/<main\b(?![^>]*\btabindex\s*=)/i, '<main tabindex="-1"');

  // Cloudflare Workers serves file.html at /file; keep the canonical,
  // sitemap and internal links aligned with the final URL.
  if (page !== '404.html' && page !== 'publicacao.html') {
    const url = canonicalUrl(page);
    if (/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i.test(html)) {
      html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, '<link rel="canonical" href="' + url + '">');
    } else {
      html = html.replace('</head>', '<link rel="canonical" href="' + url + '">\n</head>');
    }
    html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/i, '$1' + url + '$2');
  }
  html = html.replace(/<header class="masthead">[\s\S]*?<\/header>/, header(page));
  html = html.replace(/<footer>[\s\S]*?<\/footer>/, footer);
  // All published service pages describe the same office, not separate branches.
  // Reconcile JSON-LD NAP with visible contact information on every page.
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (match, raw) => {
    try {
      const node = JSON.parse(raw);
      if (node['@type'] === 'LegalService') {
        node['@id'] = localBusinessId;
        node.name = 'Zappalá Advocacia & Consultoria';
        node.address = localAddress;
        node.telephone = '+55-31-99237-7158';
        return '<script type="application/ld+json">' + JSON.stringify(node) + '</script>';
      }
    } catch (error) {
      console.warn('JSON-LD original mantido: ' + error.message);
    }
    return match;
  });

  // Avoid sending visitors and crawlers through Cloudflare's .html redirects.
  html = html.replace(/href="(?:\.\/|\/)?index\.html(#[^"]*)?"/g, (_m, hash = '') => 'href="/' + hash + '"');
  html = html.replace(/href="(?:\.\/|\/)?(equipe|informativos|direito-civil-patrimonial|direito-imobiliario|familia-sucessoes|inventario-partilha)\.html(#[^"]*)?"/g,
    (_m, route, hash = '') => 'href="/' + route + hash + '"');
  html = html.replace(/publicacao\.html\?slug=/g, '/publicacao?slug=');
  // página individual de publicação usa um cabeçalho próprio (.mast)
  html = html.replace(/(<a\b[^>]*class="[^"]*\bbrand\b[^"]*"[^>]*>)(?!<img)[\s\S]*?(<\/a>)/g,
    '$1<img src="/assets/logo-zappala.svg" alt="Zappalá advocacia &amp; consultoria" width="170" height="52">$2');
  // trechos antigos com tom de "núcleo jurídico" nas páginas de área
  html = html
    .replaceAll('<p>Atuação jurídica para pessoas, famílias e empresas.</p>', '<p>Advocacia para pessoas, famílias e pequenas empresas.</p>')
    .replaceAll('index.html#areas', '/#areas')
    .replaceAll('index.html#contato', '/#contato')
    .replaceAll('index.html#atendimento', '/#atendimento');
  if (page === 'index.html') {
    const ld = `<script type="application/ld+json">${JSON.stringify(legalService)}</script>`;
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '');
    html = html.replace('</head>', `${ld}\n</head>`);
  }
  return html;
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const page of pages) {
  const src = path.join(root, page);
  if (!fs.existsSync(src)) throw new Error(`Página ausente: ${page}`);
  fs.writeFileSync(path.join(dist, page), transform(page, fs.readFileSync(src, 'utf8')));
}
if (fs.existsSync(path.join(root, 'robots.txt'))) fs.copyFileSync(path.join(root, 'robots.txt'), path.join(dist, 'robots.txt'));

for (const dir of ['assets', 'admin']) {
  const src = path.join(root, dir);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(dist, dir), { recursive: true });
}

// fotos da equipe ficam guardadas em base64 em source/
for (const name of ['gleice-zappala.webp', 'luiza-zappala.webp']) {
  const packed = path.join(sourceDir, `${name}.b64`);
  if (!fs.existsSync(packed)) throw new Error(`Foto ausente: ${name}`);
  fs.writeFileSync(path.join(dist, 'assets', name), Buffer.from(fs.readFileSync(packed, 'utf8').trim(), 'base64'));
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
fs.mkdirSync(path.join(dist, 'data'), { recursive: true });
fs.writeFileSync(path.join(dist, 'data', 'informativos.json'), JSON.stringify(posts, null, 2));

// Do not index an empty editorial collection or a soft-404 article template.
// When the CMS publishes its first post, the files become public as before;
// proper server-rendered article pages remain a separate SEO follow-up.
if (posts.length === 0) {
  const listing = path.join(dist, 'informativos.html');
  let listingHtml = fs.readFileSync(listing, 'utf8');
  listingHtml = listingHtml.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    '<meta name="robots" content="noindex,follow">');
  fs.writeFileSync(listing, listingHtml);
  fs.rmSync(path.join(dist, 'publicacao.html'), { force: true });
}

const urls = [
  canonicalUrl('index.html'),
  canonicalUrl('equipe.html'),
  ...(posts.length ? [canonicalUrl('informativos.html')] : []),
  ...practicePages.map(canonicalUrl),
  ...posts.map((post) => `${baseUrl}/publicacao?slug=${encodeURIComponent(post.slug)}`)
];
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.replace(/&/g, '&amp;')}</loc></url>`).join('\n')}\n</urlset>\n`
);

console.log(`Build concluído: ${pages.length} páginas, ${posts.length} publicação(ões).`);
