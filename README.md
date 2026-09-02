# Zappalá Advocacia & Consultoria

Site institucional da Zappalá Advocacia & Consultoria.

## Publicação

O projeto está preparado para Cloudflare Pages com integração ao GitHub.

- Branch de produção: `main`
- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: 18 ou superior

O build reconstrói a home e a página da equipe, copia os assets e gera `data/informativos.json` e `sitemap.xml`.

## Informativos / Sveltia CMS

Depois do deploy, o painel editorial fica em `/admin/`.

A coleção **Informativos** permite criar Notícias, Artigos e Guias, com:

- título;
- categoria;
- data;
- resumo;
- imagem de capa;
- texto alternativo;
- autoria;
- corpo do texto em editor rico/Markdown;
- status publicado/rascunho;
- destaque;
- link e legenda para Instagram.

Os conteúdos são salvos em `content/informativos/`. As imagens enviadas pelo CMS ficam em `assets/uploads/`.

A autenticação do CMS está configurada pelo método de **token do GitHub**, que dispensa servidor OAuth. Na primeira entrada em `/admin/`, use a opção de autenticação por token e siga o link oferecido pelo próprio Sveltia para gerar o token com as permissões solicitadas. O token fica armazenado no navegador usado para administrar o site.

## Estrutura

- `source/`: fontes compactadas da home/equipe e imagens institucionais usadas pelo build;
- `assets/`: CSS e JavaScript de animação; uploads editoriais também entram aqui;
- `admin/`: Sveltia CMS;
- `content/informativos/`: publicações criadas pelo CMS;
- `informativos.html`: índice das publicações;
- `publicacao.html`: página individual;
- `build.js`: geração da pasta `dist/`.

## Domínio

O projeto foi preparado para `https://zappala.adv.br`.
