import Link from "next/link";
import Mail from "./icons/Mail";
import LinkedIn from "./icons/LinkedIn";
import { strings } from "@/strings";
import styles from "./Footer.module.css";

export default function Footer() {
  const op = strings.operator;
  const f = strings.footer;
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.line} />
      <div className={styles.body}>
        <div className={styles.row}>
          <div className={styles.links}>
            <Link href="/imprint" className={styles.link}>
              {f.imprint}
            </Link>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
            <Link href="/privacy" className={styles.link}>
              {f.privacy}
            </Link>
          </div>

          <div className={styles.icons}>
            <a
              href={`mailto:${op.email}`}
              className={styles.iconBtn}
              aria-label={f.emailLabel}
            >
              <Mail />
            </a>
            <a
              href={op.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconBtn}
              aria-label={f.linkedinLabel}
            >
              <LinkedIn />
            </a>
          </div>
        </div>

        <span className={styles.copy}>
          © {year} · {f.madeIn}
        </span>
      </div>
    </footer>
  );
}
