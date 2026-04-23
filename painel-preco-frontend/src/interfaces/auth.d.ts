import { IUserInfo } from "@/interfaces/types";

export interface SessionPayload {
  access_token: string;
  id_token: string;
  refresh_token: string;
  decoded: IUserInfo;
  error?: string;
  session_start?: number;
}

export interface ClientSession {
  userInfo: IUserInfo;
  roles: string[];
  error?: string;
  session_start?: number;
}
