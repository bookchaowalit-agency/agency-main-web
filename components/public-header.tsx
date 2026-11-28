import Link from 'next/link';
import { NavScroller } from '@/components/nav-scroller';

export function PublicHeader() {
  return (
    <header className="site-header">
      <Link className="site-brand" href="/">
        <span className="brand-mark" aria-hidden="true">SE</span>
        <span><strong>Solo Empire Group</strong><small>14 verticals · one shared core</small></span>
      </Link>
      <NavScroller label="Public website">
        <Link href="/agencies">Portfolio</Link>
        <Link href="/agencies#shared-core">Shared core</Link>
        <Link href="/services">Services</Link>
        <Link href="/industries">Industries</Link>
        <Link href="/solutions">Problems</Link>
        <Link href="/pricing">Pricing</Link>
      </NavScroller>
    </header>
  );
}
