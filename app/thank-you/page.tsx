import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import { SiteFooter } from '@/components/site-footer';
import { CONTACT_EMAIL, mailtoFor } from '@/lib/offers';

// Where Stripe Payment Links send the buyer after paying. Never indexed: it means nothing without a payment.
export const metadata: Metadata = {
  title: 'ขอบคุณที่ชำระเงิน',
  description: 'ขอบคุณที่ชำระเงิน ขั้นตอนต่อไปหลังชำระ',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="site-shell">
      <PublicHeader />
      <main id="main-content" className="public-page state-page">
        <p className="eyebrow">AFTER PAYMENT</p>
        <h1>ขอบคุณที่ชำระเงิน</h1>
        <p>หากคุณเพิ่งชำระผ่าน Stripe สำเร็จ ใบเสร็จจะส่งไปที่อีเมลที่กรอกไว้ และเราจะติดต่อกลับทางอีเมลภายใน 2 วันทำการ หากไม่ได้รับใบเสร็จ ส่งอีเมลมาพร้อมเวลาที่ชำระ เราจะตรวจสอบให้</p>
        <p>ถ้าเป็นรายงาน SEO ส่ง Search Console export มาที่ <a href={mailtoFor('ส่งข้อมูล Search Console')}>{CONTACT_EMAIL}</a> ได้เลย ถ้าเป็นงานระบบ ตอบอีเมลนั้นพร้อมรายละเอียดโจทย์หรือใบเสนอราคาที่ตกลงไว้</p>
        <Link className="text-link" href="/terms">ดูเงื่อนไขการยกเลิกและการคืนเงิน <span aria-hidden="true">→</span></Link>
        <SiteFooter label="after payment" />
      </main>
    </div>
  );
}
