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
  const subtitle = `${isHost ? "Host" : "Peer"}`;
  return (
    <div
      key={name}
      className={clsx(styles.userCard, "slide-fade", {
        [styles.hostBackground]: isHost,
      })}
    >
      <Avatar
        name={name ?? ""}
        index={index}
        grayOut={!isOnline}
        outline={highlight}
        online={isOnline}
      />
      <div>
        <h5>{name || "—"}</h5>

        <p>
          {subtitle} {highlight ? "(You)" : ""}{" "}
          <span>{isHost ? "😉" : "😊"}</span>
        </p>
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
