# Trincheira Links

Repositorio colaborativo de links uteis da [trincheira.dev](https://trincheira.dev). Site 100% estatico — cada link e um arquivo `.mdx`, novos links entram via Pull Request.

**[links.trincheira.dev](https://links.trincheira.dev)**

## Funcionalidades

- **Busca instantanea** — busca em nome, descricao, URL e tags
- **Tags** — filtragem multipla com contagem incremental
- **Bundles** — colecoes tematicas de links
- **Favoritos** — marcacao local com estrela (localStorage)
- **Ordenacao** — por nome (A-Z, Z-A) ou data
- **Modo escuro** — toggle com persistencia
- **Responsivo** — desktop, tablet e mobile

## Como adicionar um link

1. Faca fork do repositorio
2. Crie um arquivo `.mdx` em `gerenciador-bookmarks/src/content/links/`
3. Abra um Pull Request

Veja o guia completo em [CONTRIBUTING.md](CONTRIBUTING.md).

## Desenvolvimento

```bash
cd gerenciador-bookmarks
npm install
npm run dev      # http://localhost:4321
npm run build    # Build estatico em dist/
npm run preview  # Preview do build
```

## Stack

- [Astro](https://astro.build/) + MDX Content Collections
- [Solid.js](https://www.solidjs.com/) — UI reativa (client-side)
- [Tailwind CSS](https://tailwindcss.com/) — estilizacao
- [Cloudflare Pages](https://pages.cloudflare.com/) — hospedagem
