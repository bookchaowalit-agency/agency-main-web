import { createRequire } from 'node:module';
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const require = createRequire(import.meta.url);
const typescript = require('typescript');
const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, '..', 'lib', 'agency-portfolio.ts');
const baseRepo = join(here, '..');
const outputRoot = join(baseRepo, '..');
// Files every new agency site gets verbatim (CI, ESLint, Vitest + tests, Sentry, home page, shared lib code).
// Each site owns its copy afterwards (no shared package); existing sites were updated by hand in batch b-website.
const siteTemplate = join(baseRepo, 'templates', 'site');

const designBySlug = {
  talent: {
    projectName: 'solo-agency-talent',
    archetype: 'editorial',
    motif: 'editorial',
    world: 'Editorial talent dossier',
    material: 'paper / ink / vermilion',
    thesis: 'คัดคนสำคัญด้วย scorecard และหลักฐานที่ทีมใช้ตัดสินใจต่อได้',
    artifactCaption: 'A working page for specialist search — not a candidate database.',
    colors: { bg: '#f6efe5', ink: '#201b18', muted: '#665c52', line: '#cbbbad', panel: '#e9d9c9', accent: '#cf5b3f', inverse: '#211b18', inverseInk: '#f8f0e7' },
  },
  'cyber-security': {
    projectName: 'solo-agency-cyber-security',
    archetype: 'terminal',
    motif: 'terminal',
    world: 'Security operations console',
    material: 'terminal black / cyan / ghost state',
    thesis: 'ทำความเสี่ยงให้เห็นเป็นขอบเขต ลำดับ และ remediation ที่ตรวจซ้ำได้',
    artifactCaption: 'Readiness scope rendered as a quiet command surface.',
    colors: { bg: '#07110f', ink: '#e1f6ec', muted: '#9bb7aa', line: '#285044', panel: '#0d201b', accent: '#6cf1bf', inverse: '#dff8ed', inverseInk: '#07110f' },
  },
  technology: {
    projectName: 'solo-agency-technology',
    archetype: 'blueprint',
    motif: 'blueprint',
    world: 'Systems blueprint',
    material: 'blueprint paper / cobalt / pencil line',
    thesis: 'เลือก workflow เดียว แล้วทำ baseline, prototype และ acceptance ให้ต่อกัน',
    artifactCaption: 'One process, drawn from friction to measurable handoff.',
    colors: { bg: '#dfeef5', ink: '#0b2635', muted: '#466676', line: '#9dbdce', panel: '#c9e0eb', accent: '#1759c8', inverse: '#0d2a3a', inverseInk: '#edf8fb' },
  },
  'governance-risk': {
    projectName: 'solo-agency-governance-risk',
    archetype: 'boardpaper',
    motif: 'boardpaper',
    world: 'Board paper and control register',
    material: 'folio paper / rule line / amber mark',
    thesis: 'แปลงกฎและความเสี่ยงให้เป็น control, owner และ evidence ที่คณะกรรมการอ่านรู้เรื่อง',
    artifactCaption: 'A control register built for review, ownership and repeatability.',
    colors: { bg: '#f2edde', ink: '#242a2d', muted: '#60645e', line: '#bcb8aa', panel: '#e4ddcb', accent: '#a96824', inverse: '#293035', inverseInk: '#faf7ed' },
  },
  'transactions-corporate-finance': {
    projectName: 'solo-agency-transactions-corporate-finance',
    archetype: 'dealroom',
    motif: 'dealroom',
    world: 'Deal room evidence board',
    material: 'midnight board / ledger green / deal markers',
    thesis: 'แยก fact, assumption และ gap ให้การตัดสินใจเรื่องกิจการเดินหน้าโดยไม่หลอกตัวเอง',
    artifactCaption: 'Diligence begins where the evidence boundary is explicit.',
    colors: { bg: '#101923', ink: '#f0f4ea', muted: '#a9b7b0', line: '#354554', panel: '#172936', accent: '#c8f34b', inverse: '#eff5e9', inverseInk: '#101923' },
  },
  'industrial-infrastructure': {
    projectName: 'solo-agency-industrial-infrastructure',
    archetype: 'fieldmanual',
    motif: 'fieldmanual',
    world: 'Field manual for physical systems',
    material: 'steel / graphite / safety orange',
    thesis: 'ทำ integration, risk และ acceptance map ก่อนระบบจริงต้องรับภาระในสนาม',
    artifactCaption: 'Discovery starts with the handoff between asset, team and acceptance.',
    colors: { bg: '#e7e3d8', ink: '#202724', muted: '#5c655f', line: '#a9ada1', panel: '#d5d1c5', accent: '#bb542d', inverse: '#242d28', inverseInk: '#f1eee4' },
  },
  'science-deep-tech': {
    projectName: 'solo-agency-science-deep-tech',
    archetype: 'labnote',
    motif: 'labnote',
    world: 'Lab notebook for commercialization',
    material: 'lab paper / cobalt / signal green',
    thesis: 'เชื่อม technical evidence กับ IP, partner, product และตลาดโดยไม่ข้ามขั้น',
    artifactCaption: 'A research-to-market trace with its unknowns still visible.',
    colors: { bg: '#edf5f4', ink: '#102d40', muted: '#53707a', line: '#a9c2c4', panel: '#dcebea', accent: '#83b936', inverse: '#12384a', inverseInk: '#eff8f4' },
  },
  legal: {
    projectName: 'solo-agency-legal',
    archetype: 'chambers',
    motif: 'chambers',
    world: 'Chambers folio and redline',
    material: 'parchment / burgundy / redline',
    thesis: 'วางสิทธิ หน้าที่ และ legal handoff ให้เห็นเจ้าของงานและขอบเขตที่ต้องใช้ผู้มีใบอนุญาต',
    artifactCaption: 'Capability map only — not a law firm and not legal advice.',
    colors: { bg: '#f2e9dc', ink: '#3b1d29', muted: '#715964', line: '#cbb6ad', panel: '#e5d5ca', accent: '#a73348', inverse: '#3b1d29', inverseInk: '#f7efe4' },
  },
  'investment-asset-management': {
    projectName: 'solo-agency-investment-asset-management',
    archetype: 'capitalledger',
    motif: 'capitalledger',
    world: 'Capital allocation ledger',
    material: 'deep green / brass / ledger paper',
    thesis: 'ทำให้ thesis, risk, governance และ portfolio operations อยู่ในบันทึกตัดสินใจเดียวกัน',
    artifactCaption: 'Future capability preview — no investment solicitation or asset management.',
    colors: { bg: '#f0ecd7', ink: '#17362d', muted: '#5d6e60', line: '#b1b59b', panel: '#dfe2c8', accent: '#b38326', inverse: '#14342a', inverseInk: '#f3f1df' },
  },
  healthcare: {
    projectName: 'solo-agency-healthcare',
    archetype: 'clinical',
    motif: 'clinical',
    world: 'Clinical readiness surface',
    material: 'quiet white / teal / coral signal',
    thesis: 'เชื่อมระบบ คน เทคโนโลยี และ evidence โดยให้ safety และ qualified review นำทาง',
    artifactCaption: 'A readiness map for regulated work — never a clinical service or health-data intake.',
    colors: { bg: '#f3f8f6', ink: '#173e3d', muted: '#557674', line: '#b5d1cb', panel: '#dceee8', accent: '#e66b5b', inverse: '#185052', inverseInk: '#f0faf6' },
  },
  'real-estate': {
    projectName: 'solo-agency-real-estate',
    archetype: 'architectural',
    motif: 'architectural',
    world: 'Architectural plan for property operations',
    material: 'sand / terracotta / plan line',
    thesis: 'เชื่อมทำเล สินทรัพย์ และ operations ให้การตัดสินใจด้านทรัพย์สินมีโครงสร้าง',
    artifactCaption: 'A property operating map, not brokerage and not a return guarantee.',
    colors: { bg: '#e9dfd1', ink: '#302521', muted: '#6d5c51', line: '#bba793', panel: '#d9c8b6', accent: '#b85c41', inverse: '#30241f', inverseInk: '#f5eee4' },
  },
  energy: {
    projectName: 'solo-agency-energy',
    archetype: 'solarfield',
    motif: 'solarfield',
    world: 'Solar field and project map',
    material: 'night field / solar yellow / steel line',
    thesis: 'วาง project, permit, grid, financing และ operating risk ก่อนพลังงานต้องพิสูจน์ตัวเอง',
    artifactCaption: 'Future project capability preview — no energy production or economics guarantee.',
    colors: { bg: '#121714', ink: '#f4f3e7', muted: '#b1b7a7', line: '#3e493d', panel: '#1e281f', accent: '#f4c744', inverse: '#f6f2df', inverseInk: '#121714' },
  },
  'defense-aerospace': {
    projectName: 'solo-agency-defense-aerospace',
    archetype: 'missionbrief',
    motif: 'missionbrief',
    world: 'Mission assurance brief',
    material: 'slate / olive / authorization red',
    thesis: 'ทำ assurance, security และ authorization boundary ให้ระบบสำคัญเห็นเงื่อนไขก่อนเริ่ม',
    artifactCaption: 'Future capability preview — no weapons procurement or unauthorized mission work.',
    colors: { bg: '#1b2521', ink: '#edf0df', muted: '#b1b9a9', line: '#4e5d51', panel: '#27352d', accent: '#d36c5d', inverse: '#eff1e2', inverseInk: '#1b2521' },
  },
  'insurance-risk-transfer': {
    projectName: 'solo-agency-insurance-risk-transfer',
    archetype: 'riskmatrix',
    motif: 'riskmatrix',
    world: 'Risk matrix and transfer map',
    material: 'violet / lilac / pink signal',
    thesis: 'ทำให้ exposure และ data พร้อมคุยเรื่องการรับหรือโอนความเสี่ยงกับ partner ที่เหมาะสม',
    artifactCaption: 'Future capability preview — not an insurer, broker or underwriter.',
    colors: { bg: '#201832', ink: '#f3efff', muted: '#c1b4d8', line: '#5b4b7d', panel: '#2c2145', accent: '#ec83d1', inverse: '#f3efff', inverseInk: '#201832' },
  },
};

