# Agency Website Agent Instructions

This repository is the public-safe static website boundary for the fourteen
agency verticals. Keep private Solo Empire dashboard code, API routes, client
records, candidate data, threat data, transaction data, credentials, and
environment files outside this repository.

Before changing Next.js code, read the relevant guides under
`node_modules/next/dist/docs/`. Keep the app static-export compatible: no
database, authentication, server actions, API rewrites, or private backend
calls.

Use the package-local commands in `Taskfile.yml` and keep product build/test
implementation here rather than adding it to the Solo Empire root Taskfile.
Do not commit, push, deploy, buy domains, or add inquiry collection without
explicit owner approval and the readiness gates in the source business docs.
