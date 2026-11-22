import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/page';
import AgenciesPage from '@/app/agencies/page';
import AgencyPage, { generateStaticParams as agencyParams } from '@/app/agencies/[slug]/page';
import ServicesPage from '@/app/services/page';
import ServicePage, { generateStaticParams as serviceParams } from '@/app/services/[slug]/page';
import IndustriesPage from '@/app/industries/page';
import IndustryServicePage, { generateStaticParams as industryParams } from '@/app/industries/[industry]/[service]/page';
import SolutionsPage from '@/app/solutions/page';
import ProblemServicePage, { generateStaticParams as problemParams } from '@/app/solutions/[problem]/[service]/page';
import NotFound from '@/app/not-found';
import { agencies, statusCopy } from '@/lib/agency-portfolio';
import { agencyPseoServices } from '@/lib/agency-pseo';

const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

describe('portfolio pages', () => {
  it('home says there is no lead form and links the directories', () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain('ยังไม่มี lead form หรือการรับข้อมูลลูกค้า');
    for (const href of ['/agencies', '/services', '/industries', '/solutions']) expect(html).toContain(`href="${href}"`);
    expect(html).not.toMatch(/<form/);
  });

  it('home shows three real verticals, the shared footer, and a return link to bookchaowalit.com', () => {
    const html = renderToString(<HomePage />);
    for (const slug of ['talent', 'cyber-security', 'governance-risk']) expect(html).toContain(`href="/agencies/${slug}"`);
    expect(html).toContain('class="site-footer"');
    expect(html).toMatch(/<nav class="site-links"[^>]*><a href="https:\/\/bookchaowalit\.com">bookchaowalit\.com<\/a>/);
    expect(html).toMatch(/<h1 lang="en"/);
    // The header brand returns to the home page from every page.
    expect(html).toMatch(/class="site-brand" href="\/"/);
  });

  it('agency directory lists all fourteen verticals', () => {
    const html = renderToString(<AgenciesPage />);
    for (const agency of agencies) expect(html).toContain(esc(agency.name));
  });

  it('pre-renders one page per agency with its readiness label, and 404s an unknown slug', async () => {
    expect(agencyParams()).toEqual(agencies.map(({ slug }) => ({ slug })));
    const legal = agencies.find((agency) => agency.slug === 'legal')!;
    const html = renderToString(await AgencyPage({ params: Promise.resolve({ slug: 'legal' }) }));
    expect(html).toContain(esc(legal.promise));
    expect(html).toContain(esc(statusCopy[legal.status].label));
    await expect(AgencyPage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/);
  });

  it('renders the service directory and every pre-rendered service page', async () => {
    expect(renderToString(<ServicesPage />)).not.toMatch(/<form/);
    for (const params of serviceParams()) {
      const html = renderToString(await ServicePage({ params: Promise.resolve(params) }));
      expect(html, params.slug).not.toMatch(/<form/);
    }
    await expect(ServicePage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/);
  });
});

describe('pSEO pilot directories', () => {
  it('render every industry and problem page, and 404 a pair that does not exist', async () => {
    expect(renderToString(<IndustriesPage />)).not.toMatch(/<form/);
    expect(renderToString(<SolutionsPage />)).not.toMatch(/<form/);
    for (const params of industryParams()) renderToString(await IndustryServicePage({ params: Promise.resolve(params) }));
    for (const params of problemParams()) renderToString(await ProblemServicePage({ params: Promise.resolve(params) }));
    await expect(IndustryServicePage({ params: Promise.resolve({ industry: 'nope', service: 'nope' }) })).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/);
    await expect(ProblemServicePage({ params: Promise.resolve({ problem: 'nope', service: 'nope' }) })).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/);
    expect(renderToString(<NotFound />)).toContain('href="/');
  });
});

describe('Wave 1 internal links', () => {
  const service = (agencySlug: string) => agencyPseoServices.find((item) => item.agencySlug === agencySlug)!;

  it('every agency page links to its own pSEO service page', async () => {
    for (const agency of agencies) {
      const html = renderToString(await AgencyPage({ params: Promise.resolve({ slug: agency.slug }) }));
      expect(html, agency.slug).toContain(`href="/services/${service(agency.slug).slug}"`);
    }
  });

  it('related services link to each other so each Wave 1 service has 3+ inbound links', async () => {
    const links: Record<string, string[]> = {
      technology: ['governance-risk', 'cyber-security', 'talent'],
      'governance-risk': ['cyber-security', 'technology'],
      'cyber-security': ['governance-risk', 'technology'],
      talent: ['technology'],
    };
    for (const [from, targets] of Object.entries(links)) {
      const html = renderToString(await ServicePage({ params: Promise.resolve({ slug: service(from).slug }) }));
      for (const to of targets) expect(html, `${from} -> ${to}`).toContain(`href="/services/${service(to).slug}"`);
    }
  });
});

describe('pSEO link plan (Phase 3a): contextual links and shared hub return navigation', () => {
  const hub = /href="https:\/\/bookchaowalit\.com\/?"/g;
  it('the services page keeps its contextual hub link and the shared return link', () => {
    const html = renderToString(<ServicesPage />);
    expect(html.match(hub)).toHaveLength(2);
    expect(html.slice(html.lastIndexOf('<footer'))).toMatch(hub);
  });

  it('every representative page puts the hub first in shared site links and keeps Privacy and Status', async () => {
    const service = agencyPseoServices[0];
    const pages = [
      renderToString(<HomePage />),
      renderToString(<AgenciesPage />),
      renderToString(await AgencyPage({ params: Promise.resolve({ slug: agencies[0].slug }) })),
      renderToString(await ServicePage({ params: Promise.resolve({ slug: service.slug }) })),
      renderToString(<IndustriesPage />),
      renderToString(<SolutionsPage />),
    ];
    for (const html of pages) {
      expect(html).toMatch(/<nav class="site-links"[^>]*><a href="https:\/\/bookchaowalit\.com">bookchaowalit\.com<\/a>/);
      expect(html).toContain('href="https://bookchaowalit.com/privacy"');
      expect(html).toContain('href="https://monitor.bookchaowalit.com/"');
    }
  });
});
