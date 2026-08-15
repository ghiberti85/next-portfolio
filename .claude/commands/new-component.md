# /new-component

Scaffolds a new section component following the project's conventions.

## Usage

```
/new-component <ComponentName>
```

Example: `/new-component Testimonials`

## Steps to execute

1. **Create `src/components/<ComponentName>.tsx`** with:
   - `"use client"` directive at the top
   - A section element with `id="<componentname>"` (lowercase) and `py-12 lg:py-20 px-4` padding
   - The glassmorphism card pattern for any card-like UI: use the shared `.glass-card`
     utility class from `globals.css` — never hand-roll the
     `background`/`backdrop-filter`/`border` triplet inline
   - Section heading matching the existing sections — gradient `h2` wrapping `DecryptText`,
     with the title coming from `translations.ts` (never a hardcoded string):
     ```tsx
     <h2 className="text-4xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
       <DecryptText text={tr.title} />
     </h2>
     ```
   - TypeScript interface for the component's data shape (if applicable)
   - Data array defined at the top of the file (not fetched from API)

2. **Add UI strings to `src/lib/translations.ts`**:
   - Add the section's strings under `t.en.<componentname>` and mirror them key-for-key
     under `t.pt.<componentname>` (both languages are mandatory)

3. **Create `src/__tests__/<ComponentName>.test.tsx`** with:
   - `renders the section heading` test
   - `renders key content` test (at least one item from the data)
   - Interaction tests (modals, toggles, clicks) if applicable
   - All tests must pass before committing

4. **Add to `src/components/IntroGate.tsx`** (NOT `page.tsx` — the page sequence lives in `IntroGate`):
   - Import the component
   - Wrap it as the other sections are: `<ErrorBoundary><AnimatedSection variant="..." delay={0.05}><ComponentName /></AnimatedSection></ErrorBoundary>`
   - Do not skip the `ErrorBoundary` wrapper on a data-dependent section
   - Do not wrap it in `AnimatedSection` if it is an LCP candidate (see `docs/COMPONENTS.md` → Page composition)

5. **Add to `src/components/Navbar.tsx`** `links` array if it is a full-page section:
   ```ts
   { name: "<ComponentName>", href: "#<componentname>" }
   ```
   (the link label must come from translations, like the existing links)

6. **Update documentation**:
   - Add entry to `docs/COMPONENTS.md`
   - Add feature bullet to `README.md`
   - Add entry to `CHANGELOG.md` under `Unreleased`

7. **Run and verify**:
   ```bash
   npm test
   npm run lint
   npm run build
   ```
   All must pass before opening a PR.

## Do not

- Fetch data from an API — all data is static arrays in the component file (see ADR-005 for the only exceptions)
- Skip the test file — every component requires tests
- Hand-roll glassmorphism styles — always use the `.glass-card` class
- Hardcode section titles or UI strings — everything goes through `translations.ts` (EN + PT-BR)
- Use CSS Modules or styled-components — Tailwind only
