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

export const NO_BUNDLE = '__no_bundle__' as const;
export type BundleFilterValue = string | null;

export interface TagFilterItem {
  tag: string;
  exclude: boolean;
}

function parseTagParam(val: string | null): TagFilterItem[] {
  if (!val) return [];
  return val.split(',').filter(Boolean).map((s) => {
    const exclude = s.startsWith('-');
    return { tag: exclude ? s.slice(1) : s, exclude };
  });
}

function serializeTagParam(items: TagFilterItem[]): string | null {
  if (items.length === 0) return null;
  return items.map(({ tag, exclude }) => (exclude ? `-${tag}` : tag)).join(',');
}

function parseBundleParam(val: string | null): { bundle: BundleFilterValue; exclude: boolean } {
  if (!val) return { bundle: null, exclude: false };
  const exclude = val.startsWith('-');
  const raw = exclude ? val.slice(1) : val;
  const bundle = raw === 'none' ? NO_BUNDLE : raw;
  return { bundle, exclude };
}

function serializeBundleParam(bundle: BundleFilterValue, exclude: boolean): string | null {
  if (!bundle) return null;
  const val = bundle === NO_BUNDLE ? 'none' : bundle;
  return exclude ? `-${val}` : val;
}

function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const bundleParsed = parseBundleParam(params.get('bundle'));
  return {
    q: params.get('q') ?? '',
    tagFilters: parseTagParam(params.get('tags')),
    bundle: bundleParsed.bundle,
    bundleExclude: bundleParsed.exclude,
    fav: params.get('fav') === '1',
    sort: (params.get('sort') as SortOption) || 'date-desc',
  };
}

