# Analytics (GA4)

Privacy-first product analytics. Goal: learn how people use the app (mode mix, ritual completion, drop-off) without identifying anyone.

## Principles

- **No PII, ever.** Pool titles, option names, notes — never sent. Only enums, counts, durations.
- **No cross-site tracking.** Advertising features off, remarketing off.
- **Honor opt-out.** `navigator.doNotTrack === "1"` disables analytics outright. Settings has a user-controllable toggle (`analyticsEnabled`, default on).
- **Disabled in dev.** Script only loads when `process.env.NODE_ENV === "production"` **and** `NEXT_PUBLIC_GA_ID` is set.
- **No cookie banner.** We collect no personal data and run no ads. A clear opt-out in Settings, plus a privacy line in the About/Settings sheet, is the right level of friction for v1. Revisit if we add anything that touches PII.

## Wiring

- Single component `src/components/Analytics.tsx` injects the gtag snippet via `next/script` with `strategy="afterInteractive"`.
- It listens to `usePathname()` and emits `page_view` on each App Router navigation, with **scrubbed paths** (replace dynamic segments with placeholders, e.g. `/pool/abc123` → `/pool/[id]`) to avoid cardinality blowup and accidental ID leaks.
- Mounted once in `src/app/layout.tsx` so it covers every screen.
- All event dispatches go through `src/lib/analytics.ts` — no direct `window.gtag(...)` calls in components.

## Event catalog

Events are a **typed discriminated union** so unknown events / mistyped params fail at compile time.

| Event              | Params                                                 | Fired when                                       |
| ------------------ | ------------------------------------------------------ | ------------------------------------------------ |
| `page_view`        | `{ page_path }` (scrubbed)                             | App Router pathname changes                      |
| `pool_created`     | —                                                      | New pool persisted                               |
| `pool_deleted`     | —                                                      | Pool removed                                     |
| `pool_edited`      | —                                                      | Pool title or icon updated                       |
| `option_added`     | —                                                      | Option pushed to a pool                          |
| `option_removed`   | —                                                      | Option deleted from a pool                       |
| `mode_selected`    | `{ mode }`                                             | User picks a reveal mode                         |
| `ritual_started`   | `{ mode, option_count }`                               | Ritual screen mounts and animation begins        |
| `ritual_completed` | `{ mode, option_count, duration_ms }`                  | Winner reveal lands                              |
| `reroll`           | `{ mode }`                                             | Winner screen → reroll tapped                    |
| `history_cleared`  | —                                                      | Settings → clear history                         |
| `setting_changed`  | `{ setting }` (key only — never values)                | Any setting toggle                               |

Param vocabulary:

- `mode`: `"spin" | "plyvo" | "dice"`
- `option_count`: integer 3–8
- `duration_ms`: integer milliseconds (round to nearest 50)
- `setting`: `"soundEnabled" | "reducedMotion" | "analyticsEnabled"`

## Path scrubbing

| Real path                          | Reported as                |
| ---------------------------------- | -------------------------- |
| `/`                                | `/`                        |
| `/pool/abc123`                     | `/pool/[id]`               |
| `/pool/abc123/mode`                | `/pool/[id]/mode`          |
| `/pool/abc123/ritual/spin`         | `/pool/[id]/ritual/[mode]` |
| `/pool/abc123/winner`              | `/pool/[id]/winner`        |

Implemented in `lib/analytics.ts#scrubPath` — short regex; no router internals.

## Settings integration

`AppSettings.analyticsEnabled: boolean` (default `true`). UI surface in the Settings sheet:

> **Help us improve**
> Send anonymous usage events (no names, no content). Opt out anytime.
> [ toggle ]

When the toggle flips off:

- `track()` becomes a no-op immediately.
- The previously loaded gtag remains in memory but receives no further calls.

When `navigator.doNotTrack === "1"` at script-mount time, analytics never initialises. The Settings toggle is shown as off and disabled with a small note.

## Files

```
src/lib/analytics.ts          track, trackPageView, scrubPath, types
src/components/Analytics.tsx  next/script injection + route listener
src/types/index.ts            AppSettings.analyticsEnabled lives here
.env.example                  NEXT_PUBLIC_GA_ID=
```

## Reviewing what's collected

Before each release, run a quick local check:

1. Set `NEXT_PUBLIC_GA_ID` to a test property.
2. `npm run build && npx serve out`
3. Open the Network panel, filter `collect?` — every payload should be reviewable and contain only the params listed above.