const artifactData = (site) => JSON.stringify(site, null, 2);

function cssTemplate(site) {
  const c = site.design.colors;
  return `:root {
  --bg: ${c.bg};
  --ink: ${c.ink};
  --muted: ${c.muted};
  --line: ${c.line};
  --panel: ${c.panel};
  --accent: ${c.accent};
  --inverse: ${c.inverse};
  --inverse-ink: ${c.inverseInk};
  --sans: var(--font-sans-thai), Arial, sans-serif;
  --serif: var(--font-serif-thai), Georgia, 'Times New Roman', serif;
  --mono: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  --display: var(--serif);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; color: var(--ink); background: var(--bg); font-family: var(--sans); }
::selection { color: var(--inverse-ink); background: var(--accent); }
a { color: inherit; }
a:focus-visible { outline: 2px solid var(--accent); outline-offset: 5px; }
.skip-link { position: fixed; z-index: 10; top: 8px; left: 8px; padding: 9px 12px; color: var(--inverse-ink); background: var(--inverse); transform: translateY(-160%); }
.skip-link:focus { transform: translateY(0); }
.site-shell { min-height: 100vh; overflow: hidden; background: var(--bg); }
.site-header { display: flex; align-items: center; justify-content: space-between; gap: 24px; width: min(100%, 1480px); margin: 0 auto; padding: 18px clamp(18px, 5vw, 76px); border-bottom: 1px solid var(--line); }
.brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; }
.brand strong, .brand small { display: block; }
.brand strong { font-family: var(--display); font-size: 17px; font-weight: 700; letter-spacing: -.03em; line-height: 1.05; }
.brand small { margin-top: 4px; color: var(--muted); font-family: var(--sans); font-size: 10px; letter-spacing: .02em; text-transform: uppercase; }
.brand-mark { display: grid; place-items: center; width: 38px; height: 38px; color: var(--inverse-ink); background: var(--inverse); border: 1px solid var(--inverse); font-family: var(--mono); font-size: 11px; }
.site-header nav { display: flex; gap: 20px; color: var(--muted); font-family: var(--mono); font-size: 10px; text-transform: uppercase; }
.site-header nav a { text-decoration: none; }
.site-header nav a:hover { color: var(--accent); text-decoration: underline; text-underline-offset: 5px; }
.site-main { width: min(100%, 1480px); margin: 0 auto; padding: 0 clamp(18px, 5vw, 76px) 70px; }
.hero { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(330px, .92fr); gap: clamp(32px, 6vw, 108px); align-items: center; min-height: min(760px, calc(100vh - 77px)); padding: clamp(64px, 9vw, 130px) 0 clamp(70px, 10vw, 136px); border-bottom: 1px solid var(--line); }
.hero > *, .signal-row > *, .story-section > *, .offer-section > *, .readiness-section > * { min-width: 0; }
.hero h1 { max-width: 850px; margin: 0; font-family: var(--display); font-size: clamp(52px, 8.6vw, 126px); font-weight: 600; letter-spacing: -.075em; line-height: .94; overflow-wrap: anywhere; }
.hero-thesis { max-width: 640px; margin: 31px 0 0; color: var(--muted); font-size: clamp(16px, 1.65vw, 20px); line-height: 1.75; }
.hero-meta { display: flex; flex-wrap: wrap; gap: 12px 25px; margin-top: 29px; color: var(--muted); font-family: var(--mono); font-size: 10px; letter-spacing: .04em; text-transform: uppercase; }
.primary-link { display: inline-flex; align-items: center; gap: 13px; width: fit-content; margin-top: 31px; padding: 12px 0 9px; border-bottom: 1px solid var(--accent); color: var(--ink); font-size: 14px; font-weight: 700; text-decoration: none; }
.primary-link:hover { color: var(--accent); }
.link-mark { position: relative; display: inline-block; width: 19px; height: 12px; }
.link-mark::before, .link-mark::after { position: absolute; content: ''; background: currentColor; }
.link-mark::before { top: 5px; left: 0; width: 18px; height: 1px; }
.link-mark::after { top: 2px; right: 0; width: 7px; height: 7px; border-top: 1px solid currentColor; border-right: 1px solid currentColor; background: transparent; transform: rotate(45deg); }
.hero-art { position: relative; display: flex; min-height: 470px; flex-direction: column; justify-content: center; padding: clamp(22px, 4vw, 46px); background: var(--panel); border: 1px solid var(--line); }
.hero-art::before { position: absolute; top: 17px; right: 17px; width: 38px; height: 38px; border-top: 1px solid var(--accent); border-right: 1px solid var(--accent); content: ''; }
.artifact-caption { max-width: 360px; margin: 20px 0 0; color: var(--muted); font-family: var(--mono); font-size: 10px; line-height: 1.65; }
.signal-row { display: grid; grid-template-columns: 1fr 1.35fr .9fr; border-bottom: 1px solid var(--line); }
.signal-row div { min-height: 126px; padding: 22px 22px 20px 0; border-right: 1px solid var(--line); }
.signal-row div + div { padding-left: 22px; }
.signal-row div:last-child { border-right: 0; }
.signal-row span, .register-row > span { display: block; color: var(--muted); font-family: var(--sans); font-size: 10px; letter-spacing: .02em; line-height: 1.5; }
.signal-row strong { display: block; margin-top: 17px; font-family: var(--display); font-size: 20px; font-weight: 600; line-height: 1.18; overflow-wrap: anywhere; }
.story-section, .offer-section, .readiness-section { display: grid; grid-template-columns: minmax(190px, .52fr) minmax(0, 1fr); gap: clamp(26px, 7vw, 118px); padding: clamp(76px, 10vw, 144px) 0; border-bottom: 1px solid var(--line); }
.story-section h2, .offer-intro h2, .readiness-section h2 { max-width: 620px; margin: 0; font-family: var(--display); font-size: clamp(37px, 5vw, 74px); font-weight: 600; letter-spacing: -.07em; line-height: .98; overflow-wrap: anywhere; }
.story-section > p { max-width: 760px; align-self: end; margin: 0; font-family: var(--display); font-size: clamp(25px, 3.1vw, 46px); line-height: 1.24; letter-spacing: -.04em; overflow-wrap: anywhere; }
.offer-intro p { max-width: 640px; margin: 25px 0 0; color: var(--muted); font-size: 16px; line-height: 1.8; }
.offer-register { border-top: 1px solid var(--line); }
.register-row { display: grid; grid-template-columns: minmax(125px, .3fr) minmax(0, 1fr); gap: 28px; padding: 19px 0; border-bottom: 1px solid var(--line); }
.register-row p { max-width: 700px; margin: 0; color: var(--ink); font-size: 15px; line-height: 1.7; overflow-wrap: anywhere; }
.scope-list { display: flex; flex-wrap: wrap; gap: 9px 20px; }
.scope-list strong { position: relative; padding-left: 15px; font-family: var(--display); font-size: 21px; font-weight: 600; line-height: 1.25; }
.scope-list strong::before { position: absolute; top: .55em; left: 0; width: 6px; height: 6px; background: var(--accent); content: ''; }
.readiness-section { align-items: end; border-bottom: 0; }
.readiness-section > div:first-child p { max-width: 460px; margin: 22px 0 0; color: var(--muted); font-size: 13px; line-height: 1.75; }
.readiness-note { padding: 27px; background: var(--inverse); color: var(--inverse-ink); }
.readiness-note strong { display: block; font-family: var(--display); font-size: clamp(27px, 3.5vw, 50px); font-weight: 600; letter-spacing: -.05em; line-height: 1; }
.readiness-note p { max-width: 580px; margin: 20px 0 0; color: color-mix(in srgb, var(--inverse-ink) 76%, var(--inverse)); font-size: 14px; line-height: 1.7; }
.readiness-note span { display: block; margin-top: 25px; padding-top: 12px; border-top: 1px solid color-mix(in srgb, var(--inverse-ink) 30%, var(--inverse)); color: color-mix(in srgb, var(--inverse-ink) 70%, var(--inverse)); font-family: var(--mono); font-size: 10px; text-transform: uppercase; }
.site-footer { display: flex; justify-content: space-between; gap: 20px; padding-top: 17px; border-top: 1px solid var(--line); color: var(--muted); font-family: var(--mono); font-size: 9px; letter-spacing: .05em; text-transform: uppercase; }

/* Artifact grammar: each vertical receives a different working object, not a color swap. */
.artifact { position: relative; min-height: 285px; overflow: hidden; }
.artifact strong, .artifact small, .artifact em, .artifact > span { display: block; }
.artifact small, .artifact > span, .artifact em { color: var(--muted); font-family: var(--mono); font-size: 9px; letter-spacing: .08em; text-transform: uppercase; }
.artifact-editorial { display: grid; align-content: space-between; padding: 28px; border: 1px solid var(--ink); background: var(--bg); }
.artifact-editorial strong { max-width: 260px; font-family: var(--display); font-size: clamp(46px, 6vw, 82px); letter-spacing: -.08em; line-height: .88; }
.artifact-editorial i { display: block; width: 75%; height: 1px; background: var(--accent); }
.artifact-editorial em { font-style: normal; }
.artifact-terminal { padding: 20px; color: var(--accent); background: var(--bg); border: 1px solid var(--accent); font-family: var(--mono); }
.terminal-top { padding-bottom: 17px; color: var(--muted); border-bottom: 1px solid var(--line); font-size: 9px; letter-spacing: .08em; }
.terminal-row { display: grid; grid-template-columns: 26px 1fr 10px; gap: 10px; align-items: center; min-height: 49px; border-bottom: 1px solid var(--line); }
.terminal-row span { color: var(--muted); font-size: 10px; }
.terminal-row strong { font-family: var(--mono); font-size: 12px; font-weight: 500; }
.terminal-row i { width: 7px; height: 7px; background: var(--accent); }
.artifact-terminal small { margin-top: 18px; }
.artifact-blueprint { border: 1px solid var(--accent); background: var(--bg); }
.blueprint-axis { position: absolute; background: var(--line); }
.blueprint-axis-x { top: 51%; left: 8%; width: 84%; height: 1px; }
.blueprint-axis-y { top: 10%; left: 50%; width: 1px; height: 76%; }
.blueprint-node { position: absolute; width: 17px; height: 17px; border: 2px solid var(--accent); background: var(--bg); }
.node-a { top: 29%; left: 24%; }.node-b { top: 43%; right: 19%; }.node-c { bottom: 21%; left: 47%; }
.artifact-blueprint strong { position: absolute; right: 21px; bottom: 40px; font-family: var(--mono); font-size: 11px; letter-spacing: .09em; }
.artifact-blueprint small { position: absolute; bottom: 20px; left: 21px; }
.artifact-boardpaper { padding: 19px; border: 1px solid var(--ink); background: var(--bg); }
.boardpaper-head { display: flex; justify-content: space-between; gap: 10px; padding-bottom: 16px; border-bottom: 2px solid var(--ink); }
.boardpaper-head strong { font-family: var(--display); font-size: 15px; }.boardpaper-head span { color: var(--muted); font-family: var(--mono); font-size: 9px; }
.boardpaper-row { display: grid; grid-template-columns: 32px 1fr 110px; gap: 12px; align-items: center; min-height: 48px; border-bottom: 1px solid var(--line); }
.boardpaper-row span, .boardpaper-row i { color: var(--muted); font-family: var(--mono); font-size: 9px; font-style: normal; }.boardpaper-row strong { font-size: 13px; font-weight: 600; }
.artifact-dealroom { display: grid; align-content: center; padding: 23px; background: var(--bg); border: 1px solid var(--accent); }
.dealroom-ticker { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-family: var(--mono); font-size: 10px; }.dealroom-ticker strong, .dealroom-ticker span, .dealroom-ticker em { padding: 9px 7px; border-bottom: 2px solid var(--accent); font-style: normal; }.dealroom-ticker span { color: var(--muted); border-color: var(--line); }.dealroom-ticker em { color: var(--muted); border-color: var(--line); }
.dealroom-bars { display: flex; align-items: end; gap: 12px; height: 126px; padding: 25px 12px 0; border-bottom: 1px solid var(--line); }.dealroom-bars i { display: block; flex: 1; min-width: 16px; background: var(--accent); }.dealroom-bars i:nth-child(1) { height: 35%; }.dealroom-bars i:nth-child(2) { height: 61%; }.dealroom-bars i:nth-child(3) { height: 48%; }.dealroom-bars i:nth-child(4) { height: 84%; }.dealroom-bars i:nth-child(5) { height: 70%; }.artifact-dealroom small { margin-top: 16px; }
.artifact-fieldmanual { padding: 22px; border: 1px solid var(--ink); background: var(--bg); }.fieldmanual-stamp { display: inline-block; padding: 8px 12px; color: var(--accent); border: 1px solid var(--accent); font-family: var(--mono); font-size: 12px; font-weight: 700; line-height: 1.1; letter-spacing: .1em; transform: rotate(-4deg); }.fieldmanual-route { display: flex; gap: 0; align-items: center; margin-top: 60px; }.fieldmanual-route i { position: relative; display: block; width: 25%; height: 9px; border-top: 1px solid var(--ink); }.fieldmanual-route i::after { position: absolute; top: -5px; right: -3px; width: 8px; height: 8px; border: 1px solid var(--accent); background: var(--bg); content: ''; }.artifact-fieldmanual strong { margin-top: 31px; font-family: var(--mono); font-size: 12px; letter-spacing: .05em; }.artifact-fieldmanual small { margin-top: 11px; }
.artifact-labnote { border: 1px solid var(--accent); background: var(--bg); }.lab-orbit { position: absolute; top: 50%; left: 50%; display: block; border: 1px solid var(--line); border-radius: 50%; transform: translate(-50%, -50%); }.orbit-one { width: 235px; height: 120px; transform: translate(-50%, -50%) rotate(28deg); }.orbit-two { width: 235px; height: 120px; transform: translate(-50%, -50%) rotate(-28deg); }.lab-node { position: absolute; width: 13px; height: 13px; background: var(--accent); border-radius: 50%; }.lab-node-a { top: 23%; left: 25%; }.lab-node-b { right: 20%; bottom: 26%; }.lab-node-c { top: 46%; left: 48%; background: var(--ink); }.artifact-labnote strong { position: absolute; bottom: 40px; left: 20px; font-family: var(--mono); font-size: 11px; }.artifact-labnote small { position: absolute; bottom: 20px; left: 20px; }
.artifact-chambers { display: grid; place-items: center; border: 1px solid var(--accent); background: var(--bg); text-align: center; }.chambers-seal { display: grid; place-items: center; width: 88px; height: 88px; border: 1px solid var(--accent); border-radius: 50%; color: var(--accent); font-family: var(--display); font-size: 54px; }.chambers-rule { width: 60%; height: 1px; margin-top: 27px; background: var(--accent); }.artifact-chambers strong { margin-top: 24px; font-family: var(--display); font-size: 21px; letter-spacing: -.04em; }.artifact-chambers small { margin-top: 12px; }
.artifact-capitalledger { padding: 21px; border: 1px solid var(--accent); background: var(--bg); }.ledger-head { display: flex; justify-content: space-between; gap: 10px; padding-bottom: 15px; border-bottom: 2px solid var(--accent); }.ledger-head strong { font-family: var(--display); font-size: 16px; }.ledger-head span { color: var(--muted); font-family: var(--mono); font-size: 9px; }.ledger-row { display: grid; grid-template-columns: 30px 1fr 60px; gap: 12px; align-items: center; min-height: 49px; border-bottom: 1px solid var(--line); }.ledger-row span, .ledger-row i { color: var(--muted); font-family: var(--mono); font-size: 9px; font-style: normal; }.ledger-row strong { font-size: 13px; font-weight: 600; }.ledger-row i { height: 3px; background: var(--accent); }.artifact-capitalledger small { margin-top: 17px; }
.artifact-clinical { display: flex; flex-direction: column; justify-content: center; padding: 20px; border: 1px solid var(--accent); background: var(--bg); }.clinical-pulse { display: flex; align-items: center; height: 115px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }.clinical-pulse i { display: block; width: 20%; height: 1px; background: var(--accent); }.clinical-pulse i:nth-child(2) { height: 54px; border-right: 1px solid var(--accent); transform: skewX(-24deg); }.clinical-pulse i:nth-child(3) { height: 1px; }.clinical-pulse i:nth-child(4) { height: 37px; border-left: 1px solid var(--accent); transform: skewX(24deg); }.artifact-clinical strong { margin-top: 28px; font-family: var(--mono); font-size: 11px; letter-spacing: .05em; }.artifact-clinical small { margin-top: 11px; }
.artifact-architectural { border: 1px solid var(--ink); background: var(--bg); }.plan-room { position: absolute; display: grid; place-items: center; border: 1px solid var(--accent); color: var(--muted); font-family: var(--mono); font-size: 10px; }.room-one { top: 15%; left: 11%; width: 42%; height: 34%; }.room-two { top: 15%; right: 11%; width: 27%; height: 57%; }.room-three { bottom: 16%; left: 11%; width: 42%; height: 24%; }.plan-door { position: absolute; top: 49%; left: 51%; width: 14%; height: 1px; background: var(--accent); }.artifact-architectural strong { position: absolute; right: 19px; bottom: 22px; font-family: var(--mono); font-size: 10px; }
.artifact-solarfield { display: grid; place-items: center; border: 1px solid var(--accent); background: var(--bg); }.solar-sun { width: 90px; height: 90px; background: var(--accent); border-radius: 50%; }.solar-orbit { position: absolute; top: 50%; left: 50%; width: 80%; height: 38%; border: 1px solid var(--line); border-radius: 50%; transform: translate(-50%, -50%) rotate(-22deg); }.solar-orbit-two { width: 67%; height: 66%; transform: translate(-50%, -50%) rotate(34deg); }.artifact-solarfield strong { position: absolute; bottom: 39px; font-family: var(--mono); font-size: 11px; }.artifact-solarfield small { position: absolute; bottom: 19px; }
.artifact-missionbrief { padding: 20px; border: 1px solid var(--accent); background: var(--bg); }.mission-stamp { display: inline-block; padding: 8px 10px; color: var(--accent); border: 1px solid var(--accent); font-family: var(--mono); font-size: 10px; font-weight: 700; line-height: 1.1; letter-spacing: .1em; }.mission-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: 82%; margin: 45px auto 0; }.mission-grid i { display: block; height: 40px; border: 1px solid var(--line); }.mission-grid i:nth-child(2), .mission-grid i:nth-child(5) { background: var(--accent); border-color: var(--accent); }.artifact-missionbrief strong { margin-top: 28px; font-family: var(--mono); font-size: 11px; letter-spacing: .05em; }
.artifact-riskmatrix { display: flex; flex-direction: column; justify-content: center; padding: 22px; border: 1px solid var(--accent); background: var(--bg); }.risk-cells { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: min(100%, 260px); margin: 0 auto; }.risk-cells i { aspect-ratio: 1; border: 1px solid var(--line); }.risk-cells i:nth-child(3), .risk-cells i:nth-child(5), .risk-cells i:nth-child(7) { background: var(--accent); border-color: var(--accent); }.artifact-riskmatrix strong { margin-top: 30px; font-family: var(--mono); font-size: 11px; letter-spacing: .04em; }.artifact-riskmatrix small { margin-top: 10px; }

.archetype-terminal, .archetype-dealroom, .archetype-solarfield, .archetype-missionbrief, .archetype-riskmatrix { --display: var(--sans); }
.archetype-terminal .hero h1, .archetype-dealroom .hero h1, .archetype-solarfield .hero h1, .archetype-missionbrief .hero h1, .archetype-riskmatrix .hero h1 { letter-spacing: -.045em; line-height: 1.02; }
.archetype-terminal .brand-mark, .archetype-solarfield .brand-mark, .archetype-missionbrief .brand-mark, .archetype-riskmatrix .brand-mark { border-radius: 50%; }
.archetype-dealroom .hero-art, .archetype-solarfield .hero-art, .archetype-missionbrief .hero-art, .archetype-riskmatrix .hero-art { border-radius: 2px; }
.archetype-terminal .hero-art { background: var(--bg); }.archetype-terminal .hero-art::after { position: absolute; right: 17px; bottom: 17px; left: 17px; height: 1px; background: var(--line); content: ''; }
.archetype-boardpaper .hero h1, .archetype-chambers .hero h1, .archetype-capitalledger .hero h1, .archetype-architectural .hero h1 { font-family: var(--serif); }
.archetype-boardpaper .hero-art, .archetype-chambers .hero-art, .archetype-capitalledger .hero-art, .archetype-architectural .hero-art { box-shadow: 0 15px 34px rgba(45, 35, 28, .08); }
.archetype-fieldmanual .brand-mark, .archetype-missionbrief .brand-mark { transform: rotate(-4deg); }
.archetype-fieldmanual .hero h1, .archetype-missionbrief .hero h1 { text-transform: uppercase; letter-spacing: -.035em; }
.archetype-labnote .hero-art, .archetype-clinical .hero-art { border-radius: 22px; }.archetype-labnote .brand-mark, .archetype-clinical .brand-mark { border-radius: 50%; }
.archetype-clinical .readiness-note { border-radius: 18px; }.archetype-clinical .primary-link { border-radius: 999px; padding-right: 16px; padding-left: 16px; border: 1px solid var(--accent); }
.archetype-riskmatrix .hero-art { transform: rotate(1deg); }.archetype-riskmatrix .hero-copy { transform: rotate(-.4deg); }

@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; min-height: auto; }
  .hero-art { min-height: 410px; }
  .story-section, .offer-section, .readiness-section { gap: 42px; }
}

@media (max-width: 650px) {
  .site-header { align-items: flex-start; flex-direction: column; gap: 15px; }
  .site-header nav { gap: 14px; }
  .hero { padding-top: 53px; }
  .hero h1 { font-size: clamp(45px, 14vw, 82px); }
  .hero-art { min-height: 355px; padding: 18px; }
  .signal-row, .story-section, .offer-section, .readiness-section { grid-template-columns: 1fr; }
  .signal-row div, .signal-row div + div { min-height: auto; padding: 18px 0; border-right: 0; border-bottom: 1px solid var(--line); }
  .signal-row div:last-child { border-bottom: 0; }
  .story-section, .offer-section, .readiness-section { padding: 67px 0; gap: 31px; }
  .story-section h2, .offer-intro h2, .readiness-section h2 { font-size: clamp(37px, 12vw, 62px); }
  .register-row { grid-template-columns: 1fr; gap: 13px; }
  .site-footer { align-items: flex-start; flex-direction: column; gap: 10px; }
  .boardpaper-row { grid-template-columns: 27px 1fr; }.boardpaper-row i { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; }
}
`;
}

