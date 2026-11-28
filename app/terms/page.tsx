import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/site-footer';
import { CONTACT_EMAIL, mailtoFor } from '@/lib/offers';
import { pageMetadata } from '@/lib/site-config';

export const metadata = pageMetadata('เงื่อนไขการให้บริการและการคืนเงิน', 'เงื่อนไขการชำระเงิน มัดจำ ค่าดูแลรายเดือน การยกเลิก และการคืนเงินของบริการที่ขายบนหน้า pricing', '/terms');

// Owner-facing note: this is the policy the live Stripe Payment Links already state in their checkout text
// (deposit 50% against an agreed quote, monthly care cancellable any time, SEO without ranking guarantee),
// written out in full. Changing a rule here changes what buyers were promised: date the change.
const sections: { title: string; items: string[] }[] = [
  {
    title: 'การชำระเงิน',
    items: [
      'ชำระผ่าน Stripe ด้วยบัตรเครดิต/เดบิต, PromptPay หรือ Apple Pay ตามที่หน้าชำระเงินแสดง รายการรายเดือน (ค่าดูแลและรายงาน SEO รายเดือน) ตัดผ่านบัตรเท่านั้น และ PromptPay ใช้ได้กับยอดเงินบาทเท่านั้น',
      'ยอดที่จ่ายเท่ากับราคาที่แสดงบนหน้า pricing เป็นเงินบาท (หรือดอลลาร์สหรัฐเมื่อเลือกลิงก์ USD)',
      'เว็บไซต์นี้ไม่เห็นและไม่เก็บข้อมูลบัตร ข้อมูลการชำระเงินอยู่กับ Stripe',
    ],
  },
  {
    title: 'มัดจำและใบเสนอราคา',
    items: [
      'มัดจำ 50% ของราคาเริ่มต้นใช้เริ่มงานหลังตกลงใบเสนอราคาแล้ว ใบเสนอราคาระบุขอบเขต ราคาสุดท้าย และกำหนดส่ง',
      'ส่วนที่เหลือชำระตอนส่งมอบตามใบเสนอราคา ยอดมัดจำหักออกจากราคาสุดท้ายแล้ว',
      'หากชำระมัดจำโดยยังไม่ได้คุยขอบเขต จะติดต่อกลับทางอีเมลภายใน 2 วันทำการเพื่อทำใบเสนอราคาก่อนเริ่มงาน',
    ],
  },
  {
    title: 'การยกเลิกและการคืนเงิน',
    items: [
      'ยกเลิกก่อนเริ่มงาน: คืนมัดจำเต็มจำนวน',
      'ยกเลิกหลังเริ่มงาน: คืนมัดจำหลังหักค่างานที่ทำไปแล้วตามขั้นที่ระบุในใบเสนอราคา',
      'ค่าดูแลรายเดือนยกเลิกได้ทุกเมื่อ มีผลจากรอบถัดไป ไม่คืนเงินรอบที่ตัดแล้ว',
      'รายงาน SEO แบบจ่ายครั้งเดียวคืนเงินเต็มจำนวนหากยังไม่ได้ส่งข้อมูล Search Console ให้ แบบรายเดือนยกเลิกได้ทุกเมื่อเช่นเดียวกับค่าดูแล',
      'ขอคืนเงินหรือยกเลิกทางอีเมล คืนเงินผ่านช่องทางเดิมที่ชำระ ระยะเวลาเข้าบัญชีขึ้นกับธนาคารหรือผู้ออกบัตร',
    ],
  },
  {
    title: 'ขอบเขตและการรับประกัน',
    items: [
      'งานรายงาน SEO ไม่การันตีอันดับหรือ traffic เป็นการวิเคราะห์และแนะนำจากข้อมูลจริงของคุณ',
      'งานระบบแก้ไขข้อบกพร่องที่ไม่ตรงกับขอบเขตในใบเสนอราคาได้ฟรีภายใน 30 วันหลังส่งมอบ',
      'ค่าบริการของบุคคลที่สาม (เช่น LINE OA แพ็กเกจรายเดือน, โดเมน, hosting ที่เกินแผนฟรี) เป็นของผู้ว่าจ้าง เว้นแต่ใบเสนอราคาระบุไว้',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="site-shell">
      <PublicHeader />
      <main id="main-content" className="public-page terms-page">
        <section className="detail-hero" aria-labelledby="terms-title">
          <p className="eyebrow">TERMS · REFUNDS</p>
          <h1 id="terms-title">เงื่อนไขการให้บริการและการคืนเงิน</h1>
          <p className="lede">ใช้กับทุกบริการที่ชำระผ่านหน้า <Link href="/pricing">ราคาและการชำระเงิน</Link> · ปรับปรุงล่าสุด 28 พฤศจิกายน 2569</p>
        </section>
        {sections.map((section) => (
          <section className="terms-section" key={section.title} aria-label={section.title}>
            <h2>{section.title}</h2>
            <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ))}
        <section className="terms-section" aria-label="ติดต่อ">
          <h2>ติดต่อ</h2>
          <p>คำถาม การยกเลิก และการขอคืนเงิน: <a href={mailtoFor('ยกเลิก / ขอคืนเงิน')}>{CONTACT_EMAIL}</a> · นโยบายความเป็นส่วนตัว: <a href="https://bookchaowalit.com/privacy">bookchaowalit.com/privacy</a></p>
        </section>
        <SiteFooter label="terms" />
      </main>
    </div>
  );
}
