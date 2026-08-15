# Component Reference

Section components own their data and local UI state. Cross-cutting concerns (language, theme,
palette/terminal visibility) go through `LanguageContext`, `ThemeContext`, or the `uiEvents`
CustomEvent bus in `src/lib/uiEvents.ts` — components do not reach into each other directly.

---

## Page composition

**Files:** `src/app/page.tsx` (Server Component) → `src/components/IntroGate.tsx` (Client Component)

`page.tsx` is an `async` Server Component: it calls `getGitHubStats()` (ISR, `revalidate = 3600`)
and passes the result straight into `<IntroGate github={...} />`. All client-side state (terminal
intro visibility, `sessionStorage`, dynamic imports with `ssr: false`) lives in `IntroGate`, which
is what actually sequences the page:

```
IntroGate
├── <Navbar />
└── <main id="main-content">
    ├── <Hero />          fadeUp
    ├── <SkillsSlider />  stagger  (dynamic import, ssr: false)
    ├── <ProjectsGrid />  launch
    ├── <Timeline />      reveal
    ├── <GitHubActivity data={github} />  fadeUp
    └── <Contact />       flip
└── <Footer />            fadeUp
```

Each section (except Hero and Contact) is wrapped in `<ErrorBoundary>` for per-section failure
isolation, and every section is wrapped in `<AnimatedSection variant="...">` for its scroll-in
animation. `TerminalIntro` renders on top of everything on first visit per browser session
(`sessionStorage["portfolio-intro-seen"]`) and crossfades out once dismissed.

### Do not
- Move data fetching into `IntroGate` — it must stay a Client Component; all server-only work
  (GitHub API, secrets) belongs in `page.tsx` or `src/lib/*.ts`.
- Skip the `ErrorBoundary` wrapper on a new data-dependent section.

---

## Navbar

**File:** `src/components/Navbar.tsx`
**Type:** Client Component
**Responsibility:** Fixed top navigation with smooth-scroll links, language/theme toggles, and the command-palette/terminal trigger chips.

### Behavior
- Fixed at the top with `z-50` and `backdrop-blur-lg` background.
- Desktop: horizontal link list (hidden below `lg`) plus a `⌘K` chip and a terminal (`>_`) icon button.
- Mobile: hamburger button toggles a vertical dropdown containing the same links, language/theme controls.
- Clicking a link smooth-scrolls to the target section by `id` and closes the mobile menu.
- Theme toggle passes the click's `{x, y}` into `toggleTheme()` so the circular reveal animation originates from the button.

### Local state
| State | Type | Purpose |
|---|---|---|
| `isMobileMenuOpen` | `boolean` | Controls mobile menu visibility |

### Sections targeted
`#hero`, `#skills`, `#projects`, `#timeline`, `#contact`

### Do not
- Add authentication or user-specific items.
- Change `z-50` — it must stay above section content and below modal overlays (`z-[120]`+).

---

## Hero

**File:** `src/components/Hero.tsx`
**Type:** Client Component
**Responsibility:** Full-screen introduction with profile photo, typewriter role description, social links, CV download, and the stats counter.

### Layout
Two-column (`lg:flex-row`): left = glassmorphism card with photo, name, role, social icons, CV button. Right = typewriter headline, description, `<StatsCounter />`.

### Key elements
| Element | Detail |
|---|---|
| Profile photo | `next/image` from `github.com/ghiberti85.png`, `priority` + `loading="eager"` (LCP element) |
| Typewriter | `typewriter-effect` (dynamic import, `ssr: false`); separate string sets for mobile vs. desktop |
| Social icons | GitHub, LinkedIn, Email — Font Awesome brand icons |
| CV download | `<a href="/fernando-ghiberti-cv-en.pdf" download>` |

### Do not
- Remove `priority`/`loading="eager"` from the profile image — it is the LCP element.
- Load Typewriter with SSR enabled — it is intentionally `ssr: false`.
- Add a contact form here — that belongs in `<Contact />`.

---

## StatsCounter

**File:** `src/components/StatsCounter.tsx`
**Type:** Client Component
**Responsibility:** Animated count-up statistics (years of experience, projects delivered, performance gain, bug reduction) rendered inside `<Hero />`.

