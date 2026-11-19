// Live production domain of each showcase site (its *.vercel.app alias; long project names are cut by Vercel).
// lib/site.ts design.productionUrl is generated from this map and backfilled into older sites by the migration;
// og:image and twitter:image fall back to it when NEXT_PUBLIC_SITE_URL is not set.
export const productionUrls = {
  talent: 'https://solo-agency-talent.vercel.app',
  'cyber-security': 'https://solo-agency-cyber-security.vercel.app',
  technology: 'https://solo-agency-technology.vercel.app',
  'governance-risk': 'https://solo-agency-governance-risk.vercel.app',
  'transactions-corporate-finance': 'https://solo-agency-transactions-corporate.vercel.app',
  'industrial-infrastructure': 'https://solo-agency-industrial-infrastructu.vercel.app',
  'science-deep-tech': 'https://solo-agency-science-deep-tech.vercel.app',
  legal: 'https://solo-agency-legal.vercel.app',
  'investment-asset-management': 'https://solo-agency-investment-asset-manage.vercel.app',
  healthcare: 'https://solo-agency-healthcare.vercel.app',
  'real-estate': 'https://solo-agency-real-estate.vercel.app',
  energy: 'https://solo-agency-energy.vercel.app',
  'defense-aerospace': 'https://solo-agency-defense-aerospace.vercel.app',
  'insurance-risk-transfer': 'https://solo-agency-insurance-risk-transfer.vercel.app',
};
