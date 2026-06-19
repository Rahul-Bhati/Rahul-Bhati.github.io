"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createSession, destroySession } from "@/lib/session";
import { checkRateLimit, registerFailure, resetRateLimit } from "@/lib/rate-limit";

// Dummy hash so a wrong email still incurs a bcrypt comparison (no user enumeration via timing).
const DUMMY_HASH = "$2b$12$0000000000000000000000000000000000000000000000000000a";

/**
 * Tolerate how ADMIN_PASSWORD_HASH may arrive across environments:
 *  - `.env.local` (dotenv-expand) needs `$` escaped as `\$`; if that escaped form
 *    is pasted verbatim into Vercel (no dotenv-expand), it arrives with literal
 *    backslashes — strip them back to a valid bcrypt hash.
 *  - Also strip accidental wrapping quotes.
 */
function normalizeHash(raw: string | undefined): string | undefined {
  let h = raw?.trim();
  if (!h) return undefined;
  if (
    (h.startsWith('"') && h.endsWith('"')) ||
    (h.startsWith("'") && h.endsWith("'"))
  ) {
    h = h.slice(1, -1);
  }
  return h.replace(/\\\$/g, "$");
}

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type LoginState = { error?: string };

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** Reject cross-site POSTs (defense-in-depth atop Next's built-in Server Action origin check). */
async function assertSameOrigin(): Promise<boolean> {
  const h = await headers();
  const site = h.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return false;
  const origin = h.get("origin");
  const host = h.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return false;
    } catch {
      return false;
    }
  }
  return true;
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!(await assertSameOrigin())) {
    return { error: "Request blocked. Please reload the page and try again." };
  }

  const ip = await clientIp();
  const rl = checkRateLimit(`login:${ip}`);
  if (!rl.allowed) {
    const mins = Math.ceil(rl.retryAfterSec / 60);
    return { error: `Too many attempts. Try again in about ${mins} minute(s).` };
  }

  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminHash = normalizeHash(process.env.ADMIN_PASSWORD_HASH);
  if (!adminEmail || !adminHash) {
    return { error: "Server is not configured for login. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH." };
  }

  const emailMatches = parsed.data.email === adminEmail;
  // Always run a compare to keep timing uniform whether or not the email matched.
  const passwordMatches = await bcrypt.compare(
    parsed.data.password,
    emailMatches ? adminHash : DUMMY_HASH,
  );

  if (!emailMatches || !passwordMatches) {
    registerFailure(`login:${ip}`);
    return { error: "Invalid email or password." };
  }

  resetRateLimit(`login:${ip}`);
  await createSession({ sub: "admin", email: adminEmail });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
