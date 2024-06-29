import { ERole } from "@/utils/types";

export interface IUser {
  name: string;
  n: number;
  clientId?: string | null;
  topic?: string;
  role?: ERole;
  done?: boolean;
}

export type TUserProps = "name" | "clientId" | "n" | "role" | "topic" | "done";
