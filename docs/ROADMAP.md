# Roadmap

Where the project is going. Shipped work is recorded in [`CHANGELOG.md`](../CHANGELOG.md) —
this file only tracks what is **not done yet**. When a priority ships, remove it here and
add the CHANGELOG entry in the same PR.

---

## Current baseline

| Metric | Value | Source |
|---|---|---|
| Next.js version | **16.3.1** (Turbopack) | Migrated 2026-08-16, see CHANGELOG |
| PageSpeed Insights — mobile Performance | **89** | Manual PSI run against production, 2026-08-16 |
| PageSpeed Insights — desktop Performance | **94** | Manual PSI run against production, 2026-08-16 |
| PageSpeed Insights — Best Practices (mobile + desktop) | **96** | Manual PSI run against production, 2026-08-16 |
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

### Best Practices stuck at 96/100 (mobile + desktop) — root-caused to an upstream Next.js bug, not fixable in app code

`errors-in-console` (a React error #418 hydration mismatch) is the **only** failing audit
in the Best Practices category on either strategy (confirmed by filtering `npm run psi`'s
output against the category's actual `auditRefs`, not just any audit with score < 1).

**Root cause, confirmed 2026-08-16:**
- React's own error catalog (`https://react.dev/errors/418`) gives the unminified
  message for this exact error+args combo: *"Hydration failed because the server
  rendered **text** didn't match the client."* — a text-content mismatch specifically,
  not a tag/attribute mismatch.
- Downloaded the exact chunk PSI's console report points at
  (`_next/static/immutable/chunks/<hash>.js`) together with its source map and listed
  every one of its ~26 source files. **All of them are Next.js internals** —
  `app-index.tsx`, `app-router.tsx`, `create-initial-router-state.ts`,
  `find-head-in-cache.ts`, `react-dom-client.production.js`,
  `on-recoverable-error.ts` — **zero files from this repo**. The mismatch is inside
  Next's own App Router client bootstrap/hydration reconciliation, not in any component
  we wrote.
- This matches a long-standing, still-open upstream issue:
  [vercel/next.js#43159](https://github.com/vercel/next.js/issues/43159) — "Random
  non-deterministic React hydration error 418 using appDir that only happens on prod
  Vercel," opened November 2022, ~2% of page loads, never reproducible locally, no
  maintainer fix or explanation to date.

**Eight separate, targeted fixes were tried across two sessions before this root-cause was
found** (see CHANGELOG "Fixed"/"Investigated, not fixed" entries and closed PRs #108,
#110, #111, #112, #115, #122, #124/#125): Typewriter's `ssr:false` boundary, SkillsSlider's
`AnimatedSection` wrapper *and*, separately, SkillsSlider's own remaining `ssr:false`
boundary (react-slick renders fine server-side — confirmed via `renderToString` — so this
wasn't required either), the `useLayoutEffect` timing in `IntroGate`, a delay between
SkillsSlider's chunk load and TerminalIntro's timer chain, the full Next.js 15.5.19 →
16.3.1 migration (webpack → Turbopack included), and — the most targeted test yet, aimed
directly at "why does this app show it and other Next.js apps don't" — a temporary swap
of the CSP's `script-src` nonce for `unsafe-inline` (this app's one clearly unusual trait
vs. a typical Next.js project, and the site of one already-confirmed nonce-related
hydration bug earlier this session). Deployed to production, verified via `npm run psi`,
reverted within ~3 minutes. **None of the eight changed the outcome** — same error,
same signature, every time.

Every structural theory tested — every `ssr:false` boundary in the tree, and the app's
one genuinely unusual trait (strict per-request CSP nonces) — has been eliminated. What's
left unfalsified: something in Next's App Router hydration bootstrap that's sensitive to
real network/CPU conditions this app's specific bundle size or composition crosses a
threshold for, without any single app-code change being the "smoking gun."

**Exit condition:** a future Next.js release that fixes vercel/next.js#43159 (or a
maintainer comment on that issue pointing at a workaround we haven't tried). Re-run
`npm run psi` after any Next.js upgrade to check. Does not affect real users — React
recovers automatically from the mismatch; this is a console-log/Best-Practices-score-only
issue, not a functional bug.
