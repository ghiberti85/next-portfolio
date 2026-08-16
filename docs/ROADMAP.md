# Roadmap

Where the project is going. Shipped work is recorded in [`CHANGELOG.md`](../CHANGELOG.md) —
this file only tracks what is **not done yet**. When a priority ships, remove it here and
add the CHANGELOG entry in the same PR.

---

## Current baseline

| Metric | Value | Source |
|---|---|---|
| PageSpeed Insights — mobile Performance | **88** | Manual PSI run against production, 2026-08-16 |
| PageSpeed Insights — desktop Performance | **100** | Manual PSI run against production, 2026-08-16 |
| PageSpeed Insights — Best Practices (mobile + desktop) | **96** | Manual PSI run against production, 2026-08-16 |

These numbers are the reference point for the performance work below. Update this table
whenever a new baseline is measured — `npm run psi` prints them directly.

---

## Active priorities

### 1. Raise mobile PageSpeed Performance to ≥ 95

Currently 88 on mobile (desktop is already at 100). The dominant remaining cost is
Next.js 15.5.x bundling its own DevTools into the production build (~217KB gzipped
shipped on every page load, confirmed absent from a Next 16.3.1 build) — fixing that
needs the Next 16 migration below, not a component-level change.

Constraints:
- Do not weaken any security control (CSP, headers) to gain points — see `SECURITY.md`.
- Do not remove features to chase a score; optimise them instead.
- LCP-sensitive rules in `docs/COMPONENTS.md` (Hero not wrapped in `AnimatedSection`, no
  client-only mount gates) still apply.

### 2. Get Best Practices to 100 (mobile + desktop)

Currently 96/100 on both, and — confirmed by filtering `npm run psi`'s output by the
category's actual `auditRefs`, not just any audit with score < 1 — `errors-in-console`
(a React error #418 hydration mismatch) is the **only** failing audit in this category
on either strategy. Nothing else to fix here.

That error resisted 5 separate, targeted fixes in one session (see CHANGELOG "Fixed"
entries and closed PRs #108, #110, #111, #112 for the full elimination trail):
Typewriter's `ssr:false` boundary, SkillsSlider's `AnimatedSection` wrapper, the
`useLayoutEffect` timing in `IntroGate`, and a deliberate delay between SkillsSlider's
chunk load and TerminalIntro's timer chain. It only reproduces under real Lighthouse
CPU throttling — never locally (`dev`, `next start`), nor via a real-network headless
repro against the live URL without throttling — so it's a genuine timing-sensitive race
inside React/Next's own hydration machinery, not a static SSR/CSR content mismatch in
app code.

Next step: re-check after the Next 16 migration below before attempting further guesses
— it's plausible this is a Next 15.5.x-specific issue, same as the DevTools bundling bug.

### 3. Migrate to Next.js 16

`npm audit` currently reports 4 high-severity vulnerabilities in Next 15.5.19 (DoS,
SSRF, cache confusion), fixed only by upgrading to 16.3.1. That same upgrade also
removes the DevTools-in-production bundle bloat blocking priority 1 above.

Confirmed non-trivial — a test upgrade surfaced real breakage that needs its own
migration work, not a quick swap:
- `middleware.ts` is deprecated in favor of `proxy.ts`.
- The Edge Runtime is deprecated (check `/api/chat`, `middleware.ts`).
- Next 16 defaults to Turbopack for `next build`.
- A few `.test.tsx` files fail stricter TypeScript checks under Next 16's tsconfig.

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
