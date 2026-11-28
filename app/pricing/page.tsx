import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/site-footer';
import { buildOffers, formatThb, mailtoFor, seoPlans } from '@/lib/offers';
import { pageMetadata } from '@/lib/site-config';

export const metadata = pageMetadata(
  'ราคาและการชำระเงิน',
  'ราคาเริ่มต้นของงาน LINE OA, ระบบจองคิว, เว็บไซต์, แดชบอร์ดยอดขาย, ระบบอัตโนมัติ และรายงาน SEO พร้อมชำระมัดจำออนไลน์ผ่าน Stripe (บัตร / PromptPay)',
  '/pricing',
);

const steps = [
  'ส่งอีเมลเล่าโจทย์และงานที่อยากให้ระบบช่วย',
  'คุยขอบเขต แล้วได้ใบเสนอราคาที่ระบุราคาสุดท้ายในช่วงราคาที่แสดงไว้',
  'ชำระมัดจำ 50% ของราคาเริ่มต้นผ่าน Stripe เพื่อเริ่มงาน (ยอดมัดจำคงที่ตามที่แสดง แม้ราคาสุดท้ายสูงกว่าราคาเริ่มต้น)',
  'ส่งมอบงาน ชำระส่วนที่เหลือตามใบเสนอราคา แล้วเลือกได้ว่าจะใช้บริการดูแลรายเดือนหรือไม่',
];

export default function PricingPage() {
  return (
    <div className="site-shell">
      <PublicHeader />
      <main id="main-content" className="public-page pricing-page">
        <section className="hero" aria-labelledby="pricing-title">
          <div>
            <p className="eyebrow">PRICING</p>
            <h1 id="pricing-title">ราคาชัดเจน<br /><em>จ่ายออนไลน์ได้ทันที</em></h1>
            <p className="lede">ราคาด้านล่างเป็นราคาเริ่มต้นจริง ชำระผ่าน Stripe ด้วยบัตรหรือ PromptPay (รายการรายเดือนตัดผ่านบัตรเท่านั้น)</p>
          </div>
          <aside className="hero-aside">
            <p className="eyebrow">ก่อนชำระมัดจำ</p>
            <strong>คุยขอบเขตก่อน</strong>
            <p>มัดจำใช้เมื่อตกลงใบเสนอราคาแล้วเท่านั้น ถ้ายังไม่แน่ใจ ส่งอีเมลมาถามก่อนได้เลย</p>
            <a className="text-link" href={mailtoFor('สอบถามงาน / ขอใบเสนอราคา')}>ส่งอีเมลสอบถาม <span aria-hidden="true">→</span></a>
          </aside>
        </section>

        <section className="pricing-section" aria-labelledby="build-title">
          <div className="section-heading"><div><p className="eyebrow">BUILD + CARE</p><h2 id="build-title">งานระบบสำหรับธุรกิจ</h2></div><p>ราคาสุดท้ายขึ้นกับฟีเจอร์และขอบเขต ซึ่งจะอยู่ในใบเสนอราคาก่อนเริ่มงานเสมอ</p></div>
          <div className="pricing-grid">
            {buildOffers.map((offer) => (
              <article className="price-card" key={offer.id} aria-labelledby={`${offer.id}-name`}>
                <p className="eyebrow" lang="en">{offer.name}</p>
                <h3 id={`${offer.id}-name`}>{offer.thaiName}</h3>
                <p className="price-summary">{offer.summary}</p>
                <p className="price-main"><span>เริ่มต้น</span> {formatThb(offer.fromThb)}</p>
                <p className="price-range">ช่วงราคา {formatThb(offer.fromThb)}–{formatThb(offer.toThb)}</p>
                <dl className="price-terms">
                  <div><dt>มัดจำเริ่มงาน (50% ของราคาเริ่มต้น)</dt><dd>{formatThb(offer.depositThb)}</dd></div>
                  <div><dt>ดูแลระบบหลังส่งมอบ</dt><dd>{formatThb(offer.maintenanceThb)}/เดือน</dd></div>
                </dl>
                <div className="price-actions">
                  <a className="button button-dark" href={offer.depositUrl} rel="noopener">ชำระมัดจำ {formatThb(offer.depositThb)}</a>
                  <a className="text-link" href={offer.maintenanceUrl} rel="noopener">สมัครดูแลรายเดือน <span aria-hidden="true">→</span></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing-section" aria-labelledby="seo-title">
          <div className="section-heading"><div><p className="eyebrow">SEO REPORT</p><h2 id="seo-title">รายงาน SEO จากข้อมูลจริง</h2></div><p>ใช้ข้อมูลจาก Google Search Console ของคุณ ไม่การันตีอันดับหรือ traffic หลังชำระเงิน ส่ง Search Console export มาให้เรา ระยะเวลาส่งงานนับจากวันที่ได้ข้อมูลครบ</p></div>
          <div className="pricing-grid pricing-grid-3">
            {seoPlans.map((plan) => (
              <article className="price-card" key={plan.id} aria-labelledby={`${plan.id}-name`}>
                <p className="eyebrow">{plan.monthly ? 'รายเดือน' : 'จ่ายครั้งเดียว'}</p>
                <h3 id={`${plan.id}-name`} lang="en">{plan.name}</h3>
                <p className="price-summary">{plan.detail}</p>
                <p className="price-main">{formatThb(plan.thb)}{plan.monthly ? <span>/เดือน</span> : null}</p>
                <div className="price-actions">
                  <a className="button button-dark" href={plan.thbUrl} rel="noopener">ชำระ {formatThb(plan.thb)}</a>
                  <a className="text-link" href={plan.usdUrl} rel="noopener" lang="en">Pay in USD (${plan.usd}) <span aria-hidden="true">→</span></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing-section" aria-labelledby="steps-title">
          <div className="section-heading"><div><p className="eyebrow">HOW IT WORKS</p><h2 id="steps-title">ขั้นตอนการจ้างงาน</h2></div><p>ทุกงานมีใบเสนอราคาที่ระบุขอบเขตและกำหนดส่งก่อนเริ่ม</p></div>
          <ol className="pseo-steps">
            {steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}
          </ol>
          <p className="pricing-note">การชำระเงินทำบนหน้าของ Stripe เว็บไซต์นี้ไม่เก็บข้อมูลบัตร ยอดที่จ่ายเท่ากับราคาที่แสดง ไม่มีค่าธรรมเนียมเพิ่ม ดู <Link href="/terms">เงื่อนไขการให้บริการและการคืนเงิน</Link> ก่อนชำระ</p>
        </section>

        <SiteFooter label="pricing" />
      </main>
    </div>
  );
}
