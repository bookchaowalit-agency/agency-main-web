# Agency pSEO Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เพิ่ม pSEO pilot แบบ public-safe ให้ `book-agency-web` สร้าง landing pages สำหรับทั้ง 14 agency ที่มี search intent ชัดเจนและพร้อมวัดเส้นทางไป qualified lead โดยยังไม่เปิดรับข้อมูลลูกค้าหรือเผยแพร่ภายนอก

**Architecture:** ใช้ static content contract ใน `lib/pseo.ts` เป็นแหล่งข้อมูลเดียวของ service, industry และ problem pages แล้วให้ Next.js App Router สร้าง route แบบ static export ผ่าน shared landing-page component. Technical metadata, sitemap และ robots จะเคารพ `NEXT_PUBLIC_SITE_URL` และ `NEXT_PUBLIC_SITE_INDEXABLE`; ค่าเริ่มต้นเป็น local/noindex เพื่อไม่อ้างว่าเว็บ live.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, static export, CSS เดิมของ `book-agency-web`

**Spec:** User-approved scope in conversation; commercial and publication gates remain in `systems/business/agency-website-readiness-register.md`

## Global Constraints

- Keep `book-agency-web` public-safe and static-export compatible; no database, API route, auth, server action, private dashboard dependency, or lead form.
- Generate only pilot pages backed by a distinct buyer problem, deliverable, evidence boundary, and internal link path.
- Default all pages to `noindex`; enable indexing only when the build supplies an approved public URL and explicit `NEXT_PUBLIC_SITE_INDEXABLE=true`.
- Do not claim customer results, licenses, pricing, availability, or live publication without repository evidence and approval.
- Preserve unrelated working-tree changes and do not commit or push.

## Tasks and acceptance

1. [x] Add `lib/pseo.ts` with the Technology context pilot and six industry/six problem records; add `lib/agency-pseo.ts` with fourteen typed agency service records and deterministic paths.
2. [x] Add service, industry, and solution route families plus index hubs and a shared `components/pseo-landing-page.tsx`; every dynamic route uses `generateStaticParams()` and `dynamicParams = false`.
3. [x] Add `lib/site-config.ts`, environment-controlled canonical metadata, static `app/sitemap.ts`, and static `app/robots.ts`; default output is noindex/disallow with an empty sitemap.
4. [x] Add navigation links, `docs/pseo-pilot.md`, README indexing notes, and verification evidence without adding forms, analytics identifiers, or private data.
5. [x] Run nested `task check`, both indexing modes, local HTTP smoke tests, and root repository checks; record limitations and do not claim publication.
