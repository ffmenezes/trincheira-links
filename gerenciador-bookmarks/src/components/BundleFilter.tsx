import { For } from 'solid-js';

interface Props {
  bundles: string[];
  selectedBundle: string | null;
  onSelectBundle: (bundle: string | null) => void;
}

export default function BundleFilter(props: Props) {
  return (
    <div>
      <h2 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
        Bundles
      </h2>
      <div class="flex flex-col gap-1">
        <button
          onClick={() => props.onSelectBundle(null)}
          class="text-left px-1.5 py-0.5 text-xs rounded transition-colors"
          classList={{
            'bg-verde-belic-600 text-white': !props.selectedBundle,
            'text-verde-belic-700 dark:text-verde-belic-300 hover:bg-verde-belic-100 dark:hover:bg-verde-belic-900': !!props.selectedBundle,
          }}
        >
          Todos
        </button>
        <For each={props.bundles}>
          {(bundle) => (
            <button
              onClick={() => props.onSelectBundle(bundle)}
              class="text-left px-1.5 py-0.5 text-xs rounded transition-colors"
              classList={{
                'bg-verde-belic-600 text-white': props.selectedBundle === bundle,
                'text-verde-belic-700 dark:text-verde-belic-300 hover:bg-verde-belic-100 dark:hover:bg-verde-belic-900': props.selectedBundle !== bundle,
              }}
            >
              {bundle}
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
