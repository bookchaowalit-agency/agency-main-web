import type { Metadata } from 'next';

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function parsePublicUrl(value: string | undefined) {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    return url.toString().replace(/\/$/, '');
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

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = canonicalUrl(path);
  return {
    title,
    description,
    openGraph: { type: 'website', title, description },
    twitter: { card: 'summary', title, description },
    ...(canonical ? { alternates: { canonical } } : {}),
    robots: siteConfig.isIndexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
