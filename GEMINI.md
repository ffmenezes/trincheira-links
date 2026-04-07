# GEMINI.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Trincheira Links** (gerenciador-bookmarks) — a bookmark management web app for organizing and sharing links. All UI text is in Portuguese (pt-BR). Git-based workflow: each link is an `.mdx` file, new links are added via PR.

## Tech Stack

- **Framework:** Astro 4 with MDX Content Collections + Solid.js for reactive components
- **Styling:** Tailwind CSS with custom `verde-belic` color palette (#2d4c2d)
- **Language:** TypeScript + TSX
- **Data Storage:** MDX files in `src/content/links/` — no database, no server
- **Output:** 100% static site (no Node adapter)
- **Fonts:** Inter (sans), JetBrains Mono (mono)
- **Dark mode:** Tailwind `class` strategy, toggle with localStorage persistence

## Commands

All commands run from `gerenciador-bookmarks/`:

```bash
npm run dev      # Start dev server
npm run build    # Production build (static output to dist/)
npm run preview  # Preview production build
```

## Architecture

```
gerenciador-bookmarks/
├── src/
│   ├── content/
│   │   ├── config.ts             # Zod schema for links collection
│   │   └── links/                # One .mdx file per bookmark
│   │       ├── _template.mdx     # Template for contributors
│   │       └── *.mdx             # Bookmark entries
│   ├── data/
│   │   └── types.ts              # Bookmark interface
│   ├── pages/
│   │   └── index.astro           # Queries content collection, serializes to window.__BOOKMARKS_DATA__
│   ├── layouts/
│   │   └── Layout.astro          # HTML shell
│   └── components/
│       ├── App.tsx               # Main Solid.js app (client-side filtering, search, pagination, sort)
│       ├── BookmarkCard.tsx      # Read-only bookmark display card
│       ├── BundleFilter.tsx      # Bundle filter buttons
│       ├── SearchBar.tsx         # Search input with debounce
│       ├── TagFilter.tsx         # Incremental tag filter (shows only combinable tags)
│       └── DarkModeToggle.tsx    # Dark mode toggle
├── tests/
│   ├── integration.test.ts
│   ├── performance.test.ts
│   └── services.test.ts
├── astro.config.mjs              # Astro + Solid.js + Tailwind + MDX config
├── tailwind.config.mjs           # verde-belic palette, dark mode, custom fonts
└── vitest.config.ts              # Vitest config (jsdom)
```

## Key Patterns

- **Content Collections**: Each bookmark is a `.mdx` file with frontmatter (name, link, description, tags, bundles, etc.). At build time, `getCollection('links')` reads all entries.
- **Build-time serialization**: `index.astro` serializes bookmarks, tags, and bundles into `window.__BOOKMARKS_DATA__` via `<script is:inline define:vars>`.
- **Client-side only**: Solid.js `App` component reads from the global, does all filtering/search/pagination/sort in memory via `createSignal`/`createMemo`. No API calls, no mutations, no external store library.
- **Incremental tag filter**: After selecting a tag, only tags that exist in the remaining filtered results are shown.
- **Bundles**: Optional `bundles: ["name"]` field in frontmatter. No separate collection.
- **Data model**: Bookmarks have `id`, `name`, `link`, `tags`, `bundles`, `favorite`, `creator`, and optional OG metadata (`favicon`, `ogthumb`).
- **Features**: Search with debounce (200ms), tag/bundle filtering, favorites toggle, sort by date or name, pagination (20/page), dark mode.

## Adding a New Link

1. **Research the link:** Before adding, always search for the link on the internet (e.g., Google, GitHub, Twitter/X) to understand its context, purpose, and community reception. This ensures the description and tags are accurate and follow the taxonomy.
2. Copy `src/content/links/_template.mdx`
3. Rename to `slug-name.mdx` (lowercase, hyphen-separated, no date)
4. Fill in the frontmatter fields using the gathered research.
5. **createdAt:** Use full ISO 8601 datetime with time (e.g. `2026-03-07T14:30:00.000Z`), not just `00:00:00.000Z`. The time matters for "Mais recentes" sort — identical timestamps cause ties.
6. Submit a PR

## OpenSpec

The `openspec/` directory contains spec-driven change proposals:
- `openspec/specs/` — active specs (bookmark-system, full-text-search, link-bundles, minimal-theme, static-storage, tag-search)
- `openspec/changes/archive/` — completed change proposals
