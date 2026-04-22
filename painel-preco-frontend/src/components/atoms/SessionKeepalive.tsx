"use client";

import { useEffect } from "react";
import { logoutAction } from "@/app/action/logoutActions";
import { recordActivity, IDLE_TIMEOUT_MS, getLastActivityTime } from "@/lib/session-idle-state";

const CHECK_INTERVAL_MS = 60 * 1000; // check every 1 minute

const ACTIVITY_EVENTS = [
  // "mousemove",
  // "mousedown",
  "keydown",
  "touchstart",
  // "scroll",
  "click",
] as const;

export function SessionKeepalive() {
  useEffect(() => {
    ACTIVITY_EVENTS.forEach((e) =>
      window.addEventListener(e, recordActivity, { passive: true })
    );

    const check = async () => {
      const idleDuration = Date.now() - getLastActivityTime();
      if (idleDuration >= IDLE_TIMEOUT_MS) {
        await logoutAction();
        return;
      }
      fetch("/api/auth/session", { method: "GET", credentials: "same-origin" }).catch(
        () => undefined
      );
    };

    const id = setInterval(check, CHECK_INTERVAL_MS);

    return () => {
      clearInterval(id);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, recordActivity));
    };
  }, []);

  return null;
}
