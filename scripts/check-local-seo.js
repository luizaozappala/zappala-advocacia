// Local SEO invariants for the public, appointment-only Zappalá office.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dist = path.resolve(__dirname, '..', 'dist');
const pages = [
  'index.html', 'equipe.html',
  'direito-civil-patrimonial.html', 'direito-imobiliario.html',
  'familia-sucessoes.html', 'inventario-partilha.html'
];
const practicePages = pages.slice(2);
const businessId = 'https://zappala.adv.br/#escritorio';
const phone = '+55-31-99237-7158';
const displayedPhone = '(31) 99237-7158';
const prohibitedStreet = /Rua Maquin[ée],?\s*261/i;

for (const filename of pages) {
  const html = fs.readFileSync(path.join(dist, filename), 'utf8');
  assert.doesNotMatch(html, prohibitedStreet, `Reference-only address must not be public: ${filename}`);
  assert.ok(html.includes('Belo Horizonte'), `City missing in public contact: ${filename}`);
  assert.ok(html.includes('tel:+5531992377158'), `Phone call action missing: ${filename}`);
  assert.ok(html.includes(displayedPhone), `Human-readable phone missing: ${filename}`);
  assert.match(html, /(?:local combinado previamente|hora marcada)/, `Appointment arrangement missing: ${filename}`);
  assert.ok(!html.includes('www.google.com/maps/search/'), `Reference-address map search must be removed: ${filename}`);

  const ldNodes = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap(m => {
      const parsed = JSON.parse(m[1]);
      return Array.isArray(parsed) ? parsed : [parsed];
    });
  if (filename === 'equipe.html') continue;
  const service = ldNodes.find(n => n['@type'] === 'LegalService');
  assert.ok(service, `LegalService structured data absent: ${filename}`);
  assert.equal(service['@id'], businessId, `Business identifier inconsistent: ${filename}`);
  assert.equal(service.name, 'Zappalá Advocacia & Consultoria');
  assert.equal(service.telephone, phone);
  assert.ok(!service.address, `Do not publish a fixed-address schema: ${filename}`);
  assert.ok(service.areaServed?.some(a => a.name === 'Belo Horizonte'),
    `Service area should include Belo Horizonte: ${filename}`);
  assert.ok(!service.address?.postalCode, `Postal code must be confirmed before publishing: ${filename}`);
  assert.ok(!service.openingHoursSpecification, `Do not invent business hours: ${filename}`);
  assert.ok(!service.aggregateRating && !service.review, `Do not invent reviews: ${filename}`);
  if (practicePages.includes(filename)) {
    assert.match(html, /<title>[^<]*Belo Horizonte[^<]*<\/title>/,
      `Local title not specific: ${filename}`);
  }
}

const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
assert.match(home, /href="\/inventario-partilha"/, 'Missing internal inventory link');
assert.match(home, /href="\/direito-civil-patrimonial"/, 'Missing internal civil link');
console.log(`Local SEO OK: ${pages.length} public pages, no misleading address, click-to-call, area-served schema and headings.`);
