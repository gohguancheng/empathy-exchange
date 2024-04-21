import { EStage, IUser } from "@/utils/types";
import styles from "@/styles/utilities/TitleStatus.module.css";
import clsx from "clsx";
import { useCallback, useContext } from "react";
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
      case EStage.SHARING:
      case EStage.END: {
        return {
          isMe: me.username === user.username,
          status: !!user.done || currentSpeaker === user.username,
        };
      }
      default:
        return {};
    }
  };

  const getStatusEmoji = useCallback(
    (user: TabElement): string => {
      if (!(user && user.username)) return "";
      if (!user.online) return "❌";

      if (stage === EStage.SHARING) {
        if (user.username === currentSpeaker) return "🎙️";
        return "🎧";
      } else {
        if (user.status) return "✅";
        return "🤔";
      }

      return "";
    },
    [stage, currentSpeaker]
  );

  if (!users || !stage) return <></>;
  const elements: TabElement[] = Array.from(Array(5).keys()).map((i) => ({
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
          {elements.map((user, i) => (
            <div
              key={`${user.username}-${i}`}
              className={clsx(styles.tab, {
                [styles.offline]: !user.online,
                [styles.done]: user.status,
              })}
            >
              <div>
                {user.username ? getInitials(user.username) : "—"}{" "}
                {user.isMe ? "(You)" : ""}
              </div>
              {!!user.online && (
                <div key={`${user.status}`} className="slide-fade">
                  {getStatusEmoji(user)}
                </div>
              )}
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

type TabElement = IUser & { isMe?: boolean; status?: boolean };
