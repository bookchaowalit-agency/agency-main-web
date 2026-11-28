import { afterEach, describe, expect, it, vi } from 'vitest';
import { agencies } from '@/lib/agency-portfolio';

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
    expect(canonicalUrl('/agencies')).toBeUndefined();
    expect(pageMetadata('T', 'D', '/agencies').robots).toEqual({ index: false, follow: false });
  });

  it('gives every page the 1200x630 social card for Open Graph and a large Twitter card', async () => {
    const { pageMetadata } = await loadConfig({ NEXT_PUBLIC_SITE_URL: 'https://agency.example', NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
    const meta = pageMetadata('T', 'D', '/agencies/talent');
    expect(meta.openGraph?.images).toEqual([expect.objectContaining({ url: '/og.png', width: 1200, height: 630 })]);
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image', images: ['/og.png'] });
  });

  it('announces no image card for loopback or plain-http public URLs', async () => {
    for (const url of ['http://localhost:3010', 'https://localhost', 'https://127.0.0.1:8443', 'http://agency.example']) {
      const { pageMetadata } = await loadConfig({ NEXT_PUBLIC_SITE_URL: url, NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
      expect(pageMetadata('T', 'D', '/agencies').openGraph, url).not.toHaveProperty('images');
    }
  });

  it('announces no image card without a public URL, so crawlers are never sent to localhost', async () => {
    const { pageMetadata } = await loadConfig({ NEXT_PUBLIC_SITE_URL: undefined, NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
    const meta = pageMetadata('T', 'D', '/agencies/talent');
    expect(meta.openGraph).not.toHaveProperty('images');
    expect(meta.twitter).toMatchObject({ card: 'summary' });
  });

  it('rejects non-http(s) and malformed public URLs', async () => {
    for (const value of ['javascript:alert(1)', 'ftp://example.com', 'not a url']) {
      const { siteConfig } = await loadConfig({ NEXT_PUBLIC_SITE_URL: value, NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
      expect(siteConfig.publicUrl, value).toBeUndefined();
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
    expect(absoluteUrl('/agencies')).toBe('https://example.com/agencies');
  });

  it('needs both a public URL and NEXT_PUBLIC_SITE_INDEXABLE=true to be indexable', async () => {
    expect((await loadConfig({ NEXT_PUBLIC_SITE_URL: 'https://example.com', NEXT_PUBLIC_SITE_INDEXABLE: 'yes' })).siteConfig.isIndexable).toBe(false);
    const approved = await loadConfig({ NEXT_PUBLIC_SITE_URL: 'https://example.com', NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
    expect(approved.siteConfig.isIndexable).toBe(true);
    expect(approved.pageMetadata('T', 'D', '/agencies').alternates).toEqual({ canonical: 'https://example.com/agencies' });
  });
});

describe('robots and sitemap', () => {
  it('disallow everything and list nothing by default', async () => {
    const { robots, sitemap } = await loadRoutes({ NEXT_PUBLIC_SITE_URL: undefined, NEXT_PUBLIC_SITE_INDEXABLE: undefined });
    expect(robots).toEqual({ rules: { userAgent: '*', disallow: '/' } });
    expect(sitemap).toEqual([]);
  });

  it('let link-preview bots read a public build that is not indexable yet, and keep search engines out', async () => {
    const { robots } = await loadRoutes({ NEXT_PUBLIC_SITE_URL: 'https://example.com', NEXT_PUBLIC_SITE_INDEXABLE: undefined });
    const rules = (robots as { rules: { userAgent: string | string[]; allow?: string; disallow?: string }[] }).rules;
    expect(rules[0]).toMatchObject({ allow: '/' });
    expect(rules[0].userAgent).toContain('Twitterbot');
    expect(rules[1]).toEqual({ userAgent: '*', disallow: '/' });
  });

  it('list every agency, directory and pilot page once when indexing is approved', async () => {
    const { robots, sitemap } = await loadRoutes({ NEXT_PUBLIC_SITE_URL: 'https://example.com', NEXT_PUBLIC_SITE_INDEXABLE: 'true' });
    expect(robots).toEqual({ rules: { userAgent: '*', allow: '/' }, sitemap: 'https://example.com/sitemap.xml' });
    const urls = sitemap.map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const agency of agencies) expect(urls).toContain(`https://example.com/agencies/${agency.slug}`);
    for (const path of ['/', '/agencies', '/services', '/industries', '/solutions']) expect(urls).toContain('https://example.com' + path);
  });
});
