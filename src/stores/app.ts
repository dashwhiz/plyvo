import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import {
  type AppSettings,
  type HistoryEntry,
  type Option,
  type Pool,
  type RevealMode,
  DEFAULT_SETTINGS,
  HISTORY_CAP,
  MAX_OPTIONS,
} from "@/types";

const STORAGE_KEY = "plyvo:v1";
const STORAGE_VERSION = 1;

const now = () => new Date().toISOString();

type State = {
  pools: Record<string, Pool>;
  /** Most recent first. */
  poolOrder: string[];
  history: HistoryEntry[];
  settings: AppSettings;
};

type Actions = {
  // pools
  createPool: (input: { title: string; icon?: string }) => Pool;
  updatePool: (
    id: string,
    patch: Partial<Pick<Pool, "title" | "icon" | "lastMode">>,
  ) => void;
  deletePool: (id: string) => void;
  touchPool: (id: string) => void;

  // options
  addOption: (
    poolId: string,
    input: { name: string; note?: string },
  ) => Option | null;
  updateOption: (
    poolId: string,
    optionId: string,
    patch: Partial<Pick<Option, "name" | "note">>,
  ) => void;
  removeOption: (poolId: string, optionId: string) => void;
  reorderOptions: (poolId: string, fromIndex: number, toIndex: number) => void;

  // history
  recordWinner: (entry: {
    poolId: string;
    winnerOptionId: string;
    revealMode: RevealMode;
  }) => HistoryEntry;
  clearHistory: () => void;

  // settings
  setSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => void;
};

export type AppStore = State & Actions;

const initial: State = {
  pools: {},
  poolOrder: [],
  history: [],
  settings: DEFAULT_SETTINGS,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initial,

      createPool: ({ title, icon }) => {
        const id = nanoid();
        const t = now();
        const pool: Pool = {
          id,
          title: title.trim(),
          icon,
          options: [],
          createdAt: t,
          updatedAt: t,
        };
        set((s) => ({
          pools: { ...s.pools, [id]: pool },
          poolOrder: [id, ...s.poolOrder.filter((p) => p !== id)],
        }));
        return pool;
      },

      updatePool: (id, patch) => {
        set((s) => {
          const existing = s.pools[id];
          if (!existing) return s;
          return {
            pools: {
              ...s.pools,
              [id]: { ...existing, ...patch, updatedAt: now() },
            },
          };
        });
      },

      deletePool: (id) => {
        set((s) => {
          if (!s.pools[id]) return s;
          const next = { ...s.pools };
          delete next[id];
          return {
            pools: next,
            poolOrder: s.poolOrder.filter((pid) => pid !== id),
            history: s.history.filter((h) => h.poolId !== id),
            settings:
              s.settings.lastUsedPoolId === id
                ? { ...s.settings, lastUsedPoolId: undefined }
                : s.settings,
          };
        });
      },

      touchPool: (id) => {
        set((s) => {
          if (!s.pools[id]) return s;
          return {
            poolOrder: [id, ...s.poolOrder.filter((pid) => pid !== id)],
            settings: { ...s.settings, lastUsedPoolId: id },
          };
        });
      },

      addOption: (poolId, { name, note }) => {
        const pool = get().pools[poolId];
        if (!pool) return null;
        if (pool.options.length >= MAX_OPTIONS) return null;
        const trimmed = name.trim();
        if (!trimmed) return null;
        const option: Option = {
          id: nanoid(),
          name: trimmed,
          note: note?.trim() || undefined,
          createdAt: now(),
        };
        set((s) => {
          const p = s.pools[poolId];
          if (!p) return s;
          return {
            pools: {
              ...s.pools,
              [poolId]: {
                ...p,
                options: [...p.options, option],
                updatedAt: now(),
              },
            },
          };
        });
        return option;
      },

      updateOption: (poolId, optionId, patch) => {
        set((s) => {
          const pool = s.pools[poolId];
          if (!pool) return s;
          const next = pool.options.map((o) =>
            o.id === optionId ? { ...o, ...patch } : o,
          );
          return {
            pools: {
              ...s.pools,
              [poolId]: { ...pool, options: next, updatedAt: now() },
            },
          };
        });
      },

      removeOption: (poolId, optionId) => {
        set((s) => {
          const pool = s.pools[poolId];
          if (!pool) return s;
          return {
            pools: {
              ...s.pools,
              [poolId]: {
                ...pool,
                options: pool.options.filter((o) => o.id !== optionId),
                updatedAt: now(),
              },
            },
          };
        });
      },

      reorderOptions: (poolId, fromIndex, toIndex) => {
        set((s) => {
          const pool = s.pools[poolId];
          if (!pool) return s;
          const len = pool.options.length;
          if (
            fromIndex < 0 ||
            fromIndex >= len ||
            toIndex < 0 ||
            toIndex >= len ||
            fromIndex === toIndex
          ) {
            return s;
          }
          const next = pool.options.slice();
          const [moved] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, moved);
          return {
            pools: {
              ...s.pools,
              [poolId]: { ...pool, options: next, updatedAt: now() },
            },
          };
        });
      },

      recordWinner: ({ poolId, winnerOptionId, revealMode }) => {
        const entry: HistoryEntry = {
          id: nanoid(),
          poolId,
          winnerOptionId,
          revealMode,
          createdAt: now(),
        };
        set((s) => {
          const pool = s.pools[poolId];
          return {
            history: [entry, ...s.history].slice(0, HISTORY_CAP),
            pools: pool
              ? {
                  ...s.pools,
                  [poolId]: { ...pool, lastMode: revealMode, updatedAt: now() },
                }
              : s.pools,
          };
        });
        return entry;
      },

      clearHistory: () => set({ history: [] }),

      setSetting: (key, value) => {
        set((s) => ({ settings: { ...s.settings, [key]: value } }));
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : (undefined as unknown as Storage),
      ),
      partialize: (s): State => ({
        pools: s.pools,
        poolOrder: s.poolOrder,
        history: s.history,
        settings: s.settings,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<State>),
        settings: {
          ...DEFAULT_SETTINGS,
          ...(persisted as Partial<State>)?.settings,
        },
      }),
    },
  ),
);
