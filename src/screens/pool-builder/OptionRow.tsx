"use client";

import TextInput from "@/components/TextInput";
import ChevronUp from "@/components/icons/ChevronUp";
import ChevronDown from "@/components/icons/ChevronDown";
import Trash from "@/components/icons/Trash";
import { cn } from "@/lib/cn";
import { strings } from "@/strings";
import type { Option } from "@/types";
import styles from "./OptionRow.module.css";

type OptionRowProps = {
  option: Option;
  isFirst: boolean;
  isLast: boolean;
  onChange: (name: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};

export default function OptionRow({
  option,
  isFirst,
  isLast,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: OptionRowProps) {
  return (
    <div className={styles.row}>
      <TextInput
        variant="compact"
        value={option.name}
        onChange={(e) => onChange(e.target.value)}
        placeholder={strings.pool.optionPlaceholder}
        aria-label={strings.pool.optionPlaceholder}
        maxLength={40}
        className={styles.input}
      />
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label={strings.pool.moveUp}
        >
          <ChevronUp />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onMoveDown}
          disabled={isLast}
          aria-label={strings.pool.moveDown}
        >
          <ChevronDown />
        </button>
        <button
          type="button"
          className={cn(styles.iconBtn, styles.danger)}
          onClick={onRemove}
          aria-label={strings.pool.removeOption}
        >
          <Trash />
        </button>
      </div>
    </div>
  );
}
