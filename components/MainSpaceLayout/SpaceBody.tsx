import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";
import { EStage } from "@/utils/types";
import { useContext } from "react";
import { SelectRole } from "../SelectRole/SelectRole";
import { TopicInput } from "../TopicInput/TopicInput";
import { WaitingRoom } from "../WaitingRoom/WaitingRoom";
import { SharingDashboard } from "../SharingDashboard/SharingDashboard";

export function SpaceBody() {
  const { currentStage, me } = useContext(SocketStateContext);

  const renderStages = () => {
    if (!me) return <></>;
    switch (currentStage) {
      case EStage.WAITING:
        return <WaitingRoom />;
      case EStage.TOPIC_INPUT:
        return <TopicInput />;
      case EStage.ROLE_SELECT:
        return <SelectRole />;
      case EStage.SHARING:
        return <SharingDashboard />;
      case EStage.END:
        return (
          <div style={{ margin: "2rem", textAlign: "center" }}>
            <p>Thank you for sharing!</p>
            <p>You may now close the browser.</p>
          </div>
        );
    }
  };
  return renderStages();
}