function layoutTemplate() {
  return `import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';
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
  title: site.name + ' — ' + site.thaiName,
  description: site.promise,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="th" className={\`\${notoSansThai.variable} \${notoSerifThai.variable}\`}><body><a className="skip-link" href="#main-content">ข้ามไปเนื้อหาหลัก</a>{children}</body></html>;
}
`;
}

function readAgencies() {
  const source = readFileSync(sourcePath, 'utf8');
  const compiled = typescript.transpileModule(source, {
    compilerOptions: { module: typescript.ModuleKind.ESNext, target: typescript.ScriptTarget.ES2022 },
    fileName: sourcePath,
  }).outputText;
  const tempPath = join(tmpdir(), 'solo-empire-agencies.mjs');
  writeFileSync(tempPath, compiled, 'utf8');
  return import(pathToFileURL(tempPath).href + '?v=' + Date.now()).then((module) => module.agencies);
}

function packageJson(name) {
  // Same dependencies as this repository, so the lockfile copied below matches and `npm ci` works.
  const base = JSON.parse(readFileSync(join(baseRepo, 'package.json'), 'utf8'));
  return {
    name,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: { dev: 'next dev -p 3010', build: 'next build', start: 'next start -p 3010', lint: 'eslint', typecheck: 'tsc --noEmit', test: 'vitest run', check: 'npm run typecheck && npm run build' },
    dependencies: base.dependencies,
    devDependencies: base.devDependencies,
  };
}

