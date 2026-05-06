import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./IconButton.module.css";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Required for accessibility — describes the action ("Go back"). */
  label: string;
  variant?: "ghost" | "bordered";
  children: ReactNode;
};

export default function IconButton({
  label,
  variant = "ghost",
  className,
  children,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        styles.iconButton,
        variant === "bordered" && styles.bordered,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
