"use client";

import { useSyncExternalStore } from "react";
import { useAppStore } from "@/stores/app";

/**
 * Returns true once the persisted store has been read from localStorage.
 * Use this in screens that depend on stored state to avoid flashing the
 * default state on first paint.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => useAppStore.persist.onFinishHydration(cb),
    () => useAppStore.persist.hasHydrated(),
    () => false,
  );
}
