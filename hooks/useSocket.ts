import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

export default function useSocket(roomCode = "", username = "") {
  const [isConnected, setIsConnected] = useState<boolean>();
  const [isValidName, setIsValidName] = useState<boolean>();
  const [isAvailableRoom, setIsAvailableRoom] = useState<boolean>();
  const socket = useRef<Socket | undefined>();
  const [errors, setErrors] = useState<{
    roomError?: string;
    usernameError?: string;
  }>({});
  const [userData, setUserData] = useState({ host: false });

  const onValidate = (
    value = "",
    type: "user" | "room",
    isHost = false
  ): void => {
    if (!value || !type || !socket?.current) return;

    if (isAvailableRoom && type === "user") {
      socket.current.emit("check_name", { roomCode, username: value });
    }

    if (type === "room") {
      const checkRoomEvent = isHost ? "check_new_room" : "check_room";
      socket.current.emit(checkRoomEvent, value);
    }
  };

  const joinRoom = () => {
    if (!roomCode || !socket.current) return;
    socket.current.emit("join_room", {
      roomCode,
      username,
    });
  };

  const updateRoomIsUnavailable = (isHostUser?: boolean) => {
    const errorMsg = isHostUser
      ? "Room code is already in use, please choose another"
      : "Room code is invalid or room could be full";
    setErrors((prev) => ({ ...prev, roomError: errorMsg }));

    setIsAvailableRoom(false);
  };

  const updateUsernameCheck = () => {
    setErrors((prev) => ({
      ...prev,
      usernameError:
        "Someone else in the room has the same name, please choose another",
    }));

    setIsValidName(false);
  };

  useEffect(() => {
    if (!socket?.current && isConnected) {
      fetch("/api/socket").finally(() => {
        const sock = io("/");

        sock.on("connect", () => {
          socket.current = sock;
        });

        sock.on("check_room", (roomExists: boolean) => {
          if (roomExists) {
            setIsAvailableRoom(true);
          } else {
            updateRoomIsUnavailable(userData.host);
          }
        });

        sock.on("check_new_room", (roomNameIsAvailable: boolean) => {
          if (roomNameIsAvailable) {
            setIsAvailableRoom(true);
          } else {
            updateRoomIsUnavailable(userData.host);
          }
        });

        sock.on("check_name", (res) => {
          if (res || userData.host) {
            setIsValidName(true);
          } else {
            updateUsernameCheck();
          }
        });

        sock.on("join_room", (res) => {
          if (res) {
            setUserData((prev) => ({
              ...prev,
              roomCode: res.roomCode,
              username: res.username,
            }));
          } else {
            console.log("Error joining room");
            updateRoomIsUnavailable(userData.host);
          }
        });
      });
    }

    return () => {
      if (socket.current) {
        console.log("dismounting");
        socket.current.close();
      }
    };
  }, [isConnected]);

  useEffect(() => {
    setErrors({});

    if (!!roomCode && !!username) {
      onValidate(username, "user");
    }
  }, [roomCode]);

  useEffect(() => {
    const userError = isAvailableRoom
      ? ""
      : "Please enter a valid room code first.";

    setErrors((prev) => ({ ...prev, usernameError: userError }));
  }, [username]);

  // useEffect(() => console.log(userData), [userData]);

  return {
    isConnected,
    setIsConnected,
    isValidName,
    setIsValidName,
    isAvailableRoom,
    setIsAvailableRoom,
    errors,
    setErrors,
    onValidate,
    joinRoom,
    userData,
    setUserData,
  };
}
