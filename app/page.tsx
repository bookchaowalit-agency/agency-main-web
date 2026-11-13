import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import SiteLinks from '@/components/site-links';

export default function HomePage() {
  return (
    <div className="site-shell">
      <PublicHeader />
      <main id="main-content" className="public-page public-home">
        <p className="eyebrow">Solo Empire Group · Public portfolio</p>
        <h1>Specialist work <em>with a shared core.</em></h1>
        <p className="home-lede">สิบสี่ verticals สำหรับ buyer ที่มีโจทย์เฉพาะทาง แต่ใช้ระบบคิด การปฏิบัติการ และความสามารถกลางร่วมกัน</p>
        <Link className="button button-dark" href="/agencies">ดู agency portfolio <span aria-hidden="true">→</span></Link>
        <div className="home-directories" aria-label="pSEO pilot directories">
          <Link href="/services">Services <span aria-hidden="true">›</span></Link>
          <Link href="/industries">Industries <span aria-hidden="true">›</span></Link>
          <Link href="/solutions">Problems <span aria-hidden="true">›</span></Link>
        </div>
        <p className="home-note">หน้านี้เป็น portfolio preview สถานะของแต่ละ vertical จะแสดงตามความพร้อมจริง และยังไม่มี lead form หรือการรับข้อมูลลูกค้า</p>
        <SiteLinks />
      </main>
    </div>
  );
}
