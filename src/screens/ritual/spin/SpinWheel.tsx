"use client";

import { motion } from "motion/react";
import type { Option } from "@/types";
import styles from "./SpinWheel.module.css";

const RADIUS = 100;
const LABEL_RADIUS = 65;

const SLICE_COLORS = [
  "var(--magenta)",
  "var(--teal)",
  "var(--coral)",
  "var(--gold)",
];

const colorAt = (i: number) => SLICE_COLORS[i % SLICE_COLORS.length];

const polar = (angleDeg: number, r: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
};

type SpinWheelProps = {
  options: readonly Option[];
  /** Final rotation (degrees). Animates from 0 to this value. */
  rotation: number;
  /** Animation duration in seconds. */
  duration: number;
  onAnimationComplete: () => void;
};

export default function SpinWheel({
  options,
  rotation,
  duration,
  onAnimationComplete,
}: SpinWheelProps) {
  const n = options.length;
  const sliceAngle = 360 / n;

  return (
    <div className={styles.wrap}>
      <div className={styles.pointer} />
      <svg
        viewBox="-110 -110 220 220"
        className={styles.svg}
        aria-hidden="true"
      >
        <motion.g
          className={styles.wheelGroup}
          initial={{ rotate: 0 }}
          animate={{ rotate: rotation }}
          transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={onAnimationComplete}
        >
          {options.map((option, i) => {
            const startSvg = i * sliceAngle - 90;
            const endSvg = (i + 1) * sliceAngle - 90;
            const start = polar(startSvg, RADIUS);
            const end = polar(endSvg, RADIUS);
            const largeArc = sliceAngle > 180 ? 1 : 0;
            const path = `M 0 0 L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;

            const labelCenterFromTop = i * sliceAngle + sliceAngle / 2;
            const labelSvgAngle = labelCenterFromTop - 90;
            const labelPos = polar(labelSvgAngle, LABEL_RADIUS);

            const trimmedName = option.name.trim();
            const display = trimmedName.length > 14
              ? trimmedName.slice(0, 13) + "…"
              : trimmedName;

            return (
              <g key={option.id}>
                <path
                  d={path}
                  fill={colorAt(i)}
                  stroke="var(--bg-0)"
                  strokeWidth="0.8"
                />
                <text
                  className={styles.label}
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${labelCenterFromTop} ${labelPos.x} ${labelPos.y})`}
                >
                  {display}
                </text>
              </g>
            );
          })}
          <circle className={styles.hub} cx="0" cy="0" r="10" />
        </motion.g>
      </svg>
    </div>
  );
}
