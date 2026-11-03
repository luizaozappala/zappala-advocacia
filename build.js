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
  ['/', 'Início', 'index.html'],
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
    `<a class="brand" href="/"><img src="/assets/logo-zappala.svg" alt="Zappalá advocacia &amp; consultoria" width="190" height="58"></a>` +
    `<div class="masthead__right"><nav class="nav" aria-label="Navegação principal">${links}</nav>` +
    `<a class="masthead__cta" href="/#contato">Falar com o escritório</a></div></div></header>`;
}

const footer = `<footer><div class="wrap">
<div class="foot-grid">
<div><a class="foot-logo" href="/"><img src="/assets/logo-zappala-escuro.svg" alt="Zappalá advocacia &amp; consultoria" width="200" height="62"></a>
<p class="foot-assinatura">Uma advocacia que começa pela atenção aos detalhes.</p></div>
<div><h4>Contato</h4><p>WhatsApp <a href="https://wa.me/5531989553592">(31) 98955-3592</a><br><a href="mailto:luiza.zappala.adv@gmail.com">luiza.zappala.adv@gmail.com</a><br>Instagram <a href="https://www.instagram.com/zappala.adv/" target="_blank" rel="noopener">@zappala.adv</a></p>
<p style="margin-top:14px">Presencial em Belo Horizonte/MG, com hora marcada.<br>Por vídeo em todo o Brasil.</p></div>
<div><h4>Navegação</h4><p><a href="/#areas">Em que ajudamos</a><br><a href="/#retorno">Acompanhamento do caso</a><br><a href="/#atendimento">Como funciona</a><br><a href="/equipe.html">Equipe</a><br><a href="/informativos.html">Informativos</a></p></div>
</div>
<div class="foot-legal">Gleice Zappalá, advogada inscrita na OAB/MG sob o nº 145.047. Zappalá Advocacia &amp; Consultoria. Não atuamos na área criminal.<br><br>Conteúdo informativo, de acordo com o Código de Ética e Disciplina da OAB e o Provimento CFOAB nº 205/2021. As informações deste site não são promessa de resultado e não substituem a análise do seu caso.<br><br>As informações que você enviar por WhatsApp ou e-mail são usadas para verificar disponibilidade, conflito de interesses e uma eventual contratação, de acordo com a Lei Geral de Proteção de Dados.</div>
</div></footer>`;

const legalService = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'Zappalá Advocacia & Consultoria',
  url: `${baseUrl}/`,
  logo: `${baseUrl}/assets/logo-zappala.svg`,
  telephone: '+55-31-98955-3592',
  email: 'luiza.zappala.adv@gmail.com',
  sameAs: ['https://www.instagram.com/zappala.adv/'],
  areaServed: [{ '@type': 'City', name: 'Belo Horizonte' }, { '@type': 'Country', name: 'Brasil' }],
  address: { '@type': 'PostalAddress', addressLocality: 'Belo Horizonte', addressRegion: 'MG', addressCountry: 'BR' },
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
  html = html.replace(/<header class="masthead">[\s\S]*?<\/header>/, header(page));
  html = html.replace(/<footer>[\s\S]*?<\/footer>/, footer);
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

const urls = [
  `${baseUrl}/`,
  `${baseUrl}/equipe.html`,
  `${baseUrl}/informativos.html`,
  ...practicePages.map((page) => `${baseUrl}/${page}`),
  ...posts.map((post) => `${baseUrl}/publicacao.html?slug=${encodeURIComponent(post.slug)}`)
];
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.replace(/&/g, '&amp;')}</loc></url>`).join('\n')}\n</urlset>\n`
);

console.log(`Build concluído: ${pages.length} páginas, ${posts.length} publicação(ões).`);
