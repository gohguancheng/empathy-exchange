import { IUser } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

type IUserData = IUser & { host?: boolean };

export default function useSocket(roomCode = "", username = "") {
  const [socket, setSocket] = useState<Socket | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [userData, setUserData] = useState<IUserData>({
    username: "",
    host: false,
  });

  useEffect(() => {
    if (!socket && roomCode && username) {
      fetch("/api/socket").finally(() => {
        const sock = io("/", {
          auth: { roomCode, username },
          transports: ["websocket", "polling"],
        });

        sock.on("connect", () => {
          setSocket(sock);
        });

        sock.on("auth_success", (data: IUserData) => {
          setUserData(data);
          setIsAuthenticated(true);
        });

        const authErrorHandler = (payload: any) => {
          sock.close();
          console.log(payload);
        };
        sock.on("auth_error", authErrorHandler);
      });
    }

    return () => {
      if (socket) {
        console.log("dismounting");
        socket.close();
      }
    };
  }, [roomCode, username]);

  return {
    socket,
    userData,
    setUserData,
    isAuthenticated,
  };
}
