// Privacy, public status and contact links for every public page (interface coverage, ADR-0015 §1.2).
export default function SiteLinks() {
  return (
    <nav className="site-links" aria-label="Site">
      <a href="https://bookchaowalit.com/privacy">Privacy</a>
      <a href="https://monitor.bookchaowalit.com/">Status</a>
      <a href="mailto:bookchaowalit.work@gmail.com">Contact</a>
    </nav>
  );
}
