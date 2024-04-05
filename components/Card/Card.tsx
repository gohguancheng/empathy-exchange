import styles from "@/styles/utilities/Card.module.css";
import clsx from "clsx";

export const Card = ({
  name,
  highlight = false,
  isHost = false,
  isOnline = false,
}: CardProps) => {
  return (
    <div
      key={name}
      className={clsx(styles.userCard, {
        [styles.highlight]: highlight,
        [styles.offline]: !isOnline,
      })}
    >
      <h5>{name || "—"}</h5>
      
        {isOnline ? (
          <div className={clsx(styles.dot, {[styles.dotGreen]:isOnline})}></div>
        ) : (
          <div className={styles.dot}></div>
        )}
      <div className={styles.userIconContainer}>
        {highlight && <span>😎</span>}
        {isHost && <span>🧭</span>}
      </div>
    </div>
  );
};

type CardProps = {
  name?: string;
  highlight?: boolean;
  isHost?: boolean;
  isOnline?: boolean;
};
