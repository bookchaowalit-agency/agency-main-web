---
title: Agency Websites — Implementation Plan
tags: [agency, website, planning]
created: 2026-09-13
updated: 2026-09-13
description: แผนทำเว็บ 14 agency แบบใช้ระบบร่วมกัน พร้อมเอกสารราย agency และแยก public website ออกจาก private dashboard
---

# Agency Websites — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เตรียมเว็บไซต์ 14 agency ที่เปิดอ่านได้จริง พร้อมเอกสารภายในราย agency และ public website repository แยกจาก private dashboard โดยไม่ต้องรอ paid pilot ก่อนทำเว็บ

**Architecture:** ใช้ `book-agency-web` เป็น shared content baseline/generator แล้วแตกเป็น 14 independent static repositories และ 14 Vercel projects; แต่ละ agency มี repo, URL และ visual world ของตัวเอง

**Tech Stack:** Next.js App Router, TypeScript และ CSS จาก implementation ปัจจุบัน; static export ไม่มี database, authentication, payment หรือ lead API ในรอบแรก

**Spec:** Strategy (Solo Empire `systems/business/agency-portfolio-strategy.md`), Architecture (Solo Empire `systems/business/agency-website-architecture.md`), Brief matrix (Solo Empire `systems/business/agency-website-brief-matrix.md`), Readiness register (Solo Empire `systems/business/agency-website-readiness-register.md`) และคำสั่งล่าสุดของเจ้าของให้ทำเว็บล่วงหน้าได้แม้ยังไม่มี demand

## Owner decision update — 2026-09-13

เจ้าของยืนยันให้สร้างเว็บใหม่แยกทุก agency และ deploy บน Vercel เพื่อโชว์ก่อน แม้ยังไม่มี paid
demand โดยแต่ละเว็บต้องมี design identity ที่แตกต่างกันจริง งานรอบนี้จึงเพิ่ม:

- `agency-<slug>-web/` จำนวน 14 local repositories ใต้ `book-products/`
- Vercel project แยก 14 ชื่อ และ `*.vercel.app` production alias แยก 14 URL
- static showcase เท่านั้น ไม่มี backend, lead form, analytics, customer data หรือ claim จากงาน freelance เดิม
- design direction แบบ evidence loom และ artifact grammar เฉพาะ vertical ดูใน Agency Showcase Design System (Solo Empire `systems/business/agency-showcase-design-system.md`)
- URL และ release evidence ดูใน Agency Showcase Deployments (Solo Empire `systems/business/agency-showcase-deployments.md`)

`book-agency-web` เดิมคงไว้เป็น shared baseline และ generator source ไม่ถูกลบ และไม่ถือว่าเป็น
deployment owner ของเว็บใดเว็บหนึ่ง

## Global Constraints

- เอกสารนี้เป็นแผนและ implementation record; local repo/build และ showcase deployment เสร็จแล้ว แต่ยังไม่มี custom domain หรือ conversion flow
- งานลูกค้าเดิมเป็น freelance/client delivery ไม่ใช่ agency traction; ห้ามนำชื่อ โลโก้ ผลงาน หรือรายได้มาอ้างเป็น agency case study โดยไม่มีสิทธิ์และการอนุมัติ
- แยก `website readiness` ออกจาก `commercial readiness`: ทำหน้าเว็บและ preview ได้ แต่ไม่แปลว่าเปิดรับงานแล้ว
- สถานะ locked/incubating/target ต้องสื่อสารตามจริง; ห้ามสร้างราคา ใบอนุญาต partner ผลลัพธ์ หรือ testimonial ขึ้นเอง
- ไม่เผยแพร่ private dashboard, internal documents, client data, credentials หรือ dashboard API
- ไม่ซื้อ domain, สร้าง paid resource, commit หรือ push; การ deploy Vercel production ทำเฉพาะ static showcase ตามคำขอเจ้าของ และไม่เปลี่ยน commercial readiness
- ใช้ template และ dependency เดิมเท่าที่จำเป็น ไม่เพิ่ม CMS/backend หรือระบบจัดการลูกค้าในรอบแรก
- รักษางานค้างของผู้ใช้; ตรวจ worktree และคำสั่ง AGENTS.md ใน owner directory ก่อนแก้ไฟล์

## สิ่งที่มีอยู่แล้วและช่องว่าง

