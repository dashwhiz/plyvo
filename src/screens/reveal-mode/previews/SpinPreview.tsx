import styles from "./SpinPreview.module.css";

export default function SpinPreview() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.wheel} />
      <div className={styles.hub} />
      <div className={styles.pointer} />
    </div>
  );
}
