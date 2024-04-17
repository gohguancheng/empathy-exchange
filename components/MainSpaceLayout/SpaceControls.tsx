import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";
import { EStage } from "@/utils/types";
import { useContext } from "react";
import styles from "@/styles/SpaceControls.module.css";

export function SpaceControls() {
  const { setStage, roomCode, me, currentStage, users } =
    useContext(SocketStateContext);

  const renderStageControl = () => {
    if (!me?.host) {
      return <></>;
    }

    switch (currentStage) {
      case EStage.WAITING:
        return (
          <button
            onClick={() => {
              setStage(EStage.TOPIC_INPUT);
            }}
          >
            <span>To Topic Selection</span>
            <span>➡️</span>
          </button>
        );
      case EStage.TOPIC_INPUT:
        return (
          <button
            disabled={!me.topic}
            onClick={() => {
              setStage(EStage.ROLE_SELECT);
            }}
          >
            <span>To Role Selection</span>
            <span>➡️</span>
          </button>
        );
      case EStage.ROLE_SELECT:
        return (
          <button
            disabled={!me.role}
            onClick={() => {
              setStage(EStage.SHARING);
            }}
          >
            <span>To Sharing</span>
            <span>➡️</span>
          </button>
        );
      case EStage.SHARING:
        return (
          <button
            disabled={users
              ?.filter((u, i) => i !== 0 && u.online)
              .every((u) => u.done)}
            onClick={() => {
              setStage(EStage.END);
            }}
          >
            <span>End Session</span>
            <span>➡️</span>
          </button>
        );

      default:
        return <></>;
    }
  };

  return (
    <div className={styles.stageControls}>
      <p>
        <span>{roomCode}</span>
      </p>
      {renderStageControl()}
    </div>
  );
}
