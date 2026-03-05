import { createSignal, createMemo, createEffect, onMount, onCleanup, Show, For } from 'solid-js';
import type { Bookmark } from '../data/types';
import BookmarkCard from './BookmarkCard';
import SearchBar from './SearchBar';
import TagFilter from './TagFilter';
import BundleFilter from './BundleFilter';
import DarkModeToggle from './DarkModeToggle';

interface AppData {
  bookmarks: Bookmark[];
  tags: { tag: string; count: number }[];
  bundles: string[];
}

type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';

function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get('q') ?? '',
    tags: params.get('tags')?.split(',').filter(Boolean) ?? [],
    bundle: params.get('bundle') ?? null,
    fav: params.get('fav') === '1',
    sort: (params.get('sort') as SortOption) || 'name-asc',
  };
}

function writeUrlParams(q: string, tags: string[], bundle: string | null, fav: boolean, sort: SortOption) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (tags.length > 0) params.set('tags', tags.join(','));
  if (bundle) params.set('bundle', bundle);
  if (fav) params.set('fav', '1');
  if (sort !== 'name-asc') params.set('sort', sort);
  const str = params.toString();
  const url = str ? `${window.location.pathname}?${str}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

export default function App() {
  const initial = typeof window !== 'undefined' ? readUrlParams() : { q: '', tags: [], bundle: null, fav: false, sort: 'name-asc' as SortOption };
  const [data, setData] = createSignal<AppData | null>(null);
  const [query, setQuery] = createSignal(initial.q);
  const [selectedTags, setSelectedTags] = createSignal<string[]>(initial.tags);
  const [favoritesOnly, setFavoritesOnly] = createSignal(initial.fav);
  const [selectedBundle, setSelectedBundle] = createSignal<string | null>(initial.bundle);
  const [sortBy, setSortBy] = createSignal<SortOption>(initial.sort);
  const [favorites, setFavorites] = createSignal<Set<string>>(new Set());
  const [showScrollTop, setShowScrollTop] = createSignal(false);

  onMount(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > window.innerHeight);
    window.addEventListener('scroll', onScroll, { passive: true });
    onCleanup(() => window.removeEventListener('scroll', onScroll));
    const raw = (window as any).__BOOKMARKS_DATA__;
    if (raw) setData(raw);
    try {
      const stored = localStorage.getItem('trincheira-favorites');
      if (stored) setFavorites(new Set(JSON.parse(stored)));
    } catch {}
  });

  createEffect(() => {
    writeUrlParams(query(), selectedTags(), selectedBundle(), favoritesOnly(), sortBy());
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem('trincheira-favorites', JSON.stringify([...next]));
      return next;
    });
  };

  const isFavorite = (id: string) => favorites().has(id);

  const filtered = createMemo(() => {
    const d = data();
    if (!d) return [];
    let results = d.bookmarks;

    const q = query().toLowerCase();
    if (q) {
      results = results.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          (b.description ?? '').toLowerCase().includes(q) ||
          b.link.toLowerCase().includes(q) ||
          b.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (selectedTags().length > 0) {
      results = results.filter((b) =>
        selectedTags().every((tag) => b.tags.includes(tag))
      );
    }

    if (favoritesOnly()) {
      results = results.filter((b) => favorites().has(b.id));
    }

    const bundle = selectedBundle();
    if (bundle) {
      results = results.filter((b) => (b.bundles ?? []).includes(bundle));
    }

    return results;
  });

  const sorted = createMemo(() => {
    const items = [...filtered()];
    const favs = favorites();
    const sort = sortBy();
    const compare = (a: Bookmark, b: Bookmark) => {
      switch (sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name, 'pt-BR');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'pt-BR');
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    };
    return items.sort((a, b) => {
      const aFav = favs.has(a.id) ? 0 : 1;
      const bFav = favs.has(b.id) ? 0 : 1;
      if (aFav !== bFav) return aFav - bFav;
      return compare(a, b);
    });
  });

  const availableTags = createMemo(() => {
    const items = filtered();
    const counts = new Map<string, number>();
    for (const b of items) {
      for (const tag of b.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    for (const tag of selectedTags()) {
      if (!counts.has(tag)) counts.set(tag, 0);
    }
    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag));
  });

  const handleSearch = (q: string) => { setQuery(q); };
  const handleClearSearch = () => { setQuery(''); };
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
  const handleClearTags = () => { setSelectedTags([]); };
  const handleToggleFavorites = () => { setFavoritesOnly((prev) => !prev); };
  const handleTagClick = (tag: string) => {
    if (!selectedTags().includes(tag)) handleTagToggle(tag);
  };

  return (
    <div class="max-w-7xl mx-auto px-4 py-8">
      <header class="mb-8 flex items-start justify-between">
        <div>
          <h1
            onClick={() => {
              setQuery('');
              setSelectedTags([]);
              setSelectedBundle(null);
              setFavoritesOnly(false);
              setSortBy('name-asc');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            class="text-2xl font-bold font-mono uppercase tracking-widest text-verde-belic-600 dark:text-verde-belic-400 cursor-pointer hover:opacity-80 transition-opacity"
          >
            Trincheira Links
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Repositório de links da{' '}
            <a href="https://trincheira.dev" target="_blank" rel="noopener noreferrer" class="text-verde-belic-500 hover:text-verde-belic-400 underline">
              trincheira.dev
            </a>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <a
            href="https://github.com/ffmenezes/trincheira-links"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-verde-belic-500 dark:hover:text-verde-belic-400 transition-colors"
            title="Ver no GitHub"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <DarkModeToggle />
        </div>
      </header>

      <div class="flex gap-8">
        {/* Main content */}
        <main class="flex-1 min-w-0">
          <div class="mb-4">
            <SearchBar value={query()} onSearch={handleSearch} onClear={handleClearSearch} />
          </div>

          {/* Mobile filters */}
          <div class="lg:hidden mb-4 space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              <button
                onClick={handleToggleFavorites}
                class="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-colors"
                classList={{
                  'bg-yellow-500 text-white dark:bg-yellow-600': favoritesOnly(),
                  'text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400': !favoritesOnly(),
                }}
              >
                <svg class="w-3.5 h-3.5" fill={favoritesOnly() ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Favoritos
              </button>
            </div>

            <Show when={data() && data()!.bundles.length > 0}>
              <div class="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedBundle(null)}
                  class="px-2 py-0.5 text-[11px] rounded-full border transition-colors"
                  classList={{
                    'bg-verde-belic-600 border-verde-belic-600 text-white': !selectedBundle(),
                    'border-verde-belic-200 text-verde-belic-700 dark:border-verde-belic-700 dark:text-verde-belic-300': !!selectedBundle(),
                  }}
                >
                  Todos
                </button>
                <For each={data()!.bundles}>
                  {(bundle) => (
                    <button
                      onClick={() => setSelectedBundle(bundle)}
                      class="px-2 py-0.5 text-[11px] rounded-full border transition-colors"
                      classList={{
                        'bg-verde-belic-600 border-verde-belic-600 text-white': selectedBundle() === bundle,
                        'border-verde-belic-200 text-verde-belic-700 dark:border-verde-belic-700 dark:text-verde-belic-300': selectedBundle() !== bundle,
                      }}
                    >
                      {bundle}
                    </button>
                  )}
                </For>
              </div>
            </Show>

            <Show when={availableTags().length > 0}>
              <div class="flex flex-wrap gap-1">
                <For each={availableTags()}>
                  {(t) => {
                    const isSelected = () => selectedTags().includes(t.tag);
                    return (
                      <button
                        onClick={() => handleTagToggle(t.tag)}
                        class="px-2 py-0.5 text-[11px] rounded-full border transition-colors"
                        classList={{
                          'bg-verde-belic-600 border-verde-belic-600 text-white': isSelected(),
                          'border-verde-belic-200 text-verde-belic-700 dark:border-verde-belic-700 dark:text-verde-belic-300': !isSelected(),
                        }}
                      >
                        {t.tag}
                        <span class="opacity-50 ml-0.5">{t.count}</span>
                      </button>
                    );
                  }}
                </For>
                {selectedTags().length > 0 && (
                  <button
                    onClick={handleClearTags}
                    class="px-2 py-0.5 text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </Show>
          </div>

          <div class="flex items-center justify-between mb-4">
            <p class="text-xs text-gray-400" aria-live="polite">
              {filtered().length} bookmark{filtered().length !== 1 ? 's' : ''}{' '}
              encontrado{filtered().length !== 1 ? 's' : ''}
            </p>
            <select
              value={sortBy()}
              onChange={(e) => { setSortBy(e.target.value as SortOption); }}
              class="text-xs border border-verde-belic-200 rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-verde-belic-700 text-gray-600 dark:text-gray-300"
            >
              <option value="date-desc">Mais recentes</option>
              <option value="date-asc">Mais antigos</option>
              <option value="name-asc">Nome A-Z</option>
              <option value="name-desc">Nome Z-A</option>
            </select>
          </div>

          <Show
            when={sorted().length > 0}
            fallback={<div class="text-center py-12 text-gray-400">Nenhum bookmark encontrado</div>}
          >
            <div class="flex flex-col gap-3">
              <For each={sorted()}>
                {(bookmark) => (
                  <BookmarkCard
                    bookmark={bookmark}
                    onTagClick={handleTagClick}
                    isFavorite={isFavorite(bookmark.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                )}
              </For>
            </div>
          </Show>
        </main>

        {/* Sidebar - right */}
        <aside class="hidden lg:block w-56 shrink-0">
          <div class="space-y-6">
            <button
              onClick={handleToggleFavorites}
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors"
              classList={{
                'bg-yellow-500 text-white dark:bg-yellow-600': favoritesOnly(),
                'text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400': !favoritesOnly(),
              }}
            >
              <svg class="w-3.5 h-3.5" fill={favoritesOnly() ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Favoritos
            </button>

            <Show when={data() && data()!.bundles.length > 0}>
              <BundleFilter
                bundles={data()!.bundles}
                selectedBundle={selectedBundle()}
                onSelectBundle={(id) => { setSelectedBundle(id); }}
              />
            </Show>

            <Show when={availableTags().length > 0}>
              <TagFilter
                tags={availableTags()}
                selectedTags={selectedTags()}
                onToggle={handleTagToggle}
                onClear={handleClearTags}
              />
            </Show>
          </div>
        </aside>
      </div>

      <Show when={showScrollTop()}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Voltar ao topo"
          class="fixed bottom-6 right-6 p-3 rounded-full bg-verde-belic-500 text-white shadow-lg hover:bg-verde-belic-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </Show>
    </div>
  );
}
