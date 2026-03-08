# Contribuindo com o Trincheira Links

Obrigado por querer compartilhar um link! O processo e simples: basta abrir um **Pull Request** adicionando um arquivo `.mdx`.

## Passo a passo

### 1. Fork e clone o repositorio

```bash
gh repo fork ffmenezes/trincheira-links --clone
cd trincheira-links
```

### 2. Crie o arquivo do link

Crie um arquivo em `gerenciador-bookmarks/src/content/links/` com o formato:

```
nome-do-site-em-slug.mdx
```

Exemplos: `supabase.mdx`, `jwt-io-debugger.mdx`, `guia-definitivo-do-regex.mdx`

### 3. Preencha o frontmatter

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
| `tags` | Sim | Array de tags em minusculo |
| `favicon` | Recomendado | URL do favicon — use o padrao do Google. Cards sem favicon ficam incompletos. |
| `ogthumb` | Nao | URL da imagem Open Graph |
| `creator` | Sim | Seu usuario do GitHub |
| `favorite` | Nao | Sempre `false` no PR |
| `bundles` | Nao | Array de bundles (geralmente vazio) |

### 4. Abra o PR

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

Acesse/analise o site e gere o arquivo seguindo EXATAMENTE este formato:

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
- tags: 2-5 tags em minusculo, sem acento. SEMPRE prefira tags ja existentes no projeto: agents, ai, analytics, api, automacao, backend, blog, bmad, bubble, components, comunidade, database, design, dev, devops, github, gpt, icons, json, marketing, mcp, mockdata, mobile, newsletter, open-source, pdf, portugues, postman, postgres, react, reddit, regex, saas7d, screenshots, security, semcodar, shadcn, skills, supabase, tech12k, ui, utils, vibecoding, video, webhook, whatsapp, yaml, youtube. So crie tag nova se nenhuma existente se encaixa. Auto-tag por URL: github.com → "github" + "open-source"; reddit.com → "reddit"; chatgpt.com/g/ → "gpt" + "agents"
- favicon: use o padrao Google Favicons com o dominio do site (ex: domain=github.com para links do GitHub)
- O nome do arquivo deve ser o slug do site: letras minusculas, sem acento, separado por hifen (ex: "jwt-io-debugger.mdx")

Me retorne APENAS o conteudo do arquivo .mdx e o nome sugerido para o arquivo.
````

## Vocabulario de tags

**Regra geral:** sempre prefira tags ja existentes. Consulte a tabela abaixo antes de criar uma nova. So crie uma tag nova quando nenhuma existente se encaixa E a categoria tem potencial de ser usada por mais de um link.

**Como escolher tags:**
1. Consulte a tabela abaixo e use as que se encaixam (2-5 tags por link)
2. Tags descrevem **o que o recurso e/faz**, nao o publico (evite tags genericas como `dev` — a lista inteira e para devs)
3. Tags especificas sao bem-vindas se descrevem bem o conteudo (ex: `regex`, `yaml`, `webhook`, `icons`)
4. Nao duplique semantica: se ja tem `components` + `ui`, nao precisa de `frontend`

| Tag | Uso |
|-----|-----|
| `agents` | Agentes de IA, GPTs e automacoes inteligentes |
| `ai` | Ferramentas e recursos de inteligencia artificial |
| `analytics` | Analise de dados, heatmaps e metricas |
| `api` | Ferramentas de API, REST, JSON e webhooks |
| `automacao` | Automacao de marketing, workflows e integracoes |
| `backend` | Frameworks e servicos backend (BaaS) |
| `blog` | Blogs e sites de conteudo tecnico |
| `bmad` | BMAD Method — desenvolvimento orientado por agentes |
| `bubble` | Plataforma Bubble e plugins no-code |
| `components` | Bibliotecas de componentes UI prontos |
| `comunidade` | Comunidades, foruns e agregadores de discussao |
| `database` | Ferramentas de banco de dados e sandbox SQL |
| `design` | Design, UX, temas, icones e referencias visuais |
| `dev` | Ferramentas e frameworks de desenvolvimento geral |
| `devops` | Infraestrutura, Docker, rede e monitoramento |
| `github` | Repositorios e recursos hospedados no GitHub |
| `gpt` | GPTs customizados no ChatGPT |
| `icons` | Bibliotecas de icones |
| `json` | Visualizadores, formatadores e parsers JSON |
| `marketing` | Marketing digital e estrategia comercial |
| `mcp` | Model Context Protocol — servidores e ferramentas |
| `mockdata` | Geradores de dados ficticios para testes |
| `mobile` | Desenvolvimento mobile e apps nativos |
| `newsletter` | Newsletters e curadoria periodica de conteudo |
| `open-source` | Projetos e ferramentas open-source |
| `pdf` | Ferramentas de manipulacao e conversao de PDF |
| `portugues` | Ferramentas ligadas a escrita em portugues (legibilidade, geradores de texto) |
| `postman` | Recursos especificos do Postman |
| `postgres` | PostgreSQL — sandboxes e ferramentas |
| `react` | Bibliotecas e componentes React |
| `reddit` | Comunidades e discussoes no Reddit |
| `regex` | Expressoes regulares — guias e testadores |
| `saas7d` | Colecao SaaS 7D |
| `screenshots` | Captura e criacao de screenshots/mockups |
| `security` | Seguranca, JWT e geracao de chaves |
| `semcodar` | Ferramentas e GPTs no-code/low-code |
| `shadcn` | Ecossistema shadcn/ui — temas e extensoes |
| `skills` | Agent skills para assistentes de IA |
| `supabase` | Recursos especificos do Supabase |
| `tech12k` | Colecao Tech 12K |
| `ui` | Interfaces, design systems e componentes visuais |
| `utils` | Utilitarios gerais para o dia a dia |
| `vibecoding` | Ferramentas e metodologias de vibecoding |
| `video` | Ferramentas de video — edicao e compressao |
| `webhook` | Testadores e ferramentas de webhook |
| `whatsapp` | Ferramentas relacionadas ao WhatsApp Business |
| `yaml` | Ferramentas de YAML — validadores e formatadores |
| `youtube` | Canais do YouTube |

**Auto-tag por URL:** links do `github.com` recebem `github` + `open-source`, links do `reddit.com` recebem `reddit`, links do `chatgpt.com/g/` recebem `gpt` + `agents`.

## Duvidas?

Abra uma [issue](https://github.com/ffmenezes/trincheira-links/issues) ou mande uma mensagem na [trincheira.dev](https://trincheira.dev).
