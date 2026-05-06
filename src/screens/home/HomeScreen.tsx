"use client";

import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import Button from "@/components/Button";
import Stack from "@/components/layout/Stack";
import { useHydrated } from "@/hooks/useHydrated";
import { usePoolActions, usePoolList } from "@/hooks/usePools";
import { strings } from "@/strings";
import PoolListItem from "./PoolListItem";
import styles from "./HomeScreen.module.css";

export default function HomeScreen() {
  const router = useRouter();
  const hydrated = useHydrated();
  const pools = usePoolList();
  const { createPool } = usePoolActions();

  const handleStart = () => {
    const pool = createPool({ title: "" });
    router.push(`/pool?id=${pool.id}`);
  };

  return (
    <AppShell>
      <Stack gap={6}>
        <header className={styles.hero}>
          <h1 className={styles.wordmark}>{strings.app.name}</h1>
          <p className={styles.tagline}>{strings.app.tagline}</p>
        </header>

        <Button fullWidth onClick={handleStart}>
          {strings.home.cta}
        </Button>

        {!hydrated ? (
          <div className={styles.placeholder} />
        ) : pools.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>{strings.home.emptyTitle}</p>
            <p className={styles.emptyBody}>{strings.home.emptyBody}</p>
          </div>
        ) : (
          <Stack as="ul" gap={2} pt={8}>
            {pools.map((pool) => (
              <li key={pool.id}>
                <PoolListItem pool={pool} />
              </li>
            ))}
          </Stack>
        )}
      </Stack>
    </AppShell>
  );
}
