import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Box.module.css";

type Pad = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 14 | 16 | 20;
type Bg = "0" | "1" | "2";
type Radius = "md" | "lg" | "xl" | "pill";

type BoxProps = {
  as?: ElementType;
  p?: Pad;
  px?: Pad;
  py?: Pad;
  bg?: Bg;
  border?: boolean;
  radius?: Radius;
  full?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const bgClass: Record<Bg, string> = {
  "0": styles["bg-0"],
  "1": styles["bg-1"],
  "2": styles["bg-2"],
};

const radiusClass: Record<Radius, string> = {
  md: styles["radius-md"],
  lg: styles["radius-lg"],
  xl: styles["radius-xl"],
  pill: styles["radius-pill"],
};

const padVar = (n: Pad) => (n === 0 ? "0" : `var(--space-${n})`);

export default function Box({
  as: Tag = "div",
  p,
  px,
  py,
  bg,
  border,
  radius,
  full,
  className,
  style,
  children,
}: BoxProps) {
  const padStyle: CSSProperties = {};
  if (p !== undefined) padStyle.padding = padVar(p);
  if (px !== undefined) {
    padStyle.paddingLeft = padVar(px);
    padStyle.paddingRight = padVar(px);
  }
  if (py !== undefined) {
    padStyle.paddingTop = padVar(py);
    padStyle.paddingBottom = padVar(py);
  }

  return (
    <Tag
      className={cn(
        styles.box,
        bg && bgClass[bg],
        border && styles.border,
        radius && radiusClass[radius],
        full && styles.full,
        className,
      )}
      style={{ ...padStyle, ...style }}
    >
      {children}
    </Tag>
  );
}
