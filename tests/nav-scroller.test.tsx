import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { navOverflows } from '@/components/nav-scroller';

const nav = (width: number, lastRight: number, scrollLeft = 0) => ({
  clientWidth: width,
  scrollLeft,
  getBoundingClientRect: () => ({ left: 10, right: 10 + width }),
  lastElementChild: { getBoundingClientRect: () => ({ left: lastRight - 80, right: lastRight }) },
});

describe('header nav fade (Codex 2026-11-19)', () => {
  it('overflows only when the last link ends past the visible width', () => {
    expect(navOverflows(nav(460, 10 + 450))).toBe(false); // ~460px: all five links fit
    expect(navOverflows(nav(320, 10 + 450))).toBe(true);
    expect(navOverflows(nav(320, 10 + 300, 150))).toBe(true); // scrolled: still measured from the row start
    expect(navOverflows({ ...nav(320, 0), lastElementChild: null })).toBe(false);
  });

  it('draws the fade and its spacer only on an overflowing nav', () => {
    const css = readFileSync(join(process.cwd(), 'app', 'globals.css'), 'utf8');
    expect(css).not.toMatch(/\.site-header nav \{[^}]*mask-image/);
    expect(css).toMatch(/\.site-header nav\[data-overflow="true"\] \{[^}]*mask-image/);
    expect(css).toMatch(/\.site-header nav\[data-overflow="true"\]::after \{ flex: 0 0 48px/);
    expect(css).not.toMatch(/\.site-header nav::after/);
  });
});
