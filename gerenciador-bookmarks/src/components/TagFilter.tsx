import { For, Show, createMemo, createSignal } from 'solid-js';

interface TagInfo {
  tag: string;
  count: number;
}

interface Props {
  tags: TagInfo[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}

export default function TagFilter(props: Props) {
  const [tagQuery, setTagQuery] = createSignal('');

  const filteredTags = createMemo(() => {
    const q = tagQuery().toLowerCase();
    if (!q) return props.tags;
    return props.tags.filter((t) => t.tag.toLowerCase().includes(q));
  });

  const grouped = createMemo(() => {
    const groups = new Map<string, TagInfo[]>();
    for (const t of filteredTags()) {
      const letter = t.tag[0].toLowerCase();
      if (!groups.has(letter)) groups.set(letter, []);
      groups.get(letter)!.push(t);
    }
    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  });

  return (
    <div>
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-verde-belic-500 dark:text-verde-belic-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
          <h2 class="text-xs font-semibold text-verde-belic-600 dark:text-verde-belic-400 uppercase tracking-wide">
            Tags
          </h2>
        </div>
        {props.selectedTags.length > 0 && (
          <button
            onClick={props.onClear}
            class="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Limpar
          </button>
        )}
      </div>
      <div class="relative mb-2">
        <svg class="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Filtrar tags..."
          value={tagQuery()}
          onInput={(e) => setTagQuery(e.currentTarget.value)}
          class="w-full pl-7 pr-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-verde-belic-400 dark:focus:border-verde-belic-500 transition-colors"
        />
        <Show when={tagQuery()}>
          <button
            onClick={() => setTagQuery('')}
            class="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </Show>
      </div>
      <div class="space-y-1.5">
        <Show when={filteredTags().length > 0} fallback={
          <p class="text-[10px] text-gray-400 py-1">Nenhuma tag encontrada</p>
        }>
          <For each={grouped()}>
            {([, tags]) => (
              <div class="flex flex-wrap gap-1">
                <For each={tags}>
                  {(t) => {
                    const isSelected = () => props.selectedTags.includes(t.tag);
                    return (
                      <button
                        onClick={() => props.onToggle(t.tag)}
                        class="px-2 py-0.5 text-xs rounded transition-colors"
                        classList={{
                          'bg-verde-belic-600 text-white': isSelected(),
                          'text-verde-belic-700 dark:text-verde-belic-300 hover:bg-verde-belic-100 dark:hover:bg-verde-belic-900': !isSelected(),
                        }}
                      >
                        {t.tag}
                        <span class="opacity-50 ml-0.5">{t.count}</span>
                      </button>
                    );
                  }}
                </For>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}
