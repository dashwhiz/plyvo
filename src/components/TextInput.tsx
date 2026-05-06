import type { InputHTMLAttributes, Ref } from "react";
import { cn } from "@/lib/cn";
import styles from "./TextInput.module.css";

type Variant = "default" | "title" | "compact";

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  variant?: Variant;
  ref?: Ref<HTMLInputElement>;
};

const variantClass: Record<Variant, string | undefined> = {
  default: undefined,
  title: styles.title,
  compact: styles.compact,
};

export default function TextInput({
  variant = "default",
  className,
  type = "text",
  ref,
  ...rest
}: TextInputProps) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(styles.input, variantClass[variant], className)}
      {...rest}
    />
  );
}
