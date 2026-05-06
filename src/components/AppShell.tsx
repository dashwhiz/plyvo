import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import Footer from "./Footer";
import styles from "./AppShell.module.css";

type AppShellProps = {
  children: ReactNode;
  /** Drop horizontal padding so children can fill edge-to-edge (ritual screens). */
  fullBleed?: boolean;
  /** Hide the global footer (e.g. on the ritual screen). */
  noFooter?: boolean;
  className?: string;
};

export default function AppShell({
  children,
  fullBleed,
  noFooter,
  className,
}: AppShellProps) {
  return (
    <div className={styles.outer}>
      <div
        className={cn(styles.inner, fullBleed && styles.fullBleed, className)}
      >
        <div className={styles.main}>{children}</div>
        {!noFooter && <Footer />}
      </div>
    </div>
  );
}
