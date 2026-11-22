import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/page';
import AgenciesPage from '@/app/agencies/page';

// Interface coverage (ADR-0015 §1.2, marketing site) and the ADR-0007 12px floor.
const LINKS = ['https://bookchaowalit.com', 'https://bookchaowalit.com/privacy', 'https://monitor.bookchaowalit.com/', 'mailto:bookchaowalit.work@gmail.com'];

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? cssFiles(p) : p.endsWith('.css') ? [p] : [];
  });
}

describe('site links and text floor', () => {
  it('home and directory pages put the company hub first, followed by privacy, status and contact', () => {
    for (const html of [renderToString(<HomePage />), renderToString(<AgenciesPage />)]) {
      const nav = html.match(/<nav class="site-links"[^>]*>(.*?)<\/nav>/)?.[1];
      expect(nav).toBeDefined();
      expect(nav).toContain('>bookchaowalit.com</a>');
      const positions = LINKS.map((href) => nav!.indexOf(`href="${href}"`));
      expect(positions.every((position) => position >= 0)).toBe(true);
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
    }
  });

  it('keeps site link tap targets at least 44px high', () => {
    const css = readFileSync('app/globals.css', 'utf8');
    expect(css).toMatch(/\.site-links a \{[^}]*min-height: 44px/);
  });

  it('no stylesheet sets text below 12px', () => {
    const small = cssFiles('app').flatMap((f) =>
      [...readFileSync(f, 'utf8').matchAll(/font-size:\s*(\d*\.?\d+)(px|rem)/g)]
        .filter((m) => (m[2] === 'px' ? Number(m[1]) : Number(m[1]) * 16) < 12)
        .map((m) => `${f}: ${m[0]}`),
    );
    expect(small).toEqual([]);
  });

  it('drops the narrow-screen nav fade while a nav link has keyboard focus', () => {
    const css = readFileSync('app/globals.css', 'utf8');
    expect(css).toMatch(/\.site-header nav\[data-overflow="true"\] \{[^}]*mask-image: linear-gradient/);
    // Same specificity as the fade rule, so it must come after it.
    expect(css.indexOf('.site-header nav:focus-within')).toBeGreaterThan(css.indexOf('.site-header nav[data-overflow="true"] {'));
    expect(css).toMatch(/\.site-header nav:focus-within \{[^}]*-webkit-mask-image: none;[^}]*mask-image: none;/);
  });
});
