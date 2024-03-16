import { NextApiResponseWithSocket } from "@/utils/types";
import { NextApiRequest } from "next";
import { rooms } from ".";

export default function validateHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomCode, host = "" } = req.query;
  const isHost = (host as string).toLowerCase() === "true";
  /**
   * Validate room code
   * - host can proceed when:
   *    - room does not exist, OR
   *    - room host is disconnected
   * - non-host can proceed when:
   *    - room exists and is not full
   */

  let isAvail = false;
  let username;
  const room = rooms[roomCode as string];

  if (isHost) {
    if (room) {
      isAvail = !room.users[0].online;
      username = isAvail ? room.users[0].username : undefined;
    } else {
      isAvail = true;
    }
  } else {
    isAvail = !!room && room.users.length < 5;
  }

  const message = isAvail ? undefined : "Room is not available";
  return res.status(200).json({ isAvail, roomCode, username, message });
}
