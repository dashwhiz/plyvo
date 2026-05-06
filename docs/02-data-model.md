# Data model & storage

All data lives in `localStorage`. No server. Single user, single device.

## Types

```ts
export type RevealMode = "spin" | "plyvo" | "dice";

export type Option = {
  id: string;          // nanoid
  name: string;        // 1..40 chars after trim
  note?: string;       // optional, 0..120 chars
  createdAt: string;   // ISO
};

export type Pool = {
  id: string;
  title: string;       // 1..40 chars
  icon?: string;       // single emoji or short string
  options: Option[];   // length 0..8 in editor; 3..8 to start a ritual
  createdAt: string;
  updatedAt: string;
  lastMode?: RevealMode;
};

export type HistoryEntry = {
  id: string;
  poolId: string;
  winnerOptionId: string;
  revealMode: RevealMode;
  createdAt: string;
};

export type AppSettings = {
  soundEnabled: boolean;
  reducedMotion: boolean;
  analyticsEnabled: boolean;     // honored by lib/analytics.ts; default true
  lastUsedPoolId?: string;
};
```

## Validation rules

| Field             | Rule                                      |
| ----------------- | ----------------------------------------- |
| `Pool.title`      | 1–40 chars trimmed, no surrounding ws     |
| `Pool.icon`       | ≤ 4 chars (allow ZWJ emoji sequences)     |
| `Option.name`     | 1–40 chars trimmed                        |
| `Option.note`     | 0–120 chars                               |
| Options to spin   | min 3, max 8                              |

Editor allows 0–8 options so a draft pool can exist; reveal mode picker is gated on ≥3.

## Storage layout

Single envelope, one read, one write. Versioned so future migrations don't corrupt.

```ts
// localStorage key: "plyvo:v1"
type StorageEnvelope = {
  version: 1;
  pools: Record<string, Pool>;        // by id
  poolOrder: string[];                 // most recent first
  history: HistoryEntry[];             // capped at N (e.g. 50)
  settings: AppSettings;
};
```

Why one key:

- One JSON parse/serialize cycle on read.
- Atomic writes — no partial state mid-update.
- Easy to dump/import for backup later.

## Migrations

`lib/storage.ts` reads `version` and applies migrations sequentially:

```
load → if version < N → migrate v(N-1)→vN → save → return
```

For v1 there's nothing to migrate; the pattern is in place from day one so we never have to retrofit it.

## Defaults

```ts
const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  reducedMotion: false,    // also respects `prefers-reduced-motion` at runtime
  analyticsEnabled: true,  // forced false if navigator.doNotTrack === "1"
};

const HISTORY_CAP = 50;
```

## Hook surface

Higher-level hooks consume a single store rather than touching `localStorage` directly:

- `usePools()` → `{ pools, recentPoolIds, getPool, createPool, updatePool, deletePool, addOption, updateOption, removeOption, reorderOptions }`
- `useHistory()` → `{ entries, recordWinner, clearHistory }`
- `useSettings()` → `{ settings, setSetting }`

Each hook is a thin Zustand selector + actions. Persistence is wired once in `lib/storage.ts` via Zustand's `persist` middleware on the relevant store(s).
