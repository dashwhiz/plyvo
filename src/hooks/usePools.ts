"use client";

import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/stores/app";
import type { Pool } from "@/types";

export const usePoolList = (): Pool[] =>
  useAppStore(
    useShallow((s) =>
      s.poolOrder.map((id) => s.pools[id]).filter((p): p is Pool => Boolean(p)),
    ),
  );

export const usePool = (id: string | undefined): Pool | undefined =>
  useAppStore((s) => (id ? s.pools[id] : undefined));

export const usePoolActions = () =>
  useAppStore(
    useShallow((s) => ({
      createPool: s.createPool,
      updatePool: s.updatePool,
      deletePool: s.deletePool,
      addOption: s.addOption,
      updateOption: s.updateOption,
      removeOption: s.removeOption,
      reorderOptions: s.reorderOptions,
    })),
  );
