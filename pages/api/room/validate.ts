import { NextApiResponseWithSocket } from "@/utils/types";
import { NextApiRequest } from "next";
import spaces from "@/lib/spaces";

export default async function validateHandler(
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
  let message;
  let name;

  const space = await spaces.getSpace(roomCode as string);
  if (isHost) {
    if (space) {
      const host = await spaces.getUser(roomCode as string, space.host);
      isAvail = !host?.clientId;
      name = host?.name;
      if (!isAvail) message = "Space is in use with an online host";
    } else {
      isAvail = true;
    }
  } else {
    isAvail = !!(space && space?.capacity < 5);
    if (!isAvail)
      message = !space
        ? "Space does not exist"
        : "Space is at maximum capacity";
  }

  return res.status(200).json({ isAvail, roomCode, name, message });
}
