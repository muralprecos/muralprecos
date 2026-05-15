"use client";

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { ClientSession } from "@/interfaces/auth";

const LOGIN_PATH = "/login";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  data: ClientSession | null;
  status: SessionStatus;
  update: (data?: Partial<UpdateSessionData>) => Promise<void>;
}

interface UpdateSessionData {
  firstName: string;
  lastName: string;
  email: string;
  name: string;
}

const PUBLIC_PATHS = ["/login", "/unauthorized", "/validar-cotacao"];

const AuthContext = createContext<AuthContextValue>({
  data: null,
  status: "loading",
  update: async () => {},
});

function redirectToLogin() {
  if (typeof window !== "undefined" && window.location.pathname !== LOGIN_PATH) {
    window.location.href = LOGIN_PATH;
  }
}

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

async function clearSession() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Best-effort: proceed to redirect even if logout call fails
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ClientSession | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");
  const interceptorInstalled = useRef(false);
  const pathname = usePathname();

  const handleExpiredSession = useCallback(async () => {
    setData(null);
    setStatus("unauthenticated");
    await clearSession();
    if (typeof window !== "undefined" && !isPublicPath(window.location.pathname)) {
      redirectToLogin();
    }
  }, []);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const session: ClientSession | null = await res.json();
        if (session) {
          setData(session);
          setStatus("authenticated");
        } else {
          // Session cookie present but not found in store (e.g. after container restart)
          await handleExpiredSession();
        }
      } else {
        if (res.status === 401 || res.status === 422) {
          await handleExpiredSession();
          return;
        }
        setData(null);
        setStatus("unauthenticated");
      }
    } catch {
      setData(null);
      setStatus("unauthenticated");
    }
  }, [handleExpiredSession]);

  // Install a one-time fetch interceptor to catch 401s from backend API calls.
  // This handles access-token expiry that occurs mid-session while the user is active.
  useEffect(() => {
    if (interceptorInstalled.current) return;
    interceptorInstalled.current = true;

    const originalFetch = globalThis.fetch;

    globalThis.fetch = async function patchedFetch(
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> {
      const response = await originalFetch(input, init);

      if (response.status === 401 || response.status === 422) {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        // Only intercept calls to our Next.js API proxy routes, not auth routes themselves
        if (url.startsWith("/api/") && !url.startsWith("/api/auth/")) {
          window.dispatchEvent(new CustomEvent("session:expired"));
        }
      }

      return response;
    };

    return () => {
      globalThis.fetch = originalFetch;
    };
  }, []);

  // Handle session:expired events dispatched by the fetch interceptor
  useEffect(() => {
    const handler = () => handleExpiredSession();
    window.addEventListener("session:expired", handler);
    return () => window.removeEventListener("session:expired", handler);
  }, [handleExpiredSession]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const update = useCallback(
    async (updateData?: Partial<UpdateSessionData>) => {
      if (updateData) {
        await fetch("/api/auth/session", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
      }
      await fetchSession();
    },
    [fetchSession]
  );

  return (
    <AuthContext.Provider value={{ data, status, update }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthSession(): AuthContextValue {
  return useContext(AuthContext);
}
