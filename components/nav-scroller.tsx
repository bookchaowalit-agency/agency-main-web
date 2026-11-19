'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Box = { left: number; right: number };
type NavLike = { clientWidth: number; scrollLeft: number; getBoundingClientRect(): Box; lastElementChild: { getBoundingClientRect(): Box } | null };

/**
 * True when the last link ends past the visible width of the nav (measured from the links, so the fade's own
 * spacer never counts as overflow). Only then does the scroller get its right-edge fade.
 */
export function navOverflows(nav: NavLike): boolean {
  const last = nav.lastElementChild;
  if (!last) return false;
  const end = last.getBoundingClientRect().right - nav.getBoundingClientRect().left + nav.scrollLeft;
  return end > nav.clientWidth + 1;
}

/** The header nav: on small screens a scroll row whose fade shows only while links really sit off-screen. */
export function NavScroller({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const update = () => { nav.dataset.overflow = navOverflows(nav) ? 'true' : 'false'; };
    update();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(update) : null;
    observer?.observe(nav);
    window.addEventListener('resize', update);
    return () => { observer?.disconnect(); window.removeEventListener('resize', update); };
  }, []);
  return <nav ref={ref} aria-label={label}>{children}</nav>;
}
