import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/page';
import AgenciesPage from '@/app/agencies/page';

// Interface coverage (ADR-0015 §1.2, marketing site) and the ADR-0007 12px floor.
const LINKS = ['https://bookchaowalit.com/privacy', 'https://monitor.bookchaowalit.com/', 'mailto:bookchaowalit.work@gmail.com'];

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? cssFiles(p) : p.endsWith('.css') ? [p] : [];
  });
}

describe('site links and text floor', () => {
  it('home and directory pages link privacy, status and contact', () => {
    for (const html of [renderToString(<HomePage />), renderToString(<AgenciesPage />)]) {
      for (const href of LINKS) expect(html).toContain(`href="${href}"`);
    }
  });

  it('no stylesheet sets text below 12px', () => {
    const small = cssFiles('app').flatMap((f) =>
      [...readFileSync(f, 'utf8').matchAll(/font-size:\s*(\d*\.?\d+)(px|rem)/g)]
        .filter((m) => (m[2] === 'px' ? Number(m[1]) : Number(m[1]) * 16) < 12)
        .map((m) => `${f}: ${m[0]}`),
    );
    expect(small).toEqual([]);
  });
});
