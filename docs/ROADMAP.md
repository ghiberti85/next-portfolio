# Roadmap

Where the project is going. Shipped work is recorded in [`CHANGELOG.md`](../CHANGELOG.md) —
this file only tracks what is **not done yet**. When a priority ships, remove it here and
add the CHANGELOG entry in the same PR.

---

## Current baseline

| Metric | Value | Source |
|---|---|---|
| PageSpeed Insights — mobile Performance | **95** | Manual PSI run against production |
| PageSpeed Insights — mobile Accessibility | **100** | Manual PSI run against production |

These numbers are the reference point for the performance work below. Update this table
whenever a new baseline is measured.

---

## Active priorities

### 1. Raise mobile PageSpeed Performance to ≥ 97

Currently 95 on mobile. Target is **97 or higher** with no regression in Accessibility
(100) or in the features that define the site (terminal intro, animations, AI chat).

Constraints:
- Do not weaken any security control (CSP, headers) to gain points — see `SECURITY.md`.
- Do not remove features to chase a score; optimise them instead.
- LCP-sensitive rules in `docs/COMPONENTS.md` (Hero not wrapped in `AnimatedSection`, no
  client-only mount gates) still apply.

### 2. Programmatic PageSpeed checks via the PSI API

Today, verifying performance requires manually pasting the production URL into the
PageSpeed Insights web UI. Agents cannot do that, so score regressions go unnoticed
between deploys.

Goal: a command agents (and CI) can run to query scores programmatically, e.g.
`npm run psi`, backed by the [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)
against `https://fernando-ghiberti.vercel.app` (strategy: mobile).

Acceptance criteria:
- Runs with no env var (the PSI API works unauthenticated within low quotas) and
  optionally accepts a key via `src/lib/env.ts` if quotas become a problem.
- Prints the Lighthouse category scores (at minimum Performance and Accessibility)
  and exits non-zero if Performance drops below the current target (97 once priority 1
  ships, so it doubles as a regression gate).
- Documented in `README.md` (commands) and `AGENTS.md` (commands reference).

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
