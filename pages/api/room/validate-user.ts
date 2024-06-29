import spaces from "@/lib/spaces";
import { NextApiResponseWithSocket } from "@/utils/types";
import { NextApiRequest } from "next";

export default async function validateUserHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomCode, host = "", username: name } = req.query;
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
  let message;

  const user = await spaces.getUser(roomCode as string, name as string);
  if (isHost) {
    isAvail = !user || !user.clientId;
    message = isAvail ? undefined : "Host is already online";
  } else {
    if (!!user?.clientId) {
      message = "User is already online";
    } else {
      const space = await spaces.getSpace(roomCode as string);
      const isInvalidRole = name === space?.host;
      const isFull = space && !user && space?.capacity >= 5;

      if (isInvalidRole) {
        message = "Username is used by host, switch mode to host a Space";
      } else if (isFull) {
        message = "Space is full";
      } else {
        isAvail = true;
      }
    }
  }

  return res.status(200).json({ isAvail, roomCode, name, message });
}