มี directory `/agencies`, detail `/agencies/[slug]`, ข้อมูลครบ 14 รายการ และ shared layout ใน `infra/dashboard/web` แล้ว จึงไม่เริ่มจากศูนย์; มี shared baseline ที่ `book-agency-web` และ 14 independent showcase repositories เพิ่มแล้ว

ช่องว่างที่ต้องส่งมอบ: เอกสารราย agency ให้ครบ, copy สำหรับผู้ซื้อ, ทางเข้าจากหน้าแรก, mobile/accessibility polish, public-only build และหลักฐานตรวจ browser

ผล build/typecheck จากการตรวจครั้งก่อนเป็นหลักฐานย้อนหลัง ไม่ใช่หลักฐานว่าหน้าเว็บผ่าน browser check หรือเผยแพร่แล้ว

## Task 1 — เอกสารราย agency และ readiness ที่ไม่ปะปนกัน

**Files:**

- Create: `systems/business/agencies/README.md`
- Create: `systems/business/agencies/<slug>.md` ตามรายการด้านล่าง รวม 14 ไฟล์
- Modify: `systems/business/agency-website-architecture.md`
- Modify: `systems/business/agency-website-readiness-register.md`
- Modify: `systems/business/README.md`

| Slug / ชื่อไฟล์ | ขอบเขต agency |
| --- | --- |
| talent | Talent |
| cyber-security | Cyber Security |
| technology | Technology |
| governance-risk | Governance & Risk |
| transactions-corporate-finance | Transactions & Corporate Finance |
| industrial-infrastructure | Industrial & Infrastructure |
| science-deep-tech | Science & Deep Tech |
| legal | Legal |
| investment-asset-management | Investment & Asset Management |
| healthcare | Healthcare |
| real-estate | Real Estate |
| energy | Energy |
| defense-aerospace | Defense & Aerospace |
| insurance-risk-transfer | Insurance & Risk Transfer |

- [x] อ่าน source matrix และ data ของเว็บไซต์ก่อนเติม brief; ใช้ชื่อปัจจุบันเป็น vertical label ไม่อ้างว่าเป็นนิติบุคคลหรือแบรนด์จดทะเบียน
- [x] ทำ brief สั้นต่อ agency: buyer, problem, starting engagement, deliverables, exclusions, delivery owner/readiness, evidence links, public-safe copy, website/repo path และเงื่อนไขก่อนเปิดรับงาน
- [x] ข้อมูลที่ยังไม่ยืนยันให้ระบุสถานะตรง ๆ เช่น “ยังไม่แต่งตั้ง delivery owner” ไม่แต่งข้อมูลเติมให้ครบ
- [x] Talent อ้างอิง `ventures/job-agency/` เป็น canonical delivery pack; Technology/Governance อ้างอิง AI Trust packs ที่เกี่ยวข้อง ไม่คัดลอกจนเกิด source of truth หลายชุด
- [x] เพิ่มช่อง website readiness เช่น existing local page / verified local build / published พร้อมหลักฐาน และคง commercial status เดิมไว้แยกกัน
- [x] แก้ข้อกำหนดเดิมเฉพาะส่วนที่บังคับรอ pilot ก่อนทำเว็บ: อนุญาต build/preview ก่อน demand; การอ้างบริการพร้อมขายยังต้องมีหลักฐาน
- [x] ลิงก์ index ไปครบ 14 brief และแยก existing freelance engagements ออกจาก agency customers อย่างชัดเจน

**Acceptance:** อ่านแต่ละ brief แล้วรู้ว่าเสนออะไร มีอะไรจริง ขาดอะไร และมีหน้าเว็บที่ไหน; ทุก status มีความหมายชัด ไม่ตีความว่า draft เท่ากับเปิดธุรกิจแล้ว

## Task 2 — ปรับ shared website ปัจจุบันให้พร้อมย้าย

**Files:** `infra/dashboard/web/app/agencies/{page.tsx,layout.tsx}`, `infra/dashboard/web/app/agencies/[slug]/page.tsx`, `infra/dashboard/web/lib/agency-portfolio.ts`, `infra/dashboard/web/app/globals.css`, `infra/dashboard/web/app/page.tsx`

