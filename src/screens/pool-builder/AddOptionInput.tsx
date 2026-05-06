"use client";

import { useState, type KeyboardEvent } from "react";
import TextInput from "@/components/TextInput";
import Plus from "@/components/icons/Plus";
import { strings } from "@/strings";
import styles from "./AddOptionInput.module.css";

type AddOptionInputProps = {
  disabled?: boolean;
  onAdd: (name: string) => void;
};

export default function AddOptionInput({
  disabled,
  onAdd,
}: AddOptionInputProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onAdd(trimmed);
    setValue("");
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className={styles.row}>
      <TextInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder={strings.pool.addOption}
        aria-label={strings.pool.addOption}
        maxLength={40}
        disabled={disabled}
        className={styles.input}
      />
      <button
        type="button"
        className={styles.addBtn}
        onClick={submit}
        disabled={disabled || value.trim().length === 0}
        aria-label={strings.pool.addOption}
      >
        <Plus />
      </button>
    </div>
  );
}
