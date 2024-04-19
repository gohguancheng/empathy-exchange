import { memo, useContext } from "react";
import { SocketStateContext } from "../../provider/SocketProvider/SocketProvider";
import dynamic from "next/dynamic";
import { SpaceTopBar } from "./SpaceTopBar";
import { SpaceBody } from "./SpaceBody";
import { SpaceControls } from "./SpaceControls";

export function MainSpaceLayout() {
  const { showSpinner } = useContext(SocketStateContext);
  const Spinner = memo(
    dynamic(() => import("@/components/Spinner/Spinner"), {
      ssr: false,
    })
  );
  if (showSpinner) return <Spinner size={80} />;

  return (
    <>
      <SpaceTopBar />
      <SpaceBody />
      <SpaceControls />
    </>
  );
}
