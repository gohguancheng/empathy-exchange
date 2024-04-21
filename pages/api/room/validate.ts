import serverStore from "@/lib/roomStore";
import { NextApiResponseWithSocket } from "@/utils/types";
import { NextApiRequest } from "next";

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
   * Validate Space code
   * - host can proceed when:
   *    - Space does not exist, OR
   *    - Space host is disconnected
   * - non-host can proceed when:
   *    - Space exists and is not full
   */

  let isAvail = false;
  let username;
  const users = serverStore.getRoomUsers(roomCode as string);

  if (isHost) {
    if (users) {
      isAvail = !users[0].online;
      username = isAvail ? users[0].username : undefined;
    } else {
      isAvail = true;
    }
  } else {
    isAvail = !!users && users.length < 5;
  }

  const message = isAvail ? undefined : "Space is not available";
  return res.status(200).json({ isAvail, roomCode, username, message });
}
