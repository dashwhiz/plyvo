import type { RevealMode } from "@/types";

export const isRevealMode = (v: string | null | undefined): v is RevealMode =>
  v === "spin" || v === "plyvo" || v === "dice";

export const parseRevealMode = (v: string | null | undefined): RevealMode =>
  isRevealMode(v) ? v : "spin";
