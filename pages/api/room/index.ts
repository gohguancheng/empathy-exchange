import serverStore from "@/lib/roomStore";
import { EStage, NextApiResponseWithSocket } from "@/utils/types";
import { NextApiRequest } from "next";

export default function roomHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomCode, username, host } = req.body;
  const isHost = host;
  const room = serverStore.getRoom(roomCode as string);
  const users = serverStore.getRoomUsers(roomCode as string);
  if (isHost) {
    if (!room) {
      serverStore.rooms[roomCode] = {
        current: { stage: EStage.WAITING },
        users: [{ username }],
      };
    } else if (!!users[0].online) {
      return res
        .status(400)
        .json({ error: `Space host [${username}] is online` });
    }

    return res.status(200).json({ message: "OK", roomCode, username });
  } else {
    if (!room) return res.status(400).json({ error: `Space does not exist!` });

    const user = users.find((p) => p.username === username);

    if (user?.online) {
      return res
        .status(400)
        .json({ error: `Username ${user.username} is online` });
    } else {
      if (!user) users.push({ username });
      return res.status(200).json({ message: "OK", roomCode, username });
    }
  }
}
