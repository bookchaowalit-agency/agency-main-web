// Shared public navigation for every page. The parent company link comes first as a return path.
export default function SiteLinks() {
  return (
    <nav className="site-links" aria-label="Site">
      <a href="https://bookchaowalit.com">bookchaowalit.com</a>
      <a href="https://bookchaowalit.com/privacy">Privacy</a>
      <a href="https://monitor.bookchaowalit.com/">Status</a>
      <a href="mailto:bookchaowalit.work@gmail.com">Contact</a>
    </nav>
  );
}
