# ADR 005 — Allow Server-Side Routes for Secret-Holding Proxies and ISR Live Data

**Date:** 2026-07-04
**Status:** Accepted — supersedes [ADR 002](./002-no-api-routes.md)

---

## Context

ADR 002 decided against any API routes or backend, reasoning that the portfolio's content never
changes at runtime. That held true for skills, projects, and timeline data — but two features
built since then don't fit a purely static site:

1. **AskFernando** (AI chat) calls the Groq API. The API key cannot be shipped to the browser, so
   something server-side has to hold it and proxy the request.
2. **GitHub Activity** shows live repo/star/follower/language data pulled from the GitHub API.
   That data changes independently of any deploy — it cannot be a hardcoded array — but it also
   doesn't need a database, just a cached read.

Both were implemented (`src/app/api/chat/route.ts`, `src/app/api/csp-report/route.ts`,
`src/lib/github.ts` called from `page.tsx`) before ADR 002 was updated to reflect them, so for a
period the ADR actively contradicted the codebase. This ADR closes that gap and states the actual,
current policy.

## Decision

**Server-side code is allowed, but only for two narrow purposes:**

1. **Secret-holding proxies** — a route exists solely to keep a credential (`GROQ_API_KEY`) off the
   client and to apply request-level controls (rate limiting, input validation, CORS) that only a
   server can enforce.
2. **ISR-cached reads of genuinely dynamic public data** — a server-side fetch (not necessarily a
   route) whose result is cached via Next.js `revalidate` and fails closed (renders nothing) on
   error, used only when the data cannot reasonably be hardcoded and doesn't warrant a database.

Everything else from ADR 002 still stands: no database, no CMS, no user accounts/authentication,
no persistence. Skills, projects, and timeline content remain typed arrays edited by hand.

## Reasons

- Both existing exceptions are narrow, single-purpose, and easy to audit in one file each.
- ISR keeps the GitHub Activity section cheap and simple — no cron job, no database, no webhook.
- A hard "zero exceptions" rule was already being silently violated; a rule that describes what's
  actually allowed is more useful than one that's technically false.

## Consequences

- Before adding a new `src/app/api/` route or server-side fetch, check whether it fits one of the
  two categories above. If not, write a new ADR — don't add it quietly.
- Every server-side secret access must go through `src/lib/env.ts`, never a bare `process.env` read
  in a component or route file (enforced in the Security Checklist in `CLAUDE.md`).
- Every ISR-cached fetch must fail closed: on any error, render nothing rather than a broken or
  stale-looking state.
- `docs/ARCHITECTURE.md` documents both exceptions explicitly so this ADR doesn't drift out of sync
  again the next time a new one is added.
