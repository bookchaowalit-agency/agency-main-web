// The shared social card (templates/site/lib/og-card.ts): the agency name must be readable on every site's card.
// A node:test file, since templates/ is outside this app's tsconfig; TypeScript loads through load-ts.mjs.
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { importTs } from '../templates/site/scripts/load-ts.mjs';

const { contrastRatio, ogCard, ogLabelColor } = await importTs(join(import.meta.dirname, '..', 'templates', 'site', 'lib', 'og-card.ts'));
const card = (colors) => ({ name: 'Test', scope: ['One'], design: { world: 'World', productionUrl: 'https://x.test', colors } });
// Science & Deep Tech: accent #83b936 on #edf5f4 is 2.12:1.
const science = { bg: '#edf5f4', ink: '#102d40', muted: '#53707a', accent: '#83b936' };
const cyber = { bg: '#07110f', ink: '#e8f5ef', muted: '#9ab3a9', accent: '#6cf1bf' };

test('measures WCAG contrast', () => {
  assert.ok(Math.abs(contrastRatio('#000000', '#ffffff') - 21) < 1e-9);
  assert.equal(contrastRatio('#83b936', '#edf5f4').toFixed(2), '2.12');
});

test('agency name falls back to ink when the accent is under 3:1 on the card background (26px is large text)', () => {
  assert.equal(ogLabelColor(science), science.ink);
  assert.ok(renderToStaticMarkup(ogCard(card(science))).includes(`color:${science.ink}">BOOKCHAOWALIT AGENCY`));
});

test('agency name keeps the accent when it already reaches 3:1', () => {
  assert.equal(ogLabelColor(cyber), cyber.accent);
  assert.ok(renderToStaticMarkup(ogCard(card(cyber))).includes(`color:${cyber.accent}">BOOKCHAOWALIT AGENCY`));
});
