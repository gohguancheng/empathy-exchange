import type { NextApiRequest } from "next";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { NextApiResponseWithSocket } from "@/utils/types";
import serverStore from "@/lib/roomStore";

const attachCredentials = (socket: Socket) => {
  const data = socket.handshake.auth as {
    roomCode: string;
    username: string;
  };
  const { roomCode = "", username = "" } = data;
  const user = serverStore.getUser(roomCode, username);

  if (!user) {
    return socket.emit("auth_error", { error: "User is not registered" });
  }
  if (!!user?.online) {
    return socket.emit("auth_error", { error: "User is already online" });
  }
  serverStore.setUserOnlineState(roomCode, username, socket.id);
  socket.data = data;
  socket.join(roomCode);
  socket.emit("auth_success", {
    ...serverStore.getUser(roomCode, username),
    host: serverStore.isUserHost(roomCode, username),
  });
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

    io.on("connection", (socket) => {
      socket.on("authenticate", () => {
        attachCredentials(socket);
      });

      socket.on("get_room", async (callback) => {
        const { roomCode, username } = socket.data;
        const user = serverStore.getUser(roomCode, username);
        const update = serverStore.getRoom(roomCode);
        socket.to(roomCode).emit("room_update", update);
        callback({ update, user });
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