- [x] อ่าน `infra/dashboard/web/AGENTS.md` และ Next.js docs ที่ติดตั้งใน owner package ก่อนแก้โค้ด
- [x] เพิ่มทางเข้า Agency Portfolio จากหน้าแรกของ dashboard ด้วย link จริงไป `/agencies` โดยไม่เปลี่ยน navigation ทั้งระบบ
- [x] รักษา slug ทั้ง 14 และ `getAgency(slug)`; หน้า slug ที่ไม่รู้จักต้องเป็น 404
- [x] เติมหน้า detail ให้ครบ buyer, problem, starting engagement, scope, readiness และ shared core; ใช้ภาษาที่ผู้ซื้อเข้าใจ ไม่แสดง priority code เป็นสารหลัก
- [x] ใช้ข้อมูล static ที่อนุญาตให้เปิดเผยเท่านั้น; ไม่ import client registry หรือ private business briefs เข้า frontend
- [x] ทำ CTA เป็นลิงก์ไปส่วน scope/readiness ที่มีจริงในหน้า สำหรับ agency ที่ยังไม่พร้อมรับงาน; ไม่ทำปุ่มส่งฟอร์มจำลองหรืออ้างว่ารับข้อมูลแล้ว
- [x] แก้เลขรายการให้เป็น 01–14 ด้วย `String(agency.number).padStart(2, '0')` แทน `0{agency.number}`
- [x] ใส่ `id="main-content"` บน main ให้ตรงกับ skip link ใน root layout
- [x] แก้ selector ของ `.agency-fit-problem` ที่ถูก generic card rules ทับจนข้อความมืดบนพื้นมืด; วาง override หลัง generic rule และตรวจ contrast จริง
- [x] จำกัดหัวข้อยาวด้วย responsive typography และ wrapping; ตรวจ card/grid ไม่ล้นที่ 320px ก่อนย้าย source

**Verification:** รัน `task frontend:check` จาก root สำหรับ dashboard ที่แก้; ต้อง typecheck/build ผ่านโดยไม่แก้ dependency unrelated เพื่อให้ผ่าน

## Task 3 — เตรียม public website repo แยกจาก private OS

**Target directory:** `book-agency-web/`

**Create in target:** `README.md`, `AGENTS.md`, `.gitignore`, `package.json`, lockfile, `tsconfig.json`, `next-env.d.ts`, `next.config.ts`, `Taskfile.yml`, `app/layout.tsx`, `app/page.tsx`, `app/not-found.tsx`, `app/globals.css`, `app/agencies/layout.tsx`, `app/agencies/page.tsx`, `app/agencies/[slug]/page.tsx`, `lib/agency-portfolio.ts`