function readme(site) {
  return `# ${site.name} — ${site.thaiName}\n\nแยกเป็น showcase site สำหรับ ${site.name} ของ Solo Empire ใช้เพื่อแสดง positioning และทดสอบ message เท่านั้น\n\n- Visual world: ${site.design.world}\n- Suggested Vercel project: \`${site.design.projectName}\`\n- Route: \\/\n- สถานะ commercial: \`${site.status}\` / ${site.stage}\n- ไม่มี database, authentication, API, payment, lead form หรือข้อมูลลูกค้า\n\n## Local\n\n\`\`\`bash\nnpm ci\nnpm run lint\nnpm test\nnpm run check\nnpm run dev\n\`\`\`\n\nCI (\`.github/workflows/ci.yml\`) runs the shared Node workflow (lint, typecheck, Vitest with a line-coverage gate, then \`npm run check\`) and the shared security scan. Sentry is browser-only and off until \`NEXT_PUBLIC_SENTRY_DSN\` is set.\n\nBuild ใช้ Next.js static export และสร้าง artifact ที่ \`out/\` สำหรับ deploy แบบ static บน Vercel\n\nข้อมูล public-safe มาจาก agency brief/control-plane; งาน freelance/client เดิมไม่ถูกนับเป็น agency customer หรือ case study ในเว็บนี้\n`;
}

