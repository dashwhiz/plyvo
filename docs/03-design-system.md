# Design system

Premium retro arcade. Dark, polished, distinctive. Glow used sparingly.

## Color tokens

Defined once in `globals.css` as CSS custom properties; consumed via `var(--token)` in every CSS module.

```css
:root {
  /* surfaces */
  --bg-0: #07060d;        /* deepest background */
  --bg-1: #0e0c1a;        /* card bg */
  --bg-2: #1a1730;        /* elevated bg */
  --line: #2a2440;        /* hairline borders */

  /* text */
  --fg: #ededf2;
  --fg-muted: #9491a8;

  /* accents */
  --teal: #2fffd2;        /* primary — neon teal */
  --teal-glow: #2fffd2cc;
  --magenta: #ff3aa8;     /* secondary */
  --coral: #ff6b5a;       /* alt secondary */
  --gold: #ffc94a;        /* winner state */
  --gold-glow: #ffc94acc;

  /* feedback */
  --danger: #ff4f6e;
}
```

Light mode is **out of scope** for v1. The arcade aesthetic depends on dark.

## Typography

| Role     | Font                          | Notes                                                              |
| -------- | ----------------------------- | ------------------------------------------------------------------ |
| Display  | **Audiowide** (next/font)     | Wordmark, mode titles, winner name. Retro-futurist neon-tube vibe. |
| UI       | `Geist` (already wired)       | Body, buttons, lists                                               |
| Mono     | `Geist Mono` (already wired)  | Labels, counters, timer-like accents                               |

Why Audiowide:

- Reads as premium retro arcade, not pixel-art nostalgia (which the brief explicitly rejects).
- Scales cleanly from 22px to 72px, unlike Press Start 2P which only works small.
- Single weight, ~12kb subset — keeps bundle tight and avoids font flicker.

Loaded via `next/font/google` alongside Geist; no external CDN.

## Type scale

```
display-xl   72/76  -2%  Audiowide
display-lg   48/52  -1.5%
display-md   32/36
title-lg     22/28  Geist 600
title-md     18/24  Geist 600
body         16/22  Geist 400
small        14/18  Geist 400
caption      12/16  Geist 500 uppercase tracking 8%
```

## Spacing

4-px scale exposed as CSS variables (`--space-1: 4px`, `--space-2: 8px`, … `--space-10: 40px`, `--space-14: 56px`, `--space-20: 80px`). The `Stack` / `Row` layout primitives accept a `gap` prop that maps to these.

Mobile-first; max content width 480px on home/list screens, 100vw on ritual screens.

## Components — visual rules

- **Cards.** Background `var(--bg-1)`, 1px border `var(--line)`, 16px radius, hairline inner glow on hover via `box-shadow: inset 0 0 0 1px var(--teal-glow)` at 20% opacity.
- **Primary button.** Magenta → teal gradient bg, deep-bg text, soft outer glow at rest, brighter on press. Min height 56px on mobile.
- **Tap targets.** Minimum 44×44, prefer 56 for primaries.
- **Focus ring.** 2px teal outline, 2px offset. Never remove it.

## Motion principles

- Easing curves live in `lib/motion.ts`. Never hand-roll cubic-beziers in components.
- **Three reusable curves:**
  - `arcade.snap` — tight `cubic-bezier(.2,.8,.2,1)` for taps.
  - `arcade.swing` — `cubic-bezier(.4,1.6,.4,1)` for playful overshoot.
  - `arcade.settle` — `cubic-bezier(.16,1,.3,1)` for ritual landings.
- **Durations.**
  - Micro (button press): 120ms
  - UI transition: 220ms
  - Ritual setup: 400–600ms
  - Reveal climax: 1.4–2.4s depending on mode
- **Reduced motion.** When `prefers-reduced-motion` or `settings.reducedMotion` is true, rituals skip suspense and snap to result with a single fade.

## Glow recipe

Reusable utility. Applied with care — only on the active CTA, the winner card, and ritual focal points.

```css
.neon-teal {
  box-shadow:
    0 0 0 1px var(--teal),
    0 0 24px var(--teal-glow),
    0 0 48px color-mix(in oklab, var(--teal) 40%, transparent);
}
```

A `.neon-magenta` and `.neon-gold` variant cover the other accents.

## Sound design (deferred)

When `soundEnabled` is true:

- Tick during spin (8-bit click).
- Rising chime for Plyvo cycle.
- Dice roll clatter.
- Winner ta-da.

All assets ≤ 30kb each, lazy-loaded via Howler when the ritual mounts.
