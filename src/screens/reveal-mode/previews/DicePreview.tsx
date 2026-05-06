import styles from "./DicePreview.module.css";

export default function DicePreview() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.die}>
        <div className={styles.face}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
      </div>
    </div>
  );
}
