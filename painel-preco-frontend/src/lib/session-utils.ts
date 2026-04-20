import { EncryptJWT, jwtDecrypt } from "jose";
import { SessionPayload } from "@/interfaces/auth";

const COOKIE_NAME = "__session";
export { COOKIE_NAME };

/**
 * Returns a 32-byte Uint8Array key derived from AUTH_SECRET.
 * Works in both Node.js and Edge runtimes.
 */
export function getSessionSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not defined");
  const encoded = new TextEncoder().encode(secret);
  // A256GCM requires exactly 256 bits (32 bytes)
  const key = new Uint8Array(32);
  key.set(encoded.subarray(0, 32));
  return key;
}

export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new EncryptJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .encrypt(getSessionSecret());
}

export async function decryptSession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtDecrypt(token, getSessionSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
