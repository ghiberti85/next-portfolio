# Architecture

## Overview

This is a **single-page portfolio** rendered by the Next.js App Router. Content (skills, projects,
timeline, UI strings) is hardcoded as typed TypeScript data — there is no CMS and no database. The
one deliberate exception is a small set of **server-side routes and fetches** that exist only where
a secret must stay off the client or where truly live data (GitHub stats) is worth an ISR-cached
request. See ADR-002 (superseded) and ADR-005 for the full reasoning.

```
Browser → Vercel Edge/CDN → Next.js proxy (per-request CSP nonce)
                           → Server Components (page.tsx, /api/*, next/og)
                           → Client Components (interactive UI)
```

---

## Stack Decisions (why, not just what)

| Decision | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 App Router | SSR/SSG, image optimization, font loading, file-based routing, and a real (if minimal) server layer for the two exceptions below — all without extra infra |
| Language | TypeScript (`strict` + `noUncheckedIndexedAccess`) | Catches shape errors in the data arrays and indexed lookups at compile time |
| Styling | Tailwind CSS + CSS custom properties | Utility-first for layout/spacing; CSS variables (`--accent-teal`, `--gradient-accent`, `--card-bg`, …) carry the color system so dark/light theming and WCAG-AA contrast don't require per-component branching |
| Icons | Font Awesome React | SVG-based, tree-shakeable |
| Carousel | React Slick | Built-in RTL support, used for the reverse-direction second skills slider |
| Animation | Framer Motion | Scroll-triggered entrances, the shared-layout card→modal morph, and `useScroll`/`useSpring` progress bars all need one coherent animation primitive |
| Charts | Recharts | The skills radar chart |
| AI | Groq SDK (LLaMA 3.3-70b) | Fast inference, generous free tier, OpenAI-compatible client — good fit for a low-traffic personal-site chat feature |
| Testing | Jest + React Testing Library | Industry standard for React; RTL enforces behavior-first testing |
| Deployment | Vercel | Zero-config Next.js deploys, preview URLs per PR, automatic production deploy on `main` merge |

---

## The "no backend" policy, and its exceptions

The default is still: **no database, no CMS, no user accounts.** Skills, projects, and timeline
data are typed arrays in `src/lib/*.ts` and `src/lib/translations/*.ts` — editing content is a
one-file change and a commit, not a dashboard or a migration.

Three things intentionally break the "static site" framing, each for a specific, narrow reason:

| Exception | File(s) | Why it exists |
|---|---|---|
| AI chat proxy | `src/app/api/chat/route.ts` | `GROQ_API_KEY` must never reach the browser. The route also rate-limits, validates input, and enforces CORS — see Security Architecture below. |
| CSP violation receiver | `src/app/api/csp-report/route.ts` | Gives the CSP's `report-uri` somewhere real to POST to instead of 404ing. |
| GitHub Activity data | `src/lib/github.ts`, called from `page.tsx` | Live repo/star/language stats can't be baked into a static array; ISR (`revalidate: 3600`) keeps it cheap and ADR-worthy without a database. |

Do not add another `src/app/api/` route or server-only fetch unless it fits the same pattern
(secret-holding proxy, or ISR-cached read of genuinely dynamic public data). If it doesn't, write a
new ADR before adding it — see `docs/adr/005-server-side-api-routes-for-secrets-and-live-data.md`.

Also not present, deliberately: state management libraries (Redux/Zustand — no state is shared
beyond `LanguageContext`/`ThemeContext`), authentication (public portfolio, no protected routes),
CMS integration, and the Pages Router (legacy).

---

## Component Composition

`src/app/page.tsx` (Server Component) fetches GitHub stats and renders `<IntroGate>`, which owns
the actual page sequence and the terminal-intro gating. See `docs/COMPONENTS.md` for the full
per-component reference; the shape is:

```
page.tsx (Server) → IntroGate (Client)
├── <Navbar />
├── <Hero />               (+ <StatsCounter />)
├── <SkillsSlider />       (+ <SkillsRadar />)
├── <ProjectsGrid />
├── <Timeline />
├── <GitHubActivity />
├── <Contact />
└── <Footer />

Global overlays (layout.tsx): <CustomCursor /> <MouseSpotlight /> <ScrollProgressBar />
<SkipLink /> <AskFernando /> <CommandPalette /> <InteractiveTerminal />
```

Section components do not share state with each other directly. Cross-cutting state
(language, theme) goes through `LanguageContext`/`ThemeContext`; cross-component *actions* (open the
palette from the Navbar, open the terminal from the palette) go through the tiny CustomEvent bus in
`src/lib/uiEvents.ts` rather than prop-drilling or a new context.

---

## Data Layer

