import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";
import { useContext, useMemo } from "react";
import { TitleStatus } from "../TitleStatus/TitleStatus";
import styles from "@/styles/SpaceTopBar.module.css";
import { EStage, IUser, IUserData } from "@/utils/types";

export function SpaceTopBar() {
  const {
    users = [],
    me = {} as IUserData,
    currentStage,
  } = useContext(SocketStateContext);

  const topbarData = useMemo((): TopbarData => {
    const base = { me, users: users.filter((u) => u.username !== me.username) };
    switch (currentStage) {
      case EStage.END:
        return { ...base, title: "End", checkKey: "done" };
      case EStage.SHARING:
        return { ...base, title: "Sharing Session", checkKey: "done" };
      case EStage.ROLE_SELECT:
        return { ...base, title: "Select Role", checkKey: "role" };
      case EStage.TOPIC_INPUT:
        return { ...base, title: "Sharing Topic", checkKey: "topic" };
      case EStage.WAITING:
      default:
        return { ...base, title: "Waiting for more to join.." };
    }
  }, [currentStage, me, users]);

  return (
    <div className={styles.tobar}>
      <TitleStatus {...topbarData} />
    </div>
  );
}

type TopbarData = {
  title: string;
  users: IUser[];
  me: IUserData;
  checkKey?: keyof IUser;
};
