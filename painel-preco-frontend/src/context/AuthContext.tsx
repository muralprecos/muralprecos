"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { ClientSession } from "@/interfaces/auth";

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

const AuthContext = createContext<AuthContextValue>({
  data: null,
  status: "loading",
  update: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ClientSession | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const session: ClientSession | null = await res.json();
        if (session) {
          setData(session);
          setStatus("authenticated");
        } else {
          setData(null);
          setStatus("unauthenticated");
        }
      } else {
        setData(null);
        setStatus("unauthenticated");
      }
    } catch {
      setData(null);
      setStatus("unauthenticated");
    }
  }, []);

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
