import { auth } from "@/lib/auth";
import { decrypt } from "./encryption";
import { Session } from "next-auth";
import { IUserInfo } from "@/interfaces/types";

export async function getAccessToken() {
  const session = await auth();
  if (session?.access_token && !session.error){
    const accessTokenDecrypted = decrypt(session.access_token);
    return accessTokenDecrypted;
  }
  return null;
}

export async function getIdToken() {
  const session = await auth();
  if (session?.id_token && !session.error){
    const idTokenDecrypted = decrypt(session.id_token);
    return idTokenDecrypted;
  }
  return null;
}

function getAccessRoles(session: Session | null): string[] {
  return session?.roles ?? [];
}

export const enum CheckRolesStrategy {
  INCLUDES_AT_LEAST_ONE = 1,
  INCLUDES_ALL = 2,
  EXCLUDES_ALL = 3, 
}

export function checkAccessRoles(session: Session | null, rolesToCheck: string[], strategy: CheckRolesStrategy = CheckRolesStrategy.INCLUDES_AT_LEAST_ONE) : boolean {
  const userRoles = getAccessRoles(session);
  if (!userRoles.length) return false;
  
  const matchingRoles = userRoles.filter(role => rolesToCheck.includes(role));

  switch(strategy) {
    case CheckRolesStrategy.INCLUDES_AT_LEAST_ONE:
      return matchingRoles.length > 0;

    case CheckRolesStrategy.INCLUDES_ALL:
      return matchingRoles.length === rolesToCheck.length;
      
    case CheckRolesStrategy.EXCLUDES_ALL:
      return matchingRoles.length === 0;

    default:
      return false;
  }
}
export function getUserBySession(session: Session | null) : IUserInfo | null {
  if (session?.userInfo) {
    const {
      name, given_name, family_name, email, email_verified, organizacao, preferred_username, realm_access
    } = session.userInfo;
  
    return {
      name, given_name, family_name, email, email_verified, organizacao, preferred_username, realm_access
    };
  }
  return null;
}