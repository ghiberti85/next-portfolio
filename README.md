# Fernando Ghiberti — Personal Portfolio

A modern, performant personal portfolio built with **Next.js 15**, **TypeScript**, and **Tailwind CSS** — showcasing professional experience, technical skills, and personal projects in a clean, animated single-page application.

**Live:** [fernando-ghiberti.vercel.app](https://fernando-ghiberti.vercel.app/) &nbsp;|&nbsp; **Author:** [Fernando Ghiberti](https://linkedin.com/in/fernando-ghiberti) &nbsp;|&nbsp; **License:** MIT

---

## Overview

This portfolio gives recruiters and hiring managers a fast, clear view of Fernando's engineering profile — from his tech stack and open-source projects to his career journey and education. Everything is accessible from a single, scroll-based page with interactive modals, smooth animations, a built-in AI chat assistant, and bilingual support (EN / PT-BR).

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Icons | Font Awesome (React) | 6.x |
| Carousel | React Slick | 0.30.x |
| Animation | Typewriter Effect | 2.x |
| Motion | Framer Motion | 12.x |
| Charts | Recharts | 3.x |
| AI | Groq SDK (LLaMA 3.3) | — |
| Fonts | Geist (via `next/font`) | — |
| Testing | Jest + React Testing Library | 30.x / 16.x |
| CI/CD | GitHub Actions + Vercel | — |

---

## Features

- **Terminal Intro** — One-time animated terminal boot sequence on first visit (session-based, skippable).
- **Command Palette** — ⌘K / Ctrl+K overlay (also via the navbar chip) to jump to sections, toggle theme/language, download the CV, open the terminal, or open external profiles. Fully keyboard-navigable (arrows + Enter + Esc).
- **Interactive Terminal** — Persistent zsh-style terminal widget (Ctrl+` or navbar button) with `help`, `whoami`, `projects`, `skills`, `cv`, `contact`, `theme`, `lang`, `clear`, `exit`, command history via arrow keys, and a `sudo hire-me` easter egg.
- **GitHub Activity** — Live section fed by the GitHub API at the server (ISR, revalidated hourly): public repos, stars, followers, top-language bars, and recently updated repositories. Fails closed — the section simply doesn't render if the API is unavailable.
- **Navbar** — Fixed top navigation with smooth-scroll links, language toggle (EN / PT-BR), theme toggle (dark / light), and a responsive mobile hamburger menu.
- **Hero** — Profile photo, animated typewriter role description, social links (GitHub, LinkedIn, Email), and a downloadable CV (PDF).
- **Stats Counter** — Animated counters highlighting years of experience, projects delivered, and performance metrics.
- **Skills Slider** — Dual auto-scrolling carousels (opposite directions) with 19+ technology icons, plus a Recharts radar chart for expertise-area breakdown.
- **Projects Grid** — 18 projects in a filterable, paginated grid (6 shown initially, show-more paginates the rest). Each card opens a modal with description, tags, GitHub link, and live demo when available.
- **Timeline** — Horizontal (desktop) / vertical (mobile) career and education timeline with modal detail views per entry.
- **Contact** — Direct contact cards: Email, WhatsApp, LinkedIn, and GitHub.
- **Footer** — Back-to-top button and author credit.
- **AskFernando** — Floating AI chat assistant powered by **Groq (LLaMA 3.3-70b)**, with conversation history and bilingual support. API is rate-limited and validated server-side.
- **CustomCursor** — Custom animated cursor for pointer devices.
- **MouseSpotlight** — Subtle radial spotlight effect that follows the mouse.
- **AnimatedSection** — Scroll-triggered entrance animations (fadeUp, stagger, launch, reveal, flip) powered by Framer Motion with `prefers-reduced-motion` support.
- **Card → modal morph** — Project cards physically expand into their detail modal (Framer Motion shared layout animation).
- **Theme circular reveal** — Dark/light toggle paints the new theme outward from the clicked button via the View Transitions API (instant fallback for unsupported browsers and reduced-motion users).
- **Decrypt headings** — Section titles scramble terminal-style and resolve when scrolled into view (screen-reader copy stays intact; disabled for reduced motion).
- **SkipLink** — Accessibility skip-to-main-content link for keyboard navigation (`<main>` landmark present).
- **Internationalisation** — Full EN / PT-BR translation via `LanguageContext` (React Context + localStorage persistence).
- **Theme** — Dark / light mode via `ThemeContext` (React Context + localStorage persistence).
- **WCAG AA color system** — CSS custom properties (`--accent-teal`, `--accent-blue`, `--gradient-accent`) adapt automatically between dark (teal-400/blue-500) and light (teal-700 4.6:1 / blue-700 5.7:1) to meet WCAG AA contrast requirements in both modes.
- **Responsive design** — Mobile-first layout; all sections adapt from small screens to wide desktops.
- **Performance** — `next/image` lazy loading, `priority` on hero image, SSR via App Router, WebP assets, Geist font via `next/font` (zero layout shift), `optimizeCss` enabled. Scores: **95 Performance / 100 Accessibility** on PageSpeed Insights mobile.
- **SEO** — JSON-LD structured data (`Person` + `WebSite` schema), Open Graph image generated via `next/og`, canonical URL, `sitemap.xml` and `robots.txt` auto-generated by App Router.
- **Security** — Per-request CSP nonce (no `unsafe-eval` in production), HSTS, X-Frame-Options, rate limiting, input validation, fail-closed CORS, SHA-pinned GitHub Actions, Dependabot for automated dependency updates, and a centralised `env.ts` module that keeps server secrets out of client bundles. Full details in [`SECURITY.md`](./SECURITY.md).

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — metadata, JSON-LD, fonts, providers, global overlays
│   ├── page.tsx                # Page composition (TerminalIntro + all section components)
│   ├── globals.css             # Global styles, CSS custom properties, color tokens
│   ├── opengraph-image.tsx     # Dynamic OG image (1200×630) generated via next/og
│   ├── sitemap.ts              # Sitemap auto-generated by App Router
│   ├── robots.ts               # robots.txt auto-generated by App Router
│   └── api/
│       ├── chat/
│       │   └── route.ts        # AI chat endpoint (Groq, rate-limited, input-validated)
│       └── csp-report/
│           └── route.ts        # CSP violation report receiver (returns 204)
├── components/
│   ├── Navbar.tsx              # Fixed top nav, smooth scroll, language & theme toggles
│   ├── Hero.tsx                # Profile, typewriter, social links, CV download
│   ├── StatsCounter.tsx        # Animated statistics counters
│   ├── SkillsSlider.tsx        # Dual auto-scroll carousels + SkillsRadar
│   ├── SkillsRadar.tsx         # Recharts radar chart for expertise areas
│   ├── ProjectsGrid.tsx        # Filterable grid with modals (tag filter + show-more)
│   ├── Timeline.tsx            # Career & education timeline (horizontal/vertical) with modals
│   ├── Contact.tsx             # Contact links (Email, WhatsApp, LinkedIn, GitHub)
│   ├── Footer.tsx              # Back-to-top button and footer
│   ├── GitHubActivity.tsx      # Live GitHub stats section (server-fetched via ISR)
│   ├── AskFernando.tsx         # Floating AI chat widget (Groq-powered)
│   ├── CommandPalette.tsx      # ⌘K command palette overlay (navigate + actions)
│   ├── InteractiveTerminal.tsx # Persistent interactive terminal widget
│   ├── DecryptText.tsx         # Scramble-and-resolve heading animation
│   ├── TerminalIntro.tsx       # One-time terminal boot animation
│   ├── AnimatedSection.tsx     # Scroll-triggered Framer Motion wrapper
│   ├── CustomCursor.tsx        # Custom animated cursor
│   ├── MouseSpotlight.tsx      # Mouse-following radial spotlight overlay
│   ├── ScrollProgressBar.tsx   # Fixed top reading-progress bar
│   ├── SkipLink.tsx            # Accessibility skip-to-content link
│   └── ErrorBoundary.tsx       # React class ErrorBoundary for per-section failure isolation
├── context/
│   ├── LanguageContext.tsx     # EN / PT-BR language state (React Context + document.lang sync)
│   └── ThemeContext.tsx        # Dark / light theme state (React Context)
├── hooks/
│   ├── useEscapeKey.ts         # Shared Escape-key listener (eliminates duplicate useEffect patterns)
│   └── useFocusTrap.ts         # WCAG 2.4.7 focus trap for modal dialogs (save + restore focus)
└── lib/
    ├── env.ts                  # Centralised env-var access — server vars as functions, public as constants
    ├── github.ts               # Server-side GitHub API fetch for the GitHub Activity section
    ├── projects.ts             # Project data array extracted from ProjectsGrid
    ├── translations.ts         # All UI strings for EN and PT-BR
    └── uiEvents.ts             # Custom events for the command palette / terminal overlays

src/__tests__/                  # One test file per component + API route (Jest + RTL)
    └── hooks/                  # Hook-specific tests (useFocusTrap, useEscapeKey)
__mocks__/                      # Static file stubs for Jest
.github/
├── workflows/ci.yml            # CI: lint → test → build on every PR and push to main
└── dependabot.yml              # Automated npm + GitHub Actions update PRs (weekly, grouped)
SECURITY.md                     # Full security architecture documentation
public/
├── fernando-ghiberti-cv-en.pdf # Downloadable CV
└── images/
    └── move-it.svg             # Local placeholder image (replaces third-party placehold.co)
```

---

## Commands

```bash
# Install dependencies
npm install

# Development server (localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Run all tests (required before every PR)
npm test

# Run tests with coverage report
npm run test:coverage
```

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEY` | Yes | Groq API key used by `/api/chat` to power the AskFernando AI chat |
| `NEXT_PUBLIC_SITE_URL` | No | Full URL of the deployed site (e.g. `https://ghiberti85.vercel.app`). Used to restrict CORS on `/api/chat`. Defaults to permissive when unset. |
| `VERCEL_URL` | No | Injected automatically by Vercel. Used as fallback CORS origin when `NEXT_PUBLIC_SITE_URL` is not set. |
| `GITHUB_TOKEN` | No | Optional GitHub token to raise API rate limits for the GitHub Activity section. Unauthenticated access (60 req/h) is enough with hourly ISR. |

Create a `.env.local` file at the root with the variables above for local AI chat support.

---

## Highlighted Projects

| Project | Stack | Description |
|---|---|---|
| **DevInterviewLab** | Next.js, TypeScript, Supabase, Groq AI, PWA | AI-powered technical interview prep platform with study roadmaps and live coding practice |
| **Interview Command Center** | React, TypeScript, Vite, Supabase, Claude AI | Personal CRM for managing job interview pipelines with AI-powered recruiter responses |
| **Ghiberti UI** | React, TypeScript, Next.js, Storybook, Turborepo | Monorepo design system with 5 token themes and 30 accessible components |
| **Finanças do Casal** | React, TypeScript, Vite, Supabase, Claude AI, PWA | Collaborative personal finance PWA for couples with AI-powered spreadsheet import |
| **upload.ai** | React, TypeScript, Vite | AI-powered video title & description generator |
| **Ignite Call** | Next.js, React, TypeScript | Google Calendar scheduling integration |
| **Design System** | React, TypeScript, Storybook | Component library with GitHub Actions CD |
| **Pizza Shop** | React, TypeScript, Vite | Restaurant owner dashboard |
| **Feedget** | React, React Native, Node.js | Cross-platform feedback widget with PostgreSQL |
| **NLW Esports** | React, Node.js, React Native | Gaming partner finder |

---

## Professional Background (Summary)

| Role | Company | Period |
|---|---|---|
| Senior Software Engineer / Tech Lead | +A Educação | 2022 – Present |
| Software Engineer | EBANX | 2020 – 2022 |
| Fullstack Developer | Freelance | 2018 – Present |

Key achievements:
- Reduced page loading time by **38%** via Next.js SSR + lazy loading rebuild.
- Accelerated UI delivery by **50%** with a reusable React + Tailwind Design System documented in Storybook.
- Improved form conversion by **27%** and reduced abandonment by **25%** with dynamic validation and GTM integration.
- Delivered promotional landing pages **32% faster** using a modular React/Tailwind framework at EBANX.
- Maintained **>85% test coverage** and zero production-critical bugs across freelance projects.

---

## Education

- **Specialization in Software Engineering** — UNICAMP (2025)
- **MBA in Full Stack Development** — XP Educação (2020)
- **First Certificate in English (FCE)** — Cambridge Assessment English (2017)
- **Automation & Control Engineering** — Instituto Mauá de Tecnologia (2014) — *ABB Award for Best Final Graduation Project*

---

## Security

See [`SECURITY.md`](./SECURITY.md) for the full security architecture. Summary below.

### HTTP Layer (`next.config.ts` + `src/middleware.ts`)

| Header | Value |
|---|---|
| `Content-Security-Policy` | Per-request nonce via middleware. No `unsafe-eval` in production. `report-uri /api/csp-report`. |
| `X-Frame-Options` | `SAMEORIGIN` — prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` — blocks MIME-type sniffing |
| `Strict-Transport-Security` | Forces HTTPS with 2-year max-age and preload |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Disables camera, microphone, and geolocation access |

### `/api/chat` Route Hardening

| Protection | Detail |
|---|---|
| **Rate limiting** | 20 requests / IP / minute (sliding window). Returns HTTP 429 on excess. |
| **Role validation** | Only `"user"` and `"assistant"` roles accepted — prevents prompt injection via `role: "system"` |
| **Content validation** | Each message `content` must be a string ≤ 2,000 characters |
| **Lang validation** | `lang` restricted to `["en", "pt"]` — raw user input never reaches the system prompt |
| **CORS** | Fail-closed in production — returns 403 if origin doesn't match `NEXT_PUBLIC_SITE_URL` / `VERCEL_URL` |
| **API key guard** | Returns 503 if `GROQ_API_KEY` is not configured |

### Supply Chain

| Control | Detail |
|---|---|
| **SHA-pinned Actions** | All three GitHub Actions in `ci.yml` are pinned to exact commit SHAs (not floating tags) |
| **Dependabot** | Weekly PRs for npm packages and GitHub Actions; major-version bumps excluded; dev tooling grouped |
| **Centralised env vars** | `src/lib/env.ts` exposes server secrets only as functions — prevents accidental bundler inclusion in client chunks |

---

## Deployment

Vercel deployment is triggered automatically when a PR is merged to `main`. No manual deploy step is needed — merging IS deploying. The CI pipeline (`.github/workflows/ci.yml`) runs lint → test → build and must be green before merging.

---

## Contact

- **Email:** ghiberti85@gmail.com
- **LinkedIn:** [linkedin.com/in/fernando-ghiberti](https://linkedin.com/in/fernando-ghiberti)
- **GitHub:** [github.com/ghiberti85](https://github.com/ghiberti85)