function agentsFile(site) {
  return `# ${site.name} Showcase Instructions\n\nเว็บนี้เป็น public-safe static showcase ของ vertical ${site.name} เท่านั้น เก็บเฉพาะ positioning, scope และ readiness ที่อนุมัติให้เปิดเผย\n\nห้ามเพิ่ม client records, candidate data, threat data, transaction records, health data, credentials, private dashboard links, API routes, lead collection หรือคำกล่าวอ้างเรื่องลูกค้า/ผลลัพธ์ที่ยังไม่มีหลักฐาน\n\nก่อนแก้ Next.js ให้อ่านเอกสารใน \`node_modules/next/dist/docs/\` ที่เกี่ยวข้อง และรักษา static export ที่ \`npm run check\` ตรวจได้\n`;
}

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

function writeText(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

const agencies = await readAgencies();
const missing = agencies.filter((agency) => !designBySlug[agency.slug]).map((agency) => agency.slug);
if (missing.length) throw new Error('Missing design direction for: ' + missing.join(', '));

for (const agency of agencies) {
  const site = { ...agency, design: designBySlug[agency.slug] };
  const target = join(outputRoot, 'agency-' + agency.slug + '-web');
  if (existsSync(target)) throw new Error('Refusing to overwrite existing directory: ' + target);

  mkdirSync(join(target, 'app'), { recursive: true });
  mkdirSync(join(target, 'lib'), { recursive: true });
  mkdirSync(join(target, 'app', 'fonts'), { recursive: true });
  for (const file of ['NotoSansThai-Variable.woff2', 'NotoSerifThai-Variable.woff2', 'OFL.txt', 'README.md']) {
    copyFileSync(join(baseRepo, 'app', 'fonts', file), join(target, 'app', 'fonts', file));
  }
  writeText(join(target, '.gitignore'), `node_modules\n.next\nout\n.vercel\n*.log\n.env*\n*.tsbuildinfo\ncoverage\n`);
  writeText(join(target, '.vercelignore'), `node_modules\n.next\nout\n.git\n`);
  cpSync(siteTemplate, target, { recursive: true });
  writeText(join(target, 'package.json'), JSON.stringify(packageJson(site.design.projectName), null, 2) + '\n');
  const lock = JSON.parse(readFileSync(join(baseRepo, 'package-lock.json'), 'utf8'));
  lock.name = site.design.projectName;
  if (lock.packages?.['']) lock.packages[''].name = site.design.projectName;
  writeText(join(target, 'package-lock.json'), JSON.stringify(lock, null, 2) + '\n');
  writeText(join(target, 'tsconfig.json'), `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
`);
  writeText(join(target, 'next-env.d.ts'), `/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n\n// NOTE: This file should not be edited\n// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.\n`);
  writeText(join(target, 'next.config.ts'), `import type { NextConfig } from 'next';\n\nconst nextConfig: NextConfig = { output: 'export', trailingSlash: true };\n\nexport default nextConfig;\n`);
  writeText(join(target, 'README.md'), readme(site));
  writeText(join(target, 'AGENTS.md'), agentsFile(site));
  writeText(join(target, 'lib', 'site.ts'), `export const site = ${artifactData(site)} as const;\n`);
  writeText(join(target, 'app', 'layout.tsx'), layoutTemplate());
  writeText(join(target, 'app', 'globals.css'), cssTemplate(site));
  writeText(join(target, 'app', 'not-found.tsx'), `export default function NotFound() {\n  return <main id="main-content" className="site-main"><section className="story-section"><h1>ไม่พบหน้านี้</h1><p>กลับไปที่หน้า showcase หลักเพื่อดูขอบเขตของ vertical นี้</p></section></main>;\n}\n`);
  writeText(join(target, 'DESIGN.md'), designDoc(site));
  mkdirSync(join(target, '.impeccable'), { recursive: true });
  writeText(join(target, '.impeccable', 'design.json'), JSON.stringify(designJson(site), null, 2) + '\n');
  mkdirSync(join(target, 'docs', 'verification'), { recursive: true });
  writeText(join(target, 'docs', 'verification', 'README.md'), `# Verification\n\nหลักฐานการตรวจ build และ browser ของ ${site.name} จะถูกบันทึกที่นี่หลังสร้าง artifact รอบแรก\n`);
}

const { migrateSites } = await import('./migrate-showcase-pseo.mjs');
await migrateSites({ onlySlugs: agencies.map((agency) => agency.slug) });
console.log('Generated and migrated ' + agencies.length + ' independent agency showcase repositories under ' + outputRoot);
