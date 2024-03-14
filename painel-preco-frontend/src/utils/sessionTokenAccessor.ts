
import { auth } from "auth";
import { decrypt } from "./encryption";
import { Session } from "next-auth";

export async function getAccessToken() {
  const session = await auth();
  if (!!session && !!session.access_token && session.error == null){
    const accessTokenDecrypted = decrypt(session.access_token)    
    return accessTokenDecrypted;
  }
  return null;
}

export async function getIdToken() {
  const session = await auth();
  if (!!session && !!session.id_token && session.error == null){    
    const idTokenDecrypted = decrypt(session.id_token)    
    return idTokenDecrypted;
  }
  return null;
}

function getAccessRoles(session: Session | null) {
  if (!!session && !!session.id_token && session.error == null){    
    return session.roles;
  }
  return [];
}
export const enum CheckRolesStrategy {
  INCLUDES_AT_LEAST_ONE = 1,
  INCLUDES_ALL = 2,
  EXCLUDES_AT_LEAST_ONE = 3,
  EXCLUDES_ALL = 4
}

export function checkAccessRoles(session: Session | null, rolesToCkeck: string[], strategy: CheckRolesStrategy = CheckRolesStrategy.INCLUDES_AT_LEAST_ONE) : boolean {
  const roles = getAccessRoles(session);
  let count = 0;
  rolesToCkeck.forEach(rc => {
    count = roles?.indexOf(rc) != -1 ? ++count : count;
  })
  switch(strategy) {
    case CheckRolesStrategy.INCLUDES_AT_LEAST_ONE || CheckRolesStrategy.EXCLUDES_AT_LEAST_ONE:
      return count > 0;
    case CheckRolesStrategy.INCLUDES_ALL || CheckRolesStrategy.EXCLUDES_ALL:
      return count == rolesToCkeck.length;
    default:
      return false;
  }
}

/**
 * Método retorna access token no client-side. Não é encorajado, porém inicialmente foi a forma encontrada para tratar com requisições front-end
 * @param session 
 * @returns 
 */
export async function getAccessTokenClient(session: Session|null) {
  if (!!session && !!session.access_token) {    
    const accessTokenDecrypted = decrypt(session.access_token)    
    return accessTokenDecrypted;
  }
  return null;
}

export function isAuthenticatedFail(session: Session|null, status: string) {
  return status == `authenticated` && (session == null || session.userInfo == null || session.access_token == null || session.error != null);
}