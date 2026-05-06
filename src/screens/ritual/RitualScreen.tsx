"use client";

import { usePoolFromQuery } from "@/hooks/usePoolFromQuery";
import { poolReadiness } from "@/lib/pool";
import { parseRevealMode } from "@/lib/reveal";
import SpinRitual from "./spin/SpinRitual";
import PlyvoRitual from "./plyvo/PlyvoRitual";
import DiceRitual from "./dice/DiceRitual";

export default function RitualScreen() {
  const { hydrated, pool, search } = usePoolFromQuery();
  const mode = parseRevealMode(search.get("mode"));

  if (!hydrated) return null;
  if (!pool || !poolReadiness(pool).ok) return null;

  switch (mode) {
    case "plyvo":
      return <PlyvoRitual pool={pool} />;
    case "dice":
      return <DiceRitual pool={pool} />;
    case "spin":
      return <SpinRitual pool={pool} />;
  }
}
