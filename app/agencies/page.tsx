import Link from 'next/link';
import { agencies, sharedCore } from '@/lib/agency-portfolio';
import { pageMetadata } from '@/lib/site-config';

const formatAgencyNumber = (number: number) => String(number).padStart(2, '0');

export const metadata = pageMetadata('Agency Portfolio', 'Fourteen specialist agency verticals built on one shared core.', '/agencies');

export default function AgenciesPage() {
  return (
    <main id="main-content" className="public-page agency-page">
      <section className="hero" aria-labelledby="agency-title">
        <div>
          <p className="eyebrow">TARGET MAP / PUBLIC PREVIEW</p>
          <h1 id="agency-title">14 verticals.<br /><em>One shared core.</em></h1>
          <p className="lede">แบรนด์หน้าบ้านแยกตาม buyer และ trust model ส่วนระบบการค้า งานปฏิบัติการ ข้อมูล และเทคโนโลยีใช้ร่วมกัน</p>
          <div className="actions"><a className="button button-dark" href="#verticals">สำรวจ verticals <span aria-hidden="true">↓</span></a><a className="text-link" href="#shared-core">ดู shared core <span aria-hidden="true">↘</span></a></div>
        </div>
        <aside className="hero-aside"><p className="eyebrow">PORTFOLIO STATE</p><strong>14</strong><p>เป้าหมายเชิงสถาปัตยกรรม<br />ไม่ใช่ 14 ธุรกิจที่เปิดพร้อมกัน</p><div className="aside-meta"><span>P0 now</span><span>P1–P3 later</span></div></aside>
      </section>

      <section id="verticals" className="section" aria-labelledby="verticals-title">
        <div className="section-heading"><div><p className="eyebrow">FRONT DOORS</p><h2 id="verticals-title">Specialist verticals</h2></div><p>แต่ละหน้าช่วยให้ buyer เห็นปัญหาและ starting engagement โดยสถานะ commercial จะแสดงตามจริง</p></div>
        <div className="agency-grid">
          {agencies.map((agency) => (
            <Link className="agency-card" href={`/agencies/${agency.slug}`} key={agency.slug}>
              <div className="card-top"><span>#{formatAgencyNumber(agency.number)}</span><span className={`status status-${agency.status}`}>{agency.stage}</span></div>
              <div><h3>{agency.name}</h3><p className="card-thai">{agency.thaiName}</p><p className="card-copy">{agency.promise}</p></div>
              <div className="card-footer"><span>{agency.buyer}</span><span aria-hidden="true">↗</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section id="shared-core" className="section core-section" aria-labelledby="shared-core-title">
        <div className="section-heading"><div><p className="eyebrow">HORIZONTAL INFRASTRUCTURE</p><h2 id="shared-core-title">Shared core</h2></div><p>ไม่ใช่ Agency #15 แต่เป็น operating layer ที่ทำให้ 14 verticals ใช้ process, knowledge และ leverage ร่วมกันได้</p></div>
        <div className="core-grid">{sharedCore.map((core, index) => <article className="core-card" key={core.name}><span>0{index + 1}</span><h3>{core.name}</h3><p>{core.thaiName}</p><small>{core.items}</small></article>)}</div>
      </section>

      <footer className="site-footer"><span>Solo Empire Group · portfolio preview</span><span><Link href="/">Home</Link><i>·</i><Link href="/agencies">14 verticals</Link></span></footer>
    </main>
  );
}
