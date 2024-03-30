import { EStage } from "@/utils/types";
import clsx from "clsx";
import { ReactNode, ReactElement } from "react";
import styles from "@/styles/DynamicBackground.module.css";

export function DynamicBackground({
  children,
  stage,
}: {
  children: ReactNode | ReactElement;
  stage?: EStage;
}): ReactElement {
  const applyWrapperClass = () =>
    clsx(styles.main, {
      [styles.stageOne]: stage === EStage.WAITING,
      [styles.stageTwo]: stage === EStage.TOPIC_INPUT,
      [styles.stageThree]: stage === EStage.ROLE_SELECT,
      [styles.final]: stage === EStage.END || stage === EStage.SHARING,
    });
  return <div className={applyWrapperClass()}>{children}</div>;
}
