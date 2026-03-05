import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { Bookmark, Bundle } from '../src/data/types';

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

function generateBookmarks(count: number): Bookmark[] {
  const tags = [
    'dev',
    'design',
    'docs',
    'tools',
    'news',
    'social',
    'video',
    'music',
    'games',
    'edu',
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: `bk-${i}`,
    name: `Bookmark ${i} - ${tags[i % tags.length]} resource`,
    link: `https://example-${i}.com/path`,
    description: `Description for bookmark number ${i}, tagged as ${tags[i % tags.length]}`,
    createdAt: new Date(2025, 0, 1, 0, 0, i).toISOString(),
    tags: [tags[i % tags.length], tags[(i + 3) % tags.length]],
    favicon: '',
    ogthumb: '',
    creator: 'admin',
    favorite: i % 5 === 0,
  }));
}

describe('Performance with large datasets', async () => {
  const { getAllBookmarks, searchBookmarks, getAllTags } = await import(
    '../src/data/services'
  );

  describe('with 1,000 bookmarks', () => {
    beforeAll(() => {
      bookmarksData = generateBookmarks(1000);
      bundlesData = [];
    });

    it('lists all bookmarks under 100ms', () => {
      const start = performance.now();
      const result = getAllBookmarks(undefined, 1, 20);
      const elapsed = performance.now() - start;

      expect(result.total).toBe(1000);
      expect(result.items).toHaveLength(20);
      expect(elapsed).toBeLessThan(100);
    });

    it('searches by text query under 100ms', () => {
      const start = performance.now();
      const result = searchBookmarks('design');
      const elapsed = performance.now() - start;

      expect(result.length).toBeGreaterThan(0);
      expect(elapsed).toBeLessThan(100);
    });

    it('filters by tags under 100ms', () => {
      const start = performance.now();
      const result = getAllBookmarks({ tags: ['dev', 'tools'] });
      const elapsed = performance.now() - start;

      expect(result.total).toBeGreaterThan(0);
      expect(elapsed).toBeLessThan(100);
    });

    it('filters favorites under 100ms', () => {
      const start = performance.now();
      const result = getAllBookmarks({ favorites: true });
      const elapsed = performance.now() - start;

      expect(result.total).toBe(200); // every 5th
      expect(elapsed).toBeLessThan(100);
    });

    it('gets all tags under 100ms', () => {
      const start = performance.now();
      const tags = getAllTags();
      const elapsed = performance.now() - start;

      expect(tags.length).toBe(10);
      expect(elapsed).toBeLessThan(100);
    });
  });

  describe('with 10,000 bookmarks', () => {
    beforeAll(() => {
      bookmarksData = generateBookmarks(10000);
      bundlesData = [];
    });

    it('lists bookmarks under 200ms', () => {
      const start = performance.now();
      const result = getAllBookmarks(undefined, 1, 20);
      const elapsed = performance.now() - start;

      expect(result.total).toBe(10000);
      expect(elapsed).toBeLessThan(200);
    });

    it('searches under 200ms', () => {
      const start = performance.now();
      const result = searchBookmarks('games resource');
      const elapsed = performance.now() - start;

      expect(result.length).toBeGreaterThan(0);
      expect(elapsed).toBeLessThan(200);
    });

    it('paginates to last page under 200ms', () => {
      const start = performance.now();
      const result = getAllBookmarks(undefined, 500, 20);
      const elapsed = performance.now() - start;

      expect(result.page).toBe(500);
      expect(result.items).toHaveLength(20);
      expect(elapsed).toBeLessThan(200);
    });
  });
});
