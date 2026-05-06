"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useHistoryActions } from "@/hooks/useHistory";
import { useSetting } from "@/hooks/useSettings";
import { track } from "@/lib/analytics";
import { validOptions } from "@/lib/pool";
import { pickWinner } from "@/lib/random";
import { strings } from "@/strings";
import type { Option, Pool } from "@/types";
import styles from "./PlyvoRitual.module.css";

type Plan = {
  sequence: { id: string; name: string }[]; // last entry is the winner
  winnerId: string;
  optionCount: number;
  ticks: number; // pre-winner steps
  reduceMotion: boolean;
};

const buildSequence = (winner: Option, options: Option[]) => {
  const total = 12; // approximate cycle steps before locking on winner
  const others = options.filter((o) => o.id !== winner.id);
  if (others.length === 0) return [{ id: winner.id, name: winner.name }];
  const seq: { id: string; name: string }[] = [];
  for (let i = 0; i < total; i += 1) {
    const pick = others[Math.floor(Math.random() * others.length)];
    seq.push({ id: `${pick.id}-${i}`, name: pick.name.trim() });
  }
  seq.push({ id: winner.id, name: winner.name.trim() });
  return seq;
};

// ease-in tempo: 380ms → 70ms across the cycle, then a hold on winner.
const tempoFor = (i: number, total: number) => {
  const t = i / Math.max(1, total - 1);
  return Math.round(380 - (380 - 70) * (t * t));
};

type PlyvoRitualProps = {
  pool: Pool;
};

export default function PlyvoRitual({ pool }: PlyvoRitualProps) {
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
    const sequence = reduceMotion
      ? [{ id: winner.id, name: winner.name.trim() }]
      : buildSequence(winner, v);
    return {
      sequence,
      winnerId: winner.id,
      optionCount: v.length,
      ticks: sequence.length - 1,
      reduceMotion: Boolean(reduceMotion),
    };
  });

  const [step, setStep] = useState(0);
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (!plan) return;
    startedAtRef.current = performance.now();
    track({
      name: "ritual_started",
      mode: "plyvo",
      option_count: plan.optionCount,
    });
  }, [plan]);

  useEffect(() => {
    if (!plan) return;
    if (step >= plan.sequence.length - 1) return;

    const delay = plan.reduceMotion ? 200 : tempoFor(step, plan.ticks);
    const t = setTimeout(() => setStep((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [plan, step]);

  // Once we land on the winner card, brief flash → record + navigate.
  useEffect(() => {
    if (!plan) return;
    if (step !== plan.sequence.length - 1) return;
    if (completedRef.current) return;

    const flashDelay = plan.reduceMotion ? 200 : 600;
    setFlashing(true);
    const t = setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      const duration =
        Math.round((performance.now() - startedAtRef.current) / 50) * 50;
      track({
        name: "ritual_completed",
        mode: "plyvo",
        option_count: plan.optionCount,
        duration_ms: duration,
      });
      recordWinner({
        poolId: pool.id,
        winnerOptionId: plan.winnerId,
        revealMode: "plyvo",
      });
      router.replace(
        `/pool/winner?id=${pool.id}&winner=${plan.winnerId}&mode=plyvo`,
      );
    }, flashDelay);

    return () => clearTimeout(t);
  }, [plan, step, pool.id, recordWinner, router]);

  if (!plan) return null;

  const current = plan.sequence[step] ?? plan.sequence[plan.sequence.length - 1];
  const isWinner = step >= plan.sequence.length - 1;

  return (
    <div className={styles.screen}>
      <div className={styles.halo} />
      <p className={styles.title}>{strings.ritual.revealing}</p>
      <div className={styles.stage}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current.id}
            className={`${styles.card} ${isWinner ? styles.winnerCard : ""}`}
            initial={{ y: -40, scale: 0.92, opacity: 0, rotate: -2 }}
            animate={{
              y: 0,
              scale: isWinner ? 1.06 : 1,
              opacity: 1,
              rotate: 0,
            }}
            exit={{ y: 40, scale: 0.92, opacity: 0, rotate: 2 }}
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 26,
            }}
          >
            {current.name}
          </motion.div>
        </AnimatePresence>
        <motion.div
          className={styles.flash}
          animate={{ opacity: flashing ? [0, 0.6, 0] : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}
