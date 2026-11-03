---
name: Zappalá Advocacia & Consultoria
description: Advocacia para pessoas e famílias em Belo Horizonte, explicada em português claro.
colors:
  grafite-azulado: "#1F2C33"
  apoio: "#4E6774"
  azul-pedra: "#4B6C7C"
  gelo: "#AEBEC6"
  nevoa: "#E3E9EC"
  nevoa-clara: "#EDF1F3"
  linha: "#DCE3E6"
  branco: "#FBFCFC"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(36px, 4.4vw, 68px)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(28px, 2.9vw, 44px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(20px, 1.75vw, 26px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  md: "8px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  section: "120px"
  margin: "clamp(20px, 3.4vw, 56px)"
components:
  button-primary:
    backgroundColor: "{colors.grafite-azulado}"
    textColor: "{colors.branco}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.apoio}"
    textColor: "{colors.branco}"
  button-on-dark:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.grafite-azulado}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
    height: "52px"
  button-on-dark-hover:
    backgroundColor: "{colors.nevoa}"
    textColor: "{colors.grafite-azulado}"
  question-row:
    backgroundColor: "rgba(251,252,252,0.035)"
    textColor: "{colors.branco}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "20px 24px"
  question-row-open:
    backgroundColor: "rgba(251,252,252,0.07)"
  contact-row:
    backgroundColor: "{colors.nevoa-clara}"
    textColor: "{colors.grafite-azulado}"
    typography: "{typography.headline}"
    height: "96px"
  contact-row-hover:
    backgroundColor: "{colors.azul-pedra}"
    textColor: "{colors.branco}"
  slip:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.grafite-azulado}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "36px"
    width: "520px"
---

# Design System: Zappalá Advocacia & Consultoria

## Overview

**Creative North Star: "A conversa clara, bem explicada no papel"**

O site fala como uma advogada que senta ao lado da pessoa e explica, em português claro, o que está acontecendo. O topo e as situações acontecem num fundo grafite azulado, com uma luz suave vinda do canto: é a parte da conversa, onde as dúvidas reais das pessoas aparecem em letra grande e cada uma se abre ali mesmo. Depois a página clareia e vira papel bem organizado: o compromisso num campo de azul-pedra, o passo a passo numa folha branca sobre névoa, quem atende, e o contato em linhas grandes e simples.

A densidade é baixa e o ritmo é calmo. Uma ideia por bloco, texto corrido confortável para quem lê no celular, nenhum enfeite que não carregue informação. O visual nunca sugere "escritório de luxo": nada de livros, mármore, caneta-tinteiro, balança, colunas, dourado ou bege.

**Key Characteristics:**
- Fundo escuro só onde há conversa (topo e situações); o resto é claro.
- As perguntas das pessoas, nas palavras delas, são o elemento visual principal.
- Separação por tom de fundo e espaço, sem fios nem sombras em repouso.
- Cantos suavemente arredondados (8px) em botões e caixas; fotos com cantos retos.
- Um único momento de entrada animada, no carregamento do topo.

## Colors

Uma paleta fria e contida de grafite azulado e névoa, com um único azul-pedra de destaque.

### Primary
- **Grafite azulado**: fundo da conversa (topo, situações, rodapé), texto principal no claro e cor do botão principal em fundo claro.

### Secondary
- **Azul-pedra**: o destaque. Campo de cor do compromisso, links em fundo claro, contorno de foco e seleção de texto em fundo claro, linha de contato ao passar o mouse.

### Neutral
- **Branco**: fundo claro de verdade da página e dos papéis. Nunca bege nem cinza-amarelado.
- **Névoa**: fundo alternativo (como funciona, contato) e cor de texto secundário sobre grafite.
- **Névoa clara**: alternância de faixas no contato.
- **Gelo**: texto de apoio sobre grafite, ícone de abrir/fechar, foco e seleção em fundo escuro, pontilhado da papeleta.
- **Apoio**: texto secundário sobre fundo claro (legendas, rótulos, notas) e estado de hover do botão principal.
- **Linha**: divisões mínimas em páginas internas e campos de formulário.

### Named Rules
**The Real White Rule.** O fundo claro é sempre o branco da paleta. Qualquer tom quente no fundo é erro.
**The One Accent Rule.** Azul-pedra é o único destaque. Ele aparece no compromisso, nos links e no foco, e em nenhum outro bloco grande da mesma página.
**The Corner Light Rule.** Fundo escuro de abertura leva uma luz suave vindo do canto superior esquerdo e uma textura fina de papel. É o único degradê do sistema.

## Typography

**Display Font:** Schibsted Grotesk (com system-ui)
**Body Font:** Atkinson Hyperlegible Next (com system-ui)

**Character:** Schibsted dá firmeza e calor aos títulos sem formalidade de cartório; Atkinson foi desenhada para ser lida por qualquer pessoa, em qualquer tela, e carrega todo o texto.

