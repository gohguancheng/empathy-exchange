import spaces from "@/lib/spaces";
import { NextApiResponseWithSocket } from "@/utils/types";
import { NextApiRequest } from "next";

export default async function roomHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomCode, username: name, host } = req.body;
  const isHost = host;

  const space = await spaces.getSpace(roomCode);
  const user = await spaces.getUser(roomCode, name);

  if (isHost) {
    if (!space) {
      await spaces.createSpace(roomCode, name);
    } else if (!!user?.clientId) {
      return res.status(400).json({ error: `Space host [${name}] is online` });
    }

    return res.status(200).json({ message: "OK", roomCode, name });
  } else {
    if (!space) return res.status(400).json({ error: `Space does not exist!` });

    if (user?.clientId) {
      return res.status(400).json({ error: `Username ${user.name} is online` });
    } else if (!user) {
      await spaces.saveUser(roomCode, name);
      return res.status(200).json({ message: "OK", roomCode, name });
    }
  }
}
