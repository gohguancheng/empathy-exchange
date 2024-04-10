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
import { TitleStatus } from "@/components/TitleStatus/TitleStatus";

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

  const Spinner = dynamic(() => import("@/components/Spinner/Spinner"), {
    ssr: false,
  });
  const { showSpinner } = useSpinnerDelay({ show: !userData?.username });

  const TopWrapper = ({
    children,
  }: {
    children: ReactNode | ReactElement;
  }): ReactElement => <div className={styles.topbar}>{children}</div>;

  const renderTitle = () => {
    const userStage = getUserStage();
    const otherUsers = content?.users.filter(
      (u) => u.username !== userData.username
    );
    switch (userStage) {
      case EStage.WAITING:
        return (
          <TopWrapper>
            <TitleStatus
              title="Waiting for more to join.."
              users={otherUsers}
              me={userData}
            />
          </TopWrapper>
        );
      case EStage.TOPIC_INPUT:
        return (
          <TopWrapper>
            <TitleStatus
              title="Sharing Topic"
              users={otherUsers}
              me={userData}
              checkKey={"topic"}
            />
          </TopWrapper>
        );
      case EStage.ROLE_SELECT:
        return (
          <TopWrapper>
            <TitleStatus
              title="Select Role"
              users={otherUsers}
              me={userData}
              checkKey={"role"}
            />
          </TopWrapper>
        );
      case EStage.SHARING:
        return (
          <TopWrapper>
            <TitleStatus
              title="Sharing Session"
              users={otherUsers}
              me={userData}
              checkKey={"done"}
            />
          </TopWrapper>
        );
      case EStage.END:
        return (
          <TopWrapper>
            <TitleStatus
              title="End"
              users={otherUsers}
              me={userData}
              checkKey={"done"}
            />
          </TopWrapper>
        );
    }
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
          />
        );
      case EStage.TOPIC_INPUT:
        return (
          <TopicInput
            currentUser={userData}
            onSubmit={(topic: string) =>
              socket?.emit("set_topic", topic, roomUpdateHandler)
            }
          />
        );
      case EStage.ROLE_SELECT:
        return (
          <SelectRole
            currentUser={userData}
            onSelect={(role: string) =>
              socket?.emit("set_role", role, roomUpdateHandler)
            }
          />
        );
      case EStage.SHARING:
        return (
          <SharingDashboard
            currentUser={userData}
            users={content?.users}
            speaker={content?.current.speaker}
            onUpdate={async (speaker: string) => {
              await socket?.emit("set_speaker", speaker, roomUpdateHandler);
            }}
          />
        );
      case EStage.END:
        return <div>End</div>;

      default:
        return (
          <CenterContainer>
            <Spinner size={80} />
          </CenterContainer>
        );
    }
  };

  const renderStageControl = () => {
    const Wrapper = ({ children }: { children: ReactNode | ReactElement }) => (
      <div className={styles.stageControls}>
        <p>
          <span>{roomCode}</span>
        </p>
        {children}
      </div>
    );

    if (!userData.host) {
      return (
        <Wrapper>
          <></>
        </Wrapper>
      );
    }

    const hostStage = getUserStage();

    switch (hostStage) {
      case EStage.WAITING:
        return (
          <Wrapper>
            <button
              onClick={() => {
                setStage(EStage.TOPIC_INPUT);
              }}
            >
              <span>To Topic Selection</span>
              <span>➡️</span>
            </button>
          </Wrapper>
        );
      case EStage.TOPIC_INPUT:
        return (
          <Wrapper>
            <button
              disabled={!userData.topic}
              onClick={() => {
                setStage(EStage.ROLE_SELECT);
              }}
            >
              <span>To Role Selection</span>
              <span>➡️</span>
            </button>
          </Wrapper>
        );
      case EStage.ROLE_SELECT:
        return (
          <Wrapper>
            <button
              disabled={!userData.role}
              onClick={() => {
                setStage(EStage.SHARING);
              }}
            >
              <span>To Sharing</span>
              <span>➡️</span>
            </button>
          </Wrapper>
        );
      case EStage.SHARING:
        return (
          <Wrapper>
            <button
              disabled={
                !content?.users
                  .filter((u, i) => i !== 0 && u.online)
                  .every((u) => u.done)
              }
              onClick={() => {
                setStage(EStage.END);
              }}
            >
              <span>End Session</span>
              <span>➡️</span>
            </button>
          </Wrapper>
        );

      default:
        return (
          <Wrapper>
            <></>
          </Wrapper>
        );
    }
  };

  const CenterContainer = ({
    children,
  }: {
    children: ReactNode | ReactElement;
  }): ReactElement => (
    <div className={styles.centerContainer}>
      <div>{children}</div>
    </div>
  );

  return (
    <main className={styles.main}>
      <DynamicBackground stage={getUserStage() as EStage}>
        <CenterContainer>
          {renderTitle()}
          {renderStages()}
          {renderStageControl()}
        </CenterContainer>
      </DynamicBackground>
    </main>
  );
}
