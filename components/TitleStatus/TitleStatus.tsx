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
      case EStage.SHARING: {
        return {
          isMe: me.username === user.username,
          status: !!(currentSpeaker && user.username === currentSpeaker),
        };
      }
      case EStage.END: {
        return {
          isMe: me.username === user.username,
          status: !!user.done,
        };
      }
      default:
        return {};
    }
  };

  const getStatusEmoji = useCallback(
    (user: TabElement): string => {
      const isTrue = stage === EStage.SHARING ? "🎙️" : "✅";
      const isFalse = stage === EStage.SHARING ? "🎧" : "🤔";

      if (!(user && user.username)) return "";
      if (!user.online) return "❌";
      if (user.status === false) return isFalse;
      if (user.status) return isTrue;

      return "";
    },
    [stage]
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
                [styles.done]: user.status,
                [styles.offline]: !user.online,
              })}
            >
              <div>
                {user.username ? getInitials(user.username) : "—"}{" "}
                {user.isMe ? "(You)" : ""}
              </div>
              <div key={`${user.status}`} className="slide-fade">
                {getStatusEmoji(user)}
              </div>
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
