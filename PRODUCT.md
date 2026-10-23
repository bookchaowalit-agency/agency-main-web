# Agency portfolio baseline — Product truth

> Inferred from the code and docs (no user interview), 2026-10-23. The portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`) has no row for this repository.

## What it is

Two things in one repository:

1. A static Next.js export (`output: "export"`) that previews all fourteen agency verticals on one site: home,
   `/agencies` and one page per agency, fourteen agency service pages, and a pSEO pilot (six industry pages and six
   problem pages for the AI Automation Workflow Sprint) with three directory hubs.
2. The generator for the per-vertical showcase repositories (`scripts/generate-showcase-sites.mjs`,
   `scripts/migrate-showcase-pseo.mjs`, `templates/site/`).

## Who it is for

The owner: a content baseline and the scaffold for new agency sites. It is not a public product.

## What works today

1. All pages render from typed data in `lib/agency-portfolio.ts`, `lib/agency-pseo.ts` and `lib/pseo.ts`; readiness
   labels come from each agency's status (`incubating`, `target`, `locked`).
2. Noindex by default (`noindex, nofollow`, `Disallow: /`, empty sitemap). Indexing needs an approved
   `NEXT_PUBLIC_SITE_URL` (http(s), no query, fragment or credentials) and `NEXT_PUBLIC_SITE_INDEXABLE=true`.
3. The generator creates a new `agency-<slug>-web` sibling with CI, ESLint, Vitest tests, browser-only Sentry and
   Next.js 16.4.2, and refuses to overwrite an existing directory.
4. Browser-only Sentry is wired (errors only, PII stripped) but inert: there is no DSN because there is no deploy.

## What does not work (and must not be claimed)

- No lead form, inquiry intake, account, API, database, CMS, analytics identifier or client data.
- No clients, case studies or results; existing freelance/client work is not presented as agency traction.
- Generating a site does not mean that agency is open for work; readiness gates live in the business docs.

## Live URL and deploy state

- None. This repository has no Vercel project and is never deployed (`deployment_skipped_no_target`). The public
  showcase is the fourteen `agency-<slug>-web` repositories, one `solo-agency-*` Vercel project each.

## Boundaries

- Static export only; keep `npm run check` (tests, typecheck, build) passing.
- Each generated repository owns its copy of the template files; there is no shared package between them.
