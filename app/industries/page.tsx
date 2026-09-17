import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import { pseoIndustries, pseoService } from '@/lib/pseo';
import { pageMetadata } from '@/lib/site-config';

export const metadata = pageMetadata('Industries — pSEO Pilot', 'บริบทอุตสาหกรรมที่กำลังทดสอบสำหรับ AI Automation Workflow Sprint', '/industries');

export default function IndustriesPage() {
  return (
    <div className="site-shell">
      <PublicHeader />
      <main id="main-content" className="public-page pseo-directory">
        <section className="hero" aria-labelledby="industries-title">
          <div><p className="eyebrow">INDUSTRY DIRECTORY / PSEO PILOT</p><h1 id="industries-title">งานแบบเดียวกัน<br /><em>บริบทไม่เหมือนกัน</em></h1><p className="lede">แต่ละหน้าเริ่มจาก workflow และความเสี่ยงของอุตสาหกรรมนั้น ไม่ได้เปลี่ยนชื่ออุตสาหกรรมบน template เดิม</p></div>
          <aside className="hero-aside"><p className="eyebrow">SERVICE</p><strong>{pseoService.name}</strong><p>เลือกบริบทที่มี process owner และข้อมูลตัวอย่างที่เปิดเผยได้ก่อน</p></aside>
        </section>
        <section className="pseo-directory-section" aria-labelledby="industry-list-title"><div className="section-heading"><div><p className="eyebrow">6 PILOT CONTEXTS</p><h2 id="industry-list-title">เลือกอุตสาหกรรม</h2></div><p>ทุก card พาไปยังหน้าเฉพาะที่มี buyer, workflow และ readiness ต่างกัน</p></div><div className="pseo-directory-grid">{pseoIndustries.map((item) => <Link className="pseo-directory-card" key={item.slug} href={`/industries/${item.slug}/${item.serviceSlug}`}><div><span className="eyebrow">{item.name}</span><h3>{item.title}</h3><p>{item.intent}</p></div><span aria-hidden="true">↗</span></Link>)}</div></section>
        <footer className="site-footer"><span>Solo Empire Group · industry directory</span><span>pilot / no inquiry intake</span></footer>
      </main>
    </div>
  );
}
