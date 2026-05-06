"use client";

import { cn } from "@/lib/cn";
import styles from "./Switch.module.css";

type SwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
};

export default function Switch({
  checked,
  onChange,
  label,
  disabled,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(styles.switch, checked && styles.checked)}
    >
      <span className={styles.thumb} />
    </button>
  );
}
