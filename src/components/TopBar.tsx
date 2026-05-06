import type { ReactNode } from "react";
import styles from "./TopBar.module.css";

type TopBarProps = {
  title?: ReactNode;
  /** Optional left-side content (e.g. a small Logo). */
  left?: ReactNode;
  /** Optional right-side content (settings cog, dismiss, etc.). */
  right?: ReactNode;
};

export default function TopBar({ title, left, right }: TopBarProps) {
  return (
    <div className={styles.topBar}>
      <div className={styles.slot}>{left}</div>
      <div className={styles.title}>{title}</div>
      <div className={`${styles.slot} ${styles.slotEnd}`}>{right}</div>
    </div>
  );
}
