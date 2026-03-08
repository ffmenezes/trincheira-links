import { For } from 'solid-js';

interface Props {
  bundles: string[];
  selectedBundle: string | null;
  onSelectBundle: (bundle: string | null) => void;
}

export default function BundleFilter(props: Props) {
  return (
    <div>
      <div class="flex items-center gap-1.5 mb-2">
        <svg class="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
        <h2 class="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
          Bundles
        </h2>
      </div>
      <div class="flex flex-col gap-1">
        <button
          onClick={() => props.onSelectBundle(null)}
          class="text-left px-2 py-1 text-xs rounded-md border transition-colors flex items-center gap-1.5"
          classList={{
            'bg-amber-500 border-amber-500 text-white dark:bg-amber-600 dark:border-amber-600': !props.selectedBundle,
            'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950': !!props.selectedBundle,
          }}
        >
          Todos
        </button>
        <For each={props.bundles}>
          {(bundle) => (
            <button
              onClick={() => props.onSelectBundle(bundle)}
              class="text-left px-2 py-1 text-xs rounded-md border transition-colors flex items-center gap-1.5"
              classList={{
                'bg-amber-500 border-amber-500 text-white dark:bg-amber-600 dark:border-amber-600': props.selectedBundle === bundle,
                'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950': props.selectedBundle !== bundle,
              }}
            >
              <svg class="w-3 h-3 shrink-0 opacity-60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
              {bundle}
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
