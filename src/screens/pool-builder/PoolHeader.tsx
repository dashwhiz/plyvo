"use client";

import TextInput from "@/components/TextInput";
import { strings } from "@/strings";
import styles from "./PoolHeader.module.css";

type PoolHeaderProps = {
  title: string;
  icon: string | undefined;
  onTitleChange: (title: string) => void;
  onIconChange: (icon: string) => void;
};

export default function PoolHeader({
  title,
  icon,
  onTitleChange,
  onIconChange,
}: PoolHeaderProps) {
  return (
    <div className={styles.row}>
      <TextInput
        variant="title"
        value={icon ?? ""}
        onChange={(e) => onIconChange(e.target.value)}
        placeholder={strings.pool.iconPlaceholder}
        aria-label={strings.pool.iconAriaLabel}
        maxLength={4}
        className={styles.icon}
      />
      <TextInput
        variant="title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder={strings.pool.titlePlaceholder}
        aria-label={strings.pool.titleAriaLabel}
        maxLength={40}
        className={styles.title}
      />
    </div>
  );
}
