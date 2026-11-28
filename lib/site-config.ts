import type { Metadata } from 'next';
import { isPathIndexable } from '@/lib/pseo-indexing';

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
  name: 'Solo Empire Group',
  description: 'Specialist agency work with a shared core.',
  publicUrl,
  metadataUrl: publicUrl ?? 'http://localhost:3010',
  isIndexable: Boolean(publicUrl) && process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true',
} as const;

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.metadataUrl}${normalizedPath}`;
}

export function canonicalUrl(path: string) {
  return siteConfig.publicUrl ? absoluteUrl(path) : undefined;
}

// Shared 1200x630 social card (public/og.png, made with content-production `art template card --brand agency`).
export const ogImage = { url: '/og.png', width: 1200, height: 630, alt: 'Solo Empire Group — Specialist Agencies' } as const;

// Only announce the card when the build has a public origin: without one metadataBase is localhost and
// crawlers would be sent to an image they cannot fetch.
// Crawlers cannot fetch an image from a loopback or plain-http origin, so those builds get no image card.
function isShareableOrigin(url: string | undefined) {
  if (!url) return false;
  const { protocol, hostname } = new URL(url);
  const loopback = hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '[::1]' || /^127\./.test(hostname) || hostname === '0.0.0.0';
  return protocol === 'https:' && !loopback;
}

export function socialCard(title: string, description: string): Pick<Metadata, 'openGraph' | 'twitter'> {
  return isShareableOrigin(publicUrl)
    ? {
        openGraph: { type: 'website', title, description, images: [ogImage] },
        twitter: { card: 'summary_large_image', title, description, images: [ogImage.url] },
      }
    : { openGraph: { type: 'website', title, description }, twitter: { card: 'summary', title, description } };
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = canonicalUrl(path);
  return {
    title,
    description,
    ...socialCard(title, description),
    ...(canonical ? { alternates: { canonical } } : {}),
    // An unapproved pSEO page on an indexable site stays out of the index but still passes its internal links.
    robots: !siteConfig.isIndexable
      ? { index: false, follow: false }
      : isPathIndexable(path)
        ? { index: true, follow: true }
        : { index: false, follow: true },
  };
}
