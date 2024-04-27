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
    const base = {
      me,
      users,
    };
    switch (currentStage) {
      case EStage.END:
        return { ...base, title: "End", checkKey: "done" };
      case EStage.SHARING:
        return { ...base, title: "Sharing Session", checkKey: "done" };
      case EStage.ROLE_SELECT:
        return { ...base, title: "Select a Role", checkKey: "role" };
      case EStage.TOPIC_INPUT:
        return { ...base, title: "Prepare a Topic", checkKey: "topic" };
      case EStage.WAITING:
      default:
        return { ...base, title: "Waiting for more Peers.." };
    }
  }, [currentStage, me, users]);

  return (
    <div className={styles.topbar}>
      <TitleStatus
        {...topbarData}
        stage={currentStage as EStage}
        darkFont={
          currentStage === EStage.END ||
          currentStage === EStage.SHARING ||
          currentStage === EStage.ROLE_SELECT
        }
      />
    </div>
  );
}

type TopbarData = {
  title: string;
  users: IUser[];
  me: IUserData;
  checkKey?: keyof IUser;
  stage?: EStage | Omit<EStage, EStage.SHARING>;
};
