import { createRequire } from 'node:module';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const require = createRequire(import.meta.url);
const typescript = require('typescript');
const here = dirname(fileURLToPath(import.meta.url));
const baseRepo = join(here, '..');
const outputRoot = join(baseRepo, '..');
const siteTemplate = join(baseRepo, 'templates', 'site');
const templateFile = (path) => readFileSync(join(siteTemplate, path), 'utf8');

const headingSpacingCss = `
/* Thai tone marks sit above the tight .98 line box: give large section headings room below their eyebrow,
   and keep the readiness gate off the deliverables grid (its padding shorthand drops .pseo-section's top padding). */
.pseo-section-heading h2, .pseo-readiness h2, .pseo-card h2 { margin-top: .32em; }
.pseo-readiness { margin-top: clamp(40px, 6vw, 72px); }
`;

const pseoCss = `
/* pSEO service pages: one bounded, inspectable offer per vertical. */
.pseo-shell { min-height: 100vh; color: var(--ink); background: var(--bg); }
.pseo-header { display: flex; align-items: center; justify-content: space-between; gap: 24px; width: min(100%, 1480px); margin: 0 auto; padding: 18px clamp(18px, 5vw, 76px); border-bottom: 1px solid var(--line); }
.pseo-brand { display: inline-flex; align-items: center; gap: 12px; color: inherit; text-decoration: none; }
.pseo-brand-mark { display: grid; place-items: center; width: 38px; height: 38px; color: var(--inverse-ink); background: var(--inverse); border: 1px solid var(--inverse); font-family: var(--mono); font-size: 11px; }
.pseo-brand strong, .pseo-brand small { display: block; }
.pseo-brand strong { font-family: var(--display); font-size: 17px; font-weight: 700; letter-spacing: -.03em; line-height: 1.05; }
.pseo-brand small { margin-top: 4px; color: var(--muted); font-family: var(--sans); font-size: 10px; }
.pseo-nav { display: flex; gap: 20px; color: var(--muted); font-family: var(--mono); font-size: 10px; text-transform: uppercase; }
.pseo-nav a { text-decoration: none; }
.pseo-nav a:hover { color: var(--accent); text-decoration: underline; text-underline-offset: 5px; }
.pseo-main { width: min(100%, 1480px); margin: 0 auto; padding: 0 clamp(18px, 5vw, 76px) 70px; }
.pseo-breadcrumb { display: flex; flex-wrap: wrap; gap: 9px; padding: 22px 0 0; color: var(--muted); font-family: var(--mono); font-size: 10px; line-height: 1.5; }
.pseo-breadcrumb a { color: inherit; }
.pseo-breadcrumb strong { color: var(--ink); font-weight: 500; }
.pseo-hero { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(280px, .85fr); gap: clamp(32px, 7vw, 110px); align-items: end; padding: clamp(58px, 9vw, 126px) 0 clamp(68px, 10vw, 136px); border-bottom: 1px solid var(--line); }
.pseo-eyebrow { margin: 0; color: var(--muted); font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; }
.pseo-hero h1 { max-width: 900px; margin: 17px 0 0; font-family: var(--display); font-size: clamp(43px, 7.5vw, 104px); font-weight: 600; letter-spacing: -.07em; line-height: .98; overflow-wrap: anywhere; }
.pseo-lede { max-width: 740px; margin: 27px 0 0; color: var(--muted); font-size: clamp(16px, 1.65vw, 20px); line-height: 1.75; }
.pseo-actions { display: flex; flex-wrap: wrap; gap: 18px; align-items: center; margin-top: 31px; }
.pseo-button { display: inline-flex; align-items: center; gap: 12px; padding: 12px 15px; color: var(--inverse-ink); background: var(--inverse); border: 1px solid var(--inverse); font-size: 13px; font-weight: 700; text-decoration: none; }
.pseo-button:hover { color: var(--inverse); background: var(--bg); }
.pseo-text-link { color: var(--ink); font-size: 13px; font-weight: 700; text-underline-offset: 5px; }
.pseo-aside { padding: 24px; border: 1px solid var(--line); background: var(--panel); }
.pseo-aside > strong { display: block; margin-top: 14px; font-family: var(--display); font-size: clamp(23px, 3vw, 38px); font-weight: 600; letter-spacing: -.045em; line-height: 1.17; overflow-wrap: anywhere; }
.pseo-aside dl { margin: 28px 0 0; }
.pseo-aside dl div { display: flex; justify-content: space-between; gap: 18px; padding: 12px 0; border-top: 1px solid var(--line); }
.pseo-aside dt { color: var(--muted); font-family: var(--mono); font-size: 9px; text-transform: uppercase; }
.pseo-aside dd { max-width: 68%; margin: 0; color: var(--ink); font-size: 12px; text-align: right; overflow-wrap: anywhere; }
.pseo-section { padding: clamp(62px, 9vw, 120px) 0 0; }
.pseo-section-heading { display: grid; grid-template-columns: minmax(190px, .52fr) minmax(0, 1fr); gap: clamp(28px, 7vw, 118px); align-items: end; }
.pseo-section-heading h2, .pseo-readiness h2 { margin: 9px 0 0; font-family: var(--display); font-size: clamp(34px, 5vw, 70px); font-weight: 600; letter-spacing: -.065em; line-height: .98; overflow-wrap: anywhere; }
.pseo-section-heading > p { max-width: 680px; margin: 0; color: var(--muted); font-size: 15px; line-height: 1.75; }
.pseo-steps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 38px 0 0; padding: 0; list-style: none; }
.pseo-steps li { min-height: 188px; padding: 18px; background: var(--panel); border-top: 3px solid var(--accent); }
.pseo-steps li > span { color: var(--muted); font-family: var(--mono); font-size: 10px; }
.pseo-steps li > p { margin: 34px 0 0; color: var(--ink); font-size: 14px; line-height: 1.7; overflow-wrap: anywhere; }
.pseo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 55px; }
.pseo-card { min-width: 0; padding: 25px; border: 1px solid var(--line); }
.pseo-card-dark { color: var(--inverse-ink); background: var(--inverse); border-color: var(--inverse); }
.pseo-card-dark .pseo-eyebrow { color: var(--inverse-ink); }
.pseo-card h2 { margin: 10px 0 0; font-family: var(--display); font-size: clamp(30px, 3.6vw, 50px); font-weight: 600; letter-spacing: -.05em; line-height: 1; }
.pseo-card ul { margin: 25px 0 0; padding: 0; list-style: none; border-top: 1px solid var(--line); }
.pseo-card-dark ul { border-color: color-mix(in srgb, var(--inverse-ink) 35%, var(--inverse)); }
.pseo-card li { padding: 13px 0; color: var(--ink); border-bottom: 1px solid var(--line); font-size: 14px; line-height: 1.65; overflow-wrap: anywhere; }
.pseo-card-dark li { color: var(--inverse-ink); border-color: color-mix(in srgb, var(--inverse-ink) 35%, var(--inverse)); }
.pseo-card li::before { margin-right: 10px; color: var(--accent); content: '↳'; }
.pseo-readiness { display: grid; grid-template-columns: minmax(190px, .52fr) minmax(0, 1fr); gap: clamp(28px, 7vw, 118px); align-items: end; padding: 21px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.pseo-readiness > p { max-width: 720px; margin: 0; color: var(--muted); font-family: var(--display); font-size: clamp(20px, 2.5vw, 32px); line-height: 1.4; overflow-wrap: anywhere; }
.pseo-index-hero { padding: clamp(60px, 9vw, 120px) 0 70px; border-bottom: 1px solid var(--line); }
.pseo-index-hero h1 { max-width: 770px; margin: 17px 0 0; font-family: var(--display); font-size: clamp(48px, 8vw, 110px); font-weight: 600; letter-spacing: -.07em; line-height: .95; }
.pseo-index-hero > p { max-width: 680px; margin: 27px 0 0; color: var(--muted); font-size: 17px; line-height: 1.75; }
.pseo-index-card { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; min-height: 210px; padding: 23px; color: inherit; background: var(--panel); border-top: 3px solid var(--accent); text-decoration: none; }
.pseo-index-card:hover { color: var(--inverse-ink); background: var(--inverse); }
.pseo-index-card h2 { max-width: 780px; margin: 12px 0 0; font-family: var(--display); font-size: clamp(27px, 3.5vw, 48px); font-weight: 600; letter-spacing: -.05em; line-height: 1.05; overflow-wrap: anywhere; }
.pseo-index-card p { max-width: 710px; margin: 13px 0 0; color: var(--muted); font-size: 14px; line-height: 1.7; }
.pseo-index-card:hover p, .pseo-index-card:hover .pseo-eyebrow { color: color-mix(in srgb, var(--inverse-ink) 72%, var(--inverse)); }
.pseo-index-card > span { font-family: var(--mono); font-size: 19px; }
.pseo-home-link { display: block; margin-top: 17px; color: var(--muted); font-size: 12px; text-underline-offset: 5px; }
.pseo-footer { display: flex; justify-content: space-between; gap: 20px; padding-top: 17px; border-top: 1px solid var(--line); color: var(--muted); font-family: var(--mono); font-size: 9px; letter-spacing: .05em; text-transform: uppercase; }
.pseo-eyebrow, .pseo-aside dt, .pseo-steps li > span { color: var(--ink); }
@media (max-width: 900px) {
  .pseo-hero { grid-template-columns: 1fr; align-items: start; }
  .pseo-section-heading, .pseo-readiness { grid-template-columns: 1fr; gap: 26px; }
  .pseo-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 650px) {
  .pseo-header { align-items: flex-start; flex-direction: column; gap: 15px; }
  .pseo-nav { gap: 14px; }
  .pseo-hero h1, .pseo-index-hero h1 { font-size: clamp(43px, 13vw, 78px); }
  .pseo-steps, .pseo-grid { grid-template-columns: 1fr; }
  .pseo-card, .pseo-index-card, .pseo-aside { padding: 18px; }
  .pseo-footer { align-items: flex-start; flex-direction: column; gap: 10px; }
}
`;

