import { EStage, IUser } from "@/utils/types";
import styles from "@/styles/utilities/TitleStatus.module.css";
import clsx from "clsx";
import { useContext } from "react";
import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";
import { getInitials } from "@/utils/string";

export const TitleStatus = ({
  title,
  users,
  checkKey,
  me,
  darkFont,
  stage,
}: TitleStatusProps) => {
  const { currentSpeaker } = useContext(SocketStateContext);

  if (!users || !stage) return <></>;

  const getStatusKey = (user: IUser) => {
    if (!user) return {};
    switch (stage) {
      case EStage.TOPIC_INPUT: {
        return {
          isMe: me.username === user.username,
          status: !!user.topic,
        };
      }
      case EStage.ROLE_SELECT: {
        return {
          isMe: me.username === user.username,
          status: !!user.role,
        };
      }
      case EStage.SHARING: {
        return {
          isMe: me.username === user.username,
          status: currentSpeaker && user.username === currentSpeaker,
        };
      }
      default:
        return {};
    }
  };

  const elements = Array.from(Array(5).keys()).map((i) => ({
    ...(users[i] || {}),
    ...getStatusKey(users[i]),
  }));

  return (
    <>
      <h1 className={clsx(styles.title, { [styles.darkFont]: darkFont })}>
        {title}
      </h1>

      {!!checkKey && (
        <div className={styles.topGrid}>
          {elements.map((user) => (
            <div
              className={clsx(styles.tab, {
                [styles.done]: user.status,
                [styles.offline]: !user.online,
              })}
            >
              <div>
                {user.username ? getInitials(user.username) : "—"}{" "}
                {user.isMe ? "(You)" : ""}
              </div>
              <div>{user?.status ? "✅" : user.username ? "🤔" : ""}</div>
            </div>
          ))}
        </div>
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
  stage?: EStage;
};
