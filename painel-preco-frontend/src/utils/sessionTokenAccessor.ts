import "server-only";
import { getAccessToken as _getAccessToken, getIdToken as _getIdToken, getRefreshToken as _getRefreshToken } from "@/lib/auth";

export async function getAccessToken() {
  return _getAccessToken();
}

export async function getIdToken() {
  return _getIdToken();
}

export async function getRefreshToken() {
  return _getRefreshToken();
}

// Re-export pure client-safe role utilities for backward compatibility
export { CheckRolesStrategy, checkAccessRoles, getUserBySession } from "./rolesUtils";
