import { ERole } from "@/utils/types";

export const roles = {
  [ERole.EMPATHISER]: {
    label: "Empathiser",
    description: [
      "Try to understand and share the feelings of those speaking",
      "Offer compassion, support, and a listening ear to others",
      "Provide words of comfort and reassurance",
      "Let others feel understood and less alone in their struggles",
    ],
    emoji: "🤗",
  },
  [ERole.REFLECTOR]: {
    label: "Reflector",
    description: [
      "Mirror back the thoughts and emotions expressed by speakers back to them",
      "Paraphrase what others say to help them gain insight into their own feelings and experiences",
      "Promote self-awareness by allowing others to hear and reflect on what they said",
    ],
    emoji: "💬",
  },
  [ERole.SUMMARISER]: {
    label: "Summariser",
    description: [
      "Distill complex information into clear and concise summaries",
      "Simplify important points from discussions and provide comprehensive overviews",
      "Practice organizing thoughts and ideas",
      "Develop the skill of communicating main takeaways succinctly",
    ],
    emoji: "📋",
  },
};

export const speakerRole = {
  label: "Speaker",
  description: [
    "Remember that effective communication involves understanding the capacity of your listeners",
    "Provide sufficient warning before sharing details that may be uncomfortable",
    "Avoid trauma dumping or sharing in an overly aggressive manner",
    "Be considerate of the duration of your sharing",
  ],
  emoji: "🎤",
};
