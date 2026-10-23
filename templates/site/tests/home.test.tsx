import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/page';
import NotFound from '@/app/not-found';
import ServicesPage from '@/app/services/page';
import { PseoLandingPage } from '@/components/pseo-page';
import { pseoService } from '@/lib/pseo';
import { readinessCopy } from '@/lib/readiness';
import { site } from '@/lib/site';

// renderToString escapes text, so data copy such as "R&D" appears as "R&amp;D".
const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

describe('home page', () => {
  it('renders the promise, scope, readiness and the no-intake notice', () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain(esc(site.promise));
    for (const item of site.scope) expect(html).toContain(esc(item));
    expect(html).toContain(esc(readinessCopy(site.status).label));
    expect(html).toContain('ยังไม่มี lead form หรือการรับข้อมูลลูกค้า');
    expect(html).toContain('no client claims');
  });

  it('links twice to the pre-rendered service page and has no form', () => {
    const html = renderToString(<HomePage />);
    // next/link adds the trailing slash (trailingSlash: true) only inside a Next build.
    expect(html.match(new RegExp(`href="/services/${pseoService.slug}/?"`, 'g'))).toHaveLength(2);
    expect(html).not.toMatch(/<form/);
  });
});

describe('service pages', () => {
  it('renders the workflow, deliverables, evidence boundary and readiness gate', () => {
    const html = renderToString(<PseoLandingPage />);
    expect(html).toContain(esc(pseoService.title));
    for (const item of [...pseoService.workflow, ...pseoService.deliverables, ...pseoService.evidence]) expect(html).toContain(esc(item));
    expect(html).toContain(esc(pseoService.readiness));
    expect(html).toContain('no inquiry intake');
    expect(html).not.toMatch(/<form/);
  });

  it('escapes < in the JSON-LD so copy cannot close the script tag', () => {
    const html = renderToString(<PseoLandingPage service={{ ...pseoService, title: '</script><b>x' }} />);
    const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1] ?? '';
    expect(json).toContain('\\u003c/script>');
    expect(JSON.parse(json)[0].name).toBe('</script><b>x');
  });

  it('renders the service index and the not-found page', () => {
    expect(renderToString(<ServicesPage />)).toContain(esc(pseoService.title));
    expect(renderToString(<NotFound />)).toContain('ไม่พบหน้านี้');
  });
});
