import { For } from 'solid-js';
import type { BundleFilterValue } from './App';
import { NO_BUNDLE } from './App';

interface Props {
  bundles: string[];
  selectedBundle: BundleFilterValue;
  bundleExclude: boolean;
  onSelectBundle: (bundle: BundleFilterValue) => void;
  onSetInclude: (bundle: BundleFilterValue) => void;
  onSetExclude: (bundle: BundleFilterValue) => void;
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
          {(bundle) => {
            const isSelected = () => props.selectedBundle === bundle;
            return (
              <span class="flex items-center gap-0.5">
                <button
                  onClick={() => props.onSelectBundle(bundle)}
                  class="text-left px-2 py-1 text-xs rounded-md border transition-colors flex items-center gap-1.5 flex-1"
                  classList={{
                    'bg-amber-500 border-amber-500 text-white dark:bg-amber-600 dark:border-amber-600': isSelected(),
                    'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950': !isSelected(),
                  }}
                >
                  <svg class="w-3 h-3 shrink-0 opacity-60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                  {bundle}
                </button>
                <button
                  onClick={() => props.onSetInclude(bundle)}
                  title="Incluir"
                  class="w-5 h-5 flex items-center justify-center rounded text-[10px] font-medium transition-colors shrink-0"
                  classList={{
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400': isSelected() && !props.bundleExclude,
                    'text-emerald-600/70 dark:text-emerald-500/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50': !isSelected() || props.bundleExclude,
                  }}
                >
                  +
                </button>
                <button
                  onClick={() => props.onSetExclude(bundle)}
                  title="Excluir"
                  class="w-5 h-5 flex items-center justify-center rounded text-[10px] font-medium transition-colors shrink-0"
                  classList={{
                    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400': isSelected() && props.bundleExclude,
                    'text-rose-600/70 dark:text-rose-500/60 hover:bg-rose-50 dark:hover:bg-rose-950/50': !isSelected() || !props.bundleExclude,
                  }}
                >
                  −
                </button>
              </span>
            );
          }}
        </For>
        <span class="flex items-center gap-0.5">
          <button
            onClick={() => props.onSelectBundle(NO_BUNDLE)}
            class="text-left px-2 py-1 text-xs rounded-md border transition-colors flex items-center gap-1.5 flex-1"
            classList={{
              'bg-amber-500 border-amber-500 text-white dark:bg-amber-600 dark:border-amber-600': props.selectedBundle === NO_BUNDLE,
              'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950': props.selectedBundle !== NO_BUNDLE,
            }}
          >
            <svg class="w-3 h-3 shrink-0 opacity-60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            Sem bundle
          </button>
          <button
            onClick={() => props.onSetInclude(NO_BUNDLE)}
            title="Incluir"
            class="w-5 h-5 flex items-center justify-center rounded text-[10px] font-medium transition-colors shrink-0"
            classList={{
              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400': props.selectedBundle === NO_BUNDLE && !props.bundleExclude,
              'text-emerald-600/70 dark:text-emerald-500/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50': props.selectedBundle !== NO_BUNDLE || props.bundleExclude,
            }}
          >
            +
          </button>
          <button
            onClick={() => props.onSetExclude(NO_BUNDLE)}
            title="Excluir"
            class="w-5 h-5 flex items-center justify-center rounded text-[10px] font-medium transition-colors shrink-0"
            classList={{
              'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400': props.selectedBundle === NO_BUNDLE && props.bundleExclude,
              'text-rose-600/70 dark:text-rose-500/60 hover:bg-rose-50 dark:hover:bg-rose-950/50': props.selectedBundle !== NO_BUNDLE || !props.bundleExclude,
            }}
          >
            −
          </button>
        </span>
      </div>
    </div>
  );
}
