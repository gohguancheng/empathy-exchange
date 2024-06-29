
import Image from "next/image";
import styles from "@/styles/utilities/ParticipantsCounter.module.css";
import { IUser } from "@/lib/user";

export const ParticipantsCounter = ({ users }: AttendanceProps) => {
  const renderAttendeesIndicators = Array.from(Array(5).keys()).map((i) => {
    const user = users?.[i];
    const color = !user
      ? "gray"
      : !user.clientId
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
        key={`${user?.clientId}-${i}`}
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
  users?: IUser[];
};
