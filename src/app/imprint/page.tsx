import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import Logo from "@/components/Logo";
import Stack from "@/components/layout/Stack";
import { strings } from "@/strings";

export const metadata: Metadata = {
  title: `${strings.imprint.title} — ${strings.app.name}`,
};

export default function ImprintPage() {
  const op = strings.operator;
  const t = strings.imprint;

  return (
    <AppShell>
      <Stack gap={8} style={{ paddingTop: "var(--space-10)" }}>
        <Logo size="md" />

        <article className="prose">
          <h1>{t.title}</h1>
          <p>{t.intro}</p>

          <h2>{t.operator}</h2>
          <p>
            {op.name}
            <br />
            {t.addressLine1}
            <br />
            {t.addressLine2}
            <br />
            {t.addressLine3}
            <br />
            <a href={`mailto:${op.email}`}>{op.email}</a>
          </p>

          <p>{t.note}</p>

          <h2>{t.liability}</h2>
          <p>{t.liabilityBody}</p>

          <h2>{t.externalLinks}</h2>
          <p>{t.externalLinksBody}</p>
        </article>
      </Stack>
    </AppShell>
  );
}
