import { IUser } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

type IUserData = IUser & { host?: boolean };
type SocketStatus = {
  isValidParams?: boolean;
  isAuthenticated?: boolean;
};

export default function useSocket(
  roomCode: string,
  username: string,
  handleAuthError: (query: { message: string }) => void
) {
  const [socket, setSocket] = useState<Socket | undefined>();
  const [socketStatus, setSocketStatus] = useState<SocketStatus>({});
  const [userData, setUserData] = useState<IUserData>({
    username: "",
    host: false,
  });

  useEffect(() => {
    setSocketStatus(() => ({ isValidParams: !!(roomCode && username) }));
  }, [roomCode, username]);

  useEffect(() => {
    if (
      socketStatus.isValidParams &&
      !socketStatus.isAuthenticated &&
      !socket
    ) {
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
        });
      };

      connectSocket();

      return () => {
        sock.removeAllListeners("connect");
        sock.removeAllListeners("connect_error");
      };
    }
  }, [socketStatus]);

  useEffect(() => {
    if (socket) {
      socket.on("auth_success", (data: IUserData) => {
        setUserData(() => data);
        setSocketStatus((prev) => ({
          ...prev,
          isAuthenticated: !!data.username,
        }));
      });

      return () => {
        if (socket.connected) {
          socket.close();
        } else if (socket) {
          socket.once("connect", () => {
            socket.close();
          });
        }
        socket.removeAllListeners("auth_success");
      };
    }
  }, [socket]);

  return {
    socket,
    userData,
    setUserData,
    socketStatus,
  };
}
