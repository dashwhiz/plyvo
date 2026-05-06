"use client";

import { useAppStore } from "@/stores/app";
import type { AppSettings } from "@/types";

export const useSettings = (): AppSettings => useAppStore((s) => s.settings);

export const useSetting = <K extends keyof AppSettings>(
  key: K,
): AppSettings[K] => useAppStore((s) => s.settings[key]);

export const useSetSetting = () => useAppStore((s) => s.setSetting);
