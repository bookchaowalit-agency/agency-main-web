# Book Agency Web

Public-safe static website for Solo Empire's fourteen agency verticals. The
site is intentionally separate from the private operating-system dashboard and
does not collect leads or call a backend.

## Local commands

```bash
npm install
npm run typecheck
npm run build
npx serve out
```

Equivalent package tasks are available through `task`:

```bash
task typecheck
task build
task check
```

`npm run build` creates the deployable static artifact in `out/`. This repository
is the shared content baseline/generator; the owner-approved public showcase is
deployed from fourteen sibling `agency-<slug>-web/` repositories, one Vercel
project per vertical. No GitHub remote or custom domain is claimed by this
baseline repository. See the root deployment registry for the live aliases.

## Content boundary

- Fourteen routes live under `/agencies/<slug>` and share one template.
- Content is static and public-safe; there is no API, database, CMS, auth, form,
  payment, analytics identifier, or private dashboard dependency.
- The pSEO pilot adds fourteen agency service pages, six industry pages, six problem pages, and
  three directory hubs from the typed contract in `lib/pseo.ts`. Read
  `docs/pseo-pilot.md` before adding or publishing a page.
- `incubating`, `target`, and `locked` describe commercial readiness. A local
  website build does not mean that an agency is open for work.
- Existing client engagements remain freelance/client delivery and are not
  presented as agency customers, case studies, or traction.
- `scripts/generate-showcase-sites.mjs` creates the independent static site
  boundaries and applies the vertical-specific visual directions.
- `scripts/migrate-showcase-pseo.mjs` applies the same public-safe service page,
  metadata, JSON-LD, sitemap, robots, and home-page links to every sibling
  `agency-<slug>-web/` repository. The generator calls this migration after a
  fresh scaffold; run it again after an existing sibling is updated.

## Indexing configuration

Local and preview builds are noindex by default. An approved public build may set
both variables at build time:

```bash
NEXT_PUBLIC_SITE_URL=https://approved-domain.example
NEXT_PUBLIC_SITE_INDEXABLE=true
```

The build then emits canonical metadata, `robots.txt`, and `sitemap.xml`. A URL or
domain must not be invented in this repository; publication and inquiry gates are
tracked in the Solo Empire readiness register.

The source business briefs live in the Solo Empire control-plane repository at
`systems/business/agencies/`. When this repository becomes the public content
owner, update the brief register and migrate content deliberately; do not keep
two independently edited copies.
