import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Bookmark, Bundle } from '../src/data/types';

// In-memory data store for tests
let bookmarksData: Bookmark[] = [];
let bundlesData: Bundle[] = [];

vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn((filePath: string) => {
      if (filePath.includes('bookmarks.json')) {
        return JSON.stringify(bookmarksData);
      }
      if (filePath.includes('bundles.json')) {
        return JSON.stringify(bundlesData);
      }
      throw new Error(`Unknown file: ${filePath}`);
    }),
    writeFileSync: vi.fn((filePath: string, data: string) => {
      const parsed = JSON.parse(data);
      if (filePath.includes('bookmarks.json')) {
        bookmarksData = parsed;
      } else if (filePath.includes('bundles.json')) {
        bundlesData = parsed;
      }
    }),
  },
}));

const seedBookmarks: Bookmark[] = [
  {
    id: '1',
    name: 'Google',
    link: 'https://google.com',
    description: 'Motor de busca',
    createdAt: '2025-01-15T10:00:00.000Z',
    tags: ['pesquisa', 'utilitarios'],
    favicon: 'https://google.com/favicon.ico',
    ogthumb: '',
    creator: 'admin',
    favorite: true,
  },
  {
    id: '2',
    name: 'GitHub',
    link: 'https://github.com',
    description: 'Plataforma de desenvolvimento',
    createdAt: '2025-01-15T11:00:00.000Z',
    tags: ['desenvolvimento', 'codigo'],
    favicon: 'https://github.com/favicon.ico',
    ogthumb: '',
    creator: 'admin',
    favorite: false,
  },
  {
    id: '3',
    name: 'Stack Overflow',
    link: 'https://stackoverflow.com',
    description: 'Q&A para desenvolvedores',
    createdAt: '2025-01-15T12:00:00.000Z',
    tags: ['desenvolvimento', 'ajuda'],
    favicon: 'https://stackoverflow.com/favicon.ico',
    ogthumb: '',
    creator: 'admin',
    favorite: false,
  },
];

const seedBundles: Bundle[] = [
  {
    id: 'b1',
    name: 'Ferramentas Dev',
    description: 'Links de desenvolvimento',
    bookmarks: ['2', '3'],
    createdAt: '2025-01-15T13:00:00.000Z',
  },
];

beforeEach(() => {
  bookmarksData = structuredClone(seedBookmarks);
  bundlesData = structuredClone(seedBundles);
});

