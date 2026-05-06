import Link from "next/link";
import { cn } from "@/lib/cn";
import { strings } from "@/strings";
import styles from "./Logo.module.css";

type LogoProps = {
  size?: "sm" | "md";
  className?: string;
  /** Override the link target. Defaults to "/". */
  href?: string;
};

export default function Logo({ size = "md", className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(styles.logo, styles[size], className)}
      aria-label={strings.app.name}
    >
      {strings.app.name.toLowerCase()}
    </Link>
  );
}
