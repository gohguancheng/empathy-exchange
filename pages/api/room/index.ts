import {
  EStage,
  IRooms,
  ISocketUserMap,
  NextApiResponseWithSocket,
} from "@/utils/types";
import { NextApiRequest } from "next";

export const rooms: IRooms = {};
export const socketUserMap: ISocketUserMap = {};

export default function roomHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomCode, username, host } = req.body;
  const isHost = host;
  const room = rooms[roomCode as string];
  if (isHost) {
    if (!room) {
      rooms[roomCode] = {
        current: { stage: EStage.WAITING },
        users: [{ username }],
      };
    } else if (!!room.users[0].online) {
      return res.status(400).json({ error: `Room host ${username} is online` });
    }

    return res.status(200).json({ message: "OK", roomCode, username });
  } else {
    if (!room) return res.status(400).json({ error: `Room does not exist!` });

    const user = room.users.find((p) => p.username === username && p.online);

    if (user) {
      return res
        .status(400)
        .json({ error: `Username ${user.username} is online` });
    } else {
      return res.status(200).json({ message: "OK", roomCode, username });
    }
  }
}
