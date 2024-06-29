import type { NextApiResponse } from "next";
import type { Server as NetServer, Socket } from "net";
import { Server } from "socket.io";
import { IUser } from "@/lib/user";

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: Socket & { server: NetServer & { io: Server } };
}

export enum EStage {
  WAITING = 1,
  TOPIC_INPUT = 2,
  ROLE_SELECT = 3,
  SHARING = 4,
  END = 5,
}

export enum ERole {
  EMPATHISER = "e1",
  SUMMARISER = "s1",
  REFLECTOR = "r1",
}

export interface ISpace {
  stage: EStage;
  host: string;
  capacity: number;
  speaker?: string;
  users?: IUser[];
  timeout?: string;
}
