import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import { agencyPseoServices } from '@/lib/agency-pseo';
import { getAgency, statusCopy } from '@/lib/agency-portfolio';
import { pageMetadata } from '@/lib/site-config';

export const metadata = pageMetadata('Services — pSEO Pilot', 'บริการและ workflow ที่กำลังทดสอบด้วยหน้า pSEO แบบ public-safe', '/services');

export default function ServicesPage() {
  return (
    <div className="site-shell">
      <PublicHeader />
      <main id="main-content" className="public-page pseo-directory">
        <section className="hero" aria-labelledby="services-title">
          <div>
            <p className="eyebrow">SERVICE DIRECTORY / PSEO PILOT</p>
            <h1 id="services-title">เริ่มจาก service<br /><em>ที่วัดผลได้</em></h1>
            <p className="lede">หน้าเหล่านี้เป็น pilot สำหรับทดสอบ search intent และการอธิบายข้อเสนอ ไม่ใช่การยืนยันว่าเปิดรับงานแล้ว</p>
          </div>
          <aside className="hero-aside"><p className="eyebrow">PILOT SCOPE</p><strong>14 services · 6 industries · 6 problems</strong><p>ทุกหน้ามี owner, workflow, deliverables และ evidence boundary ของตัวเอง</p></aside>
        </section>

        <section className="pseo-directory-section" aria-labelledby="service-list-title">
          <div className="section-heading"><div><p className="eyebrow">14 SERVICE PAGES</p><h2 id="service-list-title">เลือกข้อเสนอ</h2></div><p>ทุก vertical มีหน้าเริ่มต้นของตัวเอง โดยสถานะ commercial ยังคงแสดงตาม readiness จริง</p></div>
          <div className="pseo-directory-grid">{agencyPseoServices.map((service) => { const agency = getAgency(service.agencySlug); const readiness = agency ? statusCopy[agency.status] : undefined; return <Link className="pseo-directory-card" key={service.slug} href={`/services/${service.slug}`}><div><div className="card-top"><span className="eyebrow">{service.name}</span><span className={`status status-${agency?.status ?? 'locked'}`}>{readiness?.label ?? 'pilot'}</span></div><h3>{service.title}</h3><p>{service.intent}</p></div><span aria-hidden="true">↗</span></Link>; })}</div>
        </section>

        <section className="pseo-directory-section" aria-labelledby="next-title">
          <div className="section-heading"><div><p className="eyebrow">NEXT FILTER</p><h2 id="next-title">เลือกบริบทของงาน</h2></div><p>ค้นต่อจากอุตสาหกรรมหรือปัญหา เพื่อดู workflow ที่ต่างกันจริง</p></div>
          <div className="pseo-directory-links"><Link href="/industries">ดูตามอุตสาหกรรม <span aria-hidden="true">→</span></Link><Link href="/solutions">ดูตามปัญหา <span aria-hidden="true">→</span></Link></div>
        </section>

        <footer className="site-footer"><span>Solo Empire Group · service directory</span><span>pilot / no inquiry intake</span></footer>
      </main>
    </div>
  );
}
