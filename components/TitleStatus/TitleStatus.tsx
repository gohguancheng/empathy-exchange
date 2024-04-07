import { IUser } from "@/utils/types";
import styles from "@/styles/utilities/TitleStatus.module.css";
import { Chip } from "../Chip/Chip";

export const TitleStatus = ({
  title,
  users,
  checkKey,
  me,
}: TitleStatusProps) => {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      {!!checkKey && (
        <>
          <div className={styles.topGrid}>
            {users?.map((user) => (
              <Chip
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
};
