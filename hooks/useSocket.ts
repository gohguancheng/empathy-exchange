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
    if (!socket) {
      fetch("/api/socket").finally(() => {
        const sock = io("/", { auth: { roomCode, username } });

        sock.on("connect", () => {
          setSocket(sock);
        });

        sock.on("auth_success", (data: IUserData) => {
          setUserData(data);
          setIsAuthenticated(true);
        });
      });
    }

    return () => {
      if (socket) {
        console.log("dismounting");
        socket.close();
      }
    };
  }, []);

  return {
    socket,
    userData,
    setUserData,
    isAuthenticated,
  };
}
