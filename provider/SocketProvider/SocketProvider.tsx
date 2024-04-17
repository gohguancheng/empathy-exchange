import { useRouter } from "next/router";
import {
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSocket from "@/hooks/useSocket";
import { EStage, IRoom, IUser, IUserData } from "@/utils/types";
import useSpinnerDelay from "@/hooks/useSpinner";
import { Socket } from "socket.io-client";

export const SocketStateContext = createContext<Context>({
  showSpinner: true,
  setStage: () => {},
  setTopic: () => {},
  setRole: () => {},
  setSpeaker: () => {},
});
export default function SocketStateProvider({ children }: Props) {
  const router = useRouter();
  const { roomCode, username } = router.query as {
    roomCode: string;
    username: string;
  };
  const [content, setContent] = useState<IRoom>();

  const handleAuthError = (query: { message: string }) => {
    router.replace({ pathname: "/start", query });
  };
  const { socket, setUserData, userData, socketStatus } = useSocket(
    roomCode,
    username,
    handleAuthError
  );
  const { showSpinner } = useSpinnerDelay({ show: !userData?.username });

  useEffect(() => {
    if (router.isReady && !(roomCode && username)) {
      router.replace({
        pathname: "/start",
        query: { error: "incomplete params", roomCode, username },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, roomCode, username]);

  useEffect(() => {
    if (username && userData?.username && username !== userData?.username) {
      router.replace("/start");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.username]);

  const roomUpdateHandler = useCallback((update: IRoom) => {
    setContent(() => update);
    setUserData((prev) => ({
      ...prev,
      ...update.users.find((e) => e.username === prev.username),
    }));
  }, []);

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

  const setStage = useCallback(
    (s: EStage) => {
      socket?.emit("set_stage", s, roomUpdateHandler);
    },
    [socket]
  );

  const setTopic = useCallback(
    (topic: string) => socket?.emit("set_topic", topic, roomUpdateHandler),
    [socket]
  );

  const setRole = useCallback(
    (role: string) => socket?.emit("set_role", role, roomUpdateHandler),
    [socket]
  );
  const setSpeaker = useCallback(
    async (speaker: string) =>
      await socket?.emit("set_speaker", speaker, roomUpdateHandler),
    [socket]
  );

  const socketObj = useMemo(() => socket, [socket?.id]);

  const me = useMemo(
    () => userData,
    [
      userData.username,
      userData.online,
      userData.topic,
      userData.role,
      userData.done,
    ]
  );

  const currentStage = useMemo(() => {
    const hostStage = content?.current.stage;
    if (showSpinner) return;
    if (hostStage === EStage.WAITING) return hostStage;
    if (!userData.topic || hostStage === EStage.TOPIC_INPUT)
      return EStage.TOPIC_INPUT;
    if (!userData.role || hostStage === EStage.ROLE_SELECT)
      return EStage.ROLE_SELECT;
    if (hostStage === EStage.SHARING) return EStage.SHARING;
    if (hostStage === EStage.END) return EStage.END;
  }, [content?.current.stage, me, showSpinner]);

  const currentSpeaker = useMemo(
    () => content?.current.speaker,
    [content?.current.speaker]
  );

  const context = {
    showSpinner,
    socket: socketObj,
    me,
    users: content?.users,
    currentStage,
    currentSpeaker,
    setStage,
    setTopic,
    setRole,
    setSpeaker,
    roomCode,
    username,
  };

  return (
    <SocketStateContext.Provider value={context}>
      {children}
    </SocketStateContext.Provider>
  );
}

type Props = { children: ReactNode | ReactElement };
type Context = {
  showSpinner: boolean;
  socket?: Socket;
  me?: IUserData;
  users?: IUser[];
  currentStage?: EStage | Omit<EStage, EStage.SHARING>;
  currentSpeaker?: string;
  setStage: (s: EStage) => void;
  setTopic: (s: string) => void;
  setRole: (role: string) => void;
  setSpeaker: (speaker: string) => void;
  roomCode?: string;
  username?: string;
};
