# Architecture

## Stack

| Concern             | Choice                                 | Why                                                                         |
| ------------------- | -------------------------------------- | --------------------------------------------------------------------------- |
| Framework           | Next.js 16 (App Router)                | Already installed; static export supported.                                 |
| Rendering           | Static export (`output: 'export'`)     | No server, free hosting (GitHub Pages first, custom domain later).          |
| Styling             | CSS Modules + CSS variables for tokens | Bespoke arcade visuals; clean JSX (no 30-class strings); zero new deps.     |
| Layout primitives   | `Stack`, `Row`, `Box` components       | Replace Tailwind's only real win (layout utilities) with 3 small components |
| Animation           | `motion` (framer-motion v11)           | Springs, gestures, layout anims; covers Spin/Plyvo/Dice with one model.     |
| State (in-memory)   | Zustand                                | Tiny, hookable, great for UI state across rituals.                          |
| Persistence         | Zustand `persist` middleware           | Single versioned envelope in `localStorage` (see `02-data-model`).          |
| IDs                 | `nanoid`                               | 21-char URL-safe IDs.                                                       |
| Confetti / win FX   | `canvas-confetti`                      | ~5kb, fires from a single call on winner reveal.                            |
| Sound (deferred)    | `howler` + a thin hook                 | `settings.soundEnabled` already in the model; wire after Spin works.        |
| Class composition   | `clsx`                                 | Conditional class joins; no `tailwind-merge` needed.                        |
| Lint / format       | ESLint (already), Prettier (add)       | Consistent formatting.                                                      |

### Why CSS Modules over Tailwind

- The arcade look depends on bespoke CSS (conic gradients for the wheel, 3D transforms for the die, layered glow shadows, scanline overlays). In Tailwind that becomes long arbitrary-value strings — worst of both worlds.
- The 500-line file cap is easier to keep when styling moves out of JSX entirely.
- Tokens (`--teal`, `--gold`, …) live once in `globals.css` and are consumed by every module — same DX win as a Tailwind theme without the toolchain.

### Notes on other choices

- **Motion library.** Framer Motion handles wheel rotation (spring → ease-out), card cycling (`AnimatePresence`), and dice tumble (rotateX/Y) with one mental model. GSAP is more powerful but overkill and has a license consideration.
- **No `react-three-fiber`.** Dice mode uses CSS 3D transforms — cheaper and matches the flat retro look better than realistic 3D.
- **No router for state.** Pool / mode / ritual progression lives in Zustand or URL params. Route changes only at top-level screens.

## Top-level routes

```
/                        Home
/pool/[id]               Pool Builder
/pool/[id]/mode          Reveal mode picker
/pool/[id]/ritual/[mode] Ritual screen
/pool/[id]/winner        Winner screen
```

All client-rendered. Each `page.tsx` is a thin wrapper that mounts a screen component from `src/screens/`.

## File layout

```
src/
  app/                       routing only
    layout.tsx
    page.tsx
    pool/[id]/page.tsx
    pool/[id]/mode/page.tsx
    pool/[id]/ritual/[mode]/page.tsx
    pool/[id]/winner/page.tsx
    globals.css
  screens/                   one folder per screen, composes components
    home/
    pool-builder/
    reveal-mode/
    ritual/
    winner/
  components/                shared UI primitives (each .tsx + .module.css)
    Analytics.tsx             gtag injection + route listener (no-op without GA ID)
    AppShell.tsx
    Button.tsx
    Card.tsx
    EmojiPicker.tsx
    NeonBadge.tsx
    layout/                  layout primitives — replace Tailwind utilities
      Stack.tsx              vertical flex with gap prop
      Row.tsx                horizontal flex with gap prop
      Box.tsx                styled div with padding/radius/bg props
    ...
  rituals/                   ritual modes — each isolated, < 500 lines
    spin/
      SpinRitual.tsx
      SpinWheel.tsx
      useSpinAnimation.ts
    plyvo/
      PlyvoRitual.tsx
      PlyvoCardStack.tsx
      usePlyvoSequence.ts
    dice/
      DiceRitual.tsx
      DiceCube.tsx
      useDiceRoll.ts
  hooks/
    useLocalStorage.ts
    usePools.ts
    useHistory.ts
    useSettings.ts
    useReducedMotion.ts
    useSound.ts
  lib/
    analytics.ts             typed GA4 track() + path scrubbing
    random.ts                unbiased winner selection (crypto.getRandomValues)
    storage.ts               versioned localStorage envelope
    ids.ts                   nanoid wrapper
    cn.ts                    clsx wrapper
    motion.ts                shared spring/ease configs for ritual modes
  stores/
    pools.ts                 Zustand store for pools
    settings.ts
    history.ts
    ritual.ts                ephemeral state during a reveal
  types/
    index.ts                 RevealMode, Option, Pool, HistoryEntry, AppSettings
  strings/                   user-facing copy — single source for future i18n
    en.ts                    flat-ish object, grouped by feature
    index.ts                 re-exports active locale
docs/
public/
```

