# Roadmap

Where the project is going. Shipped work is recorded in [`CHANGELOG.md`](../CHANGELOG.md) —
this file only tracks what is **not done yet**. When a priority ships, remove it here and
add the CHANGELOG entry in the same PR.

---

## Current baseline

| Metric | Value | Source |
|---|---|---|
| Next.js version | **16.3.1** (Turbopack) | Migrated 2026-08-16, see CHANGELOG |
| PageSpeed Insights — mobile Performance | **93** | Manual PSI run against production, 2026-08-16 |
| PageSpeed Insights — desktop Performance | **100** | Manual PSI run against production, 2026-08-16 |
| PageSpeed Insights — Accessibility (mobile + desktop) | **100** | Manual PSI run against production, 2026-08-16 |
| PageSpeed Insights — Best Practices (mobile + desktop) | **100** | Manual PSI run against production, 2026-08-16 |
| PageSpeed Insights — SEO (mobile + desktop) | **100** | Manual PSI run against production, 2026-08-16 |
| `npm audit` | **0 vulnerabilities** | — |

These numbers are the reference point for the performance work below. Update this table
whenever a new baseline is measured — `npm run psi` prints them directly.

---

## Active priorities

None right now — see Technical debt below for the one known, deliberately-unfixed item.

---

## Backlog (ideas, not committed)

Items below are proposals — confirm with the maintainer before starting any of them,
then move the accepted ones to Active priorities.

- Extend the PSI script to run in CI on a schedule (or post-merge) and comment/fail on
  score regressions.
- Add a `CONTRIBUTING`-style section or keep relying on `AGENTS.md` (currently the
  latter — this repo is maintained solo with AI agents as the contributors).

---

## Technical debt

None tracked right now. When you incur debt deliberately (e.g. a temporary workaround),
record it here with the reason and the exit condition.

(The React #418 hydration error that lived here for most of 2026-08-16 is resolved —
see CHANGELOG "Fixed" for the write-up. Root cause was `GitHubActivity.tsx` formatting
dates without an explicit `timeZone`, not the Next.js internals the error's stack trace
pointed at.)
