import type { NextApiResponse } from "next";
import type { Server as NetServer, Socket } from "net";
import { Server } from "socket.io";

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: Socket & { server: NetServer & { io: Server } };
}

export interface IUser {
  username: string;
  role?: ERole;
  topic?: string;
  online?: string | null;
  done?: boolean;
}

export type IUserData = IUser & { host?: boolean };

export enum EStage {
  WAITING = 1,
  TOPIC_INPUT = 2,
  ROLE_SELECT = 3,
  SHARING = 4,
  END = 5,
}

export interface IRoom {
  users: IUser[];
  current:
    | { stage: Omit<EStage, EStage.SHARING>; speaker?: string }
    | { stage: EStage.SHARING; speaker: string };
}

export interface IRooms {
  [roomCode: string]: IRoom;
}

export enum ERole {
  EMPATHISER = "e1",
  SUMMARISER = "s1",
  REFLECTOR = "r1",
}
