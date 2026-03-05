import { For, createMemo } from 'solid-js';

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
  const grouped = createMemo(() => {
    const groups = new Map<string, TagInfo[]>();
    for (const t of props.tags) {
      const letter = t.tag[0].toLowerCase();
      if (!groups.has(letter)) groups.set(letter, []);
      groups.get(letter)!.push(t);
    }
    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  });

  return (
    <div>
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Tags
        </h2>
        {props.selectedTags.length > 0 && (
          <button
            onClick={props.onClear}
            class="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Limpar
          </button>
        )}
      </div>
      <div class="space-y-1.5">
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
      </div>
    </div>
  );
}
