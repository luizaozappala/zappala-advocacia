/* Zappalá: métricas opcionais, sem carregar tags antes da autorização. */
(function () {
  'use strict';
  const meta = document.querySelector('meta[name="zappala-gtm-container"]');
  const containerId = meta && meta.getAttribute('content');
  if (!containerId || !/^GTM-[A-Z0-9]+$/.test(containerId)) return;

  const key = 'zappala_analytics_consent_v1';
  let activated = false;
  let panel = null;
  let preferenceButton = null;

  function currentChoice() {
    try {
      const value = window.localStorage.getItem(key);
      return value === 'accepted' || value === 'denied' ? value : null;
    } catch (_) { return null; }
  }

  function saveChoice(value) {
    try { window.localStorage.setItem(key, value); }
    catch (_) { /* Em navegação privada a escolha vale apenas na página. */ }
  }

  function startGtm() {
    if (activated) return;
    activated = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(containerId);
    document.head.appendChild(tag);
  }

  // Dados mínimos: canal de contato. Nunca ler conteúdo de mensagens,
  // nomes, documentos, telefone do visitante ou assunto jurídico.
  document.addEventListener('click', function (event) {
    if (currentChoice() !== 'accepted' && !activated) return;
    const target = event.target;
    const anchor = target && typeof target.closest === 'function' ? target.closest('a[href]') : null;
    if (!anchor) return;
    const href = (anchor.getAttribute('href') || '').trim();
    let channel = null;
    if (/^https:\/\/(?:wa\.me|api\.whatsapp\.com)\//i.test(href)) channel = 'whatsapp';
    else if (/^tel:/i.test(href)) channel = 'phone';
    else if (/^mailto:/i.test(href)) channel = 'email';
    if (!channel) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'contact_click', contact_channel: channel });
  });

  function closePanel() {
    if (panel) { panel.remove(); panel = null; }
  }

  function choose(choice) {
    const previous = currentChoice();
    saveChoice(choice);
    closePanel();
    if (choice === 'accepted') {
      startGtm();
    } else if (activated || previous === 'accepted') {
      // Tags já carregadas precisam ser interrompidas por navegação nova.
      window.location.reload();
    }
    if (preferenceButton) preferenceButton.focus();
  }

  function showPanel() {
    if (panel) return;
    panel = document.createElement('section');
    panel.className = 'zp-consent';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Preferências de estatísticas');
    panel.innerHTML =
      '<p class="zp-consent__title">Estatísticas do site</p>' +
      '<p class="zp-consent__text">Com sua autorização, usamos o Google Analytics para entender visitas e cliques de contato. Não enviamos o texto das suas mensagens nem informações fornecidas ao escritório. Você pode mudar sua escolha a qualquer momento.</p>' +
      '<div class="zp-consent__actions">' +
      '<button type="button" class="zp-consent__accept">Aceitar estatísticas</button>' +
      '<button type="button" class="zp-consent__deny">Recusar</button>' +
      '</div>';
    document.body.appendChild(panel);
    panel.querySelector('.zp-consent__accept').addEventListener('click', function () { choose('accepted'); });
    panel.querySelector('.zp-consent__deny').addEventListener('click', function () { choose('denied'); });
  }

  function start() {
    preferenceButton = document.createElement('button');
    preferenceButton.type = 'button';
    preferenceButton.className = 'zp-consent__settings';
    preferenceButton.textContent = 'Preferências de estatísticas';
    preferenceButton.addEventListener('click', showPanel);
    const footer = document.querySelector('footer');
    (footer || document.body).appendChild(preferenceButton);
    const choice = currentChoice();
    if (choice === 'accepted') startGtm();
    else if (choice !== 'denied') showPanel();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
