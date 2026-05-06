import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import Logo from "@/components/Logo";
import Stack from "@/components/layout/Stack";
import { strings } from "@/strings";

export const metadata: Metadata = {
  title: `${strings.privacy.title} — ${strings.app.name}`,
};

const LAST_UPDATED = "2026-05-06";

export default function PrivacyPage() {
  const t = strings.privacy;

  return (
    <AppShell>
      <Stack gap={8} pt={10}>
        <Logo size="md" />

        <article className="prose">
          <h1>{t.title}</h1>
          <p>
            <strong>{t.lastUpdated}:</strong> {LAST_UPDATED}
          </p>
          <p>{t.intro}</p>

          <h2>{t.controller}</h2>
          <p>{t.controllerBody}</p>

          <h2>{t.localData}</h2>
          <p>{t.localDataBody}</p>

          <h2>{t.serverLogs}</h2>
          <p>{t.serverLogsBody}</p>

          <h2>{t.analytics}</h2>
          <p>{t.analyticsBody}</p>
          <p>{t.analyticsCookies}</p>
          <p>{t.analyticsProvider}</p>
          <p>{t.analyticsBasis}</p>

          <h2>{t.rights}</h2>
          <p>{t.rightsBody}</p>

          <h2>{t.contact}</h2>
          <p>{t.contactBody}</p>
        </article>
      </Stack>
    </AppShell>
  );
}
