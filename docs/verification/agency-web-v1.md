---
title: Agency Website V1 Verification
tags: [verification, agency, website, accessibility]
created: 2026-09-13
updated: 2026-09-13
status: verified-local
description: หลักฐานตรวจ static agency website รุ่นแรกใน local repository
---

# Agency Website V1 Verification

ตรวจจาก local repository เมื่อ 2026-09-13 ด้วย static artifact ใน `out/` ผ่าน
`python3 -m http.server 4180 --directory out` ผลของ repository นี้เป็น baseline verification
ส่วน public showcase ถูกแตกเป็น 14 repositories และ deploy แยกบน Vercel ตาม
`systems/business/agency-showcase-deployments.md`

## Build และ route

| Check | Result |
|---|---|
| `task check` | PASS — typecheck และ `next build` |
| Static output | PASS — `out/` พร้อมใช้งาน และมี font assets 6 ไฟล์ |
| Agency detail output | PASS — 14 generated detail directories |
| pSEO output | PASS — 14 service, 6 industry, 6 problem pages และ 3 directory hubs |
| Indexing safety | PASS — noindex/disallow โดย default; sitemap ว่างเมื่อไม่มี approved URL/flag |
| Unknown route | PASS at artifact level — generated `out/404.html`; Python server ต้องตั้ง host-level 404 fallback เอง |
| Private source boundary | PASS — `app`, `lib`, `next.config.ts` ไม่มี dashboard/API/private-data reference |

Generated routes:

```text
/agencies/talent/
/agencies/cyber-security/
/agencies/technology/
/agencies/governance-risk/
/agencies/transactions-corporate-finance/
/agencies/industrial-infrastructure/
/agencies/science-deep-tech/
/agencies/legal/
/agencies/investment-asset-management/
/agencies/healthcare/
/agencies/real-estate/
/agencies/energy/
/agencies/defense-aerospace/
/agencies/insurance-risk-transfer/
```

## Browser verification

ใช้ `agent-browser` session เฉพาะงานกับ static HTTP server:

- `/` โหลดได้ มี heading และ portfolio link, ไม่มี error overlay หรือ console error
- `/agencies/` แสดงการ์ดครบ 14 ใบ และเลข `#01` ถึง `#14` ถูกต้อง
- `/agencies/transactions-corporate-finance/` แสดง buyer, engagement, scope และ readiness ครบ
- `/solutions/manual-reporting/ai-automation-workflow-sprint/` แสดง intent, buyer, workflow,
  deliverables, evidence boundary และ related links ครบ
- `/industries/logistics/ai-automation-workflow-sprint/` และ
  `/solutions/knowledge-handoff/ai-automation-workflow-sprint/` โหลดได้จาก deep link
- unknown detail route ได้ HTTP 404 จาก local host; หน้า custom 404 ตรวจได้ที่ `/404/`
- ตรวจ viewport `320x800` และ `1440x900` บน pSEO routes; ไม่พบ horizontal overflow
- axe WCAG 2A/AA บน pSEO detail: `0 violations`; มี 1 manual incomplete จาก decorative
  arrow span ที่ `aria-hidden` ซึ่งเป็น pattern เดิมของ CTA

## Screenshots

- [Agency directory — 1440px](assets/agency-directory-1440.png)
- [Transactions detail — 1440px](assets/transactions-detail-1440.png)
- [Transactions detail — 320px](assets/transactions-detail-320.png)

## Release boundary

`book-agency-web` เป็น local nested repository ที่ทำหน้าที่ shared baseline/generator และยังไม่มี
GitHub remote ส่วน deployment owners คือ `agency-<slug>-web/` จำนวน 14 repositories
ที่เชื่อมกับ Vercel project แยกกัน สถานะของ baseline คือ `verified-local`; สถานะของ public
sites คือ `published-showcase` หมายถึงมี URL สำหรับโชว์เท่านั้น ไม่เปลี่ยน commercial status
ของ agency และไม่เปิด inquiry/data intake รายละเอียด pSEO และ measurement contract อยู่ใน
`docs/pseo-pilot.md`

## Independent showcase verification

- `npm run check` ผ่านครบ 14 independent repositories หลังแก้ Thai-capable display font
- Vercel production deployments ของทั้ง 14 project ขึ้น `READY`
- HTTP smoke ตรวจครบ 14 production aliases พร้อม `data-site` marker ตรงกับ vertical
- Browser representative pass ครอบคลุม Talent, Cyber, Legal, Energy และ Insurance: มีเนื้อหา,
  ไม่มี framework overlay หรือ page error; Talent ที่ 390px ไม่มี horizontal overflow
- axe 4.12.1 ของ Insurance & Risk Transfer: `0 violations`
- screenshots ตัวอย่างของ Talent desktop/mobile และ visual families อยู่ใน `assets/`
