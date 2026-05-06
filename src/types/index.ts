export type RevealMode = "spin" | "plyvo" | "dice";

export type Option = {
  id: string;
  name: string;
  note?: string;
  createdAt: string;
};

export type Pool = {
  id: string;
  title: string;
  icon?: string;
  options: Option[];
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
  analyticsEnabled: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  reducedMotion: false,
  analyticsEnabled: true,
};

export const HISTORY_CAP = 50;

export const MIN_OPTIONS = 3;
export const MAX_OPTIONS = 8;
