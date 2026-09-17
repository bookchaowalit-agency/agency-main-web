import Link from 'next/link';
import { notFound } from 'next/navigation';
import { agencies, getAgency, statusCopy } from '@/lib/agency-portfolio';
import { pageMetadata } from '@/lib/site-config';

const formatAgencyNumber = (number: number) => String(number).padStart(2, '0');

export function generateStaticParams() {
  return agencies.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agency = getAgency(slug);
  return agency ? pageMetadata(agency.name, agency.promise, `/agencies/${agency.slug}`) : pageMetadata('Agency', 'ไม่พบ agency', '/agencies');
}

export default async function AgencyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agency = getAgency(slug);
  if (!agency) notFound();

  const readiness = statusCopy[agency.status];

  return (
    <main id="main-content" className="public-page agency-page detail-page">
      <div className="breadcrumb"><Link href="/agencies">Portfolio</Link><span>/</span><strong>{agency.name}</strong></div>

      <section className="hero detail-hero" aria-labelledby="detail-title">
        <div>
          <p className="eyebrow">BRAND {formatAgencyNumber(agency.number)} · {agency.stage} · {readiness.label}</p>
          <h1 id="detail-title">{agency.name}<br /><em>{agency.thaiName}</em></h1>
          <p className="lede">{agency.promise}</p>
          <div className="actions"><a className="button button-dark" href="#engagement">{agency.cta} <span aria-hidden="true">↓</span></a><Link className="text-link" href="/agencies">ดูทุกแบรนด์ <span aria-hidden="true">↗</span></Link></div>
        </div>
        <aside className="hero-aside detail-aside"><p className="eyebrow">STARTING ENGAGEMENT</p><strong>{agency.offer}</strong><dl><div><dt>เหมาะกับ</dt><dd>{agency.buyer}</dd></div><div><dt>สถานะ</dt><dd>{readiness.label}</dd></div></dl></aside>
      </section>

      <section id="engagement" className="fit-grid" aria-label={`${agency.name} buyer and engagement`}>
        <article className="fit-card fit-problem"><p className="eyebrow">THE PROBLEM</p><h2>{agency.problem}</h2><p>{agency.fit}</p></article>
        <article className="fit-card fit-offer"><p className="eyebrow">STARTING ENGAGEMENT</p><h2>{agency.offer}</h2><p>{agency.offerDetail}</p><a className="text-link" href="#scope">ดูขอบเขตงาน <span aria-hidden="true">→</span></a></article>
      </section>

      <section id="scope" className="detail-grid" aria-label={`${agency.name} scope and readiness`}>
        <article><p className="eyebrow">WHAT WE WORK ON</p><h2>สิ่งที่อยู่ในขอบเขตนี้</h2><ul>{agency.scope.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article><p className="eyebrow">READINESS</p><h2>{readiness.label}</h2><p className="detail-copy">{readiness.note}</p><p className="detail-note">{agency.fit}</p></article>
      </section>

      <section className="ownership-row" aria-label={`${agency.name} future ownership path`}><div><p className="eyebrow">OWNERSHIP PATH</p><h2>สิ่งที่ต้องสะสม</h2></div><p>{agency.asset}</p></section>

      <footer className="site-footer"><span>Solo Empire Group · {agency.name}</span><span><Link href="/agencies">ทุกแบรนด์</Link><i>·</i><a href="#engagement">เริ่มดู engagement</a></span></footer>
    </main>
  );
}
