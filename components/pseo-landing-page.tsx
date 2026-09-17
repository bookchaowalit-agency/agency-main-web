import Link from 'next/link';
import { getAgency, statusCopy } from '@/lib/agency-portfolio';
import { PublicHeader } from '@/components/public-header';
import { absoluteUrl, siteConfig } from '@/lib/site-config';

export type PseoLandingPageProps = {
  eyebrow: string;
  title: string;
  intent: string;
  buyer: string;
  context: string;
  workflow: string[];
  deliverables: string[];
  evidence: string[];
  readiness: string;
  agencySlug: string;
  canonicalPath: string;
  relatedLinks: Array<{ href: string; label: string }>;
};

export function PseoLandingPage({
  eyebrow,
  title,
  intent,
  buyer,
  context,
  workflow,
  deliverables,
  evidence,
  readiness,
  agencySlug,
  canonicalPath,
  relatedLinks,
}: PseoLandingPageProps) {
  const agency = getAgency(agencySlug);
  const agencyReadiness = agency ? statusCopy[agency.status] : undefined;
  const agencyCta = agency?.status === 'locked'
    ? 'ดู future capability'
    : `ดู ${agency?.name ?? 'agency'} profile`;
  const canonical = siteConfig.publicUrl ? absoluteUrl(canonicalPath) : undefined;
  const collection = eyebrow.startsWith('INDUSTRY')
    ? { name: 'Industries', path: '/industries' }
    : eyebrow.startsWith('PROBLEM')
      ? { name: 'Solutions', path: '/solutions' }
      : { name: 'Services', path: '/services' };
  const structuredData = JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: title,
      description: context,
      serviceType: eyebrow,
      inLanguage: 'th',
      ...(canonical ? { url: canonical } : {}),
      provider: { '@type': 'Organization', name: 'Solo Empire Group' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: collection.name, ...(siteConfig.publicUrl ? { item: absoluteUrl(collection.path) } : {}) },
        { '@type': 'ListItem', position: 2, name: title, ...(canonical ? { item: canonical } : {}) },
      ],
    },
  ]).replace(/</g, '\\u003c');

  return (
    <div className="site-shell">
      <PublicHeader />

      <main id="main-content" className="public-page pseo-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
        <div className="breadcrumb"><Link href="/services">pSEO pilot</Link><span>/</span><strong>{title}</strong></div>

        <section className="hero pseo-hero" aria-labelledby="pseo-title">
          <div>
            <p className="eyebrow">{eyebrow} · PILOT PAGE</p>
            <h1 id="pseo-title">{title}</h1>
            <p className="lede">{context}</p>
            <div className="actions">
              <Link className="button button-dark" href={`/agencies/${agencySlug}#engagement`}>{agencyCta} <span aria-hidden="true">→</span></Link>
              <Link className="text-link" href="/services">ดู service ทั้งหมด <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <aside className="hero-aside pseo-aside">
            <p className="eyebrow">SEARCH INTENT</p>
            <strong>{intent}</strong>
            <dl>
              <div><dt>เหมาะกับ</dt><dd>{buyer}</dd></div>
              <div><dt>สถานะ</dt><dd>{agencyReadiness?.label ?? 'pilot'}</dd></div>
            </dl>
          </aside>
        </section>

        <section className="pseo-section" aria-labelledby="workflow-title">
          <div className="section-heading"><div><p className="eyebrow">HOW WE START</p><h2 id="workflow-title">เริ่มจาก workflow เดียว</h2></div><p>ขอบเขตเล็กพอที่จะวัดผลและตรวจรับได้ ก่อนตัดสินใจขยายระบบ</p></div>
          <ol className="pseo-steps">{workflow.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol>
        </section>

        <section className="pseo-grid" aria-label="Deliverables and evidence">
          <article className="pseo-card pseo-card-dark"><p className="eyebrow">DELIVERABLES</p><h2>สิ่งที่จะได้</h2><ul>{deliverables.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="pseo-card"><p className="eyebrow">EVIDENCE BOUNDARY</p><h2>สิ่งที่เราพูดได้ตรง ๆ</h2><ul>{evidence.map((item) => <li key={item}>{item}</li>)}</ul></article>
        </section>

        <section className="pseo-readiness" aria-labelledby="readiness-title">
          <div><p className="eyebrow">READINESS GATE</p><h2 id="readiness-title">ก่อนเปิดรับ inquiry</h2></div>
          <p>{readiness}</p>
        </section>

        <section className="pseo-related" aria-labelledby="related-title">
          <div className="section-heading"><div><p className="eyebrow">KEEP EXPLORING</p><h2 id="related-title">หน้าใกล้เคียง</h2></div><p>เลือกหน้าอื่นตามอุตสาหกรรมหรือปัญหาที่มีบริบทต่างกัน</p></div>
          <div className="pseo-related-grid">{relatedLinks.map((link) => <Link className="pseo-related-link" key={link.href} href={link.href}>{link.label}<span aria-hidden="true">↗</span></Link>)}</div>
        </section>

        <footer className="site-footer"><span>Solo Empire Group · pSEO pilot</span><span>{agency?.name ?? 'Technology'} · {agencyReadiness?.label ?? 'validation'}</span></footer>
      </main>
    </div>
  );
}
