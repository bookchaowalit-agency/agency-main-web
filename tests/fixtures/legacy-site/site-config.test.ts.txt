import { afterEach, describe, expect, it, vi } from 'vitest';

// site-config reads NEXT_PUBLIC_* at import time, so every case re-imports it with fresh env.
async function loadConfig(env: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  return import('@/lib/site-config');
}

async function loadRoutes(env: Record<string, string | undefined>) {
  await loadConfig(env);
  const robots = (await import('@/app/robots')).default;
  const sitemap = (await import('@/app/sitemap')).default;
  return { robots: robots(), sitemap: sitemap() };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('site config', () => {
  it('is noindex with a localhost metadata URL when no public URL is set', async () => {
    const { siteConfig, canonicalUrl, pageMetadata } = await loadConfig({ NEXT_PUBLIC_SITE_URL: undefined, NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
    expect(siteConfig.publicUrl).toBeUndefined();
    expect(siteConfig.metadataUrl).toBe('http://localhost:3010');
    expect(siteConfig.isIndexable).toBe(false);
    expect(canonicalUrl('/services')).toBeUndefined();
    const meta = pageMetadata('T', 'D', '/services');
    expect(meta.robots).toEqual({ index: false, follow: false });
    expect(meta.alternates).toBeUndefined();
  });

  it('rejects non-http(s) and malformed public URLs', async () => {
    for (const value of ['javascript:alert(1)', 'ftp://example.com', 'not a url', '   ']) {
      const { siteConfig } = await loadConfig({ NEXT_PUBLIC_SITE_URL: value, NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
      expect(siteConfig.publicUrl, value).toBeUndefined();
      expect(siteConfig.isIndexable, value).toBe(false);
    }
  });

  it('rejects base URLs whose query, fragment or credentials would leak into every canonical link', async () => {
    for (const value of ['https://example.com/?ref=x', 'https://example.com/#top', 'https://example.com/?', 'https://user:secret@example.com']) {
      const { siteConfig } = await loadConfig({ NEXT_PUBLIC_SITE_URL: value, NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
      expect(siteConfig.publicUrl, value).toBeUndefined();
      expect(siteConfig.isIndexable, value).toBe(false);
    }
  });

  it('strips every trailing slash so absolute URLs never contain //', async () => {
    const { siteConfig, absoluteUrl } = await loadConfig({ NEXT_PUBLIC_SITE_URL: 'https://example.com//', NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
    expect(siteConfig.publicUrl).toBe('https://example.com');
    expect(absoluteUrl('/services')).toBe('https://example.com/services');
    const base = await loadConfig({ NEXT_PUBLIC_SITE_URL: 'https://example.com/base/', NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
    expect(base.absoluteUrl('/services')).toBe('https://example.com/base/services');
  });

  it('needs both a public URL and NEXT_PUBLIC_SITE_INDEXABLE=true to be indexable', async () => {
    const notApproved = await loadConfig({ NEXT_PUBLIC_SITE_URL: 'https://example.com', NEXT_PUBLIC_SITE_INDEXABLE: 'yes' });
    expect(notApproved.siteConfig.publicUrl).toBe('https://example.com');
    expect(notApproved.siteConfig.isIndexable).toBe(false);

    const approved = await loadConfig({ NEXT_PUBLIC_SITE_URL: ' https://example.com/ ', NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
    expect(approved.siteConfig.isIndexable).toBe(true);
    expect(approved.absoluteUrl('services')).toBe('https://example.com/services');
    expect(approved.canonicalUrl('/services')).toBe('https://example.com/services');
    const meta = approved.pageMetadata('T', 'D', '/services');
    expect(meta.robots).toEqual({ index: true, follow: true });
    expect(meta.alternates).toEqual({ canonical: 'https://example.com/services' });
  });
});

describe('robots and sitemap', () => {
  it('disallow everything and list nothing by default', async () => {
    const { robots, sitemap } = await loadRoutes({ NEXT_PUBLIC_SITE_URL: undefined, NEXT_PUBLIC_SITE_INDEXABLE: undefined });
    expect(robots).toEqual({ rules: { userAgent: '*', disallow: '/' } });
    expect(sitemap).toEqual([]);
  });

  it('allow crawling and list the three static routes only when indexing is approved', async () => {
    const { robots, sitemap } = await loadRoutes({ NEXT_PUBLIC_SITE_URL: 'https://example.com', NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
    expect(robots).toEqual({ rules: { userAgent: '*', allow: '/' }, sitemap: 'https://example.com/sitemap.xml' });
    expect(sitemap.map((entry) => entry.url)).toEqual([
      'https://example.com/',
      'https://example.com/services',
      expect.stringMatching(/^https:\/\/example\.com\/services\/[a-z0-9-]+$/),
    ]);
  });
});
