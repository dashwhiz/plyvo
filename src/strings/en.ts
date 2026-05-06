export const en = {
  app: {
    name: "Plyvo",
    tagline: "Pick. Spin. Go.",
  },
  common: {
    back: "Back",
    close: "Close",
  },
  operator: {
    name: "Aleksandar Velichkovikj",
    email: "al.velichkovikj@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/aleksandarvelichkovikj/",
    linkedinHandle: "linkedin.com/in/aleksandarvelichkovikj",
  },
  home: {
    cta: "Start a new pool",
    recent: "Recent",
    saved: "Saved",
    emptyTitle: "Your pools live here",
    emptyBody: "Make your first one above to get started.",
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
  footer: {
    imprint: "Imprint",
    privacy: "Privacy",
    emailLabel: "Email",
    linkedinLabel: "LinkedIn",
    madeIn: "Made in Berlin",
  },
  imprint: {
    title: "Imprint",
    intro:
      "Information according to § 5 DDG (German Digital Services Act) and § 18 MStV.",
    operator: "Operator",
    addressLine1: "Knobelsdorffstr. 18",
    addressLine2: "14059 Berlin",
    addressLine3: "Germany",
    note: "This is an independent, non-commercial personal project.",
    liability: "Liability for content",
    liabilityBody:
      "As the service provider, I am responsible for my own content on these pages under § 7 (1) DDG and general laws. I am, however, not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity (§§ 8 to 10 DDG). Obligations to remove or block the use of information under general laws remain unaffected.",
    externalLinks: "External links",
    externalLinksBody:
      "This site may contain links to external websites operated by third parties. I have no control over their content. The respective provider or operator is always responsible for the content of linked pages.",
  },
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "Last updated",
    intro:
      "This Privacy Policy explains how Plyvo handles your data. Plyvo is a local-first app: all your pools, history, and settings live in your browser and never reach a server we operate.",
    controller: "1. Controller",
    controllerBody:
      "The controller responsible under the EU General Data Protection Regulation (GDPR) is the operator listed in the Imprint.",
    localData: "2. Data stored on your device",
    localDataBody:
      "Pools, options, history, and settings are saved in your browser's localStorage. This data stays on your device. Clearing browser storage removes it. We do not synchronise, back up, or transmit it.",
    serverLogs: "3. Hosting and server logs",
    serverLogsBody:
      "The site is served as static files via a third-party host (currently GitHub Pages, operated by GitHub Inc.). The host may automatically log standard request data such as IP address, user agent, and timestamp for security and operational reasons. We do not have access to these logs beyond what the host exposes. Legal basis: Art. 6 (1) (f) GDPR (legitimate interest in operating the site securely).",
    analytics: "4. Analytics — Google Analytics 4",
    analyticsBody:
      "We use Google Analytics 4 to understand how the app is used in aggregate. We process: anonymised event counts (e.g. pool_created, ritual_started) with non-personal parameters such as reveal mode and option count, anonymised IP addresses (IP anonymisation is enabled), and standard device/browser metadata. We do not collect pool titles, option names, notes, or any user-entered content. Google signals, advertising features, and remarketing are disabled.",
    analyticsCookies:
      "GA4 may set cookies (e.g. _ga, _ga_<ID>) to distinguish sessions. Storage period: up to 14 months.",
    analyticsProvider:
      "Provider: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Data may be transferred to Google LLC in the United States. Transfers rely on the EU-US Data Privacy Framework (European Commission adequacy decision of 10 July 2023) and, where required, the EU Standard Contractual Clauses.",
    analyticsBasis:
      "Legal basis: Art. 6 (1) (f) GDPR (legitimate interest in product improvement). You can opt out at any time via the Settings page. The browser's Do-Not-Track signal is also respected — analytics will not load if it is enabled.",
    rights: "5. Your rights",
    rightsBody:
      "Under the GDPR you have the right to access (Art. 15), rectification (Art. 16), erasure (Art. 17), restriction (Art. 18), data portability (Art. 20), and to object to processing (Art. 21). For locally stored data, clearing your browser storage exercises these rights immediately. You may also lodge a complaint with a supervisory authority (Art. 77). In Germany the competent authority depends on your state of residence.",
    contact: "6. Contact",
    contactBody:
      "Questions about data processing can be sent to the email address in the Imprint.",
  },
} as const;

export type Strings = typeof en;
