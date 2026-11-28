// Priced offers sold on /pricing. Every amount and link here mirrors a LIVE Stripe Payment Link
// (metadata created_by=solo-empire, offer=<id>); the owner approved publishing these prices on 2026-11-28.
// Change a price in Stripe first, then here — tests/offers.test.ts keeps the links on buy.stripe.com.

export const CONTACT_EMAIL = 'bookchaowalit.work@gmail.com';

export type BuildOffer = {
  id: string;
  name: string;
  thaiName: string;
  summary: string;
  /** Starting price and the quoted range, in THB. */
  fromThb: number;
  toThb: number;
  /** 50% of the starting price, paid through depositUrl. */
  depositThb: number;
  depositUrl: string;
  maintenanceThb: number;
  maintenanceUrl: string;
};

export const buildOffers: readonly BuildOffer[] = [
  {
    id: 'line-chatbot-sme-v1',
    name: 'LINE OA Chatbot',
    thaiName: 'แชตบอท LINE OA สำหรับร้านค้าและ SME',
    summary: 'ตอบคำถามที่ลูกค้าถามบ่อย รับออเดอร์หรือส่งต่อให้พนักงานใน LINE OA ของร้าน',
    fromThb: 20000,
    toThb: 50000,
    depositThb: 10000,
    depositUrl: 'https://buy.stripe.com/9B614oa355eK19zgaO3ks0c',
    maintenanceThb: 3000,
    maintenanceUrl: 'https://buy.stripe.com/28EeVe7UX4aGf0paQu3ks0h',
  },
  {
    id: 'appointment-booking-line-v1',
    name: 'Appointment Booking System',
    thaiName: 'ระบบจองคิว / นัดหมายผ่าน LINE',
    summary: 'ลูกค้าจองเวลาเองได้ ร้านเห็นตารางคิวที่เดียว และส่งข้อความเตือนก่อนถึงนัด',
    fromThb: 25000,
    toThb: 50000,
    depositThb: 12500,
    depositUrl: 'https://buy.stripe.com/6oU5kEgrtaz44lLbUy3ks0e',
    maintenanceThb: 3000,
    maintenanceUrl: 'https://buy.stripe.com/dRm00k1wz4aG9G5f6K3ks0j',
  },
  {
    id: 'business-website-v1',
    name: 'Business Website + Automation',
    thaiName: 'เว็บไซต์ธุรกิจพร้อมงานอัตโนมัติ',
    summary: 'เว็บไซต์ที่ใช้งานบนมือถือได้ดี ค้นเจอบน Google และต่อกับงานหลังบ้านที่ทำซ้ำทุกวัน',
    fromThb: 30000,
    toThb: 80000,
    depositThb: 15000,
    depositUrl: 'https://buy.stripe.com/cNi28s0sv9v0g4t8Im3ks0f',
    maintenanceThb: 3000,
    maintenanceUrl: 'https://buy.stripe.com/3cI28s6QTbD83hH1fU3ks0k',
  },
  {
    id: 'sales-dashboard-line-v1',
    name: 'Sales Summary Dashboard',
    thaiName: 'แดชบอร์ดสรุปยอดขาย + สรุปส่ง LINE',
    summary: 'รวมยอดขายจากหลายช่องทางไว้ในหน้าเดียว และส่งสรุปประจำวันเข้า LINE ของเจ้าของร้าน',
    fromThb: 30000,
    toThb: 60000,
    depositThb: 15000,
    depositUrl: 'https://buy.stripe.com/cNidRacbdgXsbOd3o23ks0d',
    maintenanceThb: 3000,
    maintenanceUrl: 'https://buy.stripe.com/eVq8wQgrt36CaK9f6K3ks0i',
  },
  {
    id: 'custom-automation-v1',
    name: 'Custom Business Automation',
    thaiName: 'ระบบอัตโนมัติเฉพาะธุรกิจ',
    summary: 'ออกแบบ workflow ตามงานจริงของทีม เช่น เอกสาร ใบเสนอราคา รายงาน หรือการเชื่อมหลายระบบเข้าด้วยกัน',
    fromThb: 50000,
    toThb: 200000,
    depositThb: 25000,
    depositUrl: 'https://buy.stripe.com/28EbJ21wz6iOg4t3o23ks0g',
    maintenanceThb: 3000,
    maintenanceUrl: 'https://buy.stripe.com/7sY3cwa35cHc2dD9Mq3ks0l',
  },
];

export type SeoPlan = {
  id: string;
  name: string;
  detail: string;
  thb: number;
  usd: number;
  monthly: boolean;
  thbUrl: string;
  usdUrl: string;
};

export const seoPlans: readonly SeoPlan[] = [
  {
    id: 'seo-focused-start',
    name: 'Focused start',
    detail: '1 KPI + action brief จาก Search Console export ส่งงาน 3–5 วันทำการหลังได้ข้อมูลครบ',
    thb: 6900,
    usd: 199,
    monthly: false,
    thbUrl: 'https://buy.stripe.com/bJecN60svbD8dWlbUy3ks06',
    usdUrl: 'https://buy.stripe.com/cNidRadfh6iO5pP8Im3ks07',
  },
  {
    id: 'seo-monthly-report',
    name: 'Monthly report',
    detail: 'รายงาน SEO รายเดือน: KPI, query/page/device, technical shortlist และ action list ส่งงาน 5–7 วันทำการหลังได้ข้อมูลครบ',
    thb: 14900,
    usd: 449,
    monthly: true,
    thbUrl: 'https://buy.stripe.com/4gMcN67UXaz45pP6Ae3ks08',
    usdUrl: 'https://buy.stripe.com/3cIcN6dfhdLgdWlgaO3ks09',
  },
  {
    id: 'seo-report-action-review',
    name: 'Report + action review',
    detail: 'Monthly report + review การลงมือของรอบก่อน + measurement backlog + review call 1 ครั้งต่อเดือน',
    thb: 29900,
    usd: 890,
    monthly: true,
    thbUrl: 'https://buy.stripe.com/7sY00k8Z17mS9G53o23ks0a',
    usdUrl: 'https://buy.stripe.com/3cI4gAb799v02dD5wa3ks0b',
  },
];

const thb = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export function formatThb(amount: number) {
  return `฿${thb.format(amount)}`;
}

export function mailtoFor(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
