import { afterEach, describe, expect, it, vi } from 'vitest';

// site-config reads NEXT_PUBLIC_* at import time, so every case re-imports it with fresh env.
async function loadConfig(url: string | undefined) {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', url);
  vi.stubEnv('NEXT_PUBLIC_SITE_INDEXABLE', undefined);
  return import('@/lib/site-config');
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('share image URL', () => {
  it('never puts a loopback NEXT_PUBLIC_SITE_URL into share images', async () => {
    for (const value of ['http://localhost:3010', 'http://127.0.0.1:3000', 'http://[::1]:3010', 'https://LOCALHOST']) {
      const { siteConfig, socialImage } = await loadConfig(value);
      expect(siteConfig.shareUrl, value).toBe(siteConfig.productionUrl);
      expect(socialImage.url, value).toBe(siteConfig.productionUrl + '/og.png');
    }
  });

  it('leaves canonical links on the configured public URL', async () => {
    const { canonicalUrl, siteConfig } = await loadConfig('http://localhost:3010');
    expect(siteConfig.publicUrl).toBe('http://localhost:3010');
    expect(siteConfig.metadataUrl).toBe(siteConfig.publicUrl);
    expect(canonicalUrl('/services')).toMatch(/^http:\/\/localhost:3010\/services\/?$/);
  });

  it('keeps a real public origin, even one whose name starts with localhost', async () => {
    const { siteConfig } = await loadConfig('https://localhost.example.com');
    expect(siteConfig.shareUrl).toBe('https://localhost.example.com');
  });
});
