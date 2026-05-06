import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Stack.module.css";

type Gap = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 14 | 16 | 20;
type Align = "start" | "center" | "end" | "stretch";
type Justify = "start" | "center" | "end" | "between";

type StackProps = {
  as?: ElementType;
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

const alignClass: Record<Align, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
};

const justifyClass: Record<Justify, string> = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
};

export default function Stack({
  as: Tag = "div",
  gap = 4,
  align,
  justify,
  className,
  style,
  children,
}: StackProps) {
  return (
    <Tag
      className={cn(
        styles.stack,
        align && alignClass[align],
        justify && justifyClass[justify],
        className,
      )}
      style={{ gap: `var(--space-${gap})`, ...style }}
    >
      {children}
    </Tag>
  );
}
