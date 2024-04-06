import styles from "@/styles/utilities/Card.module.css";
import clsx from "clsx";
import { Avatar } from "../Avatar/Avatar";

export const Card = ({
  name,
  highlight = false,
  isHost = false,
  isOnline = false,
  index = 0,
}: CardProps) => {
  return (
    <div key={name} className={styles.userCard}>
      <Avatar
        name={name}
        index={index}
        grayOut={!isOnline}
        outline={highlight}
      />
      <h5>
        {isOnline ? (
          <span
            className={clsx(styles.dot, { [styles.dotGreen]: isOnline })}
          ></span>
        ) : (
          <span className={styles.dot}></span>
        )}
        {name || "—"}
      </h5>

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
  index: number;
};
