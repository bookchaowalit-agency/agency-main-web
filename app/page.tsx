import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/site-footer';
import SiteLinks from '@/components/site-links';
import { agencies } from '@/lib/agency-portfolio';

// Three real verticals on the first screen, so a buyer sees the work before clicking through.
const featuredSlugs = ['talent', 'cyber-security', 'governance-risk'];
const featured = featuredSlugs.flatMap((slug) => agencies.filter((agency) => agency.slug === slug));
const formatAgencyNumber = (number: number) => String(number).padStart(2, '0');

export default function HomePage() {
  return (
    <div className="site-shell">
      <PublicHeader />
      <main id="main-content" className="public-page public-home">
        <span className="home-mark" aria-hidden="true">SE</span>
        <p className="eyebrow" lang="en">Solo Empire Group · Public portfolio</p>
        <h1 lang="en">Specialist work <em>with a shared core.</em></h1>
        <p className="home-lede">14 กลุ่มงานเฉพาะทาง สำหรับผู้ซื้อที่มีโจทย์เฉพาะด้าน แต่ใช้ระบบคิด การปฏิบัติการ และความสามารถกลางชุดเดียวกัน</p>
        <Link className="button button-dark" href="/agencies">ดูพอร์ตโฟลิโอทั้ง 14 กลุ่มงาน <span aria-hidden="true">→</span></Link>
        <div className="home-directories" aria-label="pSEO pilot directories">
          <Link href="/services">Services <span aria-hidden="true">›</span></Link>
          <Link href="/industries">Industries <span aria-hidden="true">›</span></Link>
          <Link href="/solutions">Problems <span aria-hidden="true">›</span></Link>
          <Link href="/pricing">Pricing <span aria-hidden="true">›</span></Link>
        </div>
        <p className="home-note">หน้านี้เป็น portfolio preview สถานะของแต่ละ vertical จะแสดงตามความพร้อมจริง และยังไม่มี lead form หรือการรับข้อมูลลูกค้า</p>
        <SiteLinks />
        <section className="home-featured" aria-label="ตัวอย่างกลุ่มงาน">
          {featured.map((agency) => (
            <Link className="agency-card" href={`/agencies/${agency.slug}`} key={agency.slug}>
              <div className="card-top"><span>#{formatAgencyNumber(agency.number)}</span><span className={`status status-${agency.status}`}>{agency.stage}</span></div>
              <div><h2 className="card-title">{agency.name}</h2><p className="card-thai">{agency.thaiName}</p><p className="card-copy">{agency.promise}</p></div>
              <div className="card-footer"><span>{agency.buyer}</span><span aria-hidden="true">↗</span></div>
            </Link>
          ))}
        </section>
        <SiteFooter label="portfolio preview" links={false} />
      </main>
    </div>
  );
}