### Behavior
- Each stat animates independently once it enters the viewport (`IntersectionObserver`, threshold 0.5).
- Count-up uses `easeOutExpo` (`1 - 2^(-10t)`) over 1400ms — slow start, explosive finish.
- Data comes from `t[lang].stats` in `translations.ts`.

### Do not
- Start the count-up before the element is visible — the `IntersectionObserver` gate is what makes the animation feel intentional on scroll.

---

## SkillsSlider

**File:** `src/components/SkillsSlider.tsx`
**Type:** Client Component (loaded via `dynamic(..., { ssr: false })` in `IntroGate`)
**Responsibility:** Two opposite-direction auto-scrolling carousels of technology icons, plus `<SkillsRadar />` underneath.

### Data shape
```ts
interface Skill {
  name: string;
  icon: string; // absolute CDN URL, or a local /skills/*.svg path
}
```
34 skills, defined in the `skills` array at the top of the file, split at the midpoint (first half →
LTR slider, second half → RTL slider via `rtl={true}`). Icons come from `cdn.jsdelivr.net`
(devicons) or are self-hosted under `public/skills/` when no reliable CDN source exists.
`skillGlow` maps a skill name to a brand-colored `rgba()` used for the hover glow; unmapped skills
fall back to a teal glow.

### Slider config
- `autoplay: true`, `autoplaySpeed: 2000`, `infinite: true`
- `slidesToShow: 5` desktop, `3` at `<1024px`, `2` at `<640px`
- No arrows, no dots

### Do not
- Add click handlers to skill cards — they are hover/display-only.
- Drop `autoplaySpeed` below ~1500ms — causes visual jitter on low-end devices.
- Reintroduce `cdn.simpleicons.org` — it blocks server-side requests from `next/image` and was removed from `remotePatterns`/CSP for that reason.

---

## SkillsRadar

**File:** `src/components/SkillsRadar.tsx`
**Type:** Client Component
**Responsibility:** Recharts radar chart summarizing expertise areas (Frontend, Backend, AI/APIs, UI/Design, CMS, DevOps), rendered inside `SkillsSlider`.

### Behavior
- Data (`radarData`) comes from `t[lang].skills.radarData`.
- Stroke/fill/grid/tooltip colors adapt to the active theme via `useTheme()`.

### Do not
- Hardcode teal/blue hex values — read them conditionally from `theme === "light"` to stay WCAG AA compliant in both modes (see Color System in `CLAUDE.md`).

---

## ProjectsGrid

**File:** `src/components/ProjectsGrid.tsx`
**Type:** Client Component
**Responsibility:** Filterable, paginated project grid (18 projects) with a card → modal morph detail view.

### Data shape
```ts
// src/lib/projects.ts
interface Project {
  title: string;
  image: string;   // absolute URL or local path
  github: string;  // repo URL
  live: string;     // live demo URL, or "" if none
  tags: string[];
}
```
Descriptions live separately in `t[lang].projectDescriptions`, indexed positionally against the
`projects` array (not embedded in the `Project` object).

### Local state
| State | Type | Purpose |
|---|---|---|
| `visibleProjects` | `number` | How many cards to show (starts at 6) |
| `selectedProject` | `Project \| null` | Currently open modal |
| `activeTag` | `string \| null` | Active filter tag (`null` = All) |

### Behavior
- Default: 6 projects visible; "Show More" reveals the rest (button toggles to "Show Less").
- Tag filter: selecting a tag shows only matching projects and shows all of them (no pagination while filtered).
- Card click opens a modal; the card and the modal share a Framer Motion `layoutId={`project-${title}`}` so the card visually morphs into the modal.
- The modal's close button carries an explicit `z-10` (defensive stacking guard against the `layoutId` projection) and sits over the project image, well above where the title starts.
- The `live` link only renders when `project.live` is non-empty.
- Card tilt (`perspective`/`rotateX`/`rotateY` on mouse move) mutates the DOM ref directly — no React re-render per `mousemove` — and is skipped under `prefers-reduced-motion`.

### Do not
- Fetch project data remotely — keep it in `src/lib/projects.ts`.
- Remove the `layoutId` pairing between card and modal without keeping both elements' `layoutId` strings identical (Framer Motion matches by string).
- Drop the initial visible count below 6 without updating `ProjectsGrid.test.tsx`.

