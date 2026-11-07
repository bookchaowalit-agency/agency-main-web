# pSEO Indexing + Link Plan (2026-11-07)

ต่อจาก [pseo-pilot.md](pseo-pilot.md): เปิด index pSEO กลางทีละขั้น และหา backlink
แบบไม่ผิด Google spam policies **ไม่ทำ Link Farm / PBN / ซื้อลิงก์** — ถ้าโดน manual
action จะลามถึงทุกเว็บใน account เดียวกันรวมถึง bookchaowalit.com

สถานะตั้งต้น: 26 pSEO routes + 14 agency sites, `verified-local`, ทุก build เป็น
`noindex` / `Disallow: /`, ยังไม่มี domain ที่อนุมัติ, ยังไม่มี inquiry/CRM

## Phase 0 — Owner decisions (ก่อนเปิดอะไร)

| # | ตัดสินใจ | ตัวเลือกที่แนะนำ |
|---|---|---|
| O1 | Domain ของ agency hub | subdomain `agency.bookchaowalit.com` (ได้ authority ของ domain หลัก, wildcard DNS → Vercel มีแล้ว) |
| O2 | 14 agency sites: แยก domain หรือรวม | **รวมเป็น path** `/agencies/<slug>/` ใต้ hub เดียว — 14 thin sites แยกกันแข่งกันเอง และดูเป็นเครือข่ายมากกว่า |
| O3 | Inquiry destination | ฟอร์มเข้า CRM (crm.bookchaowalit.com) ผ่าน privacy/consent gate |
| O4 | Analytics | PostHog EU (ใช้อยู่ใน W4c) — IP discard, ไม่เก็บ PII |
| O5 | Search Console | owner verify property ด้วย DNS TXT ใน Cloudflare |

### Decisions log

- **O1 (2026-11-07):** `agency.bookchaowalit.com` — Vercel project `agency-main-web` (CLI deploy), Cloudflare CNAME
  `agency` → `cname.vercel-dns.com` (DNS only), `NEXT_PUBLIC_SITE_URL` set for production; `NEXT_PUBLIC_SITE_INDEXABLE`
  **ยังไม่ได้ตั้ง** → ทั้งเว็บยัง `noindex` / `Disallow: /` จนกว่า Wave 1 อนุมัติ

### Wave 1 shortlist (รอ owner อนุมัติ)

เลือกจาก agency ที่ status `incubating`/`target` (ไม่เอา `locked`) และหน้าที่เป็น hub ของ internal links:

| Path | เหตุผล |
|---|---|
| `/services/ai-automation-workflow-sprint` | hub ของ 12 หน้า industries/solutions — ทุกหน้าลิงก์เข้า |
| `/services/technical-recruitment-pilot` | Talent เป็น agency เดียวที่ `incubating` (มี validation จริง) |
| `/services/security-readiness-assessment` | Cyber security — intent ชัด, buyer ตัดสินใจเร็ว |
| `/services/ai-governance-readiness-review` | ตรง learning plan AI governance + demand ใหม่ |
| `/solutions/manual-reporting/ai-automation-workflow-sprint` | ปัญหาที่ค้นหาบ่อยที่สุดของกลุ่ม solutions |
| `/solutions/document-processing/ai-automation-workflow-sprint` | intent เชิงซื้อชัด, ลิงก์ถึงหลาย industry |

ก่อนอนุมัติแต่ละหน้า: ผ่าน quality gate ข้อ 2 ด้านล่าง แล้วเพิ่ม path ใน `approvedPseoPaths`

## Phase 1 — Wave 1: เปิด 6 หน้าที่แข็งที่สุด (สัปดาห์ 1–2)

1. เลือก 6 routes ที่มี evidence ครบและ intent ชัด (เริ่มจาก `/services/*` ของ agency ที่มี case/proof จริง)
2. Quality gate ต่อหน้า: เนื้อหาเฉพาะ ≥ 60% ไม่ซ้ำ template, มี evidence note, ≥ 3 internal links เข้า, ไม่มี claim ที่ห้ามอ้าง
3. ตั้ง `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_SITE_INDEXABLE=true`; หน้าที่ยังไม่ผ่าน wave ให้คง `noindex` รายหน้า — **ทำแล้ว (2026-11-07):** `lib/pseo-indexing.ts` มี `approvedPseoPaths` (ว่างอยู่) ทุกหน้าใต้ `/services/*`, `/industries/*`, `/solutions/*` ที่ไม่อยู่ในรายการจะเป็น `noindex, follow` และไม่อยู่ใน sitemap แม้เปิด global flag; อนุมัติหน้าไหนให้เพิ่ม path ในรายการนั้น ขอบเขตเดิมที่ออกแบบไว้:
   - เพิ่ม flag `indexable` (default `false`) ต่อ record ทั้งใน `lib/pseo.ts` (industries/solutions) **และ** `lib/agency-pseo.ts` (`/services/*` ที่ Wave 1 ใช้)
   - consumers ที่ต้องเคารพ flag: `pageMetadata` ใน `app/services/[slug]/page.tsx` และ routes ใต้ `app/industries`, `app/solutions` (robots `noindex` รายหน้า) และ `app/sitemap.ts` (กรอง `agencyPseoServicePaths` + `pseoPilotPaths`)
   - test: global flag `true` แต่ record `indexable: false` → ต้องได้ `noindex` และไม่อยู่ใน sitemap
