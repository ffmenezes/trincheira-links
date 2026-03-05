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
| `createdAt` | Sim | Data no formato ISO 8601 |
| `tags` | Sim | Array de tags em minusculo |
| `favicon` | Nao | URL do favicon (use o padrao do Google) |
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
- createdAt: data de hoje no formato "YYYY-MM-DDT00:00:00.000Z"
- tags: 3-6 tags em minusculo, sem acento, relevantes (ex: "dev", "design", "ia", "ferramenta", "open-source", "database", "api", "frontend", "backend")
- favicon: use o padrao Google Favicons com o dominio do site
- O nome do arquivo deve ser o slug do site: letras minusculas, sem acento, separado por hifen (ex: "jwt-io-debugger.mdx")

Me retorne APENAS o conteudo do arquivo .mdx e o nome sugerido para o arquivo.
````

## Tags comuns

`dev`, `design`, `ia`, `ferramenta`, `open-source`, `database`, `api`, `frontend`, `backend`, `devops`, `produtividade`, `marketing`, `gerador`, `json`, `pdf`, `mcp`, `componentes`, `ui`, `teste`, `documentacao`, `comunidade`

## Duvidas?

Abra uma [issue](https://github.com/ffmenezes/trincheira-links/issues) ou mande uma mensagem na [trincheira.dev](https://trincheira.dev).
