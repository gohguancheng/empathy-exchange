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
  let message;

  if (isHost) {
    isAvail = !users || (users[0].username === username && !users[0].online);
    if (!isAvail) {
      message = "Host is already online";
    }
  } else {
    const userIndex = users.findIndex((member) => member.username === username);
    const existingUser = userIndex > -1 ? users[userIndex] : undefined;
    const fullRoom = !!users && users.length >= 5;

    if (userIndex === 0) {
      message = "Username is used by host, switch mode to host a Space";
    } else if (!!existingUser && !!existingUser.online) {
      message = "User is already online";
    } else if (!existingUser && fullRoom) {
      message = "Space is full";
    } else {
      isAvail = true;
    }
  }

  return res.status(200).json({ isAvail, roomCode, username, message });
}
