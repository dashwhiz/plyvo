import styles from "./PlyvoPreview.module.css";

export default function PlyvoPreview() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={`${styles.card} ${styles.card1}`} />
      <div className={`${styles.card} ${styles.card3}`} />
      <div className={`${styles.card} ${styles.card2}`} />
    </div>
  );
}
