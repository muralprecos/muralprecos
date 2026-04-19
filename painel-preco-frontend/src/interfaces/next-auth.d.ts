import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { IUserInfo } from "@/interfaces/types";

declare module "next-auth" {
  interface Session {
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    userInfo?: IUserInfo;
    roles?: string[];
    error?: string;
    user: DefaultSession["user"];
  }

  interface User extends DefaultUser {
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    decoded?: IUserInfo;
    error?: string;
    updateFirstName?: string;
    updateLastName?: string;
    updateName?: string;
    updateEmail?: string;
  }
}
