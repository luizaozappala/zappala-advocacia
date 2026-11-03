# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Principal (80–90%):** pessoas e famílias de Belo Horizonte e região metropolitana, classes C/D e média, leigas em direito, que leem no celular, muitas vezes com pressa. Chegam por indicação de alguém de confiança, pelo Instagram (@zappala.adv) ou por um post encaminhado no WhatsApp.
  Situações típicas: demissão e acerto, trabalho sem carteira assinada, trabalho doméstico; INSS negado ou cortado, BPC/LOAS, auxílio-doença, aposentadoria; pensão alimentícia, guarda, divórcio, inventário; cobrança indevida, nome negativado, golpe do Pix, compras; multa, suspensão e cassação da CNH; problemas com imóvel ou contrato.
  O que pesa: "tenho direito ou não?", medo de perder prazo, medo de pagar e ser esquecido, achar que advogado "não é para gente como eu", vergonha de perguntar.
- **Ocasional (10–20%):** donos de pequenos negócios, MEIs e empregadores domésticos (contratar e demitir do jeito certo, contratos, cobranças, impostos, defesa em ação trabalhista).

## Product Purpose

Site do escritório Zappalá Advocacia & Consultoria (zappala.adv.br). Faz a pessoa se reconhecer na própria situação, entender em português claro se há o que fazer e qual é o próximo passo, e falar com o escritório.

Sucesso: a pessoa manda uma mensagem pelo WhatsApp (31) 99237-7158 contando brevemente o que aconteceu. Ações secundárias: seguir o Instagram, encaminhar o conteúdo para quem precisa.

## Positioning

- Quem conversa com a pessoa na primeira vez é quem conduz o caso; sem central de atendimento.
- Atualização do caso todo mês, mesmo quando o processo não andou; novidade antes, aviso antes. Responde à reclamação nº 1 do mercado ("o advogado sumiu depois que paguei"). É compromisso de atendimento, não de resultado.
- Tudo por escrito antes de assinar: escopo, limites do trabalho e honorários.
- Resposta honesta: o escritório diz quando não vale a pena entrar na Justiça.
- Várias áreas, uma relação: "a advogada da família", para qualquer problema do dia a dia (os concorrentes visíveis em BH atuam em uma área só).

## Operating Context

- Primeiro contato pelo WhatsApp, em poucas linhas, informando se há prazo correndo; sem documentos sensíveis nessa etapa.
- O escritório confere conflito de interesses antes de analisar o caso.
- Conversa presencial em Belo Horizonte, com hora marcada, ou por vídeo para todo o Brasil.
- Documentos do mundo do público: carteira de trabalho, contracheques, termo de rescisão, carta do INSS, extrato do CNIS, laudos, certidões, notificação do Detran, contratos, boletos, prints, comprovantes do Pix.
- Público fala e escreve assim: "tirou todas as minhas dúvidas", "me manteve informada", "processo parado", "não responde no zap", "nome sujo", "golpe do Pix", "perder a carteira", "pensão do meu filho".

## Capabilities and Constraints

- Site estático (HTML/CSS/JS) publicado no Cloudflare Workers a partir da branch `main` do GitHub; `npm run build` gera `dist/`. Editor de informativos (Sveltia CMS) em `/admin/`.
- Contato único: WhatsApp e telefone (31) 99237-7158; e-mail luiza.zappala.adv@gmail.com; Instagram @zappala.adv.
- Não atua na área criminal.
- **Compliance (Provimento CFOAB 205/2021, Código de Ética, Estatuto da Advocacia):** sem honorários, preços, gratuidade ou "consulta grátis"; sem promessa ou garantia de resultado; sem casos concretos, clientes, valores obtidos ou depoimentos; sem autoengrandecimento nem comparação com outros escritórios; "especialista" só com título; impulsionamento pago só para conteúdo informativo; nenhuma vantagem por indicação.
- Luíza Zappalá é assistente jurídica e nunca é apresentada como advogada nem orienta casos em nome próprio.
- Prazos, regras do INSS e de trânsito mudam: conferir na fonte oficial antes de publicar conteúdo que os cite.
- **A definir:** e-mail com o domínio zappala.adv.br; Perfil da Empresa no Google (o escritório ainda não aparece no Google Maps).

## Brand Commitments

- Nome institucional: Zappalá Advocacia & Consultoria. Nome visual: Zappalá (pronúncia "za-pa-LÁ"). Assinatura: "Uma advocacia que começa pela atenção aos detalhes."
- Voz: simples sem ser simplória, próxima sem gíria, segura sem prometer resultado, acolhedora sem drama. Fala com o leitor em "você", parte de uma situação real, explica cada termo técnico na primeira menção, diz "depende de…" seguido dos fatores.
- Frases aprovadas pela cliente para o site: "Advocacia para quem quer entender o próprio caso." e "Todo mês, você recebe notícias do seu caso." Frases recusadas: "Conte o que aconteceu." (como título) e "Você não fica sem resposta." (como título).
- Palavras banidas: juridiquês sem explicação, "soluções", "excelência", "propósito", "inovação", "garantido", "processe já", "urgente!", "não perca", a tagline "Rigor jurídico. Estratégia. Confiança." e maneirismos de IA ("é importante destacar", "nesse sentido", "vale ressaltar", "em suma", "não apenas… mas também").
- Fonte de verdade da marca: `claude/brand-profile.md` no projeto Zappala ADV do Claude; posicionamento e pesquisa em `claude/product-marketing.md` e `claude/pesquisa-clientes.md`. Logo e símbolo oficiais v2 em `assets/logo-zappala.svg`, `assets/logo-zappala-escuro.svg`, `assets/simbolo-zappala.svg`.

## Evidence on Hand

- Equipe: Gleice Zappalá, advogada responsável, OAB/MG 145.047. Luíza Zappalá, assistente jurídica; especialização em Direito Processual Civil (FGV); formação em Direito Imobiliário (FGV); medalha de ouro na Olimpíada Brasileira de Direito Civil (ABDC); coautora de capítulo em *Controvérsias Tributárias na Jurisprudência do STF*.
- Fotos próprias: apenas os retratos das duas (`source/gleice-zappala.webp.b64`, `source/luiza-zappala.webp.b64`).
- Não existem e não podem ser inventados: depoimentos, números de casos, valores obtidos, clientes, avaliações, imprensa, vídeo próprio. Banco de imagem não é usado.
- **A definir:** fotos reais (mãos e documentos, Belo Horizonte, retratos das duas com o mesmo fundo claro), conforme `claude/lista-de-fotos.md`; currículo da Gleice, incluindo quais áreas ela quer citar no perfil.

## Product Principles

1. Começar pela situação que a pessoa vive, nas palavras dela, e não pelo nome jurídico do problema.
2. Clareza antes de convencimento: dizer o que importa, o que separar e o prazo, sem prometer resultado.
3. O medo de ser esquecido é respondido com compromisso concreto de atendimento (retorno mensal, contato direto, tudo por escrito).
4. Fácil de encaminhar: cada conteúdo deve fazer sentido para "aquela pessoa que está passando por isso".
5. Toda peça pública cabe no Provimento 205; na dúvida, não publicar.

## Accessibility & Inclusion

- Leitura no celular por pessoas com pouca familiaridade com termos técnicos: texto corrido nunca abaixo de 16 px, contraste WCAG AA, termo técnico explicado na primeira menção, áreas de toque confortáveis.
- Texto alternativo em toda imagem; legenda em todo vídeo; respeitar a preferência por movimento reduzido.
