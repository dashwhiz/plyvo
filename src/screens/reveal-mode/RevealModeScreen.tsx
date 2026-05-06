"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import Stack from "@/components/layout/Stack";
import { usePoolFromQuery } from "@/hooks/usePoolFromQuery";
import { track } from "@/lib/analytics";
import { poolReadiness } from "@/lib/pool";
import { strings } from "@/strings";
import type { RevealMode } from "@/types";
import ModeCard from "./ModeCard";
import SpinPreview from "./previews/SpinPreview";
import PlyvoPreview from "./previews/PlyvoPreview";
import DicePreview from "./previews/DicePreview";
import styles from "./RevealModeScreen.module.css";

const MODE_ORDER: RevealMode[] = ["spin", "plyvo", "dice"];

const PREVIEWS: Record<RevealMode, React.ReactNode> = {
  spin: <SpinPreview />,
  plyvo: <PlyvoPreview />,
  dice: <DicePreview />,
};

export default function RevealModeScreen() {
  const router = useRouter();
  const { hydrated, pool } = usePoolFromQuery();

  const initialMode: RevealMode = pool?.lastMode ?? "spin";
  const [selected, setSelected] = useState<RevealMode>(initialMode);

  if (!hydrated) {
    return (
      <AppShell>
        <Stack gap={8} pt={10}>
          <Logo size="md" />
        </Stack>
      </AppShell>
    );
  }

  if (!pool || !poolReadiness(pool).ok) {
    return (
      <AppShell>
        <Stack gap={8} pt={10}>
          <Logo size="md" />
          <p className={styles.notFound}>{strings.pool.minOptions}</p>
        </Stack>
      </AppShell>
    );
  }

  const handleSelect = (mode: RevealMode) => {
    setSelected(mode);
    track({ name: "mode_selected", mode });
  };

  const handleStart = () => {
    router.push(`/pool/ritual?id=${pool.id}&mode=${selected}`);
  };

  const m = strings.modes;

  return (
    <AppShell>
      <Stack gap={6} pt={8}>
        <Logo size="md" />

        <p className={styles.prompt}>{m.pickPrompt}</p>

        <Stack gap={3}>
          {MODE_ORDER.map((mode) => (
            <ModeCard
              key={mode}
              title={m[mode].title}
              description={m[mode].desc}
              preview={PREVIEWS[mode]}
              selected={selected === mode}
              onSelect={() => handleSelect(mode)}
            />
          ))}
        </Stack>

        <Button fullWidth onClick={handleStart}>
          {m.start}
        </Button>
      </Stack>
    </AppShell>
  );
}
