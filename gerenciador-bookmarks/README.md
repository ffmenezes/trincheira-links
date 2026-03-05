# Trincheira Links

Gerenciador de bookmarks compartilhado para grupos privados. Rápido, minimalista, com tema verde bélico.

## Funcionalidades

- **CRUD de bookmarks** — criar, editar, excluir, favoritar
- **Busca instantânea** — busca textual em nome, descrição, URL e tags
- **Tags** — filtragem múltipla por tags com contagem
- **Bundles** — agrupe bookmarks em coleções temáticas
- **Favoritos** — marque bookmarks com estrela para acesso rápido
- **Importar/Exportar** — suporte a JSON e CSV
- **Modo escuro** — alternância manual com persistência
- **Offline** — Service Worker para cache e acesso sem conexão
- **Responsivo** — layout adaptável para desktop, tablet e mobile

## Requisitos

- Node.js 18+
- npm

## Início rápido

```bash
cd gerenciador-bookmarks
npm install
npm run dev
```

O servidor de desenvolvimento inicia em `http://localhost:4321`.

## Scripts

| Comando           | Descrição                        |
| ----------------- | -------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento      |
| `npm run build`   | Build de produção                |
| `npm run preview` | Preview do build de produção     |
| `npm test`        | Executar testes (Vitest)         |
| `npm run test:watch` | Testes em modo watch          |

## Estrutura do projeto

```
src/
├── components/     # Componentes Solid.js (App, BookmarkCard, SearchBar, etc.)
├── data/           # Tipos, serviços e dados JSON
├── layouts/        # Layout base Astro
├── lib/            # API client para comunicação frontend → backend
├── pages/          # Páginas Astro e API routes
│   ├── api/        # Endpoints REST (bookmarks, bundles, tags, import/export)
│   └── index.astro # Página principal
public/
├── sw.js           # Service Worker
└── search-worker.js # Web Worker para busca
```

## API

Todos os endpoints estão em `/api/`:

| Método | Endpoint                | Descrição                     |
| ------ | ----------------------- | ----------------------------- |
| GET    | `/api/bookmarks`        | Listar bookmarks (com filtros)|
| POST   | `/api/bookmarks`        | Criar bookmark                |
| GET    | `/api/bookmarks/:id`    | Obter bookmark por ID         |
| PUT    | `/api/bookmarks/:id`    | Atualizar bookmark            |
| DELETE | `/api/bookmarks/:id`    | Excluir bookmark              |
| GET    | `/api/tags`             | Listar todas as tags          |
| GET    | `/api/bundles`          | Listar bundles                |
| POST   | `/api/bundles`          | Criar bundle                  |
| GET    | `/api/bundles/:id`      | Obter bundle com bookmarks    |
| PUT    | `/api/bundles/:id`      | Atualizar bundle              |
| DELETE | `/api/bundles/:id`      | Excluir bundle                |
| POST   | `/api/import`           | Importar bookmarks (JSON/CSV) |
| GET    | `/api/export`           | Exportar dados (?format=json\|csv) |

### Parâmetros de busca (GET /api/bookmarks)

- `q` — texto de busca
- `tags` — tags separadas por vírgula
- `favorites` — `true` para apenas favoritos
- `bundle` — ID do bundle
- `page` — página (padrão: 1)
- `limit` — itens por página (padrão: 20)

## Stack

- [Astro](https://astro.build/) — Framework web
- [Solid.js](https://www.solidjs.com/) — UI reativa
- [Tailwind CSS](https://tailwindcss.com/) — Estilização
- [Vitest](https://vitest.dev/) — Testes
