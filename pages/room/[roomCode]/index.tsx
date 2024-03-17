import useSocket from "@/hooks/useSocket";
import { IRoom, IUser } from "@/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Room() {
  const router = useRouter();
  const { roomCode, username } = router.query as {
    roomCode: string;
    username: string;
  };
  const { socket, setUserData, userData, isAuthenticated } = useSocket(
    roomCode,
    username
  );
  const [content, setContent] = useState<IRoom>();

  useEffect(() => {
    if (!(roomCode && username)) router.replace("/");
  }, [roomCode, username, socket]);

  useEffect(() => {
    if (socket?.id && isAuthenticated) {
      socket.emit(
        "get_room",
        ({ update, user }: { update: IRoom; user: IUser }) => {
          setUserData(user);
          setContent(update);
        }
      );
      socket.on("room_update", (update: IRoom) => {
        setContent(update);
        setUserData((prev) => ({
          ...prev,
          ...update.users.find((e) => e.username === prev.username),
        }));
      });
    } else {
      socket?.on("auth_error", (payload) =>
        router.replace({ pathname: "/", query: payload })
      );
    }
  }, [isAuthenticated]);

  // useEffect(() => {
  //   console.log(userData);
  // }, [userData]);

  // useEffect(() => {
  //   console.log(content);
  // }, [content]);

  return (
    <div>
      <div>
        Room ID: {roomCode} {username}
      </div>
      {<div></div>}
    </div>
  );
}
