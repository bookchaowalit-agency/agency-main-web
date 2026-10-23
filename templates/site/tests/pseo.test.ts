import { describe, expect, it } from 'vitest';
import { pseoService } from '@/lib/pseo';
import { readinessCopy, statusCopy } from '@/lib/readiness';
import { site } from '@/lib/site';
import ServicePage, { generateMetadata, generateStaticParams } from '@/app/services/[slug]/page';

describe('service page data', () => {
  it('belongs to this vertical and agrees with the site record', () => {
    expect(pseoService.agencySlug).toBe(site.slug);
    expect(pseoService.agencyName).toBe(site.name);
    expect(pseoService.agencyThaiName).toBe(site.thaiName);
    expect(pseoService.agencyStatus).toBe(site.status);
    expect(pseoService.agencyStage).toBe(site.stage);
    expect(pseoService.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('has non-empty, duplicate-free workflow, deliverables and evidence lists (they are React keys)', () => {
    for (const list of [pseoService.workflow, pseoService.deliverables, pseoService.evidence, site.scope]) {
      expect(list.length).toBeGreaterThan(0);
      expect(new Set(list).size).toBe(list.length);
      for (const item of list) expect(item.trim()).not.toBe('');
    }
  });

  it('pre-renders exactly one service route', () => {
    expect(generateStaticParams()).toEqual([{ slug: pseoService.slug }]);
  });

  it('gives the known slug its own title and an unknown slug a fallback', async () => {
    const known = await generateMetadata({ params: Promise.resolve({ slug: pseoService.slug }) });
    expect(known.title).toBe(pseoService.title);
    const unknown = await generateMetadata({ params: Promise.resolve({ slug: 'nope' }) });
    expect(unknown.title).toBe('Service');
  });
});

describe('service route', () => {
  it('renders the landing page for the known slug and 404s any other slug', async () => {
    const page = await ServicePage({ params: Promise.resolve({ slug: pseoService.slug }) });
    expect(page).toBeTruthy();
    await expect(ServicePage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/);
  });
});

describe('readiness copy', () => {
  it('has a label and note for every status, and the site status resolves', () => {
    for (const status of ['incubating', 'target', 'locked'] as const) {
      expect(readinessCopy(status).label).not.toBe('');
      expect(readinessCopy(status).note).not.toBe('');
    }
    expect(readinessCopy(site.status)).toBe(statusCopy[site.status]);
  });
});
