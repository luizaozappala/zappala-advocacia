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
const street = 'Rua Maquiné, 261';

for (const filename of pages) {
  const html = fs.readFileSync(path.join(dist, filename), 'utf8');
  assert.ok(html.includes(street), `Public street address absent: ${filename}`);
  assert.ok(html.includes('Belo Horizonte/MG'), `City missing in public contact: ${filename}`);
  assert.ok(html.includes('tel:+5531992377158'), `Phone call action missing: ${filename}`);
  assert.ok(html.includes(displayedPhone), `Human-readable phone missing: ${filename}`);
  assert.ok(html.includes('hora marcada'), `Appointment-only wording missing: ${filename}`);
  assert.ok(html.includes('www.google.com/maps/search/'), `Address-only map search missing: ${filename}`);

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
  assert.equal(service.address?.streetAddress, street);
  assert.equal(service.address?.addressLocality, 'Belo Horizonte');
  assert.equal(service.address?.addressRegion, 'MG');
  assert.equal(service.address?.addressCountry, 'BR');
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
console.log(`Local SEO OK: ${pages.length} public pages, unified NAP, calls, local service schema and headings.`);