function writeUrlParams(
  q: string,
  tagFilters: TagFilterItem[],
  bundle: BundleFilterValue,
  bundleExclude: boolean,
  fav: boolean,
  sort: SortOption
) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  const tags = serializeTagParam(tagFilters);
  if (tags) params.set('tags', tags);
  const b = serializeBundleParam(bundle, bundleExclude);
  if (b) params.set('bundle', b);
  if (fav) params.set('fav', '1');
  if (sort !== 'date-desc') params.set('sort', sort);
  const str = params.toString();
  const url = str ? `${window.location.pathname}?${str}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

export default function App() {
  const initial = typeof window !== 'undefined' ? readUrlParams() : { q: '', tagFilters: [], bundle: null, bundleExclude: false, fav: false, sort: 'date-desc' as SortOption };
  const [data, setData] = createSignal<AppData | null>(null);
  const [query, setQuery] = createSignal(initial.q);
  const [tagFilters, setTagFilters] = createSignal<TagFilterItem[]>(initial.tagFilters);
  const [favoritesOnly, setFavoritesOnly] = createSignal(initial.fav);
  const [selectedBundle, setSelectedBundle] = createSignal<BundleFilterValue>(initial.bundle);
  const [bundleExclude, setBundleExclude] = createSignal(initial.bundleExclude);
  const [sortBy, setSortBy] = createSignal<SortOption>(initial.sort);
  const [favorites, setFavorites] = createSignal<Set<string>>(new Set());
  const [favoritesOnTop, setFavoritesOnTop] = createSignal(true);
  const [showScrollTop, setShowScrollTop] = createSignal(false);
  const [mobileBundlesExpanded, setMobileBundlesExpanded] = createSignal(false);
  const [mobileTagsExpanded, setMobileTagsExpanded] = createSignal(false);

  onMount(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > window.innerHeight);
    window.addEventListener('scroll', onScroll, { passive: true });
    onCleanup(() => window.removeEventListener('scroll', onScroll));
    const raw = (window as any).__BOOKMARKS_DATA__;
    if (raw) setData(raw);
    try {
      const stored = localStorage.getItem('trincheira-favorites');
      if (stored) setFavorites(new Set(JSON.parse(stored)));

      const storedTop = localStorage.getItem('trincheira-favorites-on-top');
      if (storedTop !== null) setFavoritesOnTop(JSON.parse(storedTop));
    } catch {}
  });

  createEffect(() => {
    writeUrlParams(query(), tagFilters(), selectedBundle(), bundleExclude(), favoritesOnly(), sortBy());
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

  const handleToggleFavoritesOnTop = () => {
    setFavoritesOnTop((prev) => {
      const next = !prev;
      localStorage.setItem('trincheira-favorites-on-top', JSON.stringify(next));
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

    const tags = tagFilters();
    if (tags.length > 0) {
      results = results.filter((b) =>
        tags.every(({ tag, exclude }) => (exclude ? !b.tags.includes(tag) : b.tags.includes(tag)))
      );
    }

    if (favoritesOnly()) {
      results = results.filter((b) => favorites().has(b.id));
    }

    const bundle = selectedBundle();
    const bundleExc = bundleExclude();
    if (bundle) {
      if (bundle === NO_BUNDLE) {
        const hasNoBundle = (b: Bookmark) => (b.bundles ?? []).length === 0;
        results = results.filter((b) => (bundleExc ? !hasNoBundle(b) : hasNoBundle(b)));
      } else {
        const inBundle = (b: Bookmark) => (b.bundles ?? []).includes(bundle);
        results = results.filter((b) => (bundleExc ? !inBundle(b) : inBundle(b)));
      }
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
      if (favoritesOnTop()) {
        const aFav = favs.has(a.id) ? 0 : 1;
        const bFav = favs.has(b.id) ? 0 : 1;
        if (aFav !== bFav) return aFav - bFav;
      }
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
    for (const { tag } of tagFilters()) {
      if (!counts.has(tag)) counts.set(tag, 0);
    }
    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag));
  });

  const handleSearch = (q: string) => { setQuery(q); };
  const handleClearSearch = () => { setQuery(''); };
  const handleTagToggle = (tag: string) => {
    setTagFilters((prev) => {
      const idx = prev.findIndex((t) => t.tag === tag);
      if (idx >= 0) return prev.filter((_, i) => i !== idx);
      return [...prev, { tag, exclude: false }];
    });
  };
  const handleTagSetInclude = (tag: string) => {
    setTagFilters((prev) => {
      const idx = prev.findIndex((t) => t.tag === tag);
      if (idx >= 0) {
        if (prev[idx].exclude) return prev.map((t, i) => (i === idx ? { ...t, exclude: false } : t));
        return prev.filter((_, i) => i !== idx);
      }
      return [...prev, { tag, exclude: false }];
    });
  };
  const handleTagSetExclude = (tag: string) => {
    setTagFilters((prev) => {
      const idx = prev.findIndex((t) => t.tag === tag);
      if (idx >= 0) {
        if (!prev[idx].exclude) return prev.map((t, i) => (i === idx ? { ...t, exclude: true } : t));
        return prev.filter((_, i) => i !== idx);
      }
      return [...prev, { tag, exclude: true }];
    });
  };
  const handleClearTags = () => { setTagFilters([]); };
  const handleToggleFavorites = () => { setFavoritesOnly((prev) => !prev); };
  const handleTagClick = (tag: string) => {
    if (!tagFilters().some((t) => t.tag === tag)) handleTagToggle(tag);
  };
  const handleBundleSetInclude = (bundle: BundleFilterValue) => {
    if (selectedBundle() === bundle && !bundleExclude()) {
      setSelectedBundle(null);
      setBundleExclude(false);
    } else {
      setSelectedBundle(bundle);
      setBundleExclude(false);
    }
  };
  const handleBundleSetExclude = (bundle: BundleFilterValue) => {
    if (selectedBundle() === bundle && bundleExclude()) {
      setSelectedBundle(null);
      setBundleExclude(false);
    } else {
      setSelectedBundle(bundle);
      setBundleExclude(true);
    }
  };

  return (
    <div class="max-w-7xl mx-auto px-4 py-8">
      <header class="mb-8 flex items-start justify-between">
        <div>
          <h1
            onClick={() => {
              setQuery('');
              setTagFilters([]);
              setSelectedBundle(null);
              setBundleExclude(false);
              setFavoritesOnly(false);
              setSortBy('date-desc');
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
                class="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-colors shrink-0"
                classList={{
                  'bg-yellow-500 text-white dark:bg-yellow-600': favoritesOnly(),
                  'text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400': !favoritesOnly(),
                }}
              >
                <svg class="w-3.5 h-3.5 shrink-0" fill={favoritesOnly() ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Favoritos
              </button>

              <button
                onClick={handleToggleFavoritesOnTop}
                title={favoritesOnTop() ? "Favoritos fixados no topo" : "Fixar favoritos no topo"}
                class="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-colors shrink-0"
                classList={{
                  'bg-yellow-500 text-white dark:bg-yellow-600': favoritesOnTop(),
                  'text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400 border border-gray-200 dark:border-gray-800': !favoritesOnTop(),
                }}
              >
                <svg class="w-3.5 h-3.5 shrink-0" fill={favoritesOnTop() ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M15 4.5l-4 4L7 10l-1.5 1.5 7 7L14 17l1.5-4 4-4-4.5-4.5Z" />
                  <path d="m9 15-4.5 4.5" />
                </svg>
                {favoritesOnTop() ? "No topo" : "Ordem normal"}
              </button>
            </div>

            <Show when={data() && data()!.bundles.length > 0}>
              <div class="border border-amber-200 dark:border-amber-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => setMobileBundlesExpanded((p) => !p)}
                  class="w-full flex items-center justify-between gap-2 px-3 py-2 text-left hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                >
                  <div class="flex items-center gap-1">
                    <svg class="w-3 h-3 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                    <span class="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Bundles</span>
                  </div>
                  <svg class="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 transition-transform" classList={{ 'rotate-180': mobileBundlesExpanded() }} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <Show when={mobileBundlesExpanded()}>
                  <div class="px-3 pb-3 pt-2 flex flex-wrap gap-1.5 border-t border-amber-200 dark:border-amber-800">
                  <button
                    onClick={() => { setSelectedBundle(null); setBundleExclude(false); }}
                    class="px-2 py-0.5 text-[11px] rounded-full border transition-colors"
                    classList={{
                      'bg-amber-500 border-amber-500 text-white dark:bg-amber-600 dark:border-amber-600': !selectedBundle(),
                      'border-amber-200 text-amber-700 dark:border-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950': !!selectedBundle(),
                    }}
                  >
                    Todos
                  </button>
                  <For each={data()!.bundles}>
                    {(bundle) => {
                      const isSelected = () => selectedBundle() === bundle;
                      return (
                        <span class="inline-flex items-center gap-0.5">
                          <button
                            onClick={() => { setSelectedBundle(bundle); setBundleExclude(false); }}
                            class="px-2 py-0.5 text-[11px] rounded-full border transition-colors flex items-center gap-1"
                            classList={{
                              'bg-amber-500 border-amber-500 text-white dark:bg-amber-600 dark:border-amber-600': isSelected(),
                              'border-amber-200 text-amber-700 dark:border-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950': !isSelected(),
                            }}
                          >
                            <svg class="w-2.5 h-2.5 shrink-0 opacity-60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                            </svg>
                            {bundle}
                          </button>
                          <button
                            onClick={() => handleBundleSetInclude(bundle)}
                            title="Incluir"
                            class="w-5 h-5 flex items-center justify-center rounded text-[10px] font-medium transition-colors shrink-0"
                            classList={{
                              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400': isSelected() && !bundleExclude(),
                              'text-emerald-600/70 dark:text-emerald-500/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50': !isSelected() || bundleExclude(),
                            }}
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleBundleSetExclude(bundle)}
                            title="Excluir"
                            class="w-5 h-5 flex items-center justify-center rounded text-[10px] font-medium transition-colors shrink-0"
                            classList={{
                              'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400': isSelected() && bundleExclude(),
                              'text-rose-600/70 dark:text-rose-500/60 hover:bg-rose-50 dark:hover:bg-rose-950/50': !isSelected() || !bundleExclude(),
                            }}
                          >
                            −
                          </button>
                        </span>
                      );
                    }}
                  </For>
                  <span class="inline-flex items-center gap-0.5">
                    <button
                      onClick={() => { setSelectedBundle(NO_BUNDLE); setBundleExclude(false); }}
                      class="px-2 py-0.5 text-[11px] rounded-full border transition-colors flex items-center gap-1"
                      classList={{
                        'bg-amber-500 border-amber-500 text-white dark:bg-amber-600 dark:border-amber-600': selectedBundle() === NO_BUNDLE,
                        'border-amber-200 text-amber-700 dark:border-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950': selectedBundle() !== NO_BUNDLE,
                      }}
                    >
                      <svg class="w-2.5 h-2.5 shrink-0 opacity-60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      Sem bundle
                    </button>
                    <button
                      onClick={() => handleBundleSetInclude(NO_BUNDLE)}
                      title="Incluir"
                      class="w-5 h-5 flex items-center justify-center rounded text-[10px] font-medium transition-colors shrink-0"
                      classList={{
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400': selectedBundle() === NO_BUNDLE && !bundleExclude(),
                        'text-emerald-600/70 dark:text-emerald-500/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50': selectedBundle() !== NO_BUNDLE || bundleExclude(),
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleBundleSetExclude(NO_BUNDLE)}
                      title="Excluir"
                      class="w-5 h-5 flex items-center justify-center rounded text-[10px] font-medium transition-colors shrink-0"
                      classList={{
                        'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400': selectedBundle() === NO_BUNDLE && bundleExclude(),
                        'text-rose-600/70 dark:text-rose-500/60 hover:bg-rose-50 dark:hover:bg-rose-950/50': selectedBundle() !== NO_BUNDLE || !bundleExclude(),
                      }}
                    >
                      −
                    </button>
                  </span>
                  </div>
                </Show>
              </div>
            </Show>

            <Show when={availableTags().length > 0}>
              <div class="border border-verde-belic-200 dark:border-verde-belic-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => setMobileTagsExpanded((p) => !p)}
                  class="w-full flex items-center justify-between gap-2 px-3 py-2 text-left hover:bg-verde-belic-50 dark:hover:bg-verde-belic-950/30 transition-colors"
                >
                  <div class="flex items-center gap-1">
                    <svg class="w-3 h-3 text-verde-belic-500 dark:text-verde-belic-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                    <span class="text-[10px] font-semibold text-verde-belic-600 dark:text-verde-belic-400 uppercase tracking-wide">Tags</span>
                  </div>
                  <div class="flex items-center gap-2">
                    {tagFilters().length > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleClearTags(); }}
                        class="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        Limpar
                      </button>
                    )}
                    <svg class="w-3.5 h-3.5 text-verde-belic-500 dark:text-verde-belic-400 transition-transform" classList={{ 'rotate-180': mobileTagsExpanded() }} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>
                <Show when={mobileTagsExpanded()}>
                  <div class="px-3 pb-3 pt-2 flex flex-wrap gap-1 border-t border-verde-belic-200 dark:border-verde-belic-800">
                  <For each={availableTags()}>
                    {(t) => {
                      const tf = () => tagFilters().find((f) => f.tag === t.tag);
                      const isSelected = () => !!tf();
                      const isExclude = () => tf()?.exclude ?? false;
                      return (
                        <span class="inline-flex items-center gap-0.5">
                          <button
                            onClick={() => handleTagToggle(t.tag)}
                            class="px-2 py-0.5 text-[11px] rounded-full border transition-colors"
                            classList={{
                              'bg-verde-belic-600 border-verde-belic-600 text-white': isSelected() && !isExclude(),
                              'bg-red-500/80 border-red-500/80 text-white': isSelected() && isExclude(),
                              'border-verde-belic-200 text-verde-belic-700 dark:border-verde-belic-700 dark:text-verde-belic-300': !isSelected(),
                            }}
                          >
                            {t.tag}
                            <span class="opacity-50 ml-0.5">{t.count}</span>
                          </button>
                          <button
                            onClick={() => handleTagSetInclude(t.tag)}
                            title="Incluir"
                            class="w-5 h-5 flex items-center justify-center rounded text-[10px] font-medium transition-colors shrink-0"
                            classList={{
                              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400': isSelected() && !isExclude(),
                              'text-emerald-600/70 dark:text-emerald-500/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50': !isSelected() || isExclude(),
                            }}
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleTagSetExclude(t.tag)}
                            title="Excluir"
                            class="w-5 h-5 flex items-center justify-center rounded text-[10px] font-medium transition-colors shrink-0"
                            classList={{
                              'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400': isSelected() && isExclude(),
                              'text-rose-600/70 dark:text-rose-500/60 hover:bg-rose-50 dark:hover:bg-rose-950/50': !isSelected() || !isExclude(),
                            }}
                          >
                            −
                          </button>
                        </span>
                      );
                    }}
                  </For>
                  </div>
                </Show>
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
            <div class="flex items-center gap-2">
              <button
                onClick={handleToggleFavorites}
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors shrink-0"
                classList={{
                  'bg-yellow-500 text-white dark:bg-yellow-600': favoritesOnly(),
                  'text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400': !favoritesOnly(),
                }}
              >
                <svg class="w-3.5 h-3.5 shrink-0" fill={favoritesOnly() ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Favoritos
              </button>

              <button
                onClick={handleToggleFavoritesOnTop}
                title={favoritesOnTop() ? "Favoritos fixados no topo" : "Fixar favoritos no topo"}
                class="flex items-center justify-center w-8 h-8 rounded-full transition-colors shrink-0"
                classList={{
                  'bg-yellow-500 text-white dark:bg-yellow-600': favoritesOnTop(),
                  'text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400 border border-gray-200 dark:border-gray-800': !favoritesOnTop(),
                }}
              >
                <svg class="w-3.5 h-3.5 shrink-0" fill={favoritesOnTop() ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M15 4.5l-4 4L7 10l-1.5 1.5 7 7L14 17l1.5-4 4-4-4.5-4.5Z" />
                  <path d="m9 15-4.5 4.5" />
                </svg>
              </button>
            </div>

            <Show when={data() && data()!.bundles.length > 0}>
              <BundleFilter
                bundles={data()!.bundles}
                selectedBundle={selectedBundle()}
                bundleExclude={bundleExclude()}
                onSelectBundle={(id) => { setSelectedBundle(id); setBundleExclude(false); }}
                onSetInclude={handleBundleSetInclude}
                onSetExclude={handleBundleSetExclude}
              />
            </Show>

            <Show when={availableTags().length > 0}>
              <TagFilter
                tags={availableTags()}
                tagFilters={tagFilters()}
                onToggle={handleTagToggle}
                onSetInclude={handleTagSetInclude}
                onSetExclude={handleTagSetExclude}
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
