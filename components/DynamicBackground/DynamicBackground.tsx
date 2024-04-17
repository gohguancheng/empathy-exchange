import { EStage } from "@/utils/types";
import clsx from "clsx";
import { ReactNode, ReactElement, useContext } from "react";
import styles from "@/styles/utilities/DynamicBackground.module.css";
import { SocketStateContext } from "../../provider/SocketProvider/SocketProvider";

export function DynamicBackground({
  children,
}: {
  children: ReactNode | ReactElement;
}): ReactElement {
  const { currentStage: stage } = useContext(SocketStateContext);

  const applyWrapperClass = () =>
    clsx(styles.main, {
      [styles.stageOne]: stage === EStage.WAITING,
      [styles.stageTwo]: stage === EStage.TOPIC_INPUT,
      [styles.stageThree]: stage === EStage.ROLE_SELECT,
      [styles.final]: stage === EStage.END || stage === EStage.SHARING,
    });
  return <div className={applyWrapperClass()}>{children}</div>;
}