describe('Bookmark Service', async () => {
  const {
    getAllBookmarks,
    getBookmarkById,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    searchBookmarks,
    getAllTags,
  } = await import('../src/data/services');

  describe('getAllBookmarks', () => {
    it('returns all bookmarks with pagination', () => {
      const result = getAllBookmarks();
      expect(result.items).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
    });

    it('paginates correctly', () => {
      const result = getAllBookmarks(undefined, 1, 2);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(3);

      const page2 = getAllBookmarks(undefined, 2, 2);
      expect(page2.items).toHaveLength(1);
    });

    it('filters by text query across name, description, link, and tags', () => {
      const byName = getAllBookmarks({ query: 'google' });
      expect(byName.items).toHaveLength(1);
      expect(byName.items[0].name).toBe('Google');

      const byDesc = getAllBookmarks({ query: 'desenvolvedores' });
      expect(byDesc.items).toHaveLength(1);
      expect(byDesc.items[0].name).toBe('Stack Overflow');

      const byLink = getAllBookmarks({ query: 'github.com' });
      expect(byLink.items).toHaveLength(1);

      const byTag = getAllBookmarks({ query: 'codigo' });
      expect(byTag.items).toHaveLength(1);
      expect(byTag.items[0].name).toBe('GitHub');
    });

    it('filters by single tag', () => {
      const result = getAllBookmarks({ tags: ['desenvolvimento'] });
      expect(result.items).toHaveLength(2);
    });

    it('filters by multiple tags (intersection)', () => {
      const result = getAllBookmarks({
        tags: ['desenvolvimento', 'ajuda'],
      });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Stack Overflow');
    });

    it('filters by favorites', () => {
      const result = getAllBookmarks({ favorites: true });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Google');
    });

    it('filters by bundle', () => {
      const result = getAllBookmarks({ bundle: 'b1' });
      expect(result.items).toHaveLength(2);
      expect(result.items.map((b) => b.id)).toEqual(
        expect.arrayContaining(['2', '3'])
      );
    });

    it('combines query and tag filters', () => {
      const result = getAllBookmarks({
        query: 'plataforma',
        tags: ['desenvolvimento'],
      });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('GitHub');
    });

    it('returns empty for non-matching query', () => {
      const result = getAllBookmarks({ query: 'nonexistent' });
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('getBookmarkById', () => {
    it('returns bookmark by id', () => {
      const bookmark = getBookmarkById('1');
      expect(bookmark).not.toBeNull();
      expect(bookmark!.name).toBe('Google');
    });

    it('returns null for non-existent id', () => {
      expect(getBookmarkById('999')).toBeNull();
    });
  });

  describe('createBookmark', () => {
    it('creates a new bookmark with generated id and createdAt', () => {
      const bookmark = createBookmark({
        name: 'New Bookmark',
        link: 'https://example.com',
        description: 'Test',
        tags: ['test'],
        favicon: '',
        ogthumb: '',
        creator: 'admin',
        favorite: false,
      });

      expect(bookmark.id).toBeTruthy();
      expect(bookmark.createdAt).toBeTruthy();
      expect(bookmark.name).toBe('New Bookmark');
      expect(bookmarksData).toHaveLength(4);
    });
  });

  describe('updateBookmark', () => {
    it('updates an existing bookmark', () => {
      const updated = updateBookmark('1', { name: 'Google Updated' });
      expect(updated).not.toBeNull();
      expect(updated!.name).toBe('Google Updated');
      expect(updated!.id).toBe('1'); // id preserved
    });

    it('returns null for non-existent id', () => {
      expect(updateBookmark('999', { name: 'Nope' })).toBeNull();
    });
  });

  describe('deleteBookmark', () => {
    it('deletes an existing bookmark', () => {
      expect(deleteBookmark('1')).toBe(true);
      expect(bookmarksData).toHaveLength(2);
      expect(bookmarksData.find((b) => b.id === '1')).toBeUndefined();
    });

    it('returns false for non-existent id', () => {
      expect(deleteBookmark('999')).toBe(false);
    });

    it('removes deleted bookmark from bundles', () => {
      deleteBookmark('2');
      expect(bundlesData[0].bookmarks).not.toContain('2');
    });
  });

  describe('searchBookmarks', () => {
    it('searches across name, description, link, and tags', () => {
      expect(searchBookmarks('google')).toHaveLength(1);
      expect(searchBookmarks('desenvolvimento')).toHaveLength(2);
      expect(searchBookmarks('stackoverflow')).toHaveLength(1);
    });

    it('is case insensitive', () => {
      expect(searchBookmarks('GOOGLE')).toHaveLength(1);
      expect(searchBookmarks('GitHub')).toHaveLength(1);
    });
  });

  describe('getAllTags', () => {
    it('returns all unique tags with counts, sorted by count', () => {
      const tags = getAllTags();
      // 5 unique tags: pesquisa, utilitarios, desenvolvimento, codigo, ajuda
      expect(tags).toHaveLength(5);

      const devTag = tags.find((t) => t.tag === 'desenvolvimento');
      expect(devTag).toBeDefined();
      expect(devTag!.count).toBe(2);

      // Should be sorted by count descending
      expect(tags[0].count).toBeGreaterThanOrEqual(tags[1].count);
    });
  });
});

describe('Bundle Service', async () => {
  const {
    getAllBundles,
    getBundleById,
    createBundle,
    updateBundle,
    deleteBundle,
    addBookmarkToBundle,
    removeBookmarkFromBundle,
    getBundleBookmarks,
  } = await import('../src/data/services');

  describe('getAllBundles', () => {
    it('returns all bundles', () => {
      const bundles = getAllBundles();
      expect(bundles).toHaveLength(1);
      expect(bundles[0].name).toBe('Ferramentas Dev');
    });
  });

  describe('getBundleById', () => {
    it('returns bundle by id', () => {
      const bundle = getBundleById('b1');
      expect(bundle).not.toBeNull();
      expect(bundle!.name).toBe('Ferramentas Dev');
    });

    it('returns null for non-existent id', () => {
      expect(getBundleById('999')).toBeNull();
    });
  });

  describe('createBundle', () => {
    it('creates a new bundle', () => {
      const bundle = createBundle({
        name: 'New Bundle',
        description: 'Testing',
        bookmarks: [],
      });
      expect(bundle.id).toBeTruthy();
      expect(bundle.name).toBe('New Bundle');
      expect(bundlesData).toHaveLength(2);
    });
  });

  describe('updateBundle', () => {
    it('updates an existing bundle', () => {
      const updated = updateBundle('b1', { name: 'Updated Bundle' });
      expect(updated).not.toBeNull();
      expect(updated!.name).toBe('Updated Bundle');
    });

    it('returns null for non-existent id', () => {
      expect(updateBundle('999', { name: 'Nope' })).toBeNull();
    });
  });

  describe('deleteBundle', () => {
    it('deletes an existing bundle', () => {
      expect(deleteBundle('b1')).toBe(true);
      expect(bundlesData).toHaveLength(0);
    });

    it('returns false for non-existent id', () => {
      expect(deleteBundle('999')).toBe(false);
    });
  });

  describe('addBookmarkToBundle', () => {
    it('adds a bookmark to a bundle', () => {
      expect(addBookmarkToBundle('b1', '1')).toBe(true);
      expect(bundlesData[0].bookmarks).toContain('1');
    });

    it('does not duplicate bookmark in bundle', () => {
      addBookmarkToBundle('b1', '2');
      const count = bundlesData[0].bookmarks.filter((id) => id === '2').length;
      expect(count).toBe(1);
    });

    it('returns false for non-existent bundle', () => {
      expect(addBookmarkToBundle('999', '1')).toBe(false);
    });
  });

  describe('removeBookmarkFromBundle', () => {
    it('removes a bookmark from a bundle', () => {
      expect(removeBookmarkFromBundle('b1', '2')).toBe(true);
      expect(bundlesData[0].bookmarks).not.toContain('2');
    });

    it('returns false for non-existent bundle', () => {
      expect(removeBookmarkFromBundle('999', '1')).toBe(false);
    });
  });

  describe('getBundleBookmarks', () => {
    it('returns bookmarks belonging to a bundle', () => {
      const bookmarks = getBundleBookmarks('b1');
      expect(bookmarks).toHaveLength(2);
      expect(bookmarks.map((b) => b.id)).toEqual(
        expect.arrayContaining(['2', '3'])
      );
    });

    it('returns empty for non-existent bundle', () => {
      expect(getBundleBookmarks('999')).toHaveLength(0);
    });
  });
});
