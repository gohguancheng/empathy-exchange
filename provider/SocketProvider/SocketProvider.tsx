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
import { EStage } from "@/utils/types";
import useSpinnerDelay from "@/hooks/useSpinner";
import { Socket } from "socket.io-client";
import { IUser } from "@/lib/user";

export const SocketStateContext = createContext<Context>({
  showSpinner: true,
  setStage: () => {},
  setTopic: () => {},
  setRole: () => {},
  setSpeaker: () => {},
  setDone: () => {},
});

export default function SocketStateProvider({ children }: Props) {
  const router = useRouter();
  const { roomCode, username } = router.query as {
    roomCode: string;
    username: string;
  };

  const handleAuthError = (query: { message: string }) => {
    router.replace({ pathname: "/start", query });
  };
  const { socket, userData, space, spaceUpdateHandler, userUpdateHandler } =
    useSocket(roomCode, username, handleAuthError);
  const { showSpinner } = useSpinnerDelay({ show: !userData?.clientId });

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
    if (username && userData?.name && username !== userData?.name) {
      router.replace("/start");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.name]);

  const setStage = useCallback(
    (value: EStage) => {
      socket?.emit("space_update", { key: "stage", value }, spaceUpdateHandler);
    },
    [socket, spaceUpdateHandler]
  );

  const setTopic = useCallback(
    (topic: string) =>
      socket?.emit(
        "user_update",
        { key: "topic", value: topic },
        userUpdateHandler
      ),
    [socket, userUpdateHandler]
  );

  const setRole = useCallback(
    (role: string) =>
      socket?.emit(
        "user_update",
        { key: "role", value: role },
        userUpdateHandler
      ),
    [socket, userUpdateHandler]
  );

  const setSpeaker = useCallback(
    async (speaker: string) => {
      await socket?.emit(
        "space_update",
        { key: "speaker", value: speaker },
        spaceUpdateHandler
      );
    },
    [socket, spaceUpdateHandler]
  );

  const setDone = useCallback(
    () =>
      socket?.emit(
        "user_update",
        { key: "done", value: true },
        userUpdateHandler
      ),
    [socket, userUpdateHandler]
  );

  const socketObj = useMemo(() => socket, [socket?.id]);

  const me = useMemo(
    () => userData,
    [
      userData.name,
      userData.clientId,
      userData.topic,
      userData.role,
      userData.done,
    ]
  );

  const currentStage = useMemo(() => {
    const hostStage = space?.stage;
    if (showSpinner) return;
    if (hostStage === EStage.WAITING) return hostStage;
    if (!userData.topic || hostStage === EStage.TOPIC_INPUT)
      return EStage.TOPIC_INPUT;
    if (!userData.role || hostStage === EStage.ROLE_SELECT)
      return EStage.ROLE_SELECT;
    if (hostStage === EStage.SHARING) return EStage.SHARING;
    if (hostStage === EStage.END) return EStage.END;
  }, [space?.stage, me, showSpinner]);

  useEffect(() => {
    if (socket && currentStage === EStage.END) {
      socket.close();
    }
  }, [currentStage, socket]);

  const currentSpeaker = useMemo(() => space?.speaker, [space?.speaker]);

  const context = {
    showSpinner,
    socket: socketObj,
    me,
    users: space?.users,
    currentStage,
    currentSpeaker,
    setStage,
    setTopic,
    setRole,
    setSpeaker,
    setDone,
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
  me?: IUser;
  users?: IUser[];
  currentStage?: EStage | Omit<EStage, EStage.SHARING>;
  currentSpeaker?: string;
  setStage: (s: EStage) => void;
  setTopic: (s: string) => void;
  setRole: (role: string) => void;
  setSpeaker: (speaker: string) => void;
  setDone: () => void;
  roomCode?: string;
  username?: string;
};
