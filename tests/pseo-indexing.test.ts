import { afterEach, describe, expect, it, vi } from 'vitest';
import { agencyPseoServicePaths } from '@/lib/agency-pseo';
import { approvedPseoPaths, isPseoPagePath, isPathIndexable } from '@/lib/pseo-indexing';
import { pseoPilotPaths } from '@/lib/pseo';

const allPseoPaths = [...agencyPseoServicePaths, ...pseoPilotPaths];

async function loadApproved() {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com');
  vi.stubEnv('NEXT_PUBLIC_SITE_INDEXABLE', 'true');
  const config = await import('@/lib/site-config');
  const sitemap = (await import('@/app/sitemap')).default;
  return { ...config, sitemap: sitemap() };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('pSEO page detection', () => {
  it('treats every service, industry and solution landing page as a pSEO page', () => {
    for (const path of allPseoPaths) expect(isPseoPagePath(path), path).toBe(true);
  });

  it('does not treat home, agency or directory pages as pSEO pages', () => {
    for (const path of ['/', '/agencies', '/agencies/legal', '/services', '/industries', '/solutions', '/services/']) {
      expect(isPseoPagePath(path), path).toBe(false);
    }
  });
});

describe('per-page indexing', () => {
  it('keeps a pSEO page out of the index unless its path is approved', () => {
    const [first, second] = allPseoPaths;
    const approved = new Set([first]);
    expect(isPathIndexable(first, approved)).toBe(true);
    expect(isPathIndexable(second, approved)).toBe(false);
    expect(isPathIndexable('/agencies/legal', approved)).toBe(true);
  });

  it('only approves paths that exist as pSEO pages (catches typos)', () => {
    const known = new Set<string>(allPseoPaths);
    for (const path of approvedPseoPaths) expect(known.has(path), path).toBe(true);
  });

  it('marks unapproved pSEO pages noindex even when the site is indexable', async () => {
    const { pageMetadata } = await loadApproved();
    const unapproved = allPseoPaths.filter((path) => !approvedPseoPaths.has(path));
    expect(unapproved.length).toBeGreaterThan(0);
    for (const path of unapproved) {
      expect(pageMetadata('T', 'D', path).robots, path).toEqual({ index: false, follow: true });
    }
    expect(pageMetadata('T', 'D', '/agencies').robots).toEqual({ index: true, follow: true });
  });

  it('leaves unapproved pSEO pages out of the sitemap but keeps the rest', async () => {
    const { sitemap } = await loadApproved();
    const urls = new Set(sitemap.map((entry) => entry.url));
    for (const path of allPseoPaths) {
      expect(urls.has(`https://example.com${path}`), path).toBe(approvedPseoPaths.has(path));
    }
    expect(urls.has('https://example.com/services')).toBe(true);
  });
});
