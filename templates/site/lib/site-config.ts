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
// A loopback base (a local build with NEXT_PUBLIC_SITE_URL=http://localhost:3010) must never reach share images.
const isLoopback = (value: string) => /^https?:\/\/(localhost|127\.\d+\.\d+\.\d+|\[::1\])(:\d+)?$/i.test(value);
// The site's own production domain (lib/site.ts): absolute URLs in metadata (og:image, twitter:image) fall back to it,
// never to localhost. Canonical links and indexing still need the approved NEXT_PUBLIC_SITE_URL.
const productionUrl = parsePublicUrl(site.design.productionUrl);
if (!productionUrl?.startsWith('https://')) throw new Error('lib/site.ts design.productionUrl must be an https URL');

export const siteConfig = {
  name: site.name,
  description: site.promise,
  publicUrl,
  productionUrl,
  metadataUrl: publicUrl && !isLoopback(publicUrl) ? publicUrl : productionUrl,
  isIndexable: Boolean(publicUrl) && process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true',
} as const;

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  return siteConfig.metadataUrl + normalizedPath;
}

export function canonicalUrl(path: string) {
  return siteConfig.publicUrl ? absoluteUrl(path) : undefined;
}

// public/og.png (drawn by scripts/og.mjs, committed), which the static export copies to out/og.png (image/png).
export const socialImage = { url: absoluteUrl('/og.png'), width: 1200, height: 630, alt: site.name + ' — ' + site.design.world } as const;

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = canonicalUrl(path);
  return {
    title,
    description,
    // Page-level openGraph replaces the layout's, so name the shared image here too.
    openGraph: { type: 'website', title, description, siteName: site.name, images: [socialImage] },
    twitter: { card: 'summary_large_image', title, description, images: [socialImage.url] },
    ...(canonical ? { alternates: { canonical } } : {}),
    robots: siteConfig.isIndexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}
