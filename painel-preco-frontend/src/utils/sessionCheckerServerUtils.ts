import { Session } from "next-auth";
import { INITIAL_PAGE_LOGIN, UNAUTH_PAGE } from "./routesUtils";
import { CheckRolesStrategy, checkAccessRoles, getAccessToken } from "./sessionTokenAccessor";


export type SessionCheck = {
  accessToken: string | null
  hasAuthorization: boolean
  redirectUrl: string | null
}

export async function checkSession(session: Session | null, rolesToCkeck: string[], rolesCheckStrategy: CheckRolesStrategy) : Promise<SessionCheck> {
  const res : SessionCheck = {
    accessToken: null,
    redirectUrl: null,
    hasAuthorization: false
  }
  if (!session || !session.userInfo) {
    res.redirectUrl = INITIAL_PAGE_LOGIN;
  }

  res.accessToken = await getAccessToken() || '';
  res.hasAuthorization = checkAccessRoles(session, rolesToCkeck, rolesCheckStrategy);

  if (!res.accessToken) {
    res.redirectUrl = INITIAL_PAGE_LOGIN;
  } else if (!res.hasAuthorization) {
    res.redirectUrl = UNAUTH_PAGE;
  }

  return res;
}