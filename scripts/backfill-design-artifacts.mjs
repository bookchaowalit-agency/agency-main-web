import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = join(fileURLToPath(new URL('..', import.meta.url)), '..');

function designDoc(site) {
  return `# ${site.name} — ${site.design.world}\n\n## Visual authority\n\nเว็บนี้เป็น public showcase แบบ static สำหรับ ${site.name} และใช้ visual world เฉพาะของ vertical นี้: ${site.design.material}\n\n## First viewport\n\nหน้าแรกเริ่มด้วย promise ที่อธิบายการตัดสินใจที่ช่วยได้ ต่อด้วย thesis, working artifact, buyer/offer/status signal และ CTA ไปยัง scope ที่มีจริง\n\n## Signature artifact\n\n${site.design.artifactCaption}\n\nArtifact ใช้ geometry ที่อธิบายภาษาของ vertical นี้และทำหน้าที่เป็น evidence loom: buyer → problem → offer → readiness\n\n## Boundaries\n\nสถานะ commercial คือ ${site.status} / ${site.stage}; URL นี้เป็น showcase เท่านั้น ไม่ใช่หลักฐานว่ามีลูกค้า agency, ไม่รับข้อมูลลูกค้า, ไม่ใช่คำแนะนำ regulated และไม่เปลี่ยนงาน freelance/client เดิมให้เป็น agency traction\n\n## Quality floor\n\nรักษา Thai glyphs ด้วย Noto Sans Thai/Noto Serif Thai, visible focus, skip link, 390px responsive layout, reduced-motion behavior และ contrast ที่อ่านได้จริง ห้ามเติม client claims, testimonials, pricing, credentials, lead form หรือ backend โดยไม่มี approval และ evidence\n`;
}

function designJson(site) {
  return {
    version: 1,
    mode: 'persuade',
    world: site.design.world,
    artifact: site.design.motif,
    tokens: {
      color: site.design.colors,
      typography: { display: 'Noto Serif Thai', body: 'Noto Sans Thai', utility: 'system monospace' },
      spacing: { page: 'clamp(18px, 5vw, 76px)', section: 'clamp(67px, 10vw, 144px)' },
      shape: { radius: 'world-specific', elevation: 'one deliberate surface system' },
    },
  };
}

for (const name of readdirSync(base)) {
  if (!name.startsWith('agency-') || !name.endsWith('-web')) continue;
  const repo = join(base, name);
  const source = readFileSync(join(repo, 'lib', 'site.ts'), 'utf8');
  const match = source.match(/^export const site = ([\s\S]+) as const;\n?$/);
  if (!match) throw new Error('Cannot parse ' + join(repo, 'lib/site.ts'));
  const site = JSON.parse(match[1]);
  const impeccableDir = join(repo, '.impeccable');
  mkdirSync(impeccableDir, { recursive: true });
  if (!existsSync(join(repo, 'DESIGN.md'))) writeFileSync(join(repo, 'DESIGN.md'), designDoc(site), 'utf8');
  if (!existsSync(join(impeccableDir, 'design.json'))) writeFileSync(join(impeccableDir, 'design.json'), JSON.stringify(designJson(site), null, 2) + '\n', 'utf8');
}

console.log('Backfilled DESIGN.md and .impeccable/design.json for 14 showcase repos');
