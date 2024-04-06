import { IUserData } from "@/utils/types";
import Image from "next/image";
import styles from "@/styles/utilities/ParticipantsCounter.module.css";

export const ParticipantsCounter = ({ users }: AttendanceProps) => {
  const renderAttendeesIndicators = users?.map((user, i) => {
    const color = !user.online ? "gray" : i === 0 ? "yellow" : "green";

    return (
      <Image
        src={`/icons/person-${color}.svg`}
        alt={`${color}-person`}
        width="40"
        height="40"
      />
    );
  });

  return (
    <div className={styles.container}>
      {" "}
      {!!users && renderAttendeesIndicators}{" "}
    </div>
  );
};

type AttendanceProps = {
  users?: IUserData[];
};
