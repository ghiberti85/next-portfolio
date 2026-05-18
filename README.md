# Fernando Ghiberti — Personal Portfolio

A modern, performant personal portfolio built with **Next.js 15**, **TypeScript**, and **Tailwind CSS** — showcasing professional experience, technical skills, and personal projects in a clean, animated single-page application.

**Live:** [ghiberti85.vercel.app](https://ghiberti85.vercel.app) &nbsp;|&nbsp; **Author:** [Fernando Ghiberti](https://linkedin.com/in/fernando-ghiberti) &nbsp;|&nbsp; **License:** MIT

---

## Overview

This portfolio is designed to give recruiters and hiring managers a fast, clear view of Fernando's engineering profile — from his tech stack and open-source projects to his career journey and education. Everything is accessible from a single, scroll-based page with interactive modals and smooth animations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Font Awesome (React) |
| Animations | Typewriter Effect |
| Carousel | React Slick |
| Fonts | Geist (via `next/font`) |
| Deployment | Vercel |

---

## Features

- **Hero section** — Profile photo, name, animated typewriter role description, links to GitHub, LinkedIn, email, and a downloadable CV (PDF).
- **Skills Slider** — Dual auto-scrolling carousels (opposite directions) showcasing 19+ technologies with proficiency bars: React, Next.js, TypeScript, JavaScript, Tailwind CSS, Docker, Git, Webpack, Vite, Storybook, Sass, WordPress, HubSpot, Netlify, Vercel, and more.
- **Projects Grid** — 12 projects displayed in a filterable, paginated grid. Each card opens a modal with description, GitHub link, and live demo when available. Projects can be filtered by technology tag (React, Next.js, Node.js, TypeScript, etc.).
- **Journey Timeline** — Interactive vertical timeline covering professional experience and education, with modal detail views per entry.
- **Contact section** — Direct contact form / links.
- **Responsive design** — Mobile-first layout; all sections adapt gracefully from small screens to wide desktops.
- **Performance optimizations** — `next/image` with lazy loading and `priority` on the hero image, SSR via Next.js App Router, WebP-ready image pipeline, and Geist font with `next/font` for zero layout shift.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with metadata and fonts
│   ├── page.tsx          # Single-page composition
│   └── globals.css       # Global styles
└── components/
    ├── Navbar.tsx
    ├── Hero.tsx           # Profile, social links, CV download
    ├── SkillsSlider.tsx   # Dual auto-scroll skill carousels
    ├── ProjectsGrid.tsx   # Filterable project grid with modals
    ├── Timeline.tsx       # Career & education timeline with modals
    ├── Contact.tsx
    └── Footer.tsx
public/
└── fernando-ghiberti-cv-en.pdf   # Downloadable CV
```

---

## Highlighted Projects

| Project | Stack | Description |
|---|---|---|
| **upload.ai** | React, TypeScript, Vite | AI-powered video title & description generator |
| **Ignite Call** | Next.js, React, TypeScript | Google Calendar scheduling integration |
| **Design System** | React, TypeScript, Storybook | Component library with GitHub Actions CD |
| **Coffee Delivery** | React, TypeScript, Vite | Shopping cart manager |
| **Pizza Shop** | React, TypeScript, Vite | Restaurant owner dashboard |
| **Feedget** | React, React Native, Node.js | Cross-platform feedback widget with PostgreSQL |
| **Be The Hero** | React, Node.js, React Native | NGO donation connector (OmniStack) |
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

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Production build
npm run build
npm start

# Lint
npm run lint
```

---

## Contact

- **Email:** ghiberti85@gmail.com
- **LinkedIn:** [linkedin.com/in/fernando-ghiberti](https://linkedin.com/in/fernando-ghiberti)
- **GitHub:** [github.com/ghiberti85](https://github.com/ghiberti85)
