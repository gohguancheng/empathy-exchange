import type { NextApiRequest } from "next";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { ISpace, NextApiResponseWithSocket } from "@/utils/types";
import spaces from "@/lib/spaces";
import { IUser } from "@/lib/user";

const attachCredentials = async (socket: Socket) => {
  const data = { ...socket.handshake.auth } as {
    roomCode: string;
    username: string;
    _me?: IUser;
    _hostedSpace?: ISpace;
  };
  const { roomCode = "", username = "" } = data;

  try {
    const space = await spaces.getSpace(roomCode);
    if (!space) {
      throw "Space not found";
    }

    const user = await spaces.getUser(roomCode, username);
    if (!user?.name) {
      throw `User, ${username}, has been logged out`;
    } else if (!!user?.clientId) {
      throw "User is already online";
    }

    await spaces.setUserProperty(roomCode, username, { clientId: socket.id });
    data._hostedSpace = space;
    data._me = { ...user, clientId: socket.id };
    socket.data = data;
  } catch (err) {
    throw err;
  }
};

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket?.server?.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const httpServer: HttpServer = res.socket.server as any;
    const io = new Server(httpServer, { addTrailingSlash: false });
    res.socket.server.io = io;

    io.use(async (socket, next) => {
      if (socket.data._me?.clientId === socket.id) next();
      try {
        await attachCredentials(socket);
        next();
      } catch (error: any) {
        const err = new Error(error);
        next(err);
      }
    });

    io.on("connection", async (socket) => {
      const { roomCode, _me, _hostedSpace: space } = socket.data;
      socket.join(roomCode);
      const users = await spaces.getSpaceUsers(roomCode);
      socket.emit("auth_success", {
        me: { ..._me, host: _me.n === 0 },
        users,
        space,
      });
      socket.to(socket.data.roomCode).emit("user_updated", _me);
      if (_me.n !== 0) socket.data._hostedSpace = undefined; // remove for non-host

      socket.on("space_update", async (update, callback) => {
        if (!socket.data._hostedSpace) return;
        const { key, value } = update;
        await spaces.setSpaceProperty(
          socket.data.roomCode,
          socket.data.username,
          { [key]: value }
        );
        socket.data._hostedSpace[key] = value;
        const newState = socket.data._hostedSpace;

        callback(newState);
        socket.to(socket.data.roomCode).emit("space_updated", newState);
      });

      socket.on("user_update", async (update, callback) => {
        const { key, value } = update;
        await spaces.setUserProperty(
          socket.data.roomCode,
          socket.data.username,
          { [key]: value }
        );
        socket.data._me[key] = value;
        const newState = socket.data._me;
        callback(newState);
        socket.to(socket.data.roomCode).emit("user_updated", newState);
      });

      socket.on("disconnecting", async () => {
        const { roomCode, username } = socket.data;
        await spaces.setUserProperty(roomCode, username, { clientId: "" });

        socket
          .to(roomCode)
          .emit("user_updated", { ...socket.data._me, clientId: "" });
      });

      socket.on("disconnect", async () => {
        const { roomCode } = socket.data;
        const isEmptyAfter = !io.sockets.adapter.rooms.get(roomCode);
        if (isEmptyAfter) {
          await spaces.deleteSpace(roomCode);
        }
      });
    });
  }

  res.end();
}
