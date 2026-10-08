---
title: Book Agency Web — Product Card
doc_id: CARD-book-agency-web
doc_type: product-card
verdict: template
version: 0.1
date: 2026-10-08
status: ร่างเพื่อพิจารณา
owner: Product owner (Book Dev)
---

# Book Agency Web — Product Card

## 1. สรุปคุณค่าในหนึ่งประโยค

เป็น baseline เนื้อหาและ generator ที่สร้างเว็บ showcase ของ agency ทั้ง 14 vertical ใน Solo Empire ช่วยเจ้าของดูแลเนื้อหา public-safe ที่เดียวแล้วกระจายไปยัง repo `agency-<slug>-web` แต่ละตัว

## 2. ปัญหาและผู้ใช้เป้าหมาย

- ผู้ใช้หลักคือเจ้าของ/ผู้ดูแลเนื้อหา agency (ภายใน) ไม่ใช่ลูกค้าปลายทาง
- ปัญหา: ต้องดูแลเนื้อหา 14 vertical, pSEO และ metadata ให้ตรงกันโดยไม่ copy มือทีละ repo
- ผู้เข้าชมปลายทางเห็นเว็บผ่าน repo แยกที่ deploy บน Vercel ไม่ใช่ repo นี้

## 3. สิ่งที่ทำได้จริงตอนนี้

- route `/agencies/[slug]` ครบ 14 vertical จาก `lib/agency-portfolio.ts`
- pSEO pilot: หน้า service, industry × service และ problem × service จาก typed contract ใน `lib/pseo.ts` / `lib/agency-pseo.ts` พร้อม directory hubs
- `scripts/generate-showcase-sites.mjs` สร้าง repo แยกต่อ vertical และ `scripts/migrate-showcase-pseo.mjs` อัปเดต service page/metadata/JSON-LD/sitemap ให้ทุก sibling
- static export (`out/`), noindex เป็นค่าเริ่มต้น, ไม่มี API/DB/form/analytics
- มีภาพหลักฐาน browser verification ใน `docs/verification/`

## 4. หลักฐานสถานะ

| รายการ | ค่า |
|---|---|
| Stack | Next.js, React |
| Commits | 1 commits (2026-09-17 → 2026-09-17) บน branch `main` |
| Source | 22 ไฟล์ / 1,318 บรรทัด |
| Tests | 0 ไฟล์ |
| CI workflows | 0 |
| Deploy config | ไม่มี |
| Live URL | ไม่พบใน facts ที่ตรวจ |
| README | 66 บรรทัด |
| โครงสร้างซ้ำกับ repo อื่น (template family) | 1 repo |

## 5. คุณค่าและจุดต่าง

- จุดต่าง: เนื้อหา agency ทั้งหมดมี source of truth เดียวพร้อม indexing gate ที่ปลอดภัย
- ไม่ใช่ product ที่ขายเอง; เป็นเครื่องมือภายในที่ลดต้นทุนการดูแลเว็บ agency **[สมมติฐาน]**
- เหมาะเป็นที่รวมของ vertical ที่ `locked` แทนการมี repo แยก

## 6. ช่องว่างสำคัญ

- ไม่มี test และไม่มี CI แม้เป็นตัวสร้างของอีก 14 repo — การแก้ generator ผิดจะกระจายไปทุก site
- README ระบุว่า business brief ต้นทางยังอยู่ใน `systems/business/agencies/` ของ solo-empire เสี่ยงมีสองสำเนาที่แก้แยกกัน
- upgrade ที่ทำใน `agency-healthcare-web`/`agency-real-estate-web` (test, CI, OG) ยังไม่ย้อนกลับมาที่ generator

## 7. คำตัดสิน

**`template`** — เป็น generator/แหล่งเนื้อหากลาง ไม่ใช่ product ต่อผู้ใช้ปลายทาง จึงติดป้าย template และเป็น canonical สำหรับ vertical ที่ตัดสินให้ `merge` จะเปลี่ยนเป็น `showcase` ถ้าตัดสินใจ deploy repo นี้เป็น agency hub สาธารณะหนึ่งเว็บแทน site แยก

## 8. ขั้นต่อไป

1. เพิ่ม CI (typecheck + build) และ test ของ generator
2. ย้าย upgrade จาก `agency-healthcare-web` (site-config resolver, tests, OG) เข้า generator
3. ตัดสินใจ source of truth ของ business brief ให้เหลือที่เดียว

## การอนุมัติ

| บทบาท | การตัดสิน | วันที่ |
|---|---|---|
| Product owner (Book Dev) | รอพิจารณา | — |

## แหล่งข้อมูล

- `README.md`
- `lib/agency-portfolio.ts`
- `lib/pseo.ts`
- `docs/pseo-pilot.md`
- `docs/verification/agency-web-v1.md`
- `systems/business/agency-showcase-deployments.md (solo-empire)`