4. ส่ง sitemap ใน Search Console, request indexing 6 หน้า
5. Visual review 375/768/1440 + deploy-smoke ตามมาตรฐาน

**Exit:** ≥ 5/6 หน้า indexed, ไม่มี coverage error, CWV ผ่าน

## Phase 2 — Wave 2–3: ขยาย (สัปดาห์ 3–8)

- Wave 2 (สัปดาห์ 3–4): อีก 10 หน้า เมื่อ Wave 1 indexed และมี impressions
- Wave 3 (สัปดาห์ 5–8): ที่เหลือ + หน้าใหม่ได้เฉพาะ intent ที่ Search Console แสดง query จริง
- กฎ: ไม่เพิ่มหน้าเร็วกว่าที่ Google index ได้; หน้าที่ 60 วันไม่มี impression → ปรับหรือ `noindex`/ลบ

## Phase 3 — Links (ทำคู่กับ Phase 1–2)

### 3a. Internal (ควบคุมได้ 100%)
- Hub ↔ services ↔ industries ↔ solutions ลิงก์ตาม relevance จริง (มีอยู่แล้ว — ตรวจไม่มีหน้าโดดเดี่ยว)
- bookchaowalit.com (portfolio) → agency hub: 1 ลิงก์ที่หน้า services/about + จาก case studies ที่เกี่ยวข้อง
- ห้าม sitewide footer links ข้ามทุกเว็บ / anchor text ที่ยัด keyword

### 3b. Earned backlinks (เป้า 10–15 referring domains คุณภาพใน 90 วัน)
| ช่องทาง | งาน | เป้า/เดือน |
|---|---|---|
| Case study / build-in-public | เขียน 1 บทความเชิงลึกต่อ agency vertical จากงานจริง (ไม่อ้างลูกค้าที่ไม่ได้อนุญาต) | 2 |
| Open source | README ของ repo สาธารณะ (web-starter, devtools-vr-starter ฯลฯ) ลิงก์กลับ hub | 3 repos |
| Thai tech community | Blognone, Medium/Dev.to cross-post พร้อม canonical, Facebook groups ด้าน AI/automation | 2 |
| Directories ที่คัดแล้ว | Clutch, GoodFirms, Google Business Profile, DBD/สมาคมอุตสาหกรรมที่เกี่ยว | 3 |
| Digital PR | ตอบนักข่าว (Featured/Qwoted), ข้อมูลจาก jobs-insights เป็น data story | 1 |
| Partners | ลิงก์จาก partner/ลูกค้าที่จบงานจริง (ขออนุญาตก่อน) | ตามโอกาส |

ติดตามด้วย Ahrefs (ต้อง authorize connector ผ่าน /mcp) หรือ Search Console Links report

## Phase 4 — Measure + decide (วันที่ 30 / 90)

ใช้ measurement contract ใน pseo-pilot.md:
`page_view → cta_click → inquiry_received → qualified_lead → proposal → won`

- วัน 30: indexed %, impressions, CTR ต่อ page family → ตัดสิน Wave 3
- วัน 90: qualified inquiries + proposals ต่อ vertical → เลือก 3 vertical ที่ลงทุนต่อ, ที่เหลือ freeze
- เชื่อม Q4 first-dollar quest: เป้า ≥ 1 qualified lead จาก organic ภายใน 2027-02-01

## Guardrails

- ไม่ทำ PBN, link farm, ซื้อ/แลกลิงก์, expired-domain redirect, AI spam content
- ทุกหน้าผ่าน page contract + evidence gate ก่อน index
- Rollback: `NEXT_PUBLIC_SITE_INDEXABLE=false` + rebuild

## Next actions

| ใคร | งาน |
|---|---|
| Owner | O1–O5 |
| Claude | เพิ่ม per-record `indexable` flag ใน `lib/pseo.ts` + `lib/agency-pseo.ts`, metadata + sitemap filter + tests (TDD ตาม ADR-0004) |
| Claude | ร่าง quality-gate checker สำหรับ pSEO record (uniqueness, links, evidence) |
| Claude | เลือก 6 หน้า Wave 1 พร้อมเหตุผล ให้ owner อนุมัติ |
| Claude | ร่างบทความ case study แรก + README backlinks ใน public repos |
