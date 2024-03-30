import { ERoles } from "@/utils/types";

export const roles = {
  [ERoles.EMPATHISER]: {
    label: "Empathiser",
    description:
      "You try to understand and share the feelings of those speaking. You offer compassion, support, and a listening ear to them. In this role, you provide comfort and reassurance to those facing challenges, helping them feel understood and less alone in their struggles.",
    emoji: "🤗",
  },
  [ERoles.REFLECTOR]: {
    label: "Reflector",
    description:
      "You mirror back the thoughts and emotions expressed by others, fostering deeper understanding and clarity in conversations. By paraphrasing and summarizing what others say, you help them gain insight into their own feelings and experiences, promoting self-awareness and personal growth.",
    emoji: "💬",
  },
  [ERoles.SUMMARISER]: {
    label: "Summariser",
    description:
      "You distill complex information into clear and concise summaries. Through synthesizing key points from discussions and providing comprehensive overviews, you practice organizing thoughts and ideas effectively. By actively engaging in this process, you develop the skill of communicating main takeaways succinctly, facilitating collaboration and understanding among participants.",
    emoji: "📋",
  },
};