function writeText(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

async function readSourceModules() {
  const tempDir = mkdtempSync(join(tmpdir(), 'solo-empire-pseo-'));
  try {
    const portfolioSource = readFileSync(join(baseRepo, 'lib', 'agency-portfolio.ts'), 'utf8');
    const pseoSource = readFileSync(join(baseRepo, 'lib', 'agency-pseo.ts'), 'utf8')
      .replace(/from ['"]@\/lib\/agency-portfolio['"]/g, "from './agency-portfolio.mjs'");
    const compilerOptions = {
      module: typescript.ModuleKind.ESNext,
      target: typescript.ScriptTarget.ES2022,
      verbatimModuleSyntax: false,
    };
    writeText(join(tempDir, 'agency-portfolio.mjs'), typescript.transpileModule(portfolioSource, { compilerOptions }).outputText);
    writeText(join(tempDir, 'agency-pseo.mjs'), typescript.transpileModule(pseoSource, { compilerOptions }).outputText);
    const portfolio = await import(pathToFileURL(join(tempDir, 'agency-portfolio.mjs')).href + `?v=${Date.now()}`);
    const pseo = await import(pathToFileURL(join(tempDir, 'agency-pseo.mjs')).href + `?v=${Date.now()}`);
    return { agencies: portfolio.agencies, services: pseo.agencyPseoServices };
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function siteConfigTemplate() {
  return templateFile('lib/site-config.ts');
}

function layoutTemplate() {
  return `import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';
import { siteConfig } from '@/lib/site-config';
import './globals.css';

const notoSansThai = localFont({
  src: [
    { path: './fonts/NotoSansThai-Variable.woff2', weight: '400', style: 'normal' },
    { path: './fonts/NotoSansThai-Variable.woff2', weight: '500', style: 'normal' },
    { path: './fonts/NotoSansThai-Variable.woff2', weight: '600', style: 'normal' },
    { path: './fonts/NotoSansThai-Variable.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans-thai',
  display: 'swap',
});

const notoSerifThai = localFont({
  src: [
    { path: './fonts/NotoSerifThai-Variable.woff2', weight: '400', style: 'normal' },
    { path: './fonts/NotoSerifThai-Variable.woff2', weight: '600', style: 'normal' },
    { path: './fonts/NotoSerifThai-Variable.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-serif-thai',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.metadataUrl),
  title: { default: site.name + ' — ' + site.thaiName, template: '%s — ' + site.name },
  description: site.promise,
  openGraph: { type: 'website', locale: 'th_TH', siteName: site.name, title: site.name + ' — ' + site.thaiName, description: site.promise },
  twitter: { card: 'summary', title: site.name + ' — ' + site.thaiName, description: site.promise },
  ...(siteConfig.publicUrl ? { alternates: { canonical: siteConfig.publicUrl } } : {}),
  robots: siteConfig.isIndexable ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="th" className={\`\${notoSansThai.variable} \${notoSerifThai.variable}\`}><body><a className="skip-link" href="#main-content">ข้ามไปเนื้อหาหลัก</a>{children}</body></html>;
}
`;
}

function pseoTypeScript(service, agency) {
  const record = {
    kind: 'service',
    slug: service.slug,
    name: service.name,
    title: service.title,
    description: service.description,
    intent: service.intent,
    buyer: service.buyer,
    context: service.context,
    workflow: service.workflow,
    deliverables: service.deliverables,
    evidence: service.evidence,
    readiness: service.readiness,
    agencySlug: service.agencySlug,
    agencyName: agency.name,
    agencyThaiName: agency.thaiName,
    agencyStatus: agency.status,
    agencyStage: agency.stage,
  };
  return `export type PseoService = Readonly<{
  kind: 'service';
  slug: string;
  name: string;
  title: string;
  description: string;
  intent: string;
  buyer: string;
  context: string;
  workflow: readonly string[];
  deliverables: readonly string[];
  evidence: readonly string[];
  readiness: string;
  agencySlug: string;
  agencyName: string;
  agencyThaiName: string;
  agencyStatus: 'incubating' | 'target' | 'locked';
  agencyStage: string;
}>;

export const pseoService: PseoService = ${JSON.stringify(record, null, 2)};
`;
}

function componentTemplate() {
  return templateFile('components/pseo-page.tsx');
}

function indexPageTemplate() {
  return `import Link from 'next/link';
import { PseoHeader } from '@/components/pseo-page';
import { site } from '@/lib/site';
import { pseoService } from '@/lib/pseo';
import { pageMetadata } from '@/lib/site-config';

export const metadata = pageMetadata(site.name + ' service', pseoService.description, '/services');

export default function ServicesPage() {
  return <div className="pseo-shell"><PseoHeader /><main id="main-content" className="pseo-main"><section className="pseo-index-hero"><p className="pseo-eyebrow">SERVICE / PSEO PILOT</p><h1>เริ่มจาก service<br />ที่วัดผลได้</h1><p>หน้า service นี้อธิบาย workflow ตั้งต้นของ vertical แบบ public-safe เพื่อทดสอบ search intent และความพร้อมในการส่งมอบ ยังไม่มี lead form หรือการรับข้อมูลลูกค้า</p></section><section className="pseo-section"><Link className="pseo-index-card" href={\`/services/\${pseoService.slug}\`}><div><p className="pseo-eyebrow">{pseoService.name}</p><h2>{pseoService.title}</h2><p>{pseoService.intent}</p></div><span aria-hidden="true">↗</span></Link></section><footer className="pseo-footer"><span>{site.name} · service directory</span><span>public-safe · no inquiry intake</span></footer></main></div>;
}
`;
}

function servicePageTemplate() {
  return `import { notFound } from 'next/navigation';
import { PseoLandingPage } from '@/components/pseo-page';
import { pseoService } from '@/lib/pseo';
import { pageMetadata } from '@/lib/site-config';

export function generateStaticParams() {
  return [{ slug: pseoService.slug }];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return slug === pseoService.slug ? pageMetadata(pseoService.title, pseoService.description, '/services/' + pseoService.slug) : pageMetadata('Service', 'ไม่พบ service', '/services');
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== pseoService.slug) notFound();
  return <PseoLandingPage />;
}
`;
}

function sitemapTemplate() {
  return `import type { MetadataRoute } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/site-config';
import { pseoService } from '@/lib/pseo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.isIndexable) return [];
  return ['/', '/services', '/services/' + pseoService.slug].map((path) => ({ url: absoluteUrl(path) }));
}
`;
}

function robotsTemplate() {
  return `import type { MetadataRoute } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/site-config';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return siteConfig.isIndexable ? { rules: { userAgent: '*', allow: '/' }, sitemap: absoluteUrl('/sitemap.xml') } : { rules: { userAgent: '*', disallow: '/' } };
}
`;
}

function patchHomePage(path, service) {
  const source = readFileSync(path, 'utf8');
  // Pages from templates/site/app/page.tsx already link the service page through pseoService.
  if (source.includes(`/services/${service.slug}`) || source.includes('pseoService.slug')) return;
  const nav = '<nav aria-label="เมนูหลัก"><a href="#offer">Scope</a><a href="#readiness">Readiness</a></nav>';
  const navReplacement = `<nav aria-label="เมนูหลัก"><a href="#offer">Scope</a><a href="#readiness">Readiness</a><Link href="/services/${service.slug}/">Service</Link></nav>`;
  const withNav = source.includes(nav) ? source.replace(nav, navReplacement) : source;
  const primary = '            <a className="primary-link" href="#offer">{site.cta}<span className="link-mark" aria-hidden="true" /></a>';
  const primaryReplacement = primary + `\n            <Link className="pseo-home-link" href="/services/${service.slug}/">ดู service page <span aria-hidden="true">↗</span></Link>`;
  const linked = withNav.includes(primary) ? withNav.replace(primary, primaryReplacement) : withNav;
  writeText(path, linked.includes("from 'next/link'") ? linked : "import Link from 'next/link';\n" + linked);
}

function verificationDoc(agency, service) {
  return `# Verification

หลักฐานและ checklist สำหรับ ${agency.name} showcase

## pSEO service page

- Route: \`/services/${service.slug}/\`
- ขอบเขต: workflow, deliverables, evidence boundary และ readiness ของ ${agency.name}
- ไม่มี lead form, API, database, analytics identifier หรือข้อมูลลูกค้า
- ค่าเริ่มต้นของ build เป็น \`noindex\` และ \`Disallow: /\`; เปิด index ได้เฉพาะเมื่อกำหนด \`NEXT_PUBLIC_SITE_URL\` และ \`NEXT_PUBLIC_SITE_INDEXABLE=true\` ที่ผ่านการอนุมัติ

## Local checks

\`\`\`bash
npm run lint
npm run typecheck
npm test        # includes the noindex / Disallow default and the indexing switch (tests/site-config.test.ts)
npm run check   # typecheck + static export
\`\`\`

CI runs the same checks through the shared workflow (\`.github/workflows/ci.yml\`) with a line-coverage gate.
`;
}

function readmeAppendix(agency, service) {
  return `\n## pSEO service page\n\nเว็บนี้มีหน้า service แบบ static ที่ \/services\/${service.slug}\/ สำหรับ intent ของ ${agency.name} โดยแยก workflow, deliverables, evidence boundary และ readiness gate ไว้ชัดเจน หน้าเริ่มต้นเป็น noindex และไม่มีการรับ inquiry หรือข้อมูลลูกค้า\n`;
}

export async function migrateSites({ onlySlugs } = {}) {
  const { agencies, services } = await readSourceModules();
  const selected = onlySlugs ? agencies.filter((agency) => onlySlugs.includes(agency.slug)) : agencies;
  const missing = selected.filter((agency) => !services.some((service) => service.agencySlug === agency.slug));
  if (missing.length) throw new Error('Missing pSEO service for: ' + missing.map((agency) => agency.slug).join(', '));

  for (const agency of selected) {
    const service = services.find((candidate) => candidate.agencySlug === agency.slug);
    const target = join(outputRoot, 'agency-' + agency.slug + '-web');
    if (!service || !existsSync(join(target, 'app', 'page.tsx'))) throw new Error('Showcase site is missing: ' + target);
    mkdirSync(join(target, 'app', 'fonts'), { recursive: true });
    for (const file of ['NotoSansThai-Variable.woff2', 'NotoSerifThai-Variable.woff2', 'OFL.txt', 'README.md']) {
      copyFileSync(join(baseRepo, 'app', 'fonts', file), join(target, 'app', 'fonts', file));
    }
    writeText(join(target, 'lib', 'site-config.ts'), siteConfigTemplate());
    writeText(join(target, 'lib', 'pseo.ts'), pseoTypeScript(service, agency));
    writeText(join(target, 'lib', 'readiness.ts'), templateFile('lib/readiness.ts'));
    writeText(join(target, 'components', 'pseo-page.tsx'), componentTemplate());
    writeText(join(target, 'app', 'layout.tsx'), layoutTemplate());
    writeText(join(target, 'app', 'services', 'page.tsx'), indexPageTemplate());
    writeText(join(target, 'app', 'services', '[slug]', 'page.tsx'), servicePageTemplate());
    writeText(join(target, 'app', 'sitemap.ts'), sitemapTemplate());
    writeText(join(target, 'app', 'robots.ts'), robotsTemplate());

    const cssPath = join(target, 'app', 'globals.css');
    const css = readFileSync(cssPath, 'utf8');
    if (!css.includes('pSEO service pages:')) writeText(cssPath, css + pseoCss + headingSpacingCss);
    else {
      let updatedCss = css;
      if (!updatedCss.includes('.pseo-card-dark .pseo-eyebrow')) updatedCss += '\n.pseo-card-dark .pseo-eyebrow { color: var(--inverse-ink); }\n';
      if (!updatedCss.includes('.pseo-eyebrow, .pseo-aside dt, .pseo-steps li > span')) updatedCss += '\n.pseo-eyebrow, .pseo-aside dt, .pseo-steps li > span { color: var(--ink); }\n';
      if (!updatedCss.includes('.pseo-readiness { margin-top:')) updatedCss += headingSpacingCss;
      if (updatedCss !== css) writeText(cssPath, updatedCss);
    }
    patchHomePage(join(target, 'app', 'page.tsx'), service);

    const readmePath = join(target, 'README.md');
    const readme = readFileSync(readmePath, 'utf8');
    if (!readme.includes('## pSEO service page')) writeText(readmePath, readme + readmeAppendix(agency, service));
    writeText(join(target, 'docs', 'verification', 'README.md'), verificationDoc(agency, service));
    console.log('Migrated ' + agency.slug + ' → /services/' + service.slug + '/');
  }
  return selected.map((agency) => agency.slug);
}

const isMain = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isMain) await migrateSites();
