import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Stack.module.css";

type Gap = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 14 | 16 | 20;
type Pad = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 14 | 16 | 20;
type Align = "start" | "center" | "end" | "stretch";
type Justify = "start" | "center" | "end" | "between";

type StackProps = {
  as?: ElementType;
  gap?: Gap;
  pt?: Pad;
  pb?: Pad;
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

const padVar = (n: Pad) => (n === 0 ? "0" : `var(--space-${n})`);

export default function Stack({
  as: Tag = "div",
  gap = 4,
  pt,
  pb,
  align,
  justify,
  className,
  style,
  children,
}: StackProps) {
  const padStyle: CSSProperties = {};
  if (pt !== undefined) padStyle.paddingTop = padVar(pt);
  if (pb !== undefined) padStyle.paddingBottom = padVar(pb);

  return (
    <Tag
      className={cn(
        styles.stack,
        align && alignClass[align],
        justify && justifyClass[justify],
        className,
      )}
      style={{ gap: `var(--space-${gap})`, ...padStyle, ...style }}
    >
      {children}
    </Tag>
  );
}
