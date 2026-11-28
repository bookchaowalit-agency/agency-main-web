import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/site-footer';
import { CONTACT_EMAIL, mailtoFor } from '@/lib/offers';

// Where Stripe Payment Links send the buyer after paying. Never indexed: it means nothing without a payment.
export const metadata: Metadata = {
  title: 'ชำระเงินเรียบร้อย',
  description: 'ขอบคุณที่ชำระเงิน ขั้นตอนต่อไปหลังชำระ',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="site-shell">
      <PublicHeader />
      <main id="main-content" className="public-page state-page">
        <p className="eyebrow">PAYMENT RECEIVED</p>
        <h1>ขอบคุณ ชำระเงินเรียบร้อยแล้ว</h1>
        <p>Stripe ส่งใบเสร็จไปที่อีเมลที่คุณกรอกไว้แล้ว เราจะติดต่อกลับทางอีเมลภายใน 2 วันทำการ</p>
        <p>ถ้าเป็นรายงาน SEO ส่ง Search Console export มาที่ <a href={mailtoFor('ส่งข้อมูล Search Console')}>{CONTACT_EMAIL}</a> ได้เลย ถ้าเป็นงานระบบ ตอบอีเมลนั้นพร้อมรายละเอียดโจทย์หรือใบเสนอราคาที่ตกลงไว้</p>
        <Link className="text-link" href="/terms">ดูเงื่อนไขการยกเลิกและการคืนเงิน <span aria-hidden="true">→</span></Link>
        <SiteFooter label="payment received" />
      </main>
    </div>
  );
}
