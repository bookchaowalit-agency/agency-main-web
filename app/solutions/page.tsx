import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import { pseoProblems, pseoService } from '@/lib/pseo';
import { pageMetadata } from '@/lib/site-config';

export const metadata = pageMetadata('Problems — pSEO Pilot', 'ปัญหา workflow ที่กำลังทดสอบด้วย AI Automation แบบมี human review', '/solutions');

export default function SolutionsPage() {
  return (
    <div className="site-shell">
      <PublicHeader />
      <main id="main-content" className="public-page pseo-directory">
        <section className="hero" aria-labelledby="solutions-title">
          <div><p className="eyebrow">PROBLEM DIRECTORY / PSEO PILOT</p><h1 id="solutions-title">เริ่มจากปัญหา<br /><em>ที่ทีมเจอทุกสัปดาห์</em></h1><p className="lede">หน้าเหล่านี้อธิบายจุดเริ่มต้นของ workflow ก่อนพูดถึงเทคโนโลยี และกำหนดจุดที่ต้องให้คนตรวจไว้ตั้งแต่ต้น</p></div>
          <aside className="hero-aside"><p className="eyebrow">SERVICE</p><strong>{pseoService.name}</strong><p>เลือกปัญหาที่มี owner, baseline และ acceptance criteria ได้</p></aside>
        </section>
        <section className="pseo-directory-section" aria-labelledby="problem-list-title"><div className="section-heading"><div><p className="eyebrow">6 PILOT PROBLEMS</p><h2 id="problem-list-title">เลือกปัญหา</h2></div><p>แต่ละหน้าให้ workflow, deliverable และขอบเขตหลักฐานที่แตกต่างกัน</p></div><div className="pseo-directory-grid">{pseoProblems.map((item) => <Link className="pseo-directory-card" key={item.slug} href={`/solutions/${item.slug}/${item.serviceSlug}`}><div><span className="eyebrow">{item.name}</span><h3>{item.title}</h3><p>{item.intent}</p></div><span aria-hidden="true">↗</span></Link>)}</div></section>
        <footer className="site-footer"><span>Solo Empire Group · problem directory</span><span>pilot / no inquiry intake</span></footer>
      </main>
    </div>
  );
}
