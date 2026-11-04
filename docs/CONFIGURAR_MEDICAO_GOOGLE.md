# Mensuração do site Zappalá — Google Analytics 4

**Identificador confirmado:** `G-V9DJTWBY1C`  
**Fluxo Web:** Site Zappalá (código `16267072400`)  
**Domínio:** https://zappala.adv.br  
**Repositório:** luizaozappala/zappala-advocacia

## Instalação

O Google Analytics 4 é carregado diretamente pelo arquivo `assets/analytics-consent.js`, gerado em todas as páginas públicas pelo `build.js`. O código é equivalente à tag `gtag.js` fornecida pela gestão, com alteração importante: **o navegador só carrega a biblioteca Google após a autorização de estatísticas**.

- Não adicionar outro snippet `gtag.js` ao HTML.
- Não ativar simultaneamente uma tag GA4 pelo GTM sem remover a instalação direta, para não duplicar eventos.
- O botão **Preferências de estatísticas** permite ao visitante aceitar ou recusar a medição. A escolha fica armazenada no próprio navegador.
- Não são enviados ao evento `contact_click` nomes, telefones pessoais, textos ou temas de mensagens; somente `contact_channel` (whatsapp, phone ou email).
- A URL de página enviada exclui parâmetros desconhecidos e preserva apenas os parâmetros UTM de campanhas (com limite de tamanho).
- A tag usa `allow_google_signals: false` e `allow_ad_personalization_signals: false`.
- O clique de contato mede somente **intenção**, não mensagem recebida, lead qualificado ou contratação.

## Testes e conferência

1. Confirmar o build no GitHub Actions e Cloudflare Workers após a publicação do código na branch `main`.
2. Abrir o site numa janela anônima e, **antes do aceite**, confirmar que `googletagmanager.com/gtag/js` não foi carregado.
3. Clicar em **Aceitar estatísticas**, verificar a requisição da biblioteca `gtag/js?id=G-V9DJTWBY1C` e conferir visualizações no Google Analytics → **Tempo real**.
4. Clicar no link WhatsApp e conferir evento `contact_click` no GA4, com `contact_channel=whatsapp` (o parâmetro personalizado pode exigir registro de dimensão personalizada para relatórios).
5. Repetir com **Recusar** e confirmar ausência de coleta. Testar em celular e desktop.
6. Evitar contabilizar tráfego próprio nos relatórios quando for possível distinguir usuários internos de forma segura.

## Google Search Console (passo adicional independente)

1. Entrar em https://search.google.com/search-console.
2. Criar ou identificar propriedade do **domínio** `zappala.adv.br`.
3. Inserir TXT de verificação no DNS, conforme instrução exibida pelo Google.
4. Depois da verificação, enviar `https://zappala.adv.br/sitemap.xml`.
5. Acompanhar indexação, impressões, cliques e termos de pesquisa. O Search Console não se instala pela tag GA4.

## Privacidade, dados jurídicos e política institucional

A tela de consentimento é uma implementação técnica inicial, não uma revisão conclusiva de conformidade com a LGPD. Recomenda-se publicar informação institucional sobre cookies, fornecedor de medição, finalidades, retenção e direitos de titulares antes da coleta em produção, conforme validação da responsável. É vedado colocar textos de casos, dados de clientes ou informações sensíveis em nomes de eventos, links de campanha e parâmetros UTM.

**Atenção ao endereço físico:** existe outra alteração pendente no repositório tratando da Rua Maquiné como endereço de referência, e não como local de atendimento. Este trabalho de métricas não altera o endereço.
