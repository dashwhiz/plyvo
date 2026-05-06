import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Row.module.css";

type Gap = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 14 | 16 | 20;
type Align = "start" | "center" | "end" | "baseline";
type Justify = "start" | "center" | "end" | "between";

type RowProps = {
  as?: ElementType;
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

const alignClass: Record<Align, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  baseline: styles.alignBaseline,
};

const justifyClass: Record<Justify, string> = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
};

export default function Row({
  as: Tag = "div",
  gap = 4,
  align = "center",
  justify,
  wrap,
  className,
  style,
  children,
}: RowProps) {
  return (
    <Tag
      className={cn(
        styles.row,
        wrap && styles.wrap,
        alignClass[align],
        justify && justifyClass[justify],
        className,
      )}
      style={{ gap: `var(--space-${gap})`, ...style }}
    >
      {children}
    </Tag>
  );
}
