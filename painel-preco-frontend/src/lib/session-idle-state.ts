/**
 * Client-only module singleton for idle-session tracking.
 * SessionKeepalive writes to it; any component can read it.
 */
export const IDLE_TIMEOUT_MS =
  Number(process.env.NEXT_PUBLIC_SESSION_IDLE_TIMEOUT_MINUTES ?? 15) * 60 * 1000;

// Initialised to now() on the client; 0 on the server (SSR — never read there).
let _lastActivityTime: number =
  typeof window !== "undefined" ? Date.now() : 0;

export function recordActivity(): void {
  _lastActivityTime = Date.now();
}

export function getLastActivityTime(): number {
  return _lastActivityTime;
}

export function getIdleRemainingMs(): number {
  return Math.max(0, _lastActivityTime + IDLE_TIMEOUT_MS - Date.now());
}
