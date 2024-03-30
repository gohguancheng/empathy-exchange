import { DynamicBackground } from "@/components/DynamicBackground/DynamicBackground";
import styles from "./../../../styles/RoomCode.module.css";
import { SelectRole } from "@/components/SelectRole/SelectRole";
import { SharingDashboard } from "@/components/SharingDashboard/SharingDashboard";
import { TopicInput } from "@/components/TopicInput/TopicInput";
import { WaitingRoom } from "@/components/WaitingRoom/WaitingRoom";
import useSocket from "@/hooks/useSocket";
import { EStage, IRoom, IUserData } from "@/utils/types";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useSpinnerDelay from "@/hooks/useSpinner";

export default function Room() {
  const router = useRouter();
  const { roomCode, username } = router.query as {
    roomCode: string;
    username: string;
  };
  const handleAuthError = (query: { message: string }) => {
    router.replace({ pathname: "/", query });
  };
  const { socket, setUserData, userData, socketStatus } = useSocket(
    roomCode,
    username,
    handleAuthError
  );
  const [content, setContent] = useState<IRoom>();

  useEffect(() => {
    if (router.isReady && !(roomCode && username)) {
      router.replace({
        pathname: "/",
        query: { error: "incomplete params", roomCode, username },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, roomCode, username]);

  useEffect(() => {
    if (username && userData?.username && username !== userData?.username) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const roomUpdateHandler = (update: IRoom) => {
    setContent(() => update);
    setUserData((prev) => ({
      ...prev,
      ...update.users.find((e) => e.username === prev.username),
    }));
  };

  useEffect(() => {
    if (socketStatus?.isConnected || !socket) return;
    socket.emit(
      "get_room",
      ({ update, user }: { update: IRoom; user: IUserData }) => {
        setUserData(() => user);
        setContent(() => update);
      }
    );

    socket.on("room_update", roomUpdateHandler);

    return () => {
      socket.off("room_update", roomUpdateHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const setStage = (s: EStage) => {
    socket?.emit("set_stage", s, roomUpdateHandler);
  };

  const CenterContainer = ({
    children,
  }: {
    children: ReactNode | ReactElement;
  }): ReactElement => <div className={styles.centerContainer}>{children}</div>;

  const Spinner = dynamic(() => import("@/components/Spinner/Spinner"), {
    ssr: false,
  });

  const { showSpinner } = useSpinnerDelay({ show: !userData?.username });
  const hostStage = content?.current.stage;
  const getUserStage = () => {
    if (showSpinner) return;
    if (hostStage === EStage.WAITING) return hostStage;
    if (!userData.topic || hostStage === EStage.TOPIC_INPUT)
      return EStage.TOPIC_INPUT;
    if (!userData.role || hostStage === EStage.ROLE_SELECT)
      return EStage.ROLE_SELECT;
    if (hostStage === EStage.SHARING) return EStage.SHARING;
    if (hostStage === EStage.END) return EStage.END;
  };

  const renderStages = () => {
    const userStage = getUserStage();

    switch (userStage) {
      case EStage.WAITING:
        return (
          <WaitingRoom
            roomCode={roomCode}
            currentUser={userData}
            users={content?.users}
            setStage={setStage}
          />
        );
      case EStage.TOPIC_INPUT:
        return (
          <TopicInput
            currentUser={userData}
            onSubmit={(topic: string) =>
              socket?.emit("set_topic", topic, roomUpdateHandler)
            }
            setStage={setStage}
          />
        );
      case EStage.ROLE_SELECT:
        return (
          <SelectRole
            currentUser={userData}
            onSelect={(role: string) =>
              socket?.emit("set_role", role, roomUpdateHandler)
            }
            setStage={setStage}
          />
        );
      case EStage.SHARING:
        return <SharingDashboard />;
      case EStage.SHARING:
        return <div>End</div>;

      default:
        return <Spinner size={80} />;
    }
  };

  return (
    <main className={styles.main}>
      <DynamicBackground stage={getUserStage() as EStage}>
        <CenterContainer>{renderStages()}</CenterContainer>
      </DynamicBackground>
      {/* <div>
        Room ID: {roomCode} {username} {`${socketStatus?.isConnected}`}{" "}
        {`${socket?.id}`} {`${router.isReady}`}
      </div>
      <div>User data: {JSON.stringify(userData)}</div>
      <div>current: {JSON.stringify(current)}</div>
      <div>users: {JSON.stringify(users)}</div> */}
    </main>
  );
}
