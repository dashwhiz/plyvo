"use client";

import AppShell from "@/components/AppShell";
import Logo from "@/components/Logo";
import Switch from "@/components/Switch";
import Trash from "@/components/icons/Trash";
import Stack from "@/components/layout/Stack";
import { useHistory, useHistoryActions } from "@/hooks/useHistory";
import { useSettings, useSetSetting } from "@/hooks/useSettings";
import { track } from "@/lib/analytics";
import { strings } from "@/strings";
import type { AppSettings } from "@/types";
import styles from "./SettingsScreen.module.css";

export default function SettingsScreen() {
  const settings = useSettings();
  const setSetting = useSetSetting();
  const history = useHistory();
  const { clearHistory } = useHistoryActions();
  const t = strings.settings;

  const toggle = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    setSetting(key, value);
    if (
      key === "soundEnabled" ||
      key === "reducedMotion" ||
      key === "analyticsEnabled"
    ) {
      track({ name: "setting_changed", setting: key });
    }
  };

  const handleClearHistory = () => {
    if (history.length === 0) return;
    if (!confirm(t.clearHistoryConfirm)) return;
    clearHistory();
    track({ name: "history_cleared" });
  };

  return (
    <AppShell>
      <Stack gap={6} style={{ paddingTop: "var(--space-10)" }}>
        <Logo size="md" />

        <article className="prose">
          <h1>{t.title}</h1>
        </article>

        <div className={styles.section}>
          <div className={styles.row}>
            <div className={styles.body}>
              <p className={styles.label}>{t.sound}</p>
              <p className={styles.desc}>{t.soundDesc}</p>
            </div>
            <Switch
              label={t.sound}
              checked={settings.soundEnabled}
              onChange={(v) => toggle("soundEnabled", v)}
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.row}>
            <div className={styles.body}>
              <p className={styles.label}>{t.reducedMotion}</p>
              <p className={styles.desc}>{t.reducedMotionDesc}</p>
            </div>
            <Switch
              label={t.reducedMotion}
              checked={settings.reducedMotion}
              onChange={(v) => toggle("reducedMotion", v)}
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.row}>
            <div className={styles.body}>
              <p className={styles.label}>{t.analytics}</p>
              <p className={styles.desc}>{t.analyticsDesc}</p>
            </div>
            <Switch
              label={t.analytics}
              checked={settings.analyticsEnabled}
              onChange={(v) => toggle("analyticsEnabled", v)}
            />
          </div>
        </div>

        <button
          type="button"
          className={styles.dangerBtn}
          onClick={handleClearHistory}
          disabled={history.length === 0}
        >
          <Trash />
          {t.clearHistory}
        </button>
      </Stack>
    </AppShell>
  );
}
