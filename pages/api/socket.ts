import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";
import { Server } from "socket.io";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}
const rooms: { [key: string]: string[] } = {};
const socketUserMap: { [key: string]: { username: string; roomCode: string } } =
  {};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket?.server?.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket?.server);

    io.on("connection", (socket) => {
      socket.on("check_room", async (name) => {
        const roomExists = !!io.sockets.adapter.rooms.has(name);
        const notFull = rooms[name].length < 6;
        socket.emit("check_room", roomExists && notFull);
      });

      socket.on("check_new_room", async (name) => {
        const roomNameAvailable = !io.sockets.adapter.rooms.has(name);
        socket.emit("check_new_room", roomNameAvailable);
      });

      socket.on("check_name", async (data) => {
        const { roomCode, username } = data;
        const nameIsAvail = !rooms[roomCode]?.[username];
        socket.emit("check_name", nameIsAvail);
      });

      socket.on("join_room", async (data) => {
        const { roomCode, username } = data;
        if (!roomCode || !username) return;
        await socket.join(roomCode);
        if (rooms[roomCode]) {
          rooms[roomCode].push(username);
          socketUserMap[socket.id] = { username, roomCode };
        } else {
          rooms[roomCode] = [username];
          socketUserMap[socket.id] = { username, roomCode };
        }
        socket.nsp.to(roomCode).emit("join_room", data);
      });

      socket.on("disconnecting", () => {
        const { username, roomCode } = socketUserMap[socket.id];
        const participants = rooms[roomCode];
        const index = participants.indexOf(username);
        if (index > -1) {
          participants.splice(index, 1);
          if (!participants.length) {
            delete rooms[roomCode];
          }
        }
        console.log("disconnecting"); // false
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