---

## Timeline

**File:** `src/components/Timeline.tsx`
**Type:** Client Component
**Responsibility:** Career/education timeline — horizontal scroll-track on desktop (professional entries above the line, education below), a left-rail vertical layout on mobile — with a modal detail view.

### Data shape
```ts
// src/lib/translations.ts
interface TimelineItemData {
  title: string;
  period: string;
  type: "professional" | "education";
  institution: string;
  details: string[]; // bullet points shown in the modal
}
```
Data lives in `t[lang].timeline.items` (no `location` field — removed as dead data in the 1.13.0 cleanup).

### Layout
- Desktop (`lg:`): horizontal scroll track with a centered gradient line, fully filled statically (the whole row is visible without vertical scrolling, so a scroll-scrubbed fill only ever looked half-drawn); professional cards anchored above it, education cards below; a colored `<Dot>` (teal/blue) sits between each card and the line. Scroll arrows shift by 320px.
- Mobile: left-rail vertical line, cards full-width to the right of the rail, dot centered on the line at each card. `useScroll` + `useSpring` still drive this line's fill progress as the section scrolls into view, since cards are revealed progressively down the page.

### Local state
| State | Type | Purpose |
|---|---|---|
| `selectedItem` | `TimelineItemData \| null` | Currently open modal |

### Do not
- Change the desktop/mobile breakpoint without testing both the horizontal track and the left-rail layout.
- Remove the `pr-12` on the modal title (`h3`) — it reserves space so long titles wrap before reaching the close button instead of rendering underneath it (regression fixed in 2.1.0).

---

## GitHubActivity

**File:** `src/components/GitHubActivity.tsx`
**Type:** Client Component, fed by server data
**Responsibility:** Renders live GitHub stats (public repos, stars, followers), a top-languages bar chart, and recently updated repos. No "view full profile" CTA — the GitHub link already lives in `<Contact />`.

### Data flow
`page.tsx` (Server Component) calls `getGitHubStats()` from `src/lib/github.ts` at request time
with `revalidate = 3600` (ISR, 1h) and passes the result down through `IntroGate` as the `data` prop.
`github.ts` fetches `/users/{login}` and `/users/{login}/repos`, excludes forks, computes language
percentages, and **fails closed**: any error (network, non-2xx, thrown exception) returns `null`.

### Props
| Prop | Type | Purpose |
|---|---|---|
| `data` | `GitHubStats \| null` | When `null`, the component renders nothing — no loading state, no error message |

### Do not
- Fetch client-side — the point of the ISR pattern is a cached, server-rendered snapshot with no client waterfall.
- Render a fallback UI when `data` is `null` — silence is the intended fail-closed behavior.
- Add the optional `GITHUB_TOKEN` as a bare `process.env` read — it must go through `src/lib/env.ts`.

---

## Contact

**File:** `src/components/Contact.tsx`
**Type:** Client Component
**Responsibility:** Four contact channel cards: Email, WhatsApp, LinkedIn, GitHub.

### Cards
| Card | href |
|---|---|
| Email | `mailto:ghiberti85@gmail.com` |
| WhatsApp | `https://wa.me/5511996186115?text=...` |
| LinkedIn | `https://linkedin.com/in/fernando-ghiberti` |
| GitHub | `https://github.com/ghiberti85` |

### Do not
- Add a contact form with a backend handler without first writing an ADR — see ADR-002 (superseded) and ADR-005 for the current API-routes policy.
- Drop `rel="noopener noreferrer"` from any `target="_blank"` link.
- Add a new channel without a matching Font Awesome icon.

---

## Footer

**File:** `src/components/Footer.tsx`
**Type:** Client Component
**Responsibility:** Author credit line and a floating "Back to Top" button that appears once the user scrolls past the skills section.

### Local state
| State | Type | Purpose |
|---|---|---|
| `showBackToTop` | `boolean` | Controls button visibility, driven by a `window.scroll` listener compared against `#skills`' offset |

### Do not
- Add navigation links — they belong in `<Navbar />`.
- Add social links — they live in `<Hero />` and `<Contact />`.

---

