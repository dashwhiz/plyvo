"use client";

import { useSearchParams } from "next/navigation";
import { useHydrated } from "@/hooks/useHydrated";
import { usePool } from "@/hooks/usePools";
import { poolReadiness } from "@/lib/pool";
import type { RevealMode } from "@/types";
import SpinRitual from "./spin/SpinRitual";
import PlyvoRitual from "./plyvo/PlyvoRitual";
import DiceRitual from "./dice/DiceRitual";

const isRevealMode = (v: string | null): v is RevealMode =>
  v === "spin" || v === "plyvo" || v === "dice";

export default function RitualScreen() {
  const search = useSearchParams();
  const hydrated = useHydrated();

  const id = search.get("id") ?? undefined;
  const modeParam = search.get("mode");
  const mode: RevealMode = isRevealMode(modeParam) ? modeParam : "spin";

  const pool = usePool(id);

  if (!hydrated) return null;
  if (!pool || !poolReadiness(pool).ok) return null;

  switch (mode) {
    case "plyvo":
      return <PlyvoRitual pool={pool} />;
    case "dice":
      return <DiceRitual pool={pool} />;
    case "spin":
    default:
      return <SpinRitual pool={pool} />;
  }
}
