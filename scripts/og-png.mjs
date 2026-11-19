// Draws a site's 1200x630 social card to <site>/public/og.png with this repository's next/og, from the
// site's own lib/site.ts and the shared card in templates/site/lib/og-card.ts. Used by the generator and the
// migration; inside a site, node scripts/og.mjs does the same with the site's own dependencies.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ImageResponse } from 'next/og.js';

const here = dirname(fileURLToPath(import.meta.url));
const cardModule = join(here, '..', 'templates', 'site', 'lib', 'og-card.ts');

export async function writeOgPng(target) {
  const { site } = await import(pathToFileURL(join(target, 'lib', 'site.ts')).href + '?t=' + Date.now());
  const { OG_SIZE, ogCard } = await import(pathToFileURL(cardModule).href);
  const png = Buffer.from(await new ImageResponse(ogCard(site), OG_SIZE).arrayBuffer());
  mkdirSync(join(target, 'public'), { recursive: true });
  writeFileSync(join(target, 'public', 'og.png'), png);
  return png.length;
}

const isMain = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isMain) {
  for (const target of process.argv.slice(2)) console.log(target + ': ' + (await writeOgPng(target)) + ' bytes');
}
