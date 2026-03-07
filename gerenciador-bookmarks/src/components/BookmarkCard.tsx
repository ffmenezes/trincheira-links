import type { Bookmark } from '../data/types';

interface Props {
  bookmark: Bookmark;
  onTagClick: (tag: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function BookmarkCard(props: Props) {
  return (
    <a
      href={props.bookmark.link}
      target="_blank"
      rel="noopener noreferrer"
      class="group flex border rounded-lg overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-[#242424]"
      classList={{
        'border-yellow-400/60 dark:border-yellow-500/40 hover:border-yellow-500 dark:hover:border-yellow-500/60': props.isFavorite,
        'border-verde-belic-200 dark:border-transparent hover:border-verde-belic-400 dark:hover:border-verde-belic-700': !props.isFavorite,
      }}
    >
      <div class="flex-1 min-w-0 p-4 flex flex-col">
        <div class="flex items-start gap-2">
          {props.bookmark.favicon && (
            <img
              src={props.bookmark.favicon}
              alt=""
              class="w-5 h-5 rounded mt-0.5 shrink-0"
              loading="lazy"
            />
          )}
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <h3 class="font-semibold text-verde-belic-600 dark:text-verde-belic-400 group-hover:text-verde-belic-500 truncate">
                {props.bookmark.name}
              </h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  props.onToggleFavorite(props.bookmark.id);
                }}
                class="shrink-0 transition-colors"
                classList={{
                  'text-yellow-500 hover:text-yellow-600': props.isFavorite,
                  'text-gray-300 hover:text-yellow-400 dark:text-gray-600 dark:hover:text-yellow-400': !props.isFavorite,
                }}
                aria-label={props.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <svg
                  class="w-4 h-4"
                  fill={props.isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            </div>
            <p class="text-xs text-verde-belic-600/60 dark:text-verde-belic-400/60 mt-0.5 truncate">
              {props.bookmark.link}
            </p>
          </div>
        </div>

        {props.bookmark.description && (
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">
            {props.bookmark.description}
          </p>
        )}

        <div class="mt-auto pt-2">
          <div class="flex flex-wrap gap-1">
            {props.bookmark.tags.map((tag) => (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  props.onTagClick(tag);
                }}
                class="px-2 py-0.5 text-xs rounded-full bg-verde-belic-100 dark:bg-verde-belic-950 text-verde-belic-700 dark:text-verde-belic-400 hover:bg-verde-belic-200 dark:hover:bg-verde-belic-900 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
          <div class="text-xs text-gray-400 mt-1.5">
            {new Date(props.bookmark.createdAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
          </div>
        </div>
      </div>

      <div class="hidden sm:block w-40 shrink-0 bg-gray-100 dark:bg-[#1a1a1a]">
        {props.bookmark.ogthumb ? (
          <img
            src={props.bookmark.ogthumb}
            alt={`Preview de ${props.bookmark.name}`}
            class="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div class="w-full h-full flex items-center justify-center">
            {props.bookmark.favicon ? (
              <img
                src={props.bookmark.favicon}
                alt=""
                class="w-8 h-8 rounded opacity-60"
                loading="lazy"
              />
            ) : (
              <svg class="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-6.364-6.364L4.5 8.25a4.5 4.5 0 006.364 6.364l4.5-4.5z" />
              </svg>
            )}
          </div>
        )}
      </div>
    </a>
  );
}
