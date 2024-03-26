import styles from "./../../../styles/RoomCode.module.css";
import { SelectRole } from "@/components/SelectRole/SelectRole";
import { SharingDashboard } from "@/components/SharingDashboard/SharingDashboard";
import { TopicInput } from "@/components/TopicInput/TopicInput";
import { WaitingRoom } from "@/components/WaitingRoom/WaitingRoom";
import useSocket from "@/hooks/useSocket";
import { EStage, IRoom, IUserData } from "@/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

  const { current, users } = content ?? {};

  const setStage = (s: EStage) => {
    socket?.emit("set_stage", s, roomUpdateHandler);
  };

  const renderStages = () => {
    const currentStage = content?.current.stage;

    if (!userData?.username) {
      return <div>Spinner</div>;
    }

    if (currentStage === EStage.WAITING) {
      return (
        <WaitingRoom
          roomCode={roomCode}
          currentUser={userData}
          users={content?.users}
          setStage={setStage}
        />
      );
    }

    if (!userData.topic || currentStage === EStage.TOPIC_INPUT) {
      return <TopicInput />;
    }

    if (!userData.role || currentStage === EStage.ROLE_SELECT) {
      return <SelectRole />;
    }

    if (currentStage === EStage.SHARING) {
      return <SharingDashboard />;
    }

    if (currentStage === EStage.END) {
      return <div>End</div>;
    }
  };

  return (
    <main className={styles.main}>
      {/* <div>
        Room ID: {roomCode} {username} {`${socketStatus?.isConnected}`}{" "}
        {`${socket?.id}`} {`${router.isReady}`}
      </div>
      <div>User data: {JSON.stringify(userData)}</div>
      <div>current: {JSON.stringify(current)}</div>
      <div>users: {JSON.stringify(users)}</div> */}
      {renderStages()}
    </main>
  );
}
