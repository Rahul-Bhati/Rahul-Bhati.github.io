import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Next.js 16: Middleware is now "Proxy". Runs on the Edge runtime, so it uses
// request.cookies (not next/headers) and Edge-compatible jose for verification.
// Per Next's auth guidance this is an OPTIMISTIC check only — the authoritative
// session verification happens in Server Components / Server Actions (lib/session.ts).

const SESSION_COOKIE = "pf_session";

function securityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  // Clickjacking protection that complements X-Frame-Options.
  res.headers.set("Content-Security-Policy", "frame-ancestors 'none'");
  return res;
}

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return Boolean(payload.sub && payload.email);
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";

  if (!isAdmin) return securityHeaders(NextResponse.next());

  const authed = await hasValidSession(req);

  // Authenticated user hitting the login page → send to dashboard.
  if (isLogin) {
    if (authed) return securityHeaders(NextResponse.redirect(new URL("/admin", req.url)));
    return securityHeaders(NextResponse.next());
  }

  // Any other /admin route requires a session.
  if (!authed) {
    const url = new URL("/admin/login", req.url);
    if (pathname !== "/admin") url.searchParams.set("next", pathname);
    return securityHeaders(NextResponse.redirect(url));
  }

  return securityHeaders(NextResponse.next());
}

export const config = {
  // Run on everything except Next internals & static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)"],
};
