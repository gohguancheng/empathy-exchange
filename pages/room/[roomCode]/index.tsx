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
    if (!router.isReady) return;
    if (roomCode && username) return;

    router.push("/");
  }, [router.isReady, roomCode, username]);

  useEffect(() => {
    if (!socket?.id || !isAuthenticated) return;
    socket.emit(
      "get_room",
      ({ update, user }: { update: IRoom; user: IUser }) => {
        setUserData(user);
        setContent(update);
      }
    );

    const roomUpdateHandler = (update: IRoom) => {
      setContent(update);
      setUserData((prev) => ({
        ...prev,
        ...update.users.find((e) => e.username === prev.username),
      }));
    };
    socket.on("room_update", roomUpdateHandler);

    return () => {
      socket.off("room_update", roomUpdateHandler);
    };
  }, [socket, isAuthenticated]);

  useEffect(() => {
    if (username && userData?.username && username !== userData?.username) {
      router.replace("/");
    }
  }, [userData]);

  // useEffect(() => {
  //   console.log(content);
  // }, [content]);
  const { current, users } = content ?? {};
  return (
    <div>
      <div>
        Room ID: {roomCode} {username} {`${isAuthenticated}`} {`${socket?.id}`}{" "}
        {`${router.isReady}`}
      </div>
      <div>User data: {JSON.stringify(userData)}</div>
      <div>current: {JSON.stringify(current)}</div>
      <div>users: {JSON.stringify(users)}</div>
      {<div></div>}
    </div>
  );
}
