# Changelog

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- `AGENTS.md` — canonical, model-agnostic instruction set for AI agents (mandatory workflow, security checklist, conventions, updated project structure, documentation map, quick start). `CLAUDE.md` is now a short pointer to it, so all tooling (Claude Code, opencode, Codex, Cursor, …) reads the same rules from one place.
- `.env.example` — environment template (`GROQ_API_KEY`, `NEXT_PUBLIC_SITE_URL`, `GITHUB_TOKEN`) so agents and new setups can bootstrap without guessing variable names. `.gitignore` gains an `!.env.example` opt-in so the template is tracked while real env files stay ignored.
- `docs/ROADMAP.md` — forward-looking priorities (mobile PageSpeed ≥ 97; programmatic PageSpeed Insights API checks), backlog, and technical-debt tracker, so incoming agents know where the project is going, not just how it works.
- `README.md` — new "Development & AI Agents" section pointing at `AGENTS.md`; env-var setup now references `.env.example`.
- **Hero** — added a WhatsApp icon alongside Email, LinkedIn, and GitHub in the social row, matching the four contact channels already offered in `<Contact />`.
- Explicit `viewport` export with light/dark `themeColor` in `layout.tsx`.
- `ProfilePage` node added to the home JSON-LD `@graph` (wraps the existing `Person`/`WebSite`), plus `inLanguage` on the profile and website nodes.
- `src/__tests__/seo-metadata-routes.test.ts` covering `robots.ts` and `sitemap.ts` (rules, `/api/` disallow, correct production domain).
- `PointerOnlyEffects` — gates `CustomCursor`/`MouseSpotlight` behind a `(pointer: fine)` check *before* importing them, so touch/mobile devices never fetch, parse, or hydrate that JS at all (previously both were imported unconditionally and only no-opped internally after mounting).
- `SkillsSlider`'s `dynamic()` import now has a sized loading skeleton (`min-h-[560px]`) to avoid a layout shift when its chunk finishes loading.
- `public/llms.txt` — a static, [llmstxt.org](https://llmstxt.org)-convention summary of the site for AI agents/crawlers (profile sections, projects, CV, sitemap). Added after Lighthouse's experimental "Agentic Browsing" category flagged it as inapplicable; the category's other checks (WebMCP form/tool/schema audits) aren't relevant to a static portfolio with no agent-invokable tools, so weren't pursued.
- `DeferredOverlays` — extracted `AskFernando`/`CommandPalette`/`InteractiveTerminal` out of `layout.tsx` into their own component, mounted via `requestIdleCallback` (falls back to a 1.5s timeout) instead of at hydration, so their chunks evaluate outside the TBT-scored window.
- `scripts/psi.ts` (`npm run psi`) — queries the PageSpeed Insights API for mobile + desktop scores and every failing audit against the deployed site, so agents (and CI, eventually) can verify a performance change without pasting the URL into the PSI web UI. Optional `PSI_API_KEY` (via `src/lib/env.ts`) avoids the low unauthenticated quota. Closes roadmap priority "Programmatic PageSpeed checks via the PSI API".

### Changed
- `.claude/commands/new-component.md` resynced with current conventions: `.glass-card` class instead of hand-rolled inline glassmorphism, `DecryptText` heading fed by `translations.ts`, section composition in `IntroGate.tsx` (was wrongly pointing at `page.tsx`), and the `ErrorBoundary`/`AnimatedSection` wrapper rule.
- Downloadable CV (`public/fernando-ghiberti-cv-en.pdf`) refreshed with a newer revision. Same filename — no code changes required.
- `robots.ts` now `disallow`s `/api/` so the chat and CSP-report endpoints are excluded from indexing.
- Home `<meta name="description">` trimmed to 155 characters (from 175) for clean SERP display, still leading with name + stack.
- **Timeline — professional experience cards synced with the updated CV** (EN and PT-BR): `+A Educação`'s period changed from "2022 – Present" to "2022 – 2026" (the CV lists it as ended) and its title/bullets now reflect the CMS migration, design system, and team-lead scope; EBANX's title gained the "(Mid-Senior)" qualifier; the freelance/personal-projects entry now lists the actual shipped projects (DevFactory, Ghiberti UI, DevInterviewLab, Interview Command Center, Finanças do Casal) instead of generic bullets.

### Removed
- **GitHubActivity** — dropped the "View full profile" CTA at the bottom of the section; the GitHub link already lives in the `<Contact />` cards, so it was a redundant, unused `viewProfile` translation key plus an extra external link doing the same thing.
- **`public/images/website-animation.json`** (160KB) — never referenced anywhere in the codebase, a leftover from before the first tracked release. Found via a `knip`/`depcheck` dead-code audit; also deduplicated `LanguageContext.tsx`'s local `Lang` type against the identical one `translations.ts` already exported, and dropped the unnecessary `export` on `GitHubRepo`/`GitHubLanguage` (`github.ts`), which are only ever used internally.

### Fixed
- **SEO — canonical domain corrected to `fernando-ghiberti.vercel.app`** across `layout.tsx` (`metadataBase`, canonical, Open Graph, JSON-LD), `sitemap.ts`, `robots.ts`, the OG image, and `README.md`. The codebase had been split between two domains.
- Removed stray `public/robot.txt` — misnamed (never served at `/robots.txt`), pointed at the wrong domain, and duplicated by the dynamic `robots.ts`. The App Router `robots.ts`/`sitemap.ts` are now the single source of truth.
- **Timeline (desktop)** — the horizontal gradient line's fill was scroll-scrubbed (`useScroll`/`useSpring`), but the whole row is already visible without vertical scrolling, so it visually stalled partway and looked broken. The desktop line is now a static, fully-filled gradient; the mobile left-rail line keeps its scroll-linked reveal, where it makes sense.
- **Mobile performance — page content no longer waits on client JS to exist.** `IntroGate` gated its entire render behind a `ready` flag that only ever flipped `true` inside a `useEffect`, so the server-rendered HTML was empty (no `<h1>`, no `<main>`) and nothing painted until hydration finished — brutal for LCP on a throttled mobile connection/CPU (measured ~13s LCP locally). Page content now always renders; `TerminalIntro` mounts as an opaque full-screen overlay on top of it on first visit instead of gating its existence. `AnimatedSection` also went back to being a plain static import — it had been converted to `dynamic(..., { ssr: false })`, which meant `ssr: false` on a wrapper around nearly the whole page, silently disabling SSR for everything inside it. Locally this took LCP from ~13s to ~1.8s.
- **Hero** (the LCP element) no longer wrapped in `<AnimatedSection>` — `whileInView` renders `opacity: 0` in the SSR output until an `IntersectionObserver` fires client-side, which was delaying when the LCP element counted as painted. Every other, below-the-fold section keeps its scroll-in animation.
- **`TerminalIntro` types ~2.4x faster on mobile viewports** (`matchMedia("(max-width: 1023px)")`). PageSpeed/Lighthouse always audits a first-time visit, so this animation's full duration counts directly against mobile Speed Index/TBT on every run; desktop was already scoring well and keeps its original pacing.
- **A React hydration mismatch on every single page load, root-caused via a real PageSpeed Insights "Browser errors" report** (minified React error #418) shared by the repo owner. `layout.tsx`'s JSON-LD `<script>` carried a per-request CSP nonce (`headers().get("x-nonce")`, minted fresh by `middleware.ts` on every request); the value baked into the attribute during SSR didn't consistently match what client hydration expected, so React discarded the entire SSR output and did a full client-side re-render on every load. PSI's own diagnostics confirmed the cost: the hydration-related chunk alone accounted for ~1.5s of Script Evaluation (by far the largest single contributor to JS execution time), and the LCP element (a plain text paragraph, no image, no network fetch) showed a 2,560ms "element render delay" — consistent with the whole page waiting on a full re-render rather than using what SSR already produced. Fix: removed the nonce from the JSON-LD script specifically — `application/ld+json` is inert data, never executed as script, so `script-src` doesn't govern it and it never needed one. `headers()` is still called (unused return value, kept only for its side effect of forcing dynamic rendering) because Next.js's own internal inline scripts *do* need the per-request nonce to satisfy CSP, and removing the call entirely let the route go static, which broke that — confirmed by testing: removing `headers()` fixed the hydration mismatch but introduced ~13 CSP "Refused to execute inline script" violations against Next's own bootstrap scripts, so the call had to stay.
- **The Hero → terminal-intro "flash"** the repo owner reported seeing during a fresh PageSpeed run: `IntroGate` resolved its `sessionStorage` check in `useEffect`, which runs *after* the browser's first paint, so Hero painted, then the intro overlay replaced it a moment later — a second, later LCP candidate that inflated the mobile Performance score. Initially moved the check to `useLayoutEffect` to resolve before paint instead; later reverted back to `useEffect` while eliminating hydration-error candidates (see below) after confirming via `npm run psi` that the timing change wasn't the cause — the flash fix still holds through the small scheduling delay described next.
- **SkillsSlider** now lazy-loads `SkillsRadar` (recharts, the heaviest dependency on the page) only once scrolled near, instead of shipping it in the initial bundle.
- **Hero's mobile typewriter** runs once and settles on the last string instead of looping forever, so it stops delaying LCP finalization and doing perpetual main-thread work on throttled mobile CPUs.
- **`TerminalIntro`** batches characters per timer tick and skips the smooth-scroll animation on mobile, cutting re-renders during the scored load window.
- **`Footer`**: `suppressHydrationWarning` on the render-time copyright year (React's documented pattern for this) and the scroll listener is now `{ passive: true }`.
- `next.config.ts`: `productionBrowserSourceMaps` enabled — PSI's diagnostics explicitly flagged large first-party JS shipping without source maps.
- **A second, harder-to-find React hydration mismatch (#418) that only reproduced on the real Vercel deployment** — never against local `next dev` or a local production `next start`, which made it invisible to normal local testing. Root-caused by running the actual production bundle inside a scriptable headless-jsdom environment against both localhost and the live URL to isolate the difference: the only structural oddity in the LCP-critical Hero was both `Typewriter` instances being wrapped in `next/dynamic(..., { ssr: false })`, which emits a React streaming "bail out to client rendering" marker around them in the SSR HTML — the likely site of the mismatch under Vercel's real request streaming. `typewriter-effect` only touches the DOM inside its own `componentDidMount` (verified via `renderToString`: it SSRs to a plain empty container), so `ssr: false` was never actually required; importing it directly removes the special boundary while the widget still never runs during SSR.
- **Elements with visible text labels do not have matching accessible names** (axe `label-content-name-mismatch`, found via `npm run psi`'s Accessibility category audits) — the language-toggle buttons' `aria-label` ("Switch to English"/"Mudar para Português") didn't contain their visible text ("EN"/"PT"), breaking voice-control activation. Fixed in all four instances (desktop nav + mobile menu).

### Migrated
- **Next.js 15.5.19 → 16.3.1** (Turbopack is now the default build tool). Fixes the 4 high-severity Next.js CVEs `npm audit` was flagging (DoS, SSRF, cache confusion — now 0 vulnerabilities) and removes the ~217KB of Next DevTools that 15.5.x bundled into every production page load: "Reduce unused JavaScript" dropped from ~270KiB to ~75KiB on both mobile and desktop. `src/middleware.ts` → `src/proxy.ts` via the official codemod (Next 16 renamed the convention; Proxy now defaults to the Node.js runtime, no config needed). Dropped `export const runtime = "edge"` from `opengraph-image.tsx` (deprecated) — bonus: that route went from dynamic to statically prerendered. `next lint` was fully removed in 16; migrated to plain `eslint .` via the official codemod, which also surfaced a new `react-hooks/set-state-in-effect` rule flagging six existing, intentional SSR-hydration-safe/reset-on-prop-change patterns — downgraded to warn rather than disabled outright. Fixed two test files against Next 16's updated TypeScript DOM lib.

### Investigated, not fixed
- **The React #418 hydration error kept getting flagged by `npm run psi`'s `errors-in-console` audit — the sole remaining Best Practices blocker (96/100 on both strategies) — after the Typewriter fix above.** Eliminated by process of elimination across five further attempts, each verified against production and each leaving the exact same error signature (same throw site inside React's hydration internals, same stack shape): (1) `SkillsSlider`'s `AnimatedSection` wrapper stacking framer-motion's client-only reveal on top of its own remaining `ssr:false` boundary; (2) the `useLayoutEffect` timing change described above; (3) a deliberate 50ms delay between mounting `SkillsSlider` and `TerminalIntro` to stop their async chunk-load and rapid-`setTimeout` re-renders from competing for the main thread; (4) **the full Next 16 migration above, webpack → Turbopack included** — this one was genuinely expected to fix it, since it fixed the DevTools-bundle-bloat issue via the same mechanism (newer Next internals), but the error survived unchanged. The error only reproduces under real Lighthouse CPU throttling — never locally, and never via a real-network headless repro against the live URL without throttling — pointing to a genuine timing-sensitive race inside React/Next's own hydration machinery rather than a static SSR/CSR content mismatch in app code, and it isn't specific to one Next.js version or bundler.
- **Root-caused (not fixable in this repo).** React's own error catalog decodes error #418 with these args as *"Hydration failed because the server rendered **text** didn't match the client"* — confirming a text-content mismatch. Downloaded the exact chunk PSI's console report points at, together with its Turbopack source map, and listed all ~26 source files bundled into it: every one is a Next.js internal (`app-index.tsx`, `app-router.tsx`, `create-initial-router-state.ts`, `find-head-in-cache.ts`, `react-dom-client.production.js`, `on-recoverable-error.ts`) — zero files from this repo. This matches a still-open upstream issue, [vercel/next.js#43159](https://github.com/vercel/next.js/issues/43159) ("Random non-deterministic React hydration error 418 using appDir that only happens on prod Vercel," opened Nov 2022, ~2% of loads, never reproducible locally, no maintainer fix to date). Moved from an active roadmap priority to tracked technical debt in `docs/ROADMAP.md` — the bug is inside Next.js's own App Router hydration bootstrap, unreachable from application code; the exit condition is an upstream fix.
- **Two more attempts, prompted by a fair question: why does this specific project show the error when other Next.js projects don't?** (1) Removed SkillsSlider's own remaining `ssr:false` boundary (kept from the `AnimatedSection` fix above) — `react-slick` renders fine server-side, so it wasn't required; this eliminated the *only other* `next/dynamic(ssr:false)` boundary still part of the initial hydration pass (`AskFernando`/`CommandPalette`/`InteractiveTerminal` mount well after hydration, gated behind a ready flag, so were never candidates the same way). (2) Temporarily swapped the CSP's `script-src` nonce for `unsafe-inline` in production for a few minutes — this app's one clearly unusual trait versus a typical Next.js project (most don't implement strict per-request CSP nonces at all), and the site of one already-confirmed nonce-related hydration bug earlier this session. Verified via `npm run psi` against the live change, then reverted. **Neither changed the outcome.** Every structural theory available from application code is now eliminated.

### Docs
- `CHANGELOG.md` backfilled with everything from v1.5.0 through v2.1.1 (previously last updated 2026-06-04, 8 releases behind).
- `docs/COMPONENTS.md` and `docs/ARCHITECTURE.md` rewritten — both had drifted back to the v1.0/v1.3 era (7 components, "no backend" framing) and no longer matched the current 20+ component, API-routes-with-exceptions architecture.
- ADR-002 ("No API Routes or Backend") marked **Superseded** — it contradicted the codebase, which already has `/api/chat`, `/api/csp-report`, and a server-side GitHub fetch. New **ADR-005** documents the actual policy (secret-holding proxies and ISR-cached live data are the only allowed exceptions).
- `README.md`: live URL corrected to match `layout.tsx`'s canonical `BASE_URL`, skill count corrected (19+ → 34), `IntroGate.tsx` added to the project structure tree.
- `CLAUDE.md`: doc-sync table (§7) now lists `docs/COMPONENTS.md`, `docs/ARCHITECTURE.md`, `docs/adr/`, and `CHANGELOG.md` as files to keep current — closing the gap that let all four fall out of sync in the first place.

---

## [2.1.1] — 2026-07-04

### Changed
- Downloadable CV (`public/fernando-ghiberti-cv-en.pdf`) refreshed with the 2026 revision (updated summary, skills, and experience). Same filename — no code changes required.

---

## [2.1.0] — 2026-07-02

### Added
- **Command Palette** (⌘K / Ctrl+K) — overlay to jump to any section, toggle theme/language, download the CV, open the terminal, or open GitHub/LinkedIn/email. Keyboard-navigable (arrows / Enter / Esc), focus-trapped, bilingual.
- **Interactive Terminal** (Ctrl+\` or navbar button) — persistent zsh-style widget with `help`, `whoami`, `projects`, `skills`, `cv`, `contact`, `theme`, `lang en|pt`, `clear`, `exit`, arrow-key command history, and a `sudo hire-me` easter egg.
- **GitHub Activity** section — server-side fetch via the GitHub API with ISR (revalidate 1h) through `src/lib/github.ts`; renders repo/star/follower stats, top-language bars, and recently updated repos. Fails closed on any API error. Optional `GITHUB_TOKEN` support.
- **Card → modal morph** on ProjectsGrid via a Framer Motion shared `layoutId`.
- **Theme circular reveal** — dark/light toggle expands from the clicked button via the View Transitions API, with instant fallback for unsupported browsers and `prefers-reduced-motion`.
- **DecryptText** — section headings scramble terminal-style and resolve on scroll into view; screen-reader text stays intact.

### Fixed
- Timeline modal close button overlapping the item title on narrow viewports and long titles (`pr-12` reserved on the title; defensive `z-10` on both modal close buttons).

### Testing
- 195 tests across 29 suites (up from 142/24).

---

## [2.0.0] — 2026-06-27 to 2026-06-29

Major architecture and security pass — no functionality removed, everything documented below is additive or internal.

### Added
- **Per-request CSP nonce** via `src/middleware.ts`, replacing the static CSP in `next.config.ts` — no `unsafe-eval` in production.
- **`/api/csp-report`** endpoint (accepts `application/csp-report`/`application/json`, caps body at 4 kB, returns 204).
- **`src/lib/env.ts`** — centralised env-var access; server secrets (`GROQ_API_KEY`, `VERCEL_URL`) exposed only as functions to keep them out of client bundles.
- **SHA-pinned GitHub Actions** in `ci.yml`; **Dependabot** (`.github/dependabot.yml`) for weekly npm + Actions updates.
- **`SECURITY.md`** — full security architecture documentation.
- **`src/hooks/useEscapeKey.ts`** and **`src/hooks/useFocusTrap.ts`** (WCAG 2.4.7) — shared across every modal (ProjectsGrid, Timeline, AskFernando).
- **`ErrorBoundary`** — per-section failure isolation on the page.
- **`IntroGate.tsx`** — extracted so `page.tsx` is a true Server Component; terminal-intro state lives client-side in `IntroGate`.
- **`src/lib/projects.ts`** — project data extracted from `ProjectsGrid` into a typed module.
- Groq client singleton (reused across warm serverless invocations instead of re-created per request).

### Changed
- `strict: true` + `noUncheckedIndexedAccess` enabled in `tsconfig.json`; all `any` types eliminated; ESLint hardened (`no-explicit-any`, `no-non-null-assertion`, `consistent-type-imports`).
- `LanguageContext` syncs `document.documentElement.lang` on toggle (WCAG 3.1.1).
- 142 tests across 24 suites (up from ~90); `fireEvent` migrated to `userEvent` across 8 test files; hook tests relocated to `src/__tests__/hooks/`.
- `README.md` / `CLAUDE.md` brought in sync with the new architecture (in a following docs-only PR).

### Fixed
- Typed, status-aware error handling on `/api/chat` (Groq 429 → HTTP 429, Groq 5xx → HTTP 502) replacing a bare `catch {}`.
- `ProjectsGrid` tilt effect now mutates the DOM ref directly instead of forcing a React re-render on every `mousemove`.

---

## [1.13.0] — 2026-06-25 to 2026-06-27

### Added
- **AI Code Reviewer** project added as the first (featured) card in the grid.
- **Philosophia** project added with a full bilingual description.

### Changed
- Projects with a live demo moved to the top of the grid.
- Project filter tags normalized: `Typescript` → `TypeScript` (7×), `Javascript` → `JavaScript`, `Groq API`/`Groq AI` → `Groq`; overly specific tags removed — 25 tags reduced to 21 unique.

### Fixed
- Mobile project-filter bar expanded to full screen width with a stronger infinite-scroll fade at both edges.
- Dead code removed from `translations.ts` (unused keys, unused `location` field on timeline items).
- Next.js upgraded `15.1.6` → `15.1.11` to resolve a React Server Components CVE (GHSA-3h52-269p-cp9r).

---

## [1.12.0] — 2026-06-14 to 2026-06-21

### Changed
- Copy shifted from frontend-only to fullstack positioning across Hero, terminal boot sequence, and Contact (EN + PT-BR).
- English set as the default site language (was Portuguese).

### Fixed
- Hero parallax removed on mobile — it caused the text column to overlap the profile card during scroll.
- Section vertical spacing tightened on mobile (`py-20` → `py-12 lg:py-20`).
- Interview Command Center live demo URL corrected.

---

## [1.11.0] — 2026-06-06 to 2026-06-08

### Added
- Open Graph image (1200×630, generated via `next/og`), JSON-LD structured data (`Person` + `WebSite`), `sitemap.xml` and `robots.txt` (all auto-generated by the App Router).
- 15 additional skills added to the carousel (Prisma, GraphQL, ESLint, AWS, Linux, Zustand, React Query, Vitest, Radix UI, Zod, Turborepo, shadcn/ui and others) — self-hosted as local SVGs after the `simpleicons` CDN proved unreliable for server-side `next/image` requests.
- Scroll progress bar, brand-colored skill-card glow on hover, progressive timeline fill line, and `easeOutExpo` stats-counter easing.

### Security
- `unsafe-eval` removed from the production CSP (dev-only).
- `/api/chat` hardened: 20 req/IP/minute rate limiting, role allowlist (`user`/`assistant` only), 2,000-char message cap, 10-message array cap, `lang` allowlist, explicit CORS with a 403 fail-closed default.
- 13-test `api-chat.test.ts` suite added.

### Fixed
- Skill glow clipped by the carousel's `overflow: hidden` — fixed with a `.skills-slider .slick-list { overflow: visible }` override, plus a softer glow radius and transition.

---

## [1.10.0] — 2026-06-05

### Added
- WCAG AA color token system (`--accent-teal`, `--accent-blue`, `--gradient-accent`) with darker light-mode stops (4.6:1 / 5.7:1 contrast).

### Fixed
- Scroll progress bar height and glow increased for mobile visibility.

---

## [1.9.0] — 2026-06-05

### Added
- Lazy loading for heavy components (AI chat, skills slider, animated sections) via `next/dynamic`.
- Critical CSS inlining (`optimizeCss` + `critters`), modern `browserslist` target (last 2 versions of major browsers, ~11 KiB polyfill savings).

### Fixed
- A same-day LCP optimization attempt (removing the terminal-intro render gate) caused a flash and a Performance-score regression (96 → 83); reverted the next day, keeping the `ready` gate.

---

## [1.8.0] — 2026-06-05

### Added
- Custom animated cursor (dot + lag ring) on pointer-fine devices, disabled under `prefers-reduced-motion` and on touch.
- Per-section entrance micro-animations (Framer Motion: fadeUp, stagger, launch, reveal, flip).
- Horizontal desktop timeline (professional entries above the line, education below) with a left-rail vertical layout on mobile.
- Two-column mobile layout for the skills carousel.

### Fixed
- Extensive accessibility iteration on the skip-to-content link across ~6 follow-up PRs (focusable-but-hidden via `sr-only`/`clip`, then `opacity` + `tabIndex={0}` for axe-core compliance) until it passed both Lighthouse and axe-core audits.
- Timeline card hover clipping, height consistency, and dot/line alignment polished across desktop and mobile.
- Hero stats corrected to 8+ years of experience; description repositioned around end-to-end delivery.

---

## [1.7.0] — 2026-06-04

### Added
- **AskFernando** — floating AI chat widget powered by Groq (`llama-3.3-70b-versatile`) via a server-side `/api/chat` route; `GROQ_API_KEY` never reaches the client.
- 3D tilt effect on project cards (`perspective`/`rotateX`/`rotateY` on mouse move, respects `prefers-reduced-motion`).
- Animated mesh-gradient background (3 fixed radial blobs, `aria-hidden`).
- **Language toggle** (EN/PT-BR, persisted to `localStorage`) with full site translation via `translations.ts`.
- **Dark/light theme toggle** with CSS custom properties driving background, cards, nav, and text.
- **Terminal boot intro** — typewriter-style terminal window shown once per session before the site reveals.
- **Animated stats counter** and **Recharts skills radar** (6 expertise areas) below the skills carousel.
- Open Graph / Twitter meta tags.

### Fixed
- Full mobile responsiveness pass — eliminated horizontal scroll, fixed oversized headings/gaps/padding across Hero, StatsCounter, Timeline, SkillsRadar, TerminalIntro, and Navbar.
- Chat colors adapted to light mode; chat input `font-size: 16px` to prevent iOS/Android auto-zoom; chat modal height uses `min(70vh, calc(100dvh - 8rem))`.
- Navbar mobile dropdown switched to `position: absolute` so it no longer scrolls away with the page.
- Terminal-to-portfolio transition changed from an abrupt cut to a smooth 0.8s crossfade.

---

## [1.5.0] — 2026-06-04

### Added
- Framer Motion scroll-triggered animations (`AnimatedSection` component) on all sections with `prefers-reduced-motion` support
- Mouse spotlight radial gradient effect that follows the cursor on desktop (`MouseSpotlight` component)
- Skip-to-content link (`<a href="#hero">`) for keyboard navigation accessibility
- `Escape` key handler to close mobile navbar menu and all modals (ProjectsGrid, Timeline)
- `:focus-visible` teal ring replacing default browser outline across all interactive elements
- `@media (prefers-reduced-motion: reduce)` CSS reset in `globals.css`

### Changed
- Section vertical padding standardized to `py-20` across SkillsSlider, ProjectsGrid, Contact
- Contact section fully refactored: flex two-column layout on desktop, cards extracted to typed array, `flex-col` + `flex-1` for uniform card heights, all card content centered

### Fixed
- Contact section desktop layout: text column left-aligned, cards column right, properly vertically centered

---

## [1.4.0] — 2026-06-04

### Added
- 4 recent projects added to top of ProjectsGrid (most recent first):
  - DevInterviewLab (Next.js, TypeScript, Supabase, Groq AI, PWA, Radix UI)
  - Interview Command Center (React, Vite, Supabase, Claude AI, PWA)
  - Ghiberti UI (React, Next.js, Storybook, Turborepo, Radix UI)
  - Finanças do Casal (React, Vite, Supabase, Claude AI, PWA)

### Changed
- Hero headline updated: `Frontend Expert` → `Senior Fullstack Expert`
- README Highlighted Projects table updated with new projects

### Fixed
- Project card images fixed to uniform `h-48` height with `object-cover object-top` (crops from bottom)
- Project modal: `max-h-[90vh] overflow-y-auto` prevents close button from going off-screen on tall images
- Project modal image: consistent `h-48` container with `fill + object-top`
- Forced Vercel image cache refresh (new deploy) for updated GitHub profile photo

---

## [1.3.0] — 2026-05-30

### Added
- HTTP security headers configured globally in `next.config.ts`: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`
- Jest 30 + React Testing Library test infrastructure (28 tests, 6 suites)
- GitHub Actions CI pipeline: lint → test:coverage → build on every PR and push to `main`
- `CLAUDE.md` — mandatory workflow rules for AI agents
- `docs/ARCHITECTURE.md` — architecture overview, stack decisions, styling conventions
- `docs/COMPONENTS.md` — per-component reference with data shapes and constraints
- `docs/adr/001–004` — Architecture Decision Records (Next.js App Router, no API routes, Tailwind + glassmorphism, testing strategy)
- `.claude/commands/` — slash commands: `/new-component`, `/add-project`, `/security-check`
- `CHANGELOG.md` (this file)
- npm scripts: `test`, `test:watch`, `test:coverage`

### Changed
- `next.config.ts` migrated to typed `NextConfig` export
- Removed deprecated `swcMinify` and `experimental.modern` options
- SVG sandbox CSP tightened to `script-src 'none'`

### Fixed
- Next.js upgraded `15.1.6` → `15.1.11` to resolve React Server Components CVE

---

## [1.2.0] — 2026-05-18

### Added
- `README.md` fully rewritten in English for recruiters: tech stack, features, project structure, highlighted projects, professional background, education, getting started, contact, security section

---

## [1.1.0] — 2025-07-04

### Changed
- CV PDF updated (`public/fernando-ghiberti-cv-en.pdf`)

### Fixed
- Timeline card position on extra-large screens

---

## [1.0.0] — 2025-01-30

### Added
- Initial portfolio release
- `Navbar` — fixed top navigation with smooth scroll and mobile hamburger menu
- `Hero` — profile photo, name, typewriter animation, social links, CV download
- `SkillsSlider` — dual auto-scrolling skill carousels with proficiency bars (19 skills)
- `ProjectsGrid` — filterable, paginated project grid with modal detail view (12 projects)
- `Timeline` — alternating vertical timeline with professional and education entries
- `Contact` — Email, WhatsApp, LinkedIn, GitHub contact cards
- `Footer` — back-to-top button and author credit
- Glassmorphism visual design system
- Responsive mobile-first layout
- `next/image` optimization with WebP and lazy loading
- Geist font via `next/font`
- Vercel deployment with automatic preview URLs per PR
