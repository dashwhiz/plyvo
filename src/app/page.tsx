import AppShell from "@/components/AppShell";
import Button from "@/components/Button";
import Stack from "@/components/layout/Stack";
import { strings } from "@/strings";
import styles from "./page.module.css";

export default function Home() {
  return (
    <AppShell>
      <Stack gap={6}>
        <header className={styles.hero}>
          <h1 className={styles.wordmark}>{strings.app.name}</h1>
          <p className={styles.tagline}>{strings.app.tagline}</p>
        </header>

        <Button fullWidth>{strings.home.cta}</Button>

        <div className={styles.empty}>
          <p className={styles.emptyTitle}>{strings.home.emptyTitle}</p>
          <p className={styles.emptyBody}>{strings.home.emptyBody}</p>
        </div>
      </Stack>
    </AppShell>
  );
}
