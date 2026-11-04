# Configuração de métricas — Zappalá Advocacia & Consultoria

**Estado:** implementação de código preparada numa branch de revisão. Não está publicada em produção. **Nenhuma coleta começa até que exista um contêiner GTM válido, tags configuradas e autorização do visitante.**

**Identificação do site:** https://zappala.adv.br/  
**Repositório:** `luizaozappala/zappala-advocacia`  
**Contato comercial:** (31) 99237-7158.

## 1. Responsável cria ou identifica as propriedades do Google

Use uma Conta Google controlada pelo escritório; não compartilhe senha, token nem chave de acesso.

1. **Google Analytics 4:** abra https://analytics.google.com, crie uma conta/propriedade para **Zappalá Advocacia & Consultoria** e um fluxo de dados *Web* para `https://zappala.adv.br`. Guarde o **ID de medição G-XXXXXXXXXX**. Se já existir uma propriedade, reutilize-a.
2. **Google Tag Manager:** abra https://tagmanager.google.com, crie uma conta/contêiner do tipo **Web** para `zappala.adv.br` ou reutilize o existente. Guarde o **ID GTM-XXXXXXX**.
3. **Google Search Console:** abra https://search.google.com/search-console e crie uma propriedade de **Domínio** `zappala.adv.br`. O Google apresentará um registro TXT de confirmação. Adicione-o no provedor de DNS que efetivamente controla o domínio; confirme no Search Console. Não envie senha de DNS para terceiros. Depois cadastre `https://zappala.adv.br/sitemap.xml`.

## 2. Ativar o contêiner GTM no build do Cloudflare Workers

O arquivo `build.js` lê a variável de **build** `GTM_CONTAINER_ID`, validando o formato `GTM-...`. Sem essa variável o site permanece sem código do Tag Manager.

1. No Cloudflare, abra **Workers & Pages → zappala-advocacia → Settings → Build / Environment variables** (a localização exata pode variar na interface).
2. Adicione `GTM_CONTAINER_ID` com o ID real do contêiner, por exemplo `GTM-ABCDEFG` (somente ilustrativo; **não usar como ID real**).
3. Após revisão da branch e integração à `main`, execute um novo build/deploy. **Variáveis somente de execução (runtime) não bastam:** o script gera o HTML durante o build.

## 3. Configurar as tags dentro do Tag Manager

O código do site já prepara o evento de camada de dados:
```js
dataLayer.push({ event: 'contact_click', contact_channel: 'whatsapp' });
```
Também emite `contact_channel: 'phone'` e `contact_channel: 'email'` para os respectivos links.

No GTM:
1. Crie uma **Tag do Google** com o ID de medição do GA4 (`G-...`). Acionador: **All Pages**. O contêiner, por sua vez, só será carregado após o consentimento.
2. Em **Variáveis → Nova → Variável da camada de dados**, crie `contact_channel` (nome da chave exatamente `contact_channel`).
3. Em **Acionadores → Novo**, crie um acionador do tipo **Evento personalizado**, nome `contact_click`.
4. Em **Tags → Nova**, crie uma tag de **Evento do Google Analytics / GA4** usando o ID correto, evento `contact_click`, parâmetro `contact_channel` com o valor da variável criada. Acione com `contact_click`.
5. Use **Preview / Tag Assistant**, aceite métricas no banner e teste um clique em cada canal. Confira **GA4 → Tempo real / DebugView**. Com a escolha **Recusar**, as tags não devem carregar.
6. Publique a versão do contêiner apenas após validar o disparo correto.

**Importante:** `contact_click` é um *indicador de intenção de contato*, **não** significa mensagem efetivamente enviada, lead qualificado ou contratação. Se transformar em evento principal do GA4, registre esse significado.

## 4. Comportamento de privacidade previsto

- Modo básico de autorização: **nenhum script GTM é carregado antes do aceite**.
- Opções apresentadas: **Aceitar estatísticas / Recusar**, com reabertura por **Preferências de estatísticas** no rodapé.
- Ao revogar o aceite, a página recarrega para interromper as tags já inicializadas.
- Os eventos personalizados não enviam número de telefone do visitante, mensagem, documento, nome, tema jurídico, nem texto do link WhatsApp.
- A documentação de privacidade/LGPD e os prazos de retenção das propriedades Google precisam de validação pela responsável. O código não substitui uma avaliação jurídica de conformidade.

## 5. Conferências antes de considerar finalizado

- [ ] Revisão da alteração de **endereço de referência** atualmente pendente em outro PR: o endereço Rua Maquiné não deve ser tratado como local de atendimento.
- [ ] Conta/propriedade GA4 verificadas, ID `G-...` registrado internamente.
- [ ] Contêiner GTM `GTM-...` verificado, tag Google e evento `contact_click` publicados e testados.
- [ ] Variável de build correta no Cloudflare Workers; novo build da `main` concluído.
- [ ] Banner de escolha testado no celular e desktop, inclusive recusa e alteração posterior.
- [ ] Search Console com domínio verificado e sitemap enviado.
- [ ] Relatórios de tempo real e primeiros eventos testados sem enviar dados de clientes.
- [ ] Texto de transparência/LGPD revisado.

## Fontes oficiais

- https://support.google.com/analytics/answer/14183469?hl=pt-BR
- https://support.google.com/tagmanager/answer/9442095?hl=pt-br
- https://support.google.com/analytics/answer/14009635?hl=pt-BR
- https://support.google.com/webmasters/answer/9008080?hl=pt-BR
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
