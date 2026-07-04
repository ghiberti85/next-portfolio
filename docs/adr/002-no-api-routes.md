# ADR 002 — No API Routes or Backend

**Date:** 2025-01-01  
**Status:** Superseded by [ADR 005](./005-server-side-api-routes-for-secrets-and-live-data.md)

---

## Context

A portfolio could fetch its data from a CMS, a database, or internal API routes. The question was whether to add a dynamic data layer.

## Decision

**No API routes, no database, no CMS.** All content is hardcoded as TypeScript arrays in the component files.

## Reasons

- The data (skills, projects, timeline) changes only when the developer intentionally updates it — not at runtime.
- Hardcoded TypeScript arrays are type-checked at compile time, catching shape errors before deployment.
- No runtime = no server cost, no cold starts, no uptime concerns.
- Editing data is a one-file change + commit, which is simpler than a CMS dashboard or DB migration for a solo project.
- A static site scores better on performance audits (no TTFB waiting for data fetching).

## Consequences

- Content updates require a code change and a new deploy. This is acceptable for a personal portfolio.
- If the project ever needs dynamic data (e.g. a contact form with persistence, a live blog), this decision should be revisited and a new ADR written.
- Do not add `src/app/api/` routes unless a clear dynamic requirement exists that cannot be served statically.

## Superseded

This ADR's blanket "no API routes" decision did not survive contact with two real requirements:

1. The AskFernando AI chat needs a server-side proxy so `GROQ_API_KEY` never reaches the browser.
2. The GitHub Activity section needs a live, ISR-cached read of public GitHub data that can't be
   hardcoded into a static array.

Both were added (`src/app/api/chat`, `src/app/api/csp-report`, `src/lib/github.ts`) without an ADR
recording the exception, which let this document silently drift out of sync with the codebase. See
[ADR 005](./005-server-side-api-routes-for-secrets-and-live-data.md) for the current policy: the
"no database, no CMS, no auth" spirit of this ADR still holds — only secret-holding proxies and
ISR-cached reads of genuinely dynamic public data are allowed exceptions, and each one should be
narrow and reviewable at a glance.
