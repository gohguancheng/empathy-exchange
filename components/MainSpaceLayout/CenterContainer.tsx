import { ReactElement, ReactNode, useContext } from "react";
import styles from "@/styles/RoomCode.module.css";
import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";
export default function CenterContainer({
  children,
}: {
  children: ReactNode | ReactElement;
}): ReactElement {
  const { currentStage } = useContext(SocketStateContext);
  return (
    <div
      key={`${currentStage}`}
      className={`${styles.centerContainer} slide-fade`}
    >
      <div>{children}</div>
    </div>
  );
}