### Hierarchy
- **Display**: título do topo e frase do campo de compromisso. Duas linhas no computador.
- **Headline**: títulos de seção e linhas do contato.
- **Title**: as perguntas das situações.
- **Lead**: frases de apoio logo abaixo de um título.
- **Body**: texto corrido, até cerca de 46ch nas colunas de leitura. Nunca abaixo de 16px.
- **Label**: legendas, nomes de área, notas e rótulos de dados, em caixa normal.

### Named Rules
**The Plain Case Rule.** Nada em caixa alta espaçada, nenhum rótulo acima de título, nenhuma fonte mono.
**The Five Steps Rule.** Uma página usa display, headline, title, lead, body e label; nenhum tamanho a mais.

## Layout

Página em largura total com um único par de margens (de 20px a 56px, conforme a tela), usado do cabeçalho ao rodapé. Seções separadas por cerca de 120px no computador e 64–96px no celular; dentro de uma seção, grupos de 16–32px. Grade de 12 colunas nas seções com duas partes (compromisso: texto nas colunas 8–11, frase embaixo em largura total; como funciona: título nas colunas 1–5, papel nas colunas 7–11; quem atende: foto maior nas colunas 1–7, a outra e os fatos nas colunas 8–12). Cabeçalho fixo, transparente sobre o topo escuro e grafite sólido depois de rolar. No celular tudo vira uma coluna, o menu mostra só o logo e o botão, e os títulos correm sem quebras forçadas.

## Elevation & Depth

Sistema plano. A profundidade vem de tons de fundo (grafite, azul-pedra, névoa, branco) e, nos fundos escuros, da luz de canto com textura de papel. Nenhum elemento em repouso tem sombra.

### Named Rules
**The Flat-At-Rest Rule.** Caixas, botões, fotos e linhas não têm sombra. Só o cabeçalho rolado ganha fundo sólido.

## Shapes

Cantos suavemente arredondados (8px) em tudo que a pessoa toca ou lê como caixa: botões, faixas das perguntas, papeleta, filtros. Fotos e faixas de largura total (contato, campos de cor) têm cantos retos. O símbolo da marca, uma diagonal entre dois triângulos, aparece só no logo e no favicon.

## Components

### Buttons
Calmos e acolhedores: uma cor sólida, cantos de 8px, texto em negrito na fonte de leitura, sem seta.
- **Shape:** cantos suavemente arredondados (8px), altura mínima de 52px.
- **Primary:** grafite azulado com texto branco no fundo claro; branco com texto grafite no fundo escuro.
- **Hover / Focus:** escurece para apoio (no claro) ou clareia para névoa (no escuro); ao pressionar, encolhe 2%. Foco com contorno de 3px em azul-pedra no claro e gelo no escuro.

### Question rows (signature)
- **Style:** faixa de 8px de raio levemente mais clara que o grafite; pergunta em title, nome da área em label gelo à direita, sinal de mais desenhado que gira para um x ao abrir.
- **Open:** a faixa clareia um passo e mostra três colunas: orientação curta, "Separe, se tiver:" com a lista de documentos, e o botão "Mandar esta situação no WhatsApp", que abre a conversa com o assunto preenchido.
- **Hover:** a pergunta desliza 8px para a direita.

### Slip (papeleta)
- **Style:** folha branca de até 520px com cantos de 8px sobre fundo névoa; etapas agrupadas por momento (Hoje, Na conversa, Depois), cada linha com a ação à esquerda e o quando à direita, ligadas por pontilhado gelo; a última linha é uma barra grafite com o resultado.

### Contact rows
- **Style:** faixas de largura total, alternando névoa e névoa clara, cada uma com um canal em headline; a primeira é o título da seção em fundo branco.
- **Hover / Focus:** a faixa fica azul-pedra com texto branco, e o texto desliza 10px.

### Navigation
- **Style:** logo à esquerda; quatro links em body (Em que ajudamos, Como funciona, Equipe, Informativos) e o botão "Falar com o escritório" à direita. Link da página atual sublinhado em gelo. No celular, só o logo e o botão.

## Do's and Don'ts

### Do:
- **Do** começar cada bloco pela situação da pessoa, nas palavras dela.
- **Do** separar seções por tom de fundo e espaço, com cerca de 120px entre elas no computador.
- **Do** manter o texto corrido em grafite (no claro) ou névoa (no escuro) a 16px ou mais.
- **Do** usar fotos reais com luz natural, tratadas com a mesma dessaturação leve e cantos retos.
- **Do** respeitar a preferência por movimento reduzido: o conteúdo aparece sem deslocamento.

### Don't:
- **Don't** usar rótulos em caixa alta espaçada, fonte mono, numeração 01/02/03 fora de sequência real, palavra destacada em outra cor no título ou setas "→" em botões.
- **Don't** usar fundo bege, dourado, verde, fotos de banco, livros, mármore, caneta-tinteiro, balança, martelo ou colunas.
- **Don't** pôr sombra em caixas em repouso, borda lateral colorida em avisos ou efeito de surgimento em todo bloco.
- **Don't** repetir o mesmo cabeçalho de seção (título à esquerda, frase à direita) em seções seguidas.
- **Don't** aumentar os títulos além da escala display: "letra grande" na Zappalá é proporcional, não de cartaz.
