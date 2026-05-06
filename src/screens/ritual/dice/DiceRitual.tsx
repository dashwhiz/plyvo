"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useHistoryActions } from "@/hooks/useHistory";
import { useSetting } from "@/hooks/useSettings";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { validOptions } from "@/lib/pool";
import { pickWinner } from "@/lib/random";
import { strings } from "@/strings";
import type { Option, Pool } from "@/types";
import styles from "./DiceRitual.module.css";

type Plan = {
  faces: string[]; // 6 face strings, with winner at index 0 (front)
  winnerId: string;
  optionCount: number;
  rotateX: number;
  rotateY: number;
  duration: number;
};

const FILLER = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

const buildFaces = (winner: Option, options: Option[]): string[] => {
  const others = options.filter((o) => o.id !== winner.id);
  const faces: string[] = [winner.name.trim()];
  for (let i = 0; i < 5; i += 1) {
    faces.push(others[i]?.name.trim() || FILLER[i]);
  }
  return faces;
};

type DiceRitualProps = {
  pool: Pool;
};

export default function DiceRitual({ pool }: DiceRitualProps) {
  const router = useRouter();
  const settingReduceMotion = useSetting("reducedMotion");
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = settingReduceMotion || prefersReducedMotion;
  const { recordWinner } = useHistoryActions();
  const startedAtRef = useRef(0);
  const completedRef = useRef(false);

  const [plan] = useState<Plan | null>(() => {
    const v = validOptions(pool);
    if (v.length === 0) return null;
    const { winner } = pickWinner(v);
    const faces = buildFaces(winner, v);
    // Final rotation is a multiple of 360 on each axis so the winner stays on
    // the front face after the tumble.
    const xTurns = reduceMotion ? 0 : 2 + Math.floor(Math.random() * 2);
    const yTurns = reduceMotion ? 0 : 2 + Math.floor(Math.random() * 2);
    return {
      faces,
      winnerId: winner.id,
      optionCount: v.length,
      rotateX: xTurns * 360,
      rotateY: yTurns * 360,
      duration: reduceMotion ? 0.4 : 1.4,
    };
  });

  useEffect(() => {
    if (!plan) return;
    startedAtRef.current = performance.now();
    track({
      name: "ritual_started",
      mode: "dice",
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
      mode: "dice",
      option_count: plan.optionCount,
      duration_ms: duration,
    });
    recordWinner({
      poolId: pool.id,
      winnerOptionId: plan.winnerId,
      revealMode: "dice",
    });
    router.replace(
      `/pool/winner?id=${pool.id}&winner=${plan.winnerId}&mode=dice`,
    );
  };

  return (
    <div className={styles.screen}>
      <p className={styles.title}>{strings.ritual.rolling}</p>
      <div className={styles.stage}>
        <motion.div
          className={styles.cube}
          initial={{ rotateX: 0, rotateY: 0 }}
          animate={{ rotateX: plan.rotateX, rotateY: plan.rotateY }}
          transition={{ duration: plan.duration, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={handleComplete}
        >
          <div className={cn(styles.face, styles.front, styles.winnerFace)}>
            {plan.faces[0]}
          </div>
          <div className={cn(styles.face, styles.back)}>{plan.faces[1]}</div>
          <div className={cn(styles.face, styles.right)}>{plan.faces[2]}</div>
          <div className={cn(styles.face, styles.left)}>{plan.faces[3]}</div>
          <div className={cn(styles.face, styles.top)}>{plan.faces[4]}</div>
          <div className={cn(styles.face, styles.bottom)}>{plan.faces[5]}</div>
        </motion.div>
      </div>
    </div>
  );
}
