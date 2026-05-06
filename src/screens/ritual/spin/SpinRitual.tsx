"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useHistoryActions } from "@/hooks/useHistory";
import { useSetting } from "@/hooks/useSettings";
import { track } from "@/lib/analytics";
import { validOptions } from "@/lib/pool";
import { pickWinner } from "@/lib/random";
import { strings } from "@/strings";
import type { Option, Pool } from "@/types";
import SpinWheel from "./SpinWheel";
import styles from "./SpinRitual.module.css";

type Plan = {
  options: Option[];
  winnerId: string;
  rotation: number;
  duration: number;
  optionCount: number;
};

type SpinRitualProps = {
  pool: Pool;
};

export default function SpinRitual({ pool }: SpinRitualProps) {
  const router = useRouter();
  const settingReduceMotion = useSetting("reducedMotion");
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = settingReduceMotion || prefersReducedMotion;

  const { recordWinner } = useHistoryActions();
  const startedAtRef = useRef(0);
  const completedRef = useRef(false);

  // Compute the entire spin plan once on mount. Random values must not run on
  // re-renders (React purity rule) — useState initializer runs exactly once.
  const [plan] = useState<Plan | null>(() => {
    const v = validOptions(pool);
    if (v.length === 0) return null;

    const { winner, index } = pickWinner(v);
    const sliceAngle = 360 / v.length;
    const sliceCenter = index * sliceAngle + sliceAngle / 2;
    const jitter = (Math.random() - 0.5) * sliceAngle * 0.7;
    const target = (360 - (sliceCenter + jitter) + 360) % 360;
    const fullRotations = reduceMotion
      ? 0
      : 4 + Math.floor(Math.random() * 3); // 4..6

    return {
      options: v,
      winnerId: winner.id,
      rotation: fullRotations * 360 + target,
      duration: reduceMotion ? 0.4 : 2.4,
      optionCount: v.length,
    };
  });

  useEffect(() => {
    if (!plan) return;
    startedAtRef.current = performance.now();
    track({
      name: "ritual_started",
      mode: "spin",
      option_count: plan.optionCount,
    });
  }, [plan]);

  if (!plan) return null;

  const handleComplete = () => {
    if (completedRef.current) return;
    completedRef.current = true;

    const duration =
      Math.round((performance.now() - startedAtRef.current) / 50) * 50;
    track({
      name: "ritual_completed",
      mode: "spin",
      option_count: plan.optionCount,
      duration_ms: duration,
    });
    recordWinner({
      poolId: pool.id,
      winnerOptionId: plan.winnerId,
      revealMode: "spin",
    });
    router.replace(
      `/pool/winner?id=${pool.id}&winner=${plan.winnerId}&mode=spin`,
    );
  };

  return (
    <div className={styles.screen}>
      <p className={styles.title}>{strings.ritual.spinning}</p>
      <SpinWheel
        options={plan.options}
        rotation={plan.rotation}
        duration={plan.duration}
        onAnimationComplete={handleComplete}
      />
    </div>
  );
}
