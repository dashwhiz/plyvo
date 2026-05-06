import { MAX_OPTIONS, MIN_OPTIONS, type Option, type Pool } from "@/types";

/** Options whose trimmed name is non-empty — what counts toward the 3..8 rule. */
export const validOptions = (pool: Pool): Option[] =>
  pool.options.filter((o) => o.name.trim().length > 0);

export type PoolReadiness =
  | { ok: true; count: number }
  | { ok: false; reason: "min" | "max"; count: number };

export const poolReadiness = (pool: Pool): PoolReadiness => {
  const count = validOptions(pool).length;
  if (count < MIN_OPTIONS) return { ok: false, reason: "min", count };
  if (count > MAX_OPTIONS) return { ok: false, reason: "max", count };
  return { ok: true, count };
};
