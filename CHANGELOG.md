# Changelog

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- **Hero** — added a WhatsApp icon alongside Email, LinkedIn, and GitHub in the social row, matching the four contact channels already offered in `<Contact />`.
- Explicit `viewport` export with light/dark `themeColor` in `layout.tsx`.
- `ProfilePage` node added to the home JSON-LD `@graph` (wraps the existing `Person`/`WebSite`), plus `inLanguage` on the profile and website nodes.
- `src/__tests__/seo-metadata-routes.test.ts` covering `robots.ts` and `sitemap.ts` (rules, `/api/` disallow, correct production domain).
- `PointerOnlyEffects` — gates `CustomCursor`/`MouseSpotlight` behind a `(pointer: fine)` check *before* importing them, so touch/mobile devices never fetch, parse, or hydrate that JS at all (previously both were imported unconditionally and only no-opped internally after mounting).
- `SkillsSlider`'s `dynamic()` import now has a sized loading skeleton (`min-h-[560px]`) to avoid a layout shift when its chunk finishes loading.
- `public/llms.txt` — a static, [llmstxt.org](https://llmstxt.org)-convention summary of the site for AI agents/crawlers (profile sections, projects, CV, sitemap). Added after Lighthouse's experimental "Agentic Browsing" category flagged it as inapplicable; the category's other checks (WebMCP form/tool/schema audits) aren't relevant to a static portfolio with no agent-invokable tools, so weren't pursued.

### Changed
- Downloadable CV (`public/fernando-ghiberti-cv-en.pdf`) refreshed with a newer revision. Same filename — no code changes required.
- `robots.ts` now `disallow`s `/api/` so the chat and CSP-report endpoints are excluded from indexing.
- Home `<meta name="description">` trimmed to 155 characters (from 175) for clean SERP display, still leading with name + stack.
- **Timeline — professional experience cards synced with the updated CV** (EN and PT-BR): `+A Educação`'s period changed from "2022 – Present" to "2022 – 2026" (the CV lists it as ended) and its title/bullets now reflect the CMS migration, design system, and team-lead scope; EBANX's title gained the "(Mid-Senior)" qualifier; the freelance/personal-projects entry now lists the actual shipped projects (DevFactory, Ghiberti UI, DevInterviewLab, Interview Command Center, Finanças do Casal) instead of generic bullets.

### Removed
- **GitHubActivity** — dropped the "View full profile" CTA at the bottom of the section; the GitHub link already lives in the `<Contact />` cards, so it was a redundant, unused `viewProfile` translation key plus an extra external link doing the same thing.

### Fixed
- **SEO — canonical domain corrected to `fernando-ghiberti.vercel.app`** across `layout.tsx` (`metadataBase`, canonical, Open Graph, JSON-LD), `sitemap.ts`, `robots.ts`, the OG image, and `README.md`. The codebase had been split between two domains.
- Removed stray `public/robot.txt` — misnamed (never served at `/robots.txt`), pointed at the wrong domain, and duplicated by the dynamic `robots.ts`. The App Router `robots.ts`/`sitemap.ts` are now the single source of truth.
- **Timeline (desktop)** — the horizontal gradient line's fill was scroll-scrubbed (`useScroll`/`useSpring`), but the whole row is already visible without vertical scrolling, so it visually stalled partway and looked broken. The desktop line is now a static, fully-filled gradient; the mobile left-rail line keeps its scroll-linked reveal, where it makes sense.
- **Mobile performance — page content no longer waits on client JS to exist.** `IntroGate` gated its entire render behind a `ready` flag that only ever flipped `true` inside a `useEffect`, so the server-rendered HTML was empty (no `<h1>`, no `<main>`) and nothing painted until hydration finished — brutal for LCP on a throttled mobile connection/CPU (measured ~13s LCP locally). Page content now always renders; `TerminalIntro` mounts as an opaque full-screen overlay on top of it on first visit instead of gating its existence. `AnimatedSection` also went back to being a plain static import — it had been converted to `dynamic(..., { ssr: false })`, which meant `ssr: false` on a wrapper around nearly the whole page, silently disabling SSR for everything inside it. Locally this took LCP from ~13s to ~1.8s.
- **Hero** (the LCP element) no longer wrapped in `<AnimatedSection>` — `whileInView` renders `opacity: 0` in the SSR output until an `IntersectionObserver` fires client-side, which was delaying when the LCP element counted as painted. Every other, below-the-fold section keeps its scroll-in animation.
- **`TerminalIntro` types ~2.4x faster on mobile viewports** (`matchMedia("(max-width: 1023px)")`). PageSpeed/Lighthouse always audits a first-time visit, so this animation's full duration counts directly against mobile Speed Index/TBT on every run; desktop was already scoring well and keeps its original pacing.

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
