import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "pf_session";
const MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day

export type SessionPayload = {
  sub: string; // "admin"
  email: string;
};

function getKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or too short (need 32+ chars). Generate with: openssl rand -base64 48",
    );
  }
  return new TextEncoder().encode(secret);
}

/** Sign a session JWT (HS256, 7-day expiry). */
export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(getKey());
}

/** Verify a session JWT. Returns payload or null. */
export async function decryptSession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, getKey(), {
      algorithms: ["HS256"],
    });
    if (!payload.sub || !payload.email) return null;
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

/** Create the session cookie (call from a Server Action / Route Handler). */
export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Read + verify the current session (Server Components / Actions). */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return decryptSession(cookieStore.get(SESSION_COOKIE)?.value);
}

/** Clear the session cookie (logout). */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
