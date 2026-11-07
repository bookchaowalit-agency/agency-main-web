// Per-page indexing gate for pSEO landing pages (docs/pseo-indexing-and-links-plan.md).
//
// NEXT_PUBLIC_SITE_INDEXABLE opens the whole site; pSEO landing pages additionally need their path listed here,
// after the page passes the Wave quality gate and the owner approves it. Fail-closed: a new pSEO page is noindex
// and left out of the sitemap until someone adds it. This module imports nothing so site-config can use it
// without an import cycle (the pSEO data modules import site-config through agency-portfolio).

export const approvedPseoPaths: ReadonlySet<string> = new Set<string>([
  // Wave 1 — owner-approved 2026-11-07 (docs/pseo-indexing-and-links-plan.md).
  '/services/ai-automation-workflow-sprint',
  '/services/technical-recruitment-pilot',
  '/services/security-readiness-assessment',
  '/services/ai-governance-readiness-review',
  '/solutions/manual-reporting/ai-automation-workflow-sprint',
  '/solutions/document-processing/ai-automation-workflow-sprint',
]);

// Landing pages live one level or more below these directory roots; the roots themselves are directories.
const pseoRoots = ['/services/', '/industries/', '/solutions/'];

export function isPseoPagePath(path: string) {
  return pseoRoots.some((root) => path.startsWith(root) && path.length > root.length);
}

export function isPathIndexable(path: string, approved: ReadonlySet<string> = approvedPseoPaths) {
  return !isPseoPagePath(path) || approved.has(path);
}
