import serverStore from "@/lib/roomStore";
import { NextApiResponseWithSocket } from "@/utils/types";
import { NextApiRequest } from "next";

export default function validateUserHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomCode, host = "", username } = req.query;
  const isHost = (host as string).toLowerCase() === "true";
  /**
   * Validate username
   * - host can proceed when:
   *    - room is new
   *    - room host is not online (rejoin)
   * - non-host can proceed when:
   *    - room exists and no user with same name is online
   */

  let isAvail = false;
  const users = serverStore.getRoomUsers(roomCode as string);

  if (isHost) {
    isAvail = !users || (users[0].username === username && !users[0].online);
  } else {
    isAvail =
      !!users &&
      !users.find((member) => !!member.online && member.username === username);
  }

  const message = isAvail ? undefined : "Seems like that name is taken";
  return res.status(200).json({ isAvail, roomCode, username, message });
}
