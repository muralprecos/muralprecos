import { jwtDecode } from "jwt-decode";

export const COOKIE_NAME = "__session";

/**
 * Returns true if the JWT access token is expired (or within 120-second buffer).
 * Safe to use in both Node.js and Edge runtimes.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    // 120-second buffer: refresh proactively 2 min before actual expiry
    return Date.now() / 1000 > decoded.exp - 120;
  } catch {
    return true;
  }
}
