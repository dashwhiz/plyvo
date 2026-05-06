"use client";

import Link from "next/link";
import { useAppStore } from "@/stores/app";
import { cn } from "@/lib/cn";
import { formatOptionCount } from "@/lib/format";
import { strings } from "@/strings";
import type { Pool } from "@/types";
import styles from "./PoolListItem.module.css";

type PoolListItemProps = {
  pool: Pool;
};

export default function PoolListItem({ pool }: PoolListItemProps) {
  const lastWinnerName = useAppStore((s) => {
    const last = s.history.find((h) => h.poolId === pool.id);
    if (!last) return undefined;
    const opt = s.pools[pool.id]?.options.find(
      (o) => o.id === last.winnerOptionId,
    );
    return opt?.name.trim() || undefined;
  });

  const trimmedTitle = pool.title.trim();
  const displayTitle = trimmedTitle || strings.pool.untitled;
  const isUntitled = !trimmedTitle;

  const meta = lastWinnerName
    ? strings.pool.lastWinner.replace("{name}", lastWinnerName)
    : formatOptionCount(pool.options.length);

  return (
    <Link
      href={{ pathname: "/pool", query: { id: pool.id } }}
      className={styles.item}
    >
      <span className={styles.icon} aria-hidden="true">
        {pool.icon || "🎲"}
      </span>
      <div className={styles.body}>
        <p className={cn(styles.title, isUntitled && styles.titleMuted)}>
          {displayTitle}
        </p>
        <span className={styles.meta}>{meta}</span>
      </div>
    </Link>
  );
}
