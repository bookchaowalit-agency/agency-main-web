import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main-content" className="public-page state-page">
      <p className="eyebrow">404 / NOT FOUND</p>
      <h1>ไม่พบหน้านี้</h1>
      <p>เส้นทางนี้ยังไม่มีอยู่ใน public agency portfolio</p>
      <Link className="text-link" href="/agencies">กลับไปดูทุก agency <span aria-hidden="true">→</span></Link>
    </main>
  );
}
