import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";
import { EStage } from "@/utils/types";
import { useContext } from "react";
import styles from "@/styles/SpaceControls.module.css";
import { useRouter } from "next/router";

export function SpaceControls() {
  const { setStage, me, currentStage, users, setSpeaker, currentSpeaker } =
    useContext(SocketStateContext);
  const { roomCode } = useRouter().query;
  const renderStageControl = () => {
    if (me?.n !== 0) {
      return <></>;
    }

    switch (currentStage) {
      case EStage.WAITING:
        const [_, ...otherUsers] = users || [];
        return (
          <button
            disabled={otherUsers.every((u) => !u.clientId)}
            onClick={() => {
              setStage(EStage.TOPIC_INPUT);
            }}
          >
            <span>To Topic Selection</span>
            <span className={styles.iconRight}></span>
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
            <span className={styles.iconRight}></span>
          </button>
        );
      case EStage.ROLE_SELECT:
        return (
          <button
            disabled={users?.some((u) => !!u.clientId && !u.role)}
            onClick={() => {
              setStage(EStage.SHARING);
              setSpeaker(me.name);
            }}
          >
            <span>To Sharing</span>
            <span className={styles.iconRight}></span>
          </button>
        );
      case EStage.SHARING:
        return (
          <button
            disabled={
              currentSpeaker !== me.name ||
              !users
                ?.filter((u, i) => i !== 0 && u.clientId)
                .every((u) => u.done)
            }
            onClick={() => {
              setStage(EStage.END);
            }}
          >
            <span>End Session</span>
            <span className={styles.iconRight}></span>
          </button>
        );

      default:
        return <></>;
    }
  };

  return (
    <div className={styles.stageControls}>
      <p>
        <span className={styles.iconKey}></span>
        {roomCode}
      </p>
      {renderStageControl()}
    </div>
  );
}
