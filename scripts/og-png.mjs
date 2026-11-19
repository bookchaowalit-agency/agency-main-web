// Draws a site's 1200x630 social card to <site>/public/og.png (plus <site>/lib/og-manifest.json) with this
// repository's next/og, from the site's own lib/site.ts and the shared card in templates/site/lib/og-card.ts.
// Used by the generator and the migration; inside a site, node scripts/og.mjs does the same with the site's own
// dependencies. TypeScript is loaded through templates/site/scripts/load-ts.mjs, so Node 22.12+ works.
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ImageResponse } from 'next/og.js';
import { importTs } from '../templates/site/scripts/load-ts.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const cardModule = join(here, '..', 'templates', 'site', 'lib', 'og-card.ts');
const sha = (data) => createHash('sha256').update(data).digest('hex');

export async function writeOgPng(target) {
  const { site } = await importTs(join(target, 'lib', 'site.ts'));
  const { OG_SIZE, ogCard, ogFingerprint } = await importTs(cardModule);
  const png = Buffer.from(await new ImageResponse(ogCard(site), OG_SIZE).arrayBuffer());
  mkdirSync(join(target, 'public'), { recursive: true });
  writeFileSync(join(target, 'public', 'og.png'), png);
  writeFileSync(join(target, 'lib', 'og-manifest.json'), JSON.stringify({ input: sha(ogFingerprint(site)), png: sha(png) }, null, 2) + '\n');
  return png.length;
}

const isMain = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isMain) {
  for (const target of process.argv.slice(2)) console.log(target + ': ' + (await writeOgPng(target)) + ' bytes');
}
