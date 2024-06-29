import { NextApiResponseWithSocket } from "@/utils/types";
import { NextApiRequest } from "next";
export default async function validateUserHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { secret } = req.body;

  if (secret === process.env.SECRET) {
    try {
      await spaces.flush();
      return res.status(200).json({ message: "Flushed" });
    } catch (err) {
      return res.status(500).json({ message: "Error flushing" });
    }
  }
  return res.status(403).json({ message: "Can't flush" });
}
