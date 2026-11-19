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

## Known limits

- `scripts/migrate-showcase-pseo.mjs` (already run on all 14 sites, so left as is): it does not update an older showcase home page that already links its service page (no hub links or "not open" label added there, and the home CTA is not moved off `contactHref`; Codex report -f1fc16c32f), it does not clear stale `.next/types` after removing `app/og.png/route.tsx` (run `next build` or delete `.next` before `tsc`), and it does not handle CRLF line endings (projectName regex and the opengraph-test hash expect LF).
- The same migration writes `public/og.png` and `lib/og-manifest.json` but does not install `tests/opengraph.test.tsx` on a site that never had one, so such a site would not catch a stale card; all 14 sites already carry the test.
- The migration removes `app/opengraph-image.tsx` / `app/og.png/route.tsx` even when a site's own test still imports it (it only reports "Review by hand" afterwards), so such a site fails tsc/Vitest until that test is updated; it does not check imports before deleting (Codex report -f1fc16c32f). The migration already ran on all 14 sites.
- `ogFingerprint()` (templates/site/lib/og-card.ts) hashes the card inputs but not the label-colour fallback rule added in a101ee0, so a renderer-only colour change does not change the fingerprint (Codex report -f1fc16c32f). Bumping `OG_CARD_VERSION` now would re-push all 14 sites for byte-identical PNGs on 11 of them; bump `OG_CARD_VERSION` with the next real card change instead.
- The showcase footer's Contact link (a `mailto:`) is not labelled as site feedback, so it can read as an inquiry channel while intake is closed. Relabelling it is a template change that needs a 14-site rollout; it waits for the next agency template change.
- Share images (`og:image`, `twitter:image`) use `NEXT_PUBLIC_SITE_URL` when it is set, even to a loopback address such as `http://localhost:3010` (Codex report agency-science-deep-tech-web-549247a98c). Without it they use `design.productionUrl` (templates/site/lib/site-config.ts, since 4b2e72a), and no real deploy sets it: the Vercel production env holds only `NEXT_PUBLIC_SENTRY_DSN` (checked for science-deep-tech 2026-11-20). Set it only to the approved public origin. A site still serving `localhost` in `og:image` is an old deploy from before 4b2e72a, fixed by its queued redeploy.

## Boundaries

- Static export only; keep `npm run check` (tests, typecheck, build) passing.
- Each generated repository owns its copy of the template files; there is no shared package between them.
