import type { RevealMode } from "@/types";

export type AnalyticsEvent =
  | { name: "pool_created" }
  | { name: "pool_deleted" }
  | { name: "pool_edited" }
  | { name: "option_added" }
  | { name: "option_removed" }
  | { name: "mode_selected"; mode: RevealMode }
  | { name: "ritual_started"; mode: RevealMode; option_count: number }
  | {
      name: "ritual_completed";
      mode: RevealMode;
      option_count: number;
      duration_ms: number;
    }
  | { name: "reroll"; mode: RevealMode }
  | { name: "history_cleared" }
  | {
      name: "setting_changed";
      setting: "soundEnabled" | "reducedMotion" | "analyticsEnabled";
    };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export const isAnalyticsAvailable = (): boolean => {
  if (typeof window === "undefined") return false;
  if (!GA_MEASUREMENT_ID) return false;
  if (process.env.NODE_ENV !== "production") return false;
  if (window.navigator?.doNotTrack === "1") return false;
  return true;
};

let userOptedOut = false;

export const setAnalyticsOptOut = (optedOut: boolean): void => {
  userOptedOut = optedOut;
};

const canSend = (): boolean => isAnalyticsAvailable() && !userOptedOut;

export const track = (event: AnalyticsEvent): void => {
  if (!canSend()) return;
  const { name, ...params } = event;
  window.gtag?.("event", name, params);
};

export const trackPageView = (path: string): void => {
  if (!canSend()) return;
  window.gtag?.("event", "page_view", {
    page_path: scrubPath(path),
  });
};

const POOL_ID_RE = /^\/pool\/[^/]+/;
const RITUAL_MODE_RE = /\/ritual\/[^/]+/;

export const scrubPath = (path: string): string => {
  let p = path.split("?")[0].split("#")[0];
  p = p.replace(POOL_ID_RE, "/pool/[id]");
  p = p.replace(RITUAL_MODE_RE, "/ritual/[mode]");
  return p || "/";
};
