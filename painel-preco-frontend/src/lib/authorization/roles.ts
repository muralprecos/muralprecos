export const ROLES = {
  ADMIN: "ADMIN",
  GESTOR: "GESTOR",
  USUARIO: "USUARIO",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

function normalizeRole(role: string): string {
  return role.toUpperCase().replace(/^ROLE_/, "");
}

export function hasRole(userRoles: string[] = [], requiredRole: Role): boolean {
  const required = normalizeRole(requiredRole);
  return userRoles.map(normalizeRole).includes(required);
}

export function hasAnyRole(
  userRoles: string[] = [],
  requiredRoles: Role[]
): boolean {
  return requiredRoles.some((role) => hasRole(userRoles, role));
}
