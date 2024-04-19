import { IUser } from "@/utils/types";
import styles from "@/styles/utilities/TitleStatus.module.css";
import { Chip } from "../Chip/Chip";
import clsx from "clsx";

export const TitleStatus = ({
  title,
  users,
  checkKey,
  me,
  darkFont,
}: TitleStatusProps) => {
  return (
    <>
      <h1 className={clsx(styles.title, { [styles.darkFont]: darkFont })}>
        {title}
      </h1>
      {!!checkKey && (
        <>
          <div className={styles.topGrid}>
            {users?.map((user, i) => (
              <Chip
                key={`${user.online}-${i}`}
                text={user.username}
                checked={!!user[checkKey]}
                grayOut={!user.online}
              />
            ))}
          </div>
          <div className={styles.me}>
            <Chip
              text={me.username}
              checked={!!me[checkKey]}
              grayOut={!me.online}
            />
          </div>
        </>
      )}
    </>
  );
};

type TitleStatusProps = {
  title: string;
  users?: IUser[];
  checkKey?: keyof IUser;
  me: IUser;
  darkFont: boolean;
};