## AskFernando

**File:** `src/components/AskFernando.tsx`
**Type:** Client Component (loaded via `dynamic()` in `layout.tsx`)
**Responsibility:** Floating AI chat widget answering questions about Fernando's skills/experience, powered by Groq via `/api/chat`.

### Behavior
- Floating button (bottom-left) opens a chat panel; `useEscapeKey` closes it.
- Sends the conversation (minus the initial greeting) plus the active `lang` to `/api/chat`.
- Aborts any in-flight request on unmount or before sending a new message (`AbortController`).
- Maps HTTP 429 → rate-limit message, other non-OK statuses → generic server-error message, network failures → network-error message — all via `t[lang].askFernando`.
- Resets to the greeting message whenever the language changes.

### Do not
- Call the Groq SDK from the client — the key is server-only (`src/lib/env.ts`).
- Interpolate raw user input into the LLM prompt without going through the `/api/chat` allowlists (role, length, `lang`).

---

## CommandPalette

**File:** `src/components/CommandPalette.tsx`
**Type:** Client Component (loaded via `dynamic()` in `layout.tsx`)
**Responsibility:** ⌘K/Ctrl+K overlay for navigating the page and triggering global actions.

### Behavior
- Opens on `Ctrl/Cmd+K` or the `OPEN_PALETTE_EVENT` custom event (dispatched by the Navbar's `⌘K` chip).
- Filters a fixed command list (scroll-to-section, toggle theme, switch language, download CV, open terminal, open GitHub/LinkedIn, send email) by label/keywords as the user types.
- Arrow keys move the selection, `Enter` runs the highlighted command, `Escape` or an outside click closes it.
- Focus-trapped (`useFocusTrap`) and closes on `Escape` (`useEscapeKey`).

### Do not
- Hardcode section hrefs outside `scrollTo()` — keep every navigation command going through the same helper so behavior stays consistent with the Navbar.
- Add a command that requires a network call — the palette must open and filter instantly.

---

## InteractiveTerminal

**File:** `src/components/InteractiveTerminal.tsx`
**Type:** Client Component (loaded via `dynamic()` in `layout.tsx`)
**Responsibility:** Persistent, always-available terminal widget (distinct from the one-time `TerminalIntro`) with a small command set.

### Behavior
- Opens on `Ctrl+\`` or the `OPEN_TERMINAL_EVENT` custom event (Navbar button, or the palette's "open terminal" command).
- Commands: `help`, `whoami`, `projects`, `skills`, `cv`, `contact`, `theme`, `lang en|pt`, `clear`, `exit`, plus the `sudo hire-me` easter egg.
- Keeps a command history navigable with `ArrowUp`/`ArrowDown`.
- `theme`/`lang` commands call the same `useTheme`/`useLanguage` setters the Navbar uses — no parallel state.

### Do not
- Add a command that mutates data — this is a portfolio, not an admin console; keep it read-only/navigational.
- Duplicate the command list in `CommandPalette` — "open terminal" should delegate here, not reimplement terminal commands as palette commands.

---

## DecryptText

**File:** `src/components/DecryptText.tsx`
**Type:** Client Component
**Responsibility:** Scrambles a heading's characters and resolves them to the real text once the element scrolls into view.

### Props
| Prop | Type | Purpose |
|---|---|---|
| `text` | `string` | The text to reveal |
| `className` | `string?` | Applied to the wrapping `<span>` |

### Behavior
- Renders the real text in an `sr-only` span (always in the accessible tree) and an `aria-hidden` span that animates.
- Animates once per mount, gated by `IntersectionObserver` (threshold 0.5).
- Skips the animation entirely under `prefers-reduced-motion` — the real text renders immediately.

### Do not
- Animate the `sr-only` copy — screen readers must always get the final text, not the scramble frames.
- Reuse the same `DecryptText` instance for text that changes after the reveal — it does not re-arm itself for text updates post-mount within the same viewport entry.

---

## TerminalIntro

**File:** `src/components/TerminalIntro.tsx`
**Type:** Client Component
**Responsibility:** One-time typewriter-style terminal boot sequence shown before the site reveals on a visitor's first session.

### Behavior
- Types out a fixed sequence of `{ cmd, out }` lines (from `t[lang].terminal.lines`) character by character.
- `onDone` fires after the last line finishes (plus a short pause); `IntroGate` marks `sessionStorage["portfolio-intro-seen"]` and crossfades to the real page.
- A "Skip intro" button calls `onDone` immediately.

### Do not
- Slow down `SPEED_CMD`/`SPEED_OUT`/`PAUSE_BETWEEN` — they were tuned down once already to fix an LCP/Speed-Index regression (see CHANGELOG 1.9.0).

---

## AnimatedSection

**File:** `src/components/AnimatedSection.tsx`
**Type:** Client Component (loaded via `dynamic()` in `IntroGate`)
**Responsibility:** Wraps a section in a Framer Motion scroll-triggered entrance animation.

### Variants
`fadeUp`, `stagger`, `launch`, `reveal`, `flip` — see the `variants` map in the file for exact transforms/easing.

### Do not
- Add a new variant without also respecting `useReducedMotion()` — every variant renders as a plain `<div>` (no animation) when the user prefers reduced motion.
- Animate non-`transform`/`opacity` properties — keeps every entrance at 60fps.

---

## CustomCursor

**File:** `src/components/CustomCursor.tsx`
**Type:** Client Component
**Responsibility:** Replaces the system cursor with a snapping dot + lagging ring on fine-pointer devices.

### Do not
- Enable on touch devices or under `prefers-reduced-motion` — both are already gated via `matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)")`.
- Animate via React state — the dot/ring positions are written directly to `style.transform` inside a `requestAnimationFrame` loop to avoid re-renders.

---

## MouseSpotlight

**File:** `src/components/MouseSpotlight.tsx`
**Type:** Client Component
**Responsibility:** Subtle radial teal spotlight that follows the cursor on desktop.

### Do not
- Render on mobile — it's `hidden lg:block` and `pointer-events-none`/`aria-hidden` by design.

---

## ScrollProgressBar

**File:** `src/components/ScrollProgressBar.tsx`
**Type:** Client Component
**Responsibility:** Fixed top bar showing scroll progress across the whole page.

### Do not
- Remove the `useSpring` smoothing on `scrollYProgress` — the raw value alone feels jumpy.

---

## SkipLink

**File:** `src/components/SkipLink.tsx`
**Type:** Client Component
**Responsibility:** "Skip to main content" link for keyboard users, targeting `#main-content` (the `<main>` in `IntroGate`).

### Do not
- Hide it with `clip`/`display:none` tricks — it must stay in the accessible tree and pass both Lighthouse's and axe-core's focusable-link audits (see CHANGELOG 1.8.0 for the iteration history).

---

## ErrorBoundary

**File:** `src/components/ErrorBoundary.tsx`
**Type:** Client Component, React class component
**Responsibility:** Catches render errors in the section it wraps and shows a small fallback instead of crashing the whole page.

### Do not
- Wrap the entire page in a single `ErrorBoundary` — each data-dependent section gets its own instance so one section's failure doesn't take down the rest.

---

## Adding a New Component

1. Create `src/components/MyComponent.tsx`.
2. Add `"use client"` if it uses state, effects, or browser APIs.
3. Reuse `useEscapeKey`/`useFocusTrap` for any new modal or overlay instead of reimplementing them.
4. Use the `.glass-card` utility and the `--accent-teal`/`--accent-blue`/`--gradient-accent` CSS variables for any card-like UI (see `docs/ARCHITECTURE.md`).
5. Create `src/__tests__/MyComponent.test.tsx` with at minimum: renders without crashing, key content is visible, interactions work.
6. Import and place it in `IntroGate.tsx` (page sections) or `layout.tsx` (global overlays) in the correct sequence.
7. Add a section `id` for Navbar/CommandPalette scroll targeting if it's a full page section.
8. Update `README.md`, this file, and `CHANGELOG.md`.

## Removing a Component

1. Delete `src/components/MyComponent.tsx` and `src/__tests__/MyComponent.test.tsx`.
2. Remove its import/usage from `IntroGate.tsx` or `layout.tsx`.
3. Remove its `id` from Navbar/CommandPalette targets if applicable.
4. Update `README.md`, this file, and `CHANGELOG.md`.
