# pSEO Pilot

สถานะของชุดนี้คือ `pilot` และ `verified-local` เว็บสร้างจาก structured content
เพื่อทดสอบ search intent และ message ของทั้ง 14 agency โดยยังไม่มี custom domain,
lead form, CRM หรือการส่งข้อมูลออกจาก static site; production showcase aliases ยัง
คง `noindex`/`Disallow: /`

## Page contract

ทุกหน้า pSEO ต้องตอบคำถามที่มีบริบทเฉพาะและมีข้อมูลครบชุดต่อไปนี้:

- `intent` — งานค้นหาที่หน้านี้ช่วยตอบ
- `buyer` — คนที่มีปัญหาและมีสิทธิ์เริ่ม discovery
- `context` — เหตุผลที่ workflow นี้ต่างจากหน้าอื่น
- `workflow` — ขั้นตอนเริ่มงานที่ตรวจรับได้
- `deliverables` — สิ่งที่ส่งมอบในขอบเขต pilot
- `evidence` — หลักฐานที่ใช้ได้และสิ่งที่ยังห้ามอ้าง
- `readiness` — gate ก่อนเปิด inquiry หรือใช้ข้อมูลจริง

ข้อมูลอยู่ใน `lib/pseo.ts` และ route สร้างด้วย static export จาก contract เดียว
การเพิ่มหน้าใหม่ต้องมี intent ที่ไม่ซ้ำ, source/evidence note และ internal link ที่ชัดเจน
ก่อนนำเข้า sitemap

## Pilot routes

- `/services/<service-slug>/` จำนวน 14 หน้า (หนึ่งหน้าเริ่มต้นต่อ agency)
- `/industries/<industry>/ai-automation-workflow-sprint/` จำนวน 6 หน้า
- `/solutions/<problem>/ai-automation-workflow-sprint/` จำนวน 6 หน้า
- sibling `agency-<slug>-web/` แต่ละเว็บมี `/services/<service-slug>/` ของตัวเอง
  และมี home link, metadata, `robots.txt` และ `sitemap.xml` ที่ใช้ contract เดียวกัน

หน้า index `/services`, `/industries` และ `/solutions` ใช้เป็น directory สำหรับคนอ่าน
และเป็น internal linking hub

หน้า landing ที่ render จาก contract จะฝัง JSON-LD แบบ `Service` และ `BreadcrumbList` เพื่อ
ช่วยให้ search engine เข้าใจประเภทหน้าและลำดับเส้นทาง โดยจะเติม URL ใน structured data
เมื่อ build มี `NEXT_PUBLIC_SITE_URL` ที่ผ่านการตรวจแล้วเท่านั้น

## Indexing and publication

ค่าเริ่มต้นจะเป็น `noindex` และ `robots.txt` จะ disallow ทั้งไซต์ เพื่อให้ build local
หรือ production showcase ที่ยังไม่ผ่าน gate ไม่ถูกนับเป็นการเผยแพร่สำหรับ search ตั้งค่าต่อไปนี้
เฉพาะ build ที่มี URL และ owner อนุมัติแล้ว:

```bash
NEXT_PUBLIC_SITE_URL=https://approved-domain.example
NEXT_PUBLIC_SITE_INDEXABLE=true
```

เมื่อเปิด indexing แล้วจึงสร้าง canonical URL และ `sitemap.xml` ที่มี home, 14 agency
routes, 14 service routes, directory routes และ pSEO pilot routes โดยอัตโนมัติ ถ้า URL ไม่ถูกต้องหรือ flag
ไม่ใช่ `true` ระบบจะกลับไปใช้ localhost metadata และ noindex

## Measurement contract

เมื่อมี inquiry destination ที่ผ่าน privacy/consent gate แล้ว ให้เก็บ funnel แบบ metadata
เท่าที่จำเป็น:

`page_view → cta_click → inquiry_received → qualified_lead → proposal → won`

อย่างน้อยต้องรู้ `page_path`, `page_family`, `source`, `timestamp` และ `agency_slug`
โดยไม่เก็บข้อมูล candidate, threat, health, transaction หรือข้อความส่วนตัวไว้ในหน้า
และไม่ติด analytics identifier จนกว่าจะเลือก provider, retention และ owner แล้ว

การตัดสินใจรอบ 30/90 วันใช้ impressions, clicks, CTA rate, inquiries ที่เข้าเกณฑ์,
proposal และรายได้ ไม่ใช้จำนวนหน้าหรือ page views อย่างเดียว:

- impressions ต่ำ → ตรวจ demand, internal links และ crawl/index state
- impressions มีแต่ clicks ต่ำ → ปรับ title, intent match และ snippet
- clicks มีแต่ inquiry ต่ำ → ปรับ offer, proof และ CTA หลังเปิด intake ที่ถูกต้อง
- inquiry เยอะแต่ไม่ qualified → ลด scope หรือเปลี่ยน buyer/problem cluster

## Safe rollback

ตั้ง `NEXT_PUBLIC_SITE_INDEXABLE=false` แล้ว rebuild เพื่อปิด indexing และเอา routes ออก
จาก sitemap; ลบหรือแก้ record ใน `lib/pseo.ts` แล้วรัน `task check` เพื่อ rollback content
ที่ไม่ผ่าน evidence/readiness gate การเผยแพร่จริง, domain, Search Console และ inquiry
เป็นการตัดสินใจแยกตาม `systems/business/agency-website-readiness-register.md`
