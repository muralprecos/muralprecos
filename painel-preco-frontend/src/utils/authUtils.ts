import { IUser } from "@/interfaces/types";

export function isLoggedIn(user: IUser) : boolean {
  return user != null && user.isAuth && user.user != null && user.user.userInfo != null && user.user.userToken != null;
}