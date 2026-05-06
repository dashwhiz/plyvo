# Plyvo

Mobile-first browser app that helps groups decide where to go by turning indecision into a short, playful ritual. Local-first, no backend, deployed as a static site.

> Pick. Spin. Go.

## Develop

```bash
npm install
npm run dev
```

App runs at http://localhost:3000.

Copy `.env.example` to `.env.local` and fill in values when needed (analytics is off in dev regardless).

## Scripts

| Script              | Purpose                              |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Dev server                           |
| `npm run build`     | Production static export → `out/`    |
| `npm run start`     | Serve a non-export build (rare)      |
| `npm run lint`      | ESLint                               |
| `npm run format`    | Prettier write                       |
| `npm run format:check` | Prettier check (CI)               |

## Stack

- **Next.js 16** (App Router) with `output: "export"` — pure static site.
- **CSS Modules** + CSS variable design tokens (no Tailwind).
- **Zustand** for state, persisted to `localStorage` via the `persist` middleware.
- **Motion** (framer-motion) for ritual animations.
- **canvas-confetti** for the winner pop.
- **GA4** via `next/script`, gated on `NEXT_PUBLIC_GA_ID` and disabled outside production.

## Structure

```
src/
  app/         routing, layouts, pages
  components/  shared UI (incl. layout primitives Stack/Row/Box, Analytics)
  hooks/       shared hooks (use*Pools/Settings/History/LocalStorage)
  lib/         analytics, random, storage, motion configs, cn
  rituals/     spin/, plyvo/, dice/ — each a self-contained reveal mode
  screens/     one folder per route — composes components
  stores/      zustand stores (pools, settings, history, ritual)
  strings/     en.ts — single source of user-facing copy
  types/       data model: Pool, Option, HistoryEntry, AppSettings, RevealMode
docs/          design + product reference
public/
```

Path alias: `@/*` → `src/*`.

## Environment

| Variable             | Use                                                              |
| -------------------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_GA_ID`  | GA4 Measurement ID (e.g. `G-XXXXXXXXXX`). Empty disables GA.     |
| `PLYVO_BASE_PATH`    | Static-export base path (e.g. `/plyvo` for GH Pages project).    |

## Documentation

In-depth design and product docs live in [`docs/`](./docs):

- [`00-product`](./docs/00-product.md) — goals, scope, screens
- [`01-architecture`](./docs/01-architecture.md) — stack, file layout, conventions
- [`02-data-model`](./docs/02-data-model.md) — types, validation, storage
- [`03-design-system`](./docs/03-design-system.md) — colors, type, motion
- [`04-rituals`](./docs/04-rituals.md) — Spin / Plyvo / Dice animation design
- [`05-deploy`](./docs/05-deploy.md) — static export and GitHub Pages
- [`06-analytics`](./docs/06-analytics.md) — GA4 events and privacy posture

## Privacy

No accounts. No backend. All data lives in your browser's `localStorage`.
Analytics, when enabled, sends anonymous event counts only — no pool titles,
option names, or any user content. See [`docs/06-analytics`](./docs/06-analytics.md).
