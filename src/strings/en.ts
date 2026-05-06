export const en = {
  app: {
    name: "Plyvo",
    tagline: "Pick. Spin. Go.",
  },
  home: {
    cta: "Start a new pool",
    recent: "Recent",
    saved: "Saved",
    empty: "No pools yet. Start one above.",
  },
  pool: {
    titlePlaceholder: "What are we deciding?",
    addOption: "Add option",
    optionPlaceholder: "Option name",
    minOptions: "Add at least 3 options",
    maxOptions: "Up to 8 options",
    deleteConfirm: "Delete this pool?",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
  },
  modes: {
    pickPrompt: "Choose how to reveal",
    spin: { title: "Spin", desc: "Classic wheel." },
    plyvo: { title: "Plyvo", desc: "Theatrical reveal." },
    dice: { title: "Dice", desc: "Quick and punchy." },
    start: "Start",
  },
  ritual: {
    spinning: "Spinning…",
    revealing: "Revealing…",
    rolling: "Rolling…",
  },
  winner: {
    title: "Winner",
    reroll: "Reroll",
    backToPool: "Back to pool",
    startOver: "Start over",
  },
  settings: {
    title: "Settings",
    sound: "Sound",
    reducedMotion: "Reduce motion",
    analytics: "Help us improve",
    analyticsDesc:
      "Send anonymous usage events. No names, no content. Opt out anytime.",
    clearHistory: "Clear history",
  },
} as const;

export type Strings = typeof en;
