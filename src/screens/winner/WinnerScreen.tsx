"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import Button from "@/components/Button";
import Stack from "@/components/layout/Stack";
import { useHydrated } from "@/hooks/useHydrated";
import { usePool } from "@/hooks/usePools";
import { useSetting } from "@/hooks/useSettings";
import { strings } from "@/strings";
import type { RevealMode } from "@/types";
import styles from "./WinnerScreen.module.css";

const isRevealMode = (v: string | null): v is RevealMode =>
  v === "spin" || v === "plyvo" || v === "dice";

const fireConfetti = () => {
  const fire = (origin: { x: number; y: number }, particleCount: number) =>
    confetti({
      particleCount,
      spread: 80,
      startVelocity: 38,
      origin,
      colors: ["#2fffd2", "#ff3aa8", "#ffc94a", "#ff6b5a"],
      disableForReducedMotion: true,
    });
  fire({ x: 0.5, y: 0.4 }, 90);
  setTimeout(() => fire({ x: 0.2, y: 0.5 }, 40), 180);
  setTimeout(() => fire({ x: 0.8, y: 0.5 }, 40), 280);
};

export default function WinnerScreen() {
  const search = useSearchParams();
  const router = useRouter();
  const hydrated = useHydrated();
  const reducedMotion = useSetting("reducedMotion");

  const id = search.get("id") ?? undefined;
  const winnerId = search.get("winner") ?? undefined;
  const mode: RevealMode = isRevealMode(search.get("mode"))
    ? (search.get("mode") as RevealMode)
    : "spin";

  const pool = usePool(id);
  const winner = winnerId
    ? pool?.options.find((o) => o.id === winnerId)
    : undefined;

  useEffect(() => {
    if (!winner) return;
    if (reducedMotion) return;
    fireConfetti();
  }, [winner, reducedMotion]);

  if (!hydrated || !pool || !winner) return null;

  const handleReroll = () =>
    router.replace(`/pool/ritual?id=${pool.id}&mode=${mode}`);
  const handleBackToPool = () => router.push(`/pool?id=${pool.id}`);
  const handleStartOver = () => router.push("/");

  return (
    <AppShell noFooter>
      <Stack gap={4} className={styles.screen}>
        <motion.p
          className={styles.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {strings.winner.title}
        </motion.p>
        <motion.h1
          className={styles.name}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
            delay: 0.1,
          }}
        >
          {winner.name.trim()}
        </motion.h1>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Button fullWidth onClick={handleReroll}>
            {strings.winner.reroll}
          </Button>
          <Button fullWidth variant="ghost" onClick={handleBackToPool}>
            {strings.winner.backToPool}
          </Button>
          <Button fullWidth variant="ghost" onClick={handleStartOver}>
            {strings.winner.startOver}
          </Button>
        </motion.div>
      </Stack>
    </AppShell>
  );
}
