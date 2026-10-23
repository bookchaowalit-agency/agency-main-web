import Link from 'next/link';
import { readinessCopy } from '@/lib/readiness';
import { site } from '@/lib/site';
import { pseoService, type PseoService } from '@/lib/pseo';
import { absoluteUrl, siteConfig } from '@/lib/site-config';

function structuredData(service: PseoService) {
  const canonical = siteConfig.publicUrl ? absoluteUrl('/services/' + service.slug) : undefined;
  return JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.context,
      serviceType: service.name,
      inLanguage: 'th',
      ...(canonical ? { url: canonical } : {}),
      provider: { '@type': 'Organization', name: 'Solo Empire Group' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Services', ...(siteConfig.publicUrl ? { item: absoluteUrl('/services') } : {}) },
        { '@type': 'ListItem', position: 2, name: service.title, ...(canonical ? { item: canonical } : {}) },
      ],
    },
  ]).replace(/</g, '\\u003c');
}

export function PseoHeader() {
  return <header className="pseo-header"><Link className="pseo-brand" href="/"><span className="pseo-brand-mark" aria-hidden="true">{String(site.number).padStart(2, '0')}</span><span><strong>{site.name}</strong><small>{site.thaiName}</small></span></Link><nav className="pseo-nav" aria-label="เมนู service"><Link href="/">Showcase</Link><Link href={`/services/${pseoService.slug}`}>Service</Link></nav></header>;
}

export function PseoLandingPage({ service = pseoService }: { service?: PseoService }) {
  const readiness = readinessCopy(service.agencyStatus);
  const structuredDataJson = structuredData(service);
  return <div className="pseo-shell"><PseoHeader /><main id="main-content" className="pseo-main">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataJson }} />
    <div className="pseo-breadcrumb"><Link href="/services">Service</Link><span>/</span><strong>{service.name}</strong></div>
    <section className="pseo-hero" aria-labelledby="pseo-title"><div><p className="pseo-eyebrow">SERVICE / {service.agencyName.toUpperCase()}</p><h1 id="pseo-title">{service.title}</h1><p className="pseo-lede">{service.context}</p><div className="pseo-actions"><Link className="pseo-button" href="/">กลับไปดู showcase</Link><Link className="pseo-text-link" href="#readiness">ดู readiness gate ↓</Link></div></div><aside className="pseo-aside"><p className="pseo-eyebrow">SEARCH INTENT</p><strong>{service.intent}</strong><dl><div><dt>เหมาะกับ</dt><dd>{service.buyer}</dd></div><div><dt>สถานะ</dt><dd>{readiness.label}</dd></div></dl></aside></section>
    <section className="pseo-section" aria-labelledby="workflow-title"><div className="pseo-section-heading"><div><p className="pseo-eyebrow">HOW WE START</p><h2 id="workflow-title">เริ่มจาก workflow เดียว</h2></div><p>ขอบเขตเล็กพอที่จะวัดผลและตรวจรับได้ ก่อนตัดสินใจขยายระบบ</p></div><ol className="pseo-steps">{service.workflow.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol></section>
    <section className="pseo-section pseo-grid" aria-label="Deliverables and evidence"><article className="pseo-card pseo-card-dark"><p className="pseo-eyebrow">DELIVERABLES</p><h2>สิ่งที่จะได้</h2><ul>{service.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="pseo-card"><p className="pseo-eyebrow">EVIDENCE BOUNDARY</p><h2>สิ่งที่เราพูดได้ตรง ๆ</h2><ul>{service.evidence.map((item) => <li key={item}>{item}</li>)}</ul></article></section>
    <section id="readiness" className="pseo-section pseo-readiness" aria-labelledby="readiness-title"><div><p className="pseo-eyebrow">READINESS GATE / {service.agencyStage}</p><h2 id="readiness-title">ก่อนเปิดรับ inquiry</h2></div><p>{service.readiness}</p></section>
    <footer className="pseo-footer"><span>{site.name} · service page</span><span>{readiness.label} · public-safe · no inquiry intake</span></footer>
  </main></div>;
}
