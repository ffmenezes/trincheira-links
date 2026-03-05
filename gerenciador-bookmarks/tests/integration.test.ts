import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Bookmark, Bundle } from '../src/data/types';

// Shared in-memory store for integration tests
let bookmarksData: Bookmark[] = [];
let bundlesData: Bundle[] = [];

vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn((filePath: string) => {
      if (filePath.includes('bookmarks.json'))
        return JSON.stringify(bookmarksData);
      if (filePath.includes('bundles.json'))
        return JSON.stringify(bundlesData);
      throw new Error(`Unknown file: ${filePath}`);
    }),
    writeFileSync: vi.fn((filePath: string, data: string) => {
      const parsed = JSON.parse(data);
      if (filePath.includes('bookmarks.json')) bookmarksData = parsed;
      else if (filePath.includes('bundles.json')) bundlesData = parsed;
    }),
  },
}));

beforeEach(() => {
  bookmarksData = [];
  bundlesData = [];
});

describe('Integration: Full CRUD workflow', async () => {
  const {
    getAllBookmarks,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    getAllTags,
    createBundle,
    addBookmarkToBundle,
    getBundleBookmarks,
    deleteBundle,
  } = await import('../src/data/services');

  it('performs complete bookmark lifecycle', () => {
    // Create
    const bk1 = createBookmark({
      name: 'Test Link',
      link: 'https://test.com',
      description: 'A test',
      tags: ['test', 'integration'],
      favicon: '',
      ogthumb: '',
      creator: 'admin',
      favorite: false,
    });
    expect(bk1.id).toBeTruthy();

    const bk2 = createBookmark({
      name: 'Another Link',
      link: 'https://another.com',
      description: 'Another test',
      tags: ['test', 'other'],
      favicon: '',
      ogthumb: '',
      creator: 'admin',
      favorite: true,
    });

    // Read all
    let all = getAllBookmarks();
    expect(all.total).toBe(2);

    // Update
    const updated = updateBookmark(bk1.id, {
      name: 'Updated Test Link',
      favorite: true,
    });
    expect(updated!.name).toBe('Updated Test Link');
    expect(updated!.favorite).toBe(true);

    // Filter favorites
    const favs = getAllBookmarks({ favorites: true });
    expect(favs.total).toBe(2);

    // Search
    const search = getAllBookmarks({ query: 'another' });
    expect(search.total).toBe(1);

    // Tags
    const tags = getAllTags();
    expect(tags.find((t) => t.tag === 'test')!.count).toBe(2);

    // Tag filter
    const filtered = getAllBookmarks({ tags: ['integration'] });
    expect(filtered.total).toBe(1);
    expect(filtered.items[0].name).toBe('Updated Test Link');

    // Delete
    expect(deleteBookmark(bk1.id)).toBe(true);
    all = getAllBookmarks();
    expect(all.total).toBe(1);
    expect(all.items[0].id).toBe(bk2.id);
  });

  it('performs complete bundle lifecycle with bookmark associations', () => {
    // Create bookmarks
    const bk1 = createBookmark({
      name: 'Link A',
      link: 'https://a.com',
      description: '',
      tags: ['alpha'],
      favicon: '',
      ogthumb: '',
      creator: 'admin',
      favorite: false,
    });
    const bk2 = createBookmark({
      name: 'Link B',
      link: 'https://b.com',
      description: '',
      tags: ['beta'],
      favicon: '',
      ogthumb: '',
      creator: 'admin',
      favorite: false,
    });

    // Create bundle
    const bundle = createBundle({
      name: 'My Bundle',
      description: 'Test bundle',
      bookmarks: [],
    });
    expect(bundle.id).toBeTruthy();

    // Add bookmarks to bundle
    addBookmarkToBundle(bundle.id, bk1.id);
    addBookmarkToBundle(bundle.id, bk2.id);

    // Get bundle bookmarks
    const bundleBookmarks = getBundleBookmarks(bundle.id);
    expect(bundleBookmarks).toHaveLength(2);

    // Filter all bookmarks by bundle
    const filtered = getAllBookmarks({ bundle: bundle.id });
    expect(filtered.total).toBe(2);

    // Delete a bookmark removes it from bundle too
    deleteBookmark(bk1.id);
    const afterDelete = getBundleBookmarks(bundle.id);
    expect(afterDelete).toHaveLength(1);
    expect(afterDelete[0].id).toBe(bk2.id);

    // Delete bundle
    expect(deleteBundle(bundle.id)).toBe(true);
  });
});
