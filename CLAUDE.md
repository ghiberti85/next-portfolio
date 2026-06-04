# CLAUDE.md — AI Agent Instructions for next-portfolio

This file governs how AI agents (Claude Code and others) must work on this repository.
All rules below are mandatory. Follow them on every task without exception.

---

## Project Overview

Personal portfolio SPA built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**.
Single page composed of: Navbar → Hero → SkillsSlider → ProjectsGrid → Timeline → Contact → Footer.
Deployed automatically to Vercel on every push to `main`.

---

## Workflow — Mandatory for Every Change

### 1. Branch
Always work on a dedicated branch. Never commit directly to `main`.

```bash
git checkout -b <type>/<short-description>
# e.g. feat/add-dark-mode, fix/modal-close-button, docs/update-readme
```

Branch naming convention: `feat/`, `fix/`, `docs/`, `refactor/`, `security/`, `test/`.

### 2. Code
- Keep changes minimal and focused — no unrelated refactors.
- Do not add abstractions beyond what the task requires.
- Follow the existing code patterns in each file.
- No comments unless the WHY is non-obvious.
- No `console.log` in committed code (enforced by `removeConsole` in production).

### 3. Tests — Required for every functional change
Run the full test suite before committing:

```bash
npm test
```

**Rules:**
- Every new component or feature must ship with tests in `src/__tests__/<ComponentName>.test.tsx`.
- Every bug fix must include a regression test.
- When a component is removed, delete its test file too.
- Coverage threshold is **70% lines** (enforced by Jest). Do not lower it.
- Tests must pass locally before pushing.

Test commands:
```bash
npm test                  # run all tests once
npm run test:watch        # watch mode during development
npm run test:coverage     # run with coverage report
```

### 4. Lint & Build
Run lint and build before opening a PR:

```bash
npm run lint
npm run build
```

Both must pass with zero errors.

### 5. Commit
Write clear, conventional commit messages:

```
<type>(<scope>): <short summary>

- bullet detail if needed
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `security`, `chore`.

### 6. Pull Request
Always open a PR to merge into `main`. Never push directly.

PR checklist:
- [ ] Tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Build passes (`npm run build`)
- [ ] Tests added for new/changed functionality
- [ ] Documentation updated if the feature surface changed
- [ ] Security implications reviewed (see Security section)

Merge method: **squash**.

### 7. Documentation
Keep the following in sync after every change:

| File | Update when |
|---|---|
| `README.md` | Tech stack, features, project structure, or commands change |
| `CLAUDE.md` | Workflow, tooling, or project architecture changes |
| `src/__tests__/` | Any component is added, changed, or removed |

If you add a feature → add it to the README features section.
If you remove a feature → remove it from README, delete its tests, remove dead code.

### 8. Deploy
The Vercel deployment is triggered automatically when a PR is merged to `main`.
No manual deploy step is needed — merging IS deploying.
The CI pipeline (`ci.yml`) must be green before merging.

---

## Security Checklist

Review the following on every PR:

- [ ] No secrets, tokens, API keys, or credentials committed — use environment variables.
- [ ] No new `dangerouslyAllowSVG` usages without a tight `contentSecurityPolicy`.
- [ ] External URLs hardcoded in components must be trusted, static origins.
- [ ] New `remotePatterns` in `next.config.ts` must be limited to the exact hostname needed.
- [ ] HTTP security headers in `next.config.ts` must not be weakened.
- [ ] No `eval()`, `dangerouslySetInnerHTML`, or unescaped user input.
- [ ] Dependencies added via `npm install` must be audited with `npm audit`.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — metadata, fonts, global styles
│   ├── page.tsx            # Page composition (imports all section components)
│   └── globals.css
└── components/
    ├── Navbar.tsx           # Fixed top nav, smooth scroll, mobile hamburger
    ├── Hero.tsx             # Profile, typewriter, social links, CV download
    ├── SkillsSlider.tsx     # Dual auto-scroll carousels with skill proficiency bars
    ├── ProjectsGrid.tsx     # Filterable grid with modals (tag filter + pagination)
    ├── Timeline.tsx         # Career & education vertical timeline with modals
    ├── Contact.tsx          # Email, WhatsApp, LinkedIn, GitHub contact cards
    └── Footer.tsx           # Back-to-top button + author credit

src/__tests__/              # One test file per component
__mocks__/                  # Static file stubs for Jest
.github/workflows/ci.yml    # CI: lint → test → build on every PR and push to main
public/
└── fernando-ghiberti-cv-en.pdf
```

---

## Testing Conventions

- Use `@testing-library/react` — test behavior, not implementation.
- Do not test internal state or implementation details.
- Prefer `getByRole`, `getByText`, `getByLabelText` over `getByTestId`.
- Use `data-testid` only as a last resort when no semantic query works.
- Mock external dependencies (e.g. `typewriter-effect`, `next/image`, `next/font`) at the top of the test file.
- Each describe block maps to one component. Group tests by feature within the block.

Example structure for a new component `MyWidget`:
```
src/components/MyWidget.tsx
src/__tests__/MyWidget.test.tsx
```

Minimum test coverage per component:
- Renders without crashing
- Renders key content (headings, labels, links)
- Interactive behavior (clicks, toggles, modals)
- Edge cases relevant to the component's logic

---

## Tech Stack Reference

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Icons | Font Awesome React | 6.x |
| Carousel | React Slick | 0.30.x |
| Animation | Typewriter Effect | 2.x |
| Testing | Jest + React Testing Library | 30.x / 16.x |
| CI/CD | GitHub Actions + Vercel | — |

---

## Commands Reference

```bash
npm run dev            # start dev server at localhost:3000
npm run build          # production build (must pass before PR)
npm run lint           # ESLint check (must pass before PR)
npm test               # run all tests (must pass before PR)
npm run test:coverage  # tests + coverage report
```
