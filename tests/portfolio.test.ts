import { describe, expect, it } from 'vitest';
import { agencies, getAgency, statusCopy } from '@/lib/agency-portfolio';
import { agencyPseoServicePaths, agencyPseoServices, getAgencyPseoService } from '@/lib/agency-pseo';
import { getPseoIndustry, getPseoProblem, getPseoService, pseoIndustries, pseoPilotPaths, pseoProblems, pseoService } from '@/lib/pseo';

const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/;

describe('agency portfolio', () => {
  it('lists the fourteen verticals with unique kebab-case slugs and numbers 1..14', () => {
    expect(agencies).toHaveLength(14);
    expect(new Set(agencies.map((agency) => agency.slug)).size).toBe(14);
    for (const agency of agencies) expect(agency.slug).toMatch(kebab);
    expect(agencies.map((agency) => agency.number).sort((a, b) => a - b)).toEqual(Array.from({ length: 14 }, (_, index) => index + 1));
  });

  it('has readiness copy for every status in use and duplicate-free scope lists (React keys)', () => {
    for (const agency of agencies) {
      expect(statusCopy[agency.status].label).not.toBe('');
      expect(new Set(agency.scope).size).toBe(agency.scope.length);
    }
  });

  it('finds an agency by slug and returns undefined for an unknown slug', () => {
    expect(getAgency('legal')?.name).toBe('Legal');
    expect(getAgency('nope')).toBeUndefined();
  });
});

describe('agency service pages', () => {
  it('has exactly one service per agency, with unique slugs and paths', () => {
    expect(agencyPseoServices.map((service) => service.agencySlug)).toEqual(agencies.map((agency) => agency.slug));
    expect(new Set(agencyPseoServices.map((service) => service.slug)).size).toBe(agencies.length);
    expect(agencyPseoServicePaths).toEqual(agencyPseoServices.map((service) => `/services/${service.slug}`));
  });

  it('copies buyer and offer from the agency and keeps every list non-empty and duplicate-free', () => {
    for (const service of agencyPseoServices) {
      const agency = getAgency(service.agencySlug)!;
      expect(service.buyer).toBe(agency.buyer);
      expect(service.name).toBe(agency.offer);
      for (const list of [service.workflow, service.deliverables, service.evidence]) {
        expect(list.length).toBeGreaterThan(0);
        expect(new Set(list).size).toBe(list.length);
      }
    }
    expect(getAgencyPseoService(agencyPseoServices[0].slug)).toBe(agencyPseoServices[0]);
    expect(getAgencyPseoService('nope')).toBeUndefined();
  });
});

describe('pSEO pilot pages', () => {
  it('resolves only matching industry/problem and service pairs', () => {
    expect(getPseoService(pseoService.slug)).toBe(pseoService);
    expect(getPseoService('nope')).toBeUndefined();
    const industry = pseoIndustries[0];
    expect(getPseoIndustry(industry.slug, industry.serviceSlug)).toBe(industry);
    expect(getPseoIndustry(industry.slug, 'other-service')).toBeUndefined();
    const problem = pseoProblems[0];
    expect(getPseoProblem(problem.slug, problem.serviceSlug)).toBe(problem);
    expect(getPseoProblem('nope', problem.serviceSlug)).toBeUndefined();
  });

  it('publishes unique pilot paths for the service, every industry and every problem', () => {
    expect(pseoPilotPaths).toHaveLength(1 + pseoIndustries.length + pseoProblems.length);
    expect(new Set(pseoPilotPaths).size).toBe(pseoPilotPaths.length);
  });
});
