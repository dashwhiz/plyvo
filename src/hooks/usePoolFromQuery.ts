"use client";

import { useSearchParams } from "next/navigation";
import { useHydrated } from "./useHydrated";
import { usePool } from "./usePools";

export function usePoolFromQuery() {
  const search = useSearchParams();
  const hydrated = useHydrated();
  const id = search.get("id") ?? undefined;
  const pool = usePool(id);
  return { hydrated, id, pool, search } as const;
}
