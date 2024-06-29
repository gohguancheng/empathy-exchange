import { IUser } from "@/lib/user";
import { ISpace } from "@/utils/types";
import { useCallback, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

type SocketStatus = { isValidParams?: boolean; isConnected?: boolean };

export default function useSocket(
  roomCode: string,
  username: string,
  handleAuthError: (query: { message: string }) => void
) {
  const [socket, setSocket] = useState<Socket | undefined>();
  const [socketStatus, setSocketStatus] = useState<SocketStatus>();
  const [space, setSpace] = useState<ISpace>();
  const [userData, setUserData] = useState<IUser>({ name: username, n: 10 });

  const initializeSession = useCallback(
    (data: { me: IUser; users: IUser[]; space: ISpace }) => {
      setUserData(() => data.me);
      setSpace(() => ({ ...data.space, users: data.users }));
      setSocketStatus((prev) => ({
        ...prev,
        isConnected: !!data.me.clientId,
      }));
    },
    []
  );

  const spaceUpdateHandler = useCallback((newState: ISpace) => {
    setSpace((prev) => ({ ...newState, users: prev?.users }));
  }, []);

  const userUpdateHandler = useCallback(
    (updatedUser: IUser) => {
      setSpace((prev) => {
        const users = prev?.users ?? [];
        if (users.length) {
          users[updatedUser.n] = updatedUser;
        }
        return { ...prev, users } as ISpace;
      });

      if (updatedUser.name === userData.name) {
        setUserData(() => updatedUser);
      }
    },
    [userData.name]
  );

  useEffect(() => {
    setSocketStatus((prev) => ({
      ...prev,
      isValidParams: !!(roomCode && username),
    }));
  }, [roomCode, username]);

  useEffect(() => {
    if (socketStatus?.isValidParams && !socket) {
      let sock: Socket;
      const connectSocket = async () => {
        await fetch("/api/socket").finally(() => {
          sock = new (io as any)({
            auth: { roomCode, username },
            transports: ["websocket", "polling"],
            addTrailingSlash: false,
          }) as Socket;

          const handleConnection = () => {
            setSocket(() => sock);
          };
          sock.on("connect", handleConnection);

          const authErrorHandler = (payload: { message: string }) => {
            handleAuthError(payload);
          };
          sock.on("connect_error", (err) => {
            authErrorHandler({ message: err.message });
          });

          sock.on("space_not_found", () => {
            authErrorHandler({ message: "Space is not found" });
          });
        });
      };

      connectSocket();
      return () => {
        if (sock.connected) {
          sock.close();
        } else if (sock) {
          sock.once("connect", () => {
            sock.close();
          });
        }
        sock.removeAllListeners("connect");
        sock.removeAllListeners("connect_error");
        sock.removeAllListeners("space_not_found");
      };
    }
  }, [socketStatus?.isValidParams]);

  useEffect(() => {
    if (socket?.id) {
      socket.on("auth_success", initializeSession);
      socket.on("space_updated", spaceUpdateHandler);
      socket.on("user_updated", userUpdateHandler);

      return () => {
        socket.removeAllListeners("auth_success");
        socket.removeAllListeners("space_updated");
        socket.removeAllListeners("user_updated");
      };
    }
  }, [socket?.id, initializeSession, spaceUpdateHandler, userUpdateHandler]);

  return {
    socket,
    userData,
    setUserData,
    socketStatus,
    space,
    setSpace,
    spaceUpdateHandler,
    userUpdateHandler,
  };
}
