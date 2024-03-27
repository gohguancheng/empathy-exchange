import type { NextApiRequest } from "next";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { EStage, NextApiResponseWithSocket } from "@/utils/types";
import serverStore from "@/lib/roomStore";

const attachCredentials = (socket: Socket) => {
  const data = socket.handshake.auth as {
    roomCode: string;
    username: string;
  };
  const { roomCode = "", username = "" } = data;
  const user = serverStore.getUser(roomCode, username);
  let error;
  if (!user) {
    error = "User is not registered";
    // socket.emit("auth_error", { error });
    throw error;
  }
  if (!!user?.online) {
    error = "User is already online";

    throw error;
  }

  serverStore.setUserOnlineState(roomCode, username, socket.id);
  socket.data = data;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket?.server?.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const httpServer: HttpServer = res.socket.server as any;
    const io = new Server(httpServer, { addTrailingSlash: false });
    res.socket.server.io = io;

    io.use((socket, next) => {
      if (socket.data.roomCode && socket.data.username) next();
      try {
        attachCredentials(socket);
        next();
      } catch (error: any) {
        const err = new Error(error);
        next(err);
      }
    });

    io.on("connection", (socket) => {
      if (socket.data.roomCode) {
        const { roomCode, username } = socket.data;
        socket.join(roomCode);
        socket.emit("auth_success", {
          ...serverStore.getUser(roomCode, username),
          host: serverStore.isUserHost(roomCode, username),
        });
      }

      socket.on("get_room", async (callback) => {
        const { roomCode, username } = socket.data;
        const user = serverStore.getUser(roomCode, username);
        const update = serverStore.getRoom(roomCode);
        socket.to(roomCode).emit("room_update", update);
        callback({ update, user });
      });

      socket.on("set_stage", (stage: EStage, callback) => {
        const update = serverStore.setStageForRoom(socket.data.roomCode, stage);
        callback(update);
        socket.to(socket.data.roomCode).emit("room_update", update);
      });

      socket.on("set_topic", (topic: string, callback) => {
        const update = serverStore.setTopicForUser(
          socket.data.roomCode,
          socket.data.username,
          topic
        );
        callback(update);
        socket.to(socket.data.roomCode).emit("room_update", update);
      });

      socket.on("disconnecting", async () => {
        const { roomCode, username } = socket.data;
        await serverStore.setUserOnlineState(roomCode, username, "");
        socket.to(roomCode).emit("room_update", serverStore.getRoom(roomCode));
      });

      socket.on("disconnect", () => {
        const { roomCode } = socket.data;
        serverStore.closeRoomIfEmpty(roomCode);
      });
    });
  }
  res.end();
}