| Data | Location | Shape |
|---|---|---|
| Skills carousel | `SkillsSlider.tsx` → `skills: Skill[]` | `{ name, icon (URL or local path) }` |
| Skills radar | `translations/skills.ts` → `skills[lang].radarData` | `{ subject, value (0–100) }[]` |
| Projects | `src/lib/projects.ts` → `projects: Project[]` | `{ title, image, github, live, tags[] }` |
| Project descriptions | `translations/projectDescriptions.ts` → `projectDescriptions[lang]` | `string[]`, indexed positionally against `projects` |
| Timeline items | `translations/timeline.ts` → `timeline[lang].items` | `{ title, period, type, institution, details[] }` |
| GitHub activity | `src/lib/github.ts` → `GitHubStats` | Fetched server-side, ISR 1h, fails closed (`null` on any error) |
| UI strings | `translations/<section>.ts` → `<section>["en" \| "pt"]` | One file per section (nav, hero, skills, …), each with one object per language, mirrored key-for-key — split so a component's chunk only pulls in its own section's strings, not every section in the app |

To add/edit static content: update the relevant array. No API calls, no migrations. The only
runtime data fetch in the app is `getGitHubStats()`.

---

## Styling Conventions

### Glassmorphism Card Pattern
The `.glass-card` utility class (defined in `globals.css`) is the standard for content cards
(skills, projects, timeline items, contact cards, modals). Don't hand-roll the
`backdrop-filter`/`border`/`background` triplet per component — use the class, or extend it if the
whole system needs to change.

### Color System
All accent colors are CSS custom properties, not hardcoded Tailwind classes, so the same markup
adapts correctly between dark and light mode:

| Token | Dark | Light | Contrast |
|---|---|---|---|
| `--accent-teal` | `#14b8a6` | `#0f766e` | 4.6:1 (WCAG AA) |
| `--accent-blue` | `#3b82f6` | `#1d4ed8` | 5.7:1 (WCAG AA) |
| `--gradient-accent` | `linear-gradient(135deg, teal, blue)` | darker stops, same direction | — |

Never hardcode `#14b8a6`/`#3b82f6` in a component — read the variable. Full token list and rules in
`AGENTS.md` → Color System.

### Theme & Language
`ThemeContext` (dark/light, `localStorage`-persisted) and `LanguageContext` (EN/PT-BR,
`localStorage`-persisted, syncs `document.documentElement.lang`) are the only two React Contexts in
the app. The theme toggle additionally drives a circular reveal via the View Transitions API
(`document.startViewTransition`, feature-detected, falls back to an instant switch for unsupported
browsers and `prefers-reduced-motion`).

### Responsive Breakpoints
Tailwind defaults, mobile-first. `sm:` for minor grid adjustments, `lg:` for the desktop layout
switch (single-column → multi-column; horizontal timeline track only exists at `lg:`).

---

## Security Architecture

Full details and control inventory in [`SECURITY.md`](../SECURITY.md). Summary:

- **Per-request CSP nonce** — `src/proxy.ts` generates a nonce per request, injects it as the
  `x-nonce` request header and as `'nonce-{nonce}'` in the `script-src` directive. Next.js threads
  this nonce through to its own internal inline (hydration/bootstrap) scripts automatically, but
  only if the route renders dynamically per request — `layout.tsx` calls `headers()` (ignoring the
  return value) purely to force that. It does *not* apply the nonce to the JSON-LD `<script
  type="application/ld+json">` — that's inert data, never executed as script, so `script-src`
  doesn't govern it; giving it a nonce previously caused a hydration mismatch (see CHANGELOG). No
  `unsafe-eval` in production; `report-uri /api/csp-report` is backed by a real endpoint.
- **Static HTTP headers** (`next.config.ts` → `headers()`): HSTS, `X-Frame-Options: SAMEORIGIN`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` (camera/mic/geo disabled).
- **`src/lib/env.ts`** — the only place server secrets (`GROQ_API_KEY`, `VERCEL_URL`,
  `GITHUB_TOKEN`) are read from `process.env`; they're exposed as functions so the bundler can't
  accidentally inline them into a client chunk.
- **`/api/chat`** — rate limited (20 req/IP/min, in-memory sliding window with eviction), role
  allowlist (`user`/`assistant` only — blocks prompt injection via a client-supplied `role: "system"`),
  content length caps, `lang` allowlist, fail-closed CORS (403 if origin doesn't match
  `NEXT_PUBLIC_SITE_URL`/`VERCEL_URL`), 503 if `GROQ_API_KEY` is absent.
- **Supply chain** — all GitHub Actions in `ci.yml` pinned to full commit SHAs; Dependabot runs
  weekly for npm and Actions.
- SVG skill icons served from CDNs require `dangerouslyAllowSVG: true`; mitigated by a strict
  sandbox CSP on the image handler (`script-src 'none'`).

**Do not weaken any of the above.** If a feature needs to relax a policy, write an ADR first.

---

## CI/CD Pipeline

```
git push → GitHub Actions (ci.yml)
              ├── npm run lint
              ├── npm run test:coverage   (fails below 70/60/70/70 — lines/branches/functions/statements)
              └── npm run build
Also on every PR: GitGuardian secret scanning, Vercel preview deploy
                        ↓ (on merge to main, squash only)
                   Vercel auto-deploy → production
```

Preview deployments are created automatically by Vercel for every PR branch; the production URL
only updates when `main` changes. `main` should be treated as protected (PR + green CI required)
even where that isn't yet enforced by a GitHub branch-protection rule.
