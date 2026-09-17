import type { MetadataRoute } from 'next';
import { agencies } from '@/lib/agency-portfolio';
import { agencyPseoServicePaths } from '@/lib/agency-pseo';
import { pseoPilotPaths } from '@/lib/pseo';
import { absoluteUrl, siteConfig } from '@/lib/site-config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.isIndexable) return [];

  const paths = [
    '/',
    '/agencies',
    ...agencies.map((agency) => `/agencies/${agency.slug}`),
    '/services',
    '/industries',
    '/solutions',
    ...agencyPseoServicePaths,
    ...pseoPilotPaths,
  ];

  return [...new Set(paths)].map((path) => ({ url: absoluteUrl(path) }));
}
