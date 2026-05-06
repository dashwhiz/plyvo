"use client";

import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/stores/app";
import type { HistoryEntry } from "@/types";

export const useHistory = (): HistoryEntry[] =>
  useAppStore((s) => s.history);

export const useHistoryCount = (): number =>
  useAppStore((s) => s.history.length);

export const useHistoryForPool = (poolId: string | undefined): HistoryEntry[] =>
  useAppStore(
    useShallow((s) =>
      poolId ? s.history.filter((h) => h.poolId === poolId) : [],
    ),
  );

export const useHistoryActions = () =>
  useAppStore(
    useShallow((s) => ({
      recordWinner: s.recordWinner,
      clearHistory: s.clearHistory,
    })),
  );
