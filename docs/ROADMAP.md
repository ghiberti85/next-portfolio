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

### 1. Get Best Practices to 100 (mobile + desktop)

Currently 96/100 on both, and — confirmed by filtering `npm run psi`'s output by the
category's actual `auditRefs`, not just any audit with score < 1 — `errors-in-console`
(a React error #418 hydration mismatch) is the **only** failing audit in this category
on either strategy. Nothing else to fix here.

That error resisted **six** separate, targeted fixes across two sessions (see CHANGELOG
"Fixed"/"Investigated, not fixed" entries and closed PRs #108, #110, #111, #112, #115
for the full elimination trail): Typewriter's `ssr:false` boundary, SkillsSlider's
`AnimatedSection` wrapper, the `useLayoutEffect` timing in `IntroGate`, a deliberate
delay between SkillsSlider's chunk load and TerminalIntro's timer chain, and — the one
that was expected to fix it, since it fixed the DevTools-bundle-bloat issue the same
way — **the full Next.js 15.5.19 → 16.3.1 migration (webpack → Turbopack included)**.
The error survived that too, same signature, just a different chunk hash.

It only reproduces under real Lighthouse CPU throttling — never locally (`dev`,
`next start`), nor via a real-network headless repro against the live URL without
throttling — so it's a genuine timing-sensitive race inside React/Next's own hydration
machinery, not a static SSR/CSR content mismatch in app code, and it isn't tied to a
specific Next.js version or bundler. Given the volume of process-of-elimination already
done, further blind attempts have low expected value — this needs either a real Chrome
CPU-throttled trace (DevTools Performance panel, not PSI's summary) to see what's
actually queued on the main thread when it fires, or acceptance that this is a
known-but-unfixed characteristic of this app for now. Does not affect real users (React
recovers automatically; this is a console-only, Best-Practices-score-only issue).

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

- None tracked right now. When you incur debt deliberately (e.g. a temporary workaround),
  record it here with the reason and the exit condition.
