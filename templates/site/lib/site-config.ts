import type { Metadata } from 'next';
import { site } from '@/lib/site';

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

// Accept only an absolute http(s) base URL and strip its trailing slashes. Paths are appended to this value, so a
// query, fragment or user:password would end up inside every canonical and sitemap URL: reject those.
function parsePublicUrl(value: string | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    if (url.search || url.hash || url.username || url.password || /[?#]/.test(value)) return undefined;
    return url.toString().replace(/\/+$/, '');
  } catch {
    return undefined;
  }
}

const publicUrl = parsePublicUrl(configuredUrl);

export const siteConfig = {
  name: site.name,
  description: site.promise,
  publicUrl,
  metadataUrl: publicUrl ?? 'http://localhost:3010',
  isIndexable: Boolean(publicUrl) && process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true',
} as const;

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  return siteConfig.metadataUrl + normalizedPath;
}

export function canonicalUrl(path: string) {
  return siteConfig.publicUrl ? absoluteUrl(path) : undefined;
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = canonicalUrl(path);
  return {
    title,
    description,
    openGraph: { type: 'website', title, description, siteName: site.name },
    twitter: { card: 'summary', title, description },
    ...(canonical ? { alternates: { canonical } } : {}),
    robots: siteConfig.isIndexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}
