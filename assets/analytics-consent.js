/* Zappalá: Google Analytics 4 opcional (com consentimento). */
(function () {
  'use strict';

  const measurementId = 'G-V9DJTWBY1C';
  const storageKey = 'zappala_analytics_consent_v1';
  let activated = false;
  let panel = null;
  let preferencesButton = null;
  let temporaryChoice = null;

  function choice() {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored === 'accepted' || stored === 'denied' ? stored : temporaryChoice;
    } catch (_) { return temporaryChoice; }
  }

  function save(value) {
    temporaryChoice = value;
    try { window.localStorage.setItem(storageKey, value); } catch (_) {}
  }

  function pageLocation() {
    // Keep campaign attribution; exclude unknown/sensitive query parameters.
    const url = new URL(window.location.href);
    const allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    const clean = new URL(url.origin + url.pathname);
    for (const key of allowed) {
      const value = url.searchParams.get(key);
      if (value) clean.searchParams.set(key, value.slice(0, 120));
    }
    return clean.href;
  }

  function startAnalytics() {
    if (activated) return;
    activated = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_location: pageLocation(),
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(tag);
  }

  // A click does not mean a message was sent or a legal service was retained.
  // Do not forward the URL (WhatsApp text may describe a sensitive legal case).
  document.addEventListener('click', function (event) {
    if (!activated) return;
    const element = event.target;
    const link = element && typeof element.closest === 'function' ? element.closest('a[href]') : null;
    if (!link) return;
    const href = (link.getAttribute('href') || '').trim();
    let channel = null;
    if (href.startsWith('https://wa.me/') || href.startsWith('https://api.whatsapp.com/')) channel = 'whatsapp';
    else if (href.startsWith('tel:')) channel = 'phone';
    else if (href.startsWith('mailto:')) channel = 'email';
    if (channel) {
      window.gtag('event', 'contact_click', {
        contact_channel: channel,
        transport_type: 'beacon'
      });
    }
  });

  function closePanel() {
    if (!panel) return;
    panel.remove();
    panel = null;
  }

  function select(value) {
    const previouslyActive = activated;
    save(value);
    closePanel();
    if (value === 'accepted') startAnalytics();
    else if (previouslyActive) {
      // Clear the running page; GA4 will not be loaded on the next one.
      window.location.reload();
      return;
    }
    if (preferencesButton) preferencesButton.focus();
  }

  function openPanel() {
    if (panel) return;
    panel = document.createElement('section');
    panel.className = 'zp-consent';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Preferências de estatísticas');
    panel.innerHTML =
      '<p class="zp-consent__title">Estatísticas do site</p>' +
      '<p class="zp-consent__text">Com sua autorização, usamos o Google Analytics para medir visitas e cliques nos canais de contato. O Google pode processar dados de navegação. Não rastreamos o conteúdo das mensagens enviadas ao escritório. Você pode alterar esta escolha no rodapé.</p>' +
      '<div class="zp-consent__actions">' +
      '<button type="button" class="zp-consent__accept">Aceitar estatísticas</button>' +
      '<button type="button" class="zp-consent__deny">Recusar</button>' +
      '</div>';
    document.body.appendChild(panel);
    panel.querySelector('.zp-consent__accept').addEventListener('click', function () { select('accepted'); });
    panel.querySelector('.zp-consent__deny').addEventListener('click', function () { select('denied'); });
  }

  function initialize() {
    preferencesButton = document.createElement('button');
    preferencesButton.type = 'button';
    preferencesButton.className = 'zp-consent__settings';
    preferencesButton.textContent = 'Preferências de estatísticas';
    preferencesButton.addEventListener('click', openPanel);
    const footer = document.querySelector('footer');
    (footer || document.body).appendChild(preferencesButton);
    if (choice() === 'accepted') startAnalytics();
    else if (choice() !== 'denied') openPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
