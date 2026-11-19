import Link from 'next/link';
import type { ReactNode } from 'react';
import SiteLinks from '@/components/site-links';

// One footer for every page: the page label, page links (Home · 14 verticals by default) and the site links.
export function SiteFooter({ label, children }: Readonly<{ label: string; children?: ReactNode }>) {
  return (
    <footer className="site-footer">
      <span>Solo Empire Group · {label}</span>
      <span>{children ?? <><Link href="/">Home</Link><i>·</i><Link href="/agencies">14 verticals</Link></>}</span>
      <SiteLinks />
    </footer>
  );
}
