"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./ModeCard.module.css";

type ModeCardProps = {
  title: string;
  description: string;
  preview: ReactNode;
  selected: boolean;
  onSelect: () => void;
};

export default function ModeCard({
  title,
  description,
  preview,
  selected,
  onSelect,
}: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(styles.card, selected && styles.selected)}
      aria-pressed={selected}
    >
      <span className={styles.preview}>{preview}</span>
      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        <span className={styles.desc}>{description}</span>
      </span>
    </button>
  );
}
