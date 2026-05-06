import type { SVGProps } from "react";

export default function Trash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3.5 5h13M8 5V3.5h4V5M5 5l1 11.5h8L15 5M8.5 8.5v5M11.5 8.5v5" />
    </svg>
  );
}
