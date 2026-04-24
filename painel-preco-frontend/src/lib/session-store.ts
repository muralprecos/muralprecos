import "server-only";
import { SessionPayload } from "@/interfaces/auth";

const SESSION_TTL_MS = 60 * 60 * 24 * 30 * 1000; // 30 days

interface StoreEntry {
  payload: SessionPayload;
  expiresAt: number;
}

//TODO: Implementar limpeza periódica de sessões expiradas para evitar o consumo excessivo de memória em processos de longa duração.
//TODO: Considerar o uso de uma solução de armazenamento mais robusta (por exemplo, Redis) para ambientes de produção ou se precisarmos de escalabilidade horizontal.

// Use globalThis to survive HMR in development (module cache is cleared on hot reload,
// but globalThis persists for the lifetime of the Node.js process).
declare global {
  // eslint-disable-next-line no-var
  var __sessionStore: Map<string, StoreEntry> | undefined;
}

function getStore(): Map<string, StoreEntry> {
  if (!globalThis.__sessionStore) {
    globalThis.__sessionStore = new Map();
  }
  return globalThis.__sessionStore;
}

export function sessionStoreGet(id: string): SessionPayload | null {
  const store = getStore();
  const entry = store.get(id);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(id);
    return null;
  }
  return entry.payload;
}

export function sessionStoreSet(id: string, payload: SessionPayload): void {
  getStore().set(id, {
    payload,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
}

export function sessionStoreDelete(id: string): void {
  getStore().delete(id);
}
