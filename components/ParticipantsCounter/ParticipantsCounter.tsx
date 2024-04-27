import { IUserData } from "@/utils/types";
import Image from "next/image";
import styles from "@/styles/utilities/ParticipantsCounter.module.css";

export const ParticipantsCounter = ({ users }: AttendanceProps) => {
  const renderAttendeesIndicators = Array.from(Array(5).keys()).map((i) => {
    const user = users?.[i];
    const color = !user
      ? "gray"
      : !user.online
      ? "red"
      : i === 0
      ? "yellow"
      : "green";

    return (
      <Image
        src={`/icons/person-${color}.svg`}
        alt={`${color}-person`}
        width="40"
        height="40"
        key={`${user?.online}-${i}`}
      />
    );
  });

  return (
    <div className={styles.container}>
      {!!users && renderAttendeesIndicators}
    </div>
  );
};

type AttendanceProps = {
  users?: IUserData[];
};
