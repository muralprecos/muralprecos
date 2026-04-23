import { ClientSession } from "@/interfaces/auth";
import { IUserInfo } from "@/interfaces/types";

export const enum CheckRolesStrategy {
  INCLUDES_AT_LEAST_ONE = 1,
  INCLUDES_ALL = 2,
  EXCLUDES_ALL = 3,
}

function getAccessRoles(session: ClientSession | null): string[] {
  return session?.roles ?? [];
}

function normalizeRole(role: string): string {
  return role.toUpperCase().replace(/^ROLE_/, "");
}

export function checkAccessRoles(
  session: ClientSession | null,
  rolesToCheck: string[],
  strategy: CheckRolesStrategy = CheckRolesStrategy.INCLUDES_AT_LEAST_ONE
): boolean {
  const userRoles = getAccessRoles(session);
  if (!userRoles.length) return false;

  const normalizedUserRoles = userRoles.map(normalizeRole);
  const normalizedRolesToCheck = rolesToCheck.map(normalizeRole);
  const matchingRoles = normalizedUserRoles.filter((role) =>
    normalizedRolesToCheck.includes(role)
  );

  switch (strategy) {
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

export function getUserBySession(session: ClientSession | null): IUserInfo | null {
  if (session?.userInfo) {
    const {
      name,
      given_name,
      family_name,
      email,
      email_verified,
      organizacao,
      preferred_username,
      realm_access,
    } = session.userInfo;

    return {
      name,
      given_name,
      family_name,
      email,
      email_verified,
      organizacao,
      preferred_username,
      realm_access,
    };
  }
  return null;
}
