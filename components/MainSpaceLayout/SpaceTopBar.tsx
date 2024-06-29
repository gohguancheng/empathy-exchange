import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";
import { useContext, useMemo } from "react";
import { TitleStatus } from "../TitleStatus/TitleStatus";
import styles from "@/styles/SpaceTopBar.module.css";
import { EStage } from "@/utils/types";
import { IUser, TUserProps } from "@/lib/user";

export function SpaceTopBar() {
  const {
    users = [],
    me = {} as IUser,
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
  me: IUser;
  checkKey?: TUserProps;
  stage?: EStage | Omit<EStage, EStage.SHARING>;
};