- [x] ตรวจว่า target ยังไม่มีงานของผู้อื่น และอ่าน repository-boundary rules ก่อนสร้าง; ถ้ามีอยู่แล้วให้ประเมินและ reuse ไม่ overwrite
- [x] สร้าง local repository boundary; บันทึกชัดเจนว่า local repo ไม่เท่ากับ GitHub remote และยังไม่ push
- [x] Port เฉพาะ public-safe agency components/data และ CSS ที่จำเป็น ไม่ copy dashboard tree, `.env`, API routes หรือ private navigation
- [x] ใช้ dependency versions ที่ติดตั้งและตรวจผ่านใน source package พร้อมสร้าง lockfile ของ repo ใหม่; ไม่พ่วง dependency ของ dashboard ที่ไม่ใช้
- [x] สร้าง root layout ใหม่ที่เป็น public agency metadata และ skip link; หน้า `/` เป็นทางเข้าสู่ directory `/agencies` ที่ใช้งานได้จริง
- [x] ใช้ config ขั้นต่ำสำหรับ static artifact:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
```

- [x] คง `generateStaticParams()` ให้ครบทุก slug และตั้ง `dynamicParams = false` ใน detail route ตามข้อกำหนดของ static build ที่ติดตั้ง
- [x] ไม่ย้าย `/api/:path*` rewrite หรือ `DASHBOARD_API_ORIGIN`; public website ไม่มีเหตุผลเรียก private backend
- [x] ให้ package-owned `Taskfile.yml` เรียก dev/build/typecheck/check ของ repo นี้โดยตรง ไม่ฝาก implementation ใน root Taskfile
- [x] กำหนด shared baseline/generator และ 14 deployment repositories ให้ชัด; หน้าเดิมใน dashboard เป็น internal/shared preview และแต่ละ Vercel site เป็น public release snapshot
- [ ] เมื่อมี public URL ที่อนุมัติแล้ว ค่อยเปลี่ยน dashboard เป็น link ไป public owner; ห้ามใส่ domain ที่ยังไม่มีจริง

**Acceptance:** target build ได้โดยไม่ต้องมี private dashboard/API/database; artifact `out/` มี directory และ detail ครบ 14 agency และไม่มีข้อมูลภายใน

## Task 4 — ตรวจเส้นทางจริงและหน้าจอ

**Evidence:** `book-agency-web/docs/verification/agency-web-v1.md` และ Agency Showcase Deployments (Solo Empire `systems/business/agency-showcase-deployments.md`)

- [x] รัน typecheck และ production build จาก public repo; บันทึก command, exit status และวันที่ตรวจ
- [x] เปิด static artifact ผ่าน local HTTP server ไม่ใช้เพียง dev server เป็นหลักฐานว่า deployable
- [x] ตรวจ shared baseline `/`, `/agencies/`, detail ทั้ง 14 และ 404 ด้วย local static host; ตรวจ production root endpoint และ page marker ของ Vercel alias ครบ 14 เว็บ
- [x] ตรวจจอ 320, 390, 768 และ 1440px: ไม่มี horizontal overflow, ชื่อยาวไม่ทับ CTA, เลข 10–14 ไม่เป็น 010–014
- [x] ตรวจ keyboard navigation, focus visible, skip link, heading order และ contrast ของ problem cards
- [x] ตรวจทุก CTA ว่าไปปลายทางจริง และ readiness copy ไม่สื่อว่า agency locked เปิดรับงานแล้ว
- [x] ตรวจ network และ artifact ว่าไม่มี private API call, private operating-system metadata, client records หรือ internal-document links; ไม่พิมพ์ private payload ลง evidence
- [x] บันทึก screenshots และผลผ่าน/ไม่ผ่าน; ไม่รายงาน “verified” จาก build อย่างเดียว

**Acceptance:** ทุก route/interaction ที่ระบุผ่านหรือมีข้อจำกัดที่รายงานตรง ๆ; ปิด defect ที่ทำให้ใช้งานไม่ได้ก่อนส่ง release package

## Task 5 — ส่งมอบและเตรียมเผยแพร่

**Files:** public repo `README.md`; `systems/business/agency-website-readiness-register.md`; registry owner files เฉพาะเมื่อตรวจพบ repo ที่สร้างจริงแล้ว

- [x] README ระบุวิธี install, check, build, serve artifact, ขอบเขตข้อมูลสาธารณะ และวิธีแก้ shared template/data
- [x] จัด release package เป็น static `out/` และ evidence link; ยังไม่ต้องมี custom domain เพื่อถือว่า local website พร้อม
- [x] ปรับ readiness register จากหลักฐานจริง: local build verified แยกจาก published-showcase; ใส่ Vercel URL เฉพาะเมื่อมีจริง
- [ ] ลงทะเบียน repository ตาม schema ของ `repository-catalog/registries/projects.yaml` และ `repository-catalog/REGISTRY.md` เมื่อสร้างจริงเท่านั้น; ตรวจ runtime registry หาก ownership contract กำหนด ไม่สร้างข้อมูลสมมติล่วงหน้า
- [x] ยืนยัน account/project ปลายทาง, public visibility และข้อความ/ช่องทางที่เปิดเผยได้ก่อน deploy; ไม่กลับไปตั้ง paid pilot เป็นเงื่อนไขทำเว็บ
- [x] deploy production showcase ทั้ง 14 และบันทึกสถานะ `READY`/HTTP smoke ใน deployment registry; ไม่สร้าง paid resources หรืออ้างว่าเว็บ live เป็น commercial service
- [x] รัน docs checks สำหรับเอกสาร/registry ที่แก้ และ owner checks สำหรับ code ที่แก้; บันทึก diary สรุปโดยไม่มี raw transcript

## ลำดับลงมือและขอบเขตรอบแรก

ทำ Task 1 → 2 → 3 → 4 → 5; จบแต่ละ task เป็นชุดที่ review ได้ ไม่ commit/push โดยพลการ

รอบแรกส่งมอบ **14 briefs + 14 agency pages + 14 independent showcase repositories + 14 Vercel projects + verification evidence** ไม่รวม 14 custom domains, CRM, CMS, payments, client migration หรือการเปิดบริการ regulated โดยไม่มีความพร้อม

หากภายหลัง agency ใดต้องมีทีม สิทธิ์เข้าถึง หรือ conversion release cycle ของตัวเอง ค่อยเพิ่ม owner,
reviewer, custom domain และ release/rollback gate ให้ repo ที่มีอยู่ โดยไม่เปิดรับงานเพียงเพราะเว็บโชว์ได้
