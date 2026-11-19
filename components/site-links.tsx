// Privacy, public status and contact links for every public page (interface coverage, ADR-0015 §1.2).
// No link to bookchaowalit.com here: the pSEO plan (docs/pseo-indexing-and-links-plan.md, Phase 3a) keeps the
// portfolio <-> agency hub link to one spot, the services page, and bans sitewide cross-site footer links.
export default function SiteLinks() {
  return (
    <nav className="site-links" aria-label="Site">
      <a href="https://bookchaowalit.com/privacy">Privacy</a>
      <a href="https://monitor.bookchaowalit.com/">Status</a>
      <a href="mailto:bookchaowalit.work@gmail.com">Contact</a>
    </nav>
  );
}