### Why split screens vs components vs rituals

- **`screens/`** owns layout and data wiring for one route.
- **`components/`** holds reusable primitives — no business logic.
- **`rituals/`** is its own domain because each mode has bespoke animation logic that should not leak into shared components. Each mode lives behind a small interface (props: `options`, `onWinner`) so swapping/adding modes is trivial.

## Conventions

- **~500-line guideline per file.** Soft target. If a file is at 600 and splitting would create artificial seams or a leaky abstraction, leave it. Split when there's a genuine seam (a sub-component used elsewhere, a hook with its own concern), not to chase a number. With CSS Modules, the `.tsx` rarely approaches the cap because styles live in a sibling `.module.css`.
- **One concern per file.** Components don't define their own types in-file beyond local props; shared types live in `src/types`.
- **Client components by default for now.** Most of this app is interactive. Mark every screen file `"use client"` until we identify pieces that benefit from server rendering (likely just the root layout).
- **`@/*` alias** for all internal imports. No deep relative paths.
- **No barrel files** unless they earn their place — they hurt tree shaking and bloat diffs.
- **Animation timings come from `lib/motion.ts`.** Don't sprinkle magic numbers across rituals.
- **No hard-coded user-facing strings in components.** All copy lives in `src/strings/en.ts` and is imported via `import { strings } from "@/strings"`. Keeps copy reviewable in one place and makes future localization a swap, not a refactor.
- **Errors at boundaries only.** No defensive try/catches around in-memory state. Wrap `localStorage` access in `lib/storage.ts` once.

## Strings & future localization

All user-facing copy lives in `src/strings/en.ts`:

```ts
// src/strings/en.ts
export const en = {
  app: {
    name: "Plyvo",
    tagline: "Pick. Spin. Go.",
  },
  home: {
    cta: "Start a new pool",
    recent: "Recent",
    saved: "Saved",
  },
  pool: {
    titlePlaceholder: "What are we deciding?",
    minOptions: "Add at least 3 options",
    maxOptions: "Up to 8 options",
  },
  modes: {
    spin: { title: "Spin", desc: "Classic wheel." },
    plyvo: { title: "Plyvo", desc: "Theatrical reveal." },
    dice: { title: "Dice", desc: "Quick and punchy." },
  },
  // ...
} as const;

export type Strings = typeof en;
```

```ts
// src/strings/index.ts
export { en as strings } from "./en";
export type { Strings } from "./en";
```

Components consume it directly:

```tsx
import { strings } from "@/strings";
<h1>{strings.home.cta}</h1>
```

Why this shape and not `i18next` / `next-intl`:

- Single locale in v1 — a library is dead weight.
- `as const` gives us type-safe key access; missing or misspelled keys fail at compile time.
- When a second locale is needed: add `es.ts` with the same shape (TypeScript enforces parity), add a `locale` field to `AppSettings`, change `index.ts` to a small selector hook. No component changes.

Rules:

- No string literal that the user sees may live in a component or screen file.
- Format strings use template literals or a tiny `format(template, vars)` helper — no ICU MessageFormat in v1.
- Pluralization (e.g. "1 option" vs "3 options") gets a small helper in `lib/format.ts` when first needed; don't pre-build it.

## SSR safety for `localStorage`

Static export still prerenders to HTML at build time. `localStorage` does not exist there. Pattern:

```ts
// hooks/useLocalStorage.ts
const [value, setValue] = useState<T>(initial);

useEffect(() => {
  const raw = window.localStorage.getItem(key);
  if (raw) setValue(JSON.parse(raw));
}, [key]);
```

Hydration mismatch is avoided by always rendering `initial` on first paint, then swapping in the stored value after mount. Screens that depend on stored data show a tiny skeleton during the first frame.

## Testing (deferred)

Not in MVP build order, but worth noting: when added, target `lib/random.ts` (winner selection unbiased) and `hooks/usePools.ts` (CRUD) with Vitest. Skip ritual visual tests — manual QA is faster than maintaining motion snapshots.
