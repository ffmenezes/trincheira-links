# Contribuindo com o Trincheira Links

Obrigado por querer compartilhar um link! O processo e simples: basta abrir um **Pull Request** adicionando um arquivo `.mdx`.

## Passo a passo

### 1. Fork e clone o repositorio

```bash
gh repo fork ffmenezes/trincheira-links --clone
cd trincheira-links
```

### 2. Pesquise sobre o link

Antes de adicionar, **sempre pesquise sobre o link na internet** (Google, GitHub, Twitter/X) para entender o contexto real, propósito e como a comunidade o utiliza. Isso garante que a descrição seja precisa e as tags sigam a taxonomia correta.

### 3. Crie o arquivo do link

Crie um arquivo em `gerenciador-bookmarks/src/content/links/` com o formato:

```
nome-do-site-em-slug.mdx
```

Exemplos: `supabase.mdx`, `jwt-io-debugger.mdx`, `guia-definitivo-do-regex.mdx`

### 4. Preencha o frontmatter

```mdx
---
name: "Nome do Site"
link: "https://example.com"
description: "Descricao curta e objetiva do que o site faz"
createdAt: "2026-03-05T00:00:00.000Z"
tags: ["tag1", "tag2", "tag3"]
favicon: "https://www.google.com/s2/favicons?domain=example.com&sz=32"
ogthumb: ""
creator: "seu-usuario-github"
favorite: false
bundles: []
---
```

**Campos:**

| Campo | Obrigatorio | Descricao |
|---|---|---|
| `name` | Sim | Nome do site/ferramenta |
| `link` | Sim | URL completa (com `https://`) |
| `description` | Sim | Descricao curta em portugues |
| `createdAt` | Sim | Data e horário no formato ISO 8601 (ex: `2026-03-07T14:30:00.000Z`). Use o horário real de inserção, não apenas `00:00:00` — isso afeta a ordenação "Mais recentes". |
| `tags` | Sim | Array de tags seguindo o [Guia de Tags](gerenciador-bookmarks/TAGS_GUIDE.md). (2 a 4 tags). |
| `favicon` | Recomendado | URL do favicon — use o padrao do Google. Cards sem favicon ficam incompletos. |
| `ogthumb` | Nao | URL da imagem Open Graph |
| `creator` | Sim | Seu usuario do GitHub |
| `favorite` | Nao | Sempre `false` no PR |
| `bundles` | Nao | Array de bundles (geralmente vazio) |

### 5. Abra o PR

```bash
git checkout -b add/nome-do-site
git add gerenciador-bookmarks/src/content/links/nome-do-site.mdx
git commit -m "add: Nome do Site"
git push origin add/nome-do-site
gh pr create --title "add: Nome do Site" --body "Adicionando link para [Nome do Site](https://example.com)"
```

## Gerando o .mdx com IA

Se voce usa ChatGPT, Claude, ou outra IA, cole o prompt abaixo e informe a URL:

````
Preciso que voce gere um arquivo .mdx para o Trincheira Links (um gerenciador de bookmarks).

A URL do site e: [COLE A URL AQUI]

Acesse/analise o site, **pesquise sobre o link na internet para entender seu contexto real (Google, GitHub, Twitter/X)** e gere o arquivo seguindo EXATAMENTE este formato:

```mdx
---
name: "Nome do Site"
link: "URL_COMPLETA"
description: "Descricao curta em portugues do que o site faz (1-2 frases)"
createdAt: "DATA_DE_HOJE_ISO8601"
tags: ["tag1", "tag2", "tag3"]
favicon: "https://www.google.com/s2/favicons?domain=DOMINIO&sz=32"
ogthumb: ""
creator: "MEU_USUARIO_GITHUB"
favorite: false
bundles: []
---
```

Regras:
- name: nome oficial do site, curto
- description: em portugues, objetiva, 1-2 frases
- createdAt: data e horário de hoje no formato ISO 8601 (ex: "YYYY-MM-DDTHH:mm:ss.000Z"). Use horário real, não 00:00:00.
- tags: 2-4 tags em minusculo, sem acento. Siga o Guia de Tags de 3 Eixos:
  - Eixo A (Domínio): ai, dev, design, nocode, negocios ou conteudo.
  - Eixo B (Especialidade): frontend, backend, api, database, devops, security, mobile, agents, vibecoding, icons, ui, livros, blog, youtube, newsletter, reddit, marketing, produtividade, analytics.
  - Eixo C (Específico/Ferramenta): regex, yaml, json, jwt, pdf, video, mockdata, webhook, qrcode, screenshots, transcricao, acessibilidade, dev-tools, ferramentas, tech12k, saas7d, bmad, shadcn, supabase, postgres, semcodar, bubble.
  - PROIBIDO usar: 'open-source' e 'utils'. Use 'github', 'dev-tools' ou 'ferramentas' quando necessário.
- favicon: use o padrao Google Favicons com o dominio do site (ex: domain=github.com para links do GitHub)
- O nome do arquivo deve ser o slug do site: letras minusculas, sem acento, separado por hifen (ex: "jwt-io-debugger.mdx")

Me retorne APENAS o conteudo do arquivo .mdx e o nome sugerido para o arquivo.
````
