# Changelog

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

_No unreleased changes._

---

## [1.3.0] — 2026-05-30

### Added
- HTTP security headers configured globally in `next.config.ts`: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`
- Jest 30 + React Testing Library test infrastructure (28 tests, 6 suites)
- GitHub Actions CI pipeline: lint → test:coverage → build on every PR and push to `main`
- `CLAUDE.md` — mandatory workflow rules for AI agents
- `docs/ARCHITECTURE.md` — architecture overview, stack decisions, styling conventions
- `docs/COMPONENTS.md` — per-component reference with data shapes and constraints
- `docs/adr/` — Architecture Decision Records (ADRs 001–004)
- `.claude/commands/` — slash commands for AI agents: `/new-component`, `/add-project`, `/security-check`
- `CHANGELOG.md` (this file)
- npm scripts: `test`, `test:watch`, `test:coverage`

### Changed
- `next.config.ts` migrated to typed `NextConfig` export
- Removed deprecated `swcMinify` and `experimental.modern` options (Next.js 15 defaults)
- SVG sandbox CSP tightened to `script-src 'none'`

### Fixed
- Next.js upgraded from `15.1.6` to `15.1.11` to resolve React Server Components CVE

---

## [1.2.0] — 2026-05-18

### Added
- `README.md` fully rewritten in English for recruiters: tech stack table, features, project structure, highlighted projects, professional background, education, getting started, contact

---

## [1.1.0] — 2025-07-04

### Added
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
- `Timeline` — alternating vertical timeline with professional and education entries, modal detail view
- `Contact` — Email, WhatsApp, LinkedIn, GitHub contact cards
- `Footer` — back-to-top button and author credit
- Glassmorphism visual design system
- Responsive layout (mobile-first, `lg:` breakpoint for desktop)
- `next/image` optimization with WebP format and lazy loading
- Geist font via `next/font` for zero layout shift
- Vercel deployment with automatic preview URLs per PR
