import { NextResponse, userAgent, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hashSession } from "@/lib/analytics";

// Node runtime (uses node:crypto via analytics + Prisma).
export const runtime = "nodejs";

const NO_CONTENT = new NextResponse(null, { status: 204 });

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  // Respect Do Not Track / Global Privacy Control.
  if (req.headers.get("dnt") === "1" || req.headers.get("sec-gpc") === "1") {
    return NO_CONTENT;
  }

  let path: unknown;
  try {
    ({ path } = await req.json());
  } catch {
    return NO_CONTENT;
  }
  if (typeof path !== "string" || !path.startsWith("/")) return NO_CONTENT;

  // Don't track admin or API traffic.
  if (path.startsWith("/admin") || path.startsWith("/api")) return NO_CONTENT;

  const { isBot, device } = userAgent(req);
  const ua = req.headers.get("user-agent") ?? "";
  const referrerRaw = req.headers.get("referer");
  // Only keep external referrers (ignore same-origin navigation).
  let referrer: string | null = null;
  if (referrerRaw) {
    try {
      const refHost = new URL(referrerRaw).host;
      if (refHost !== req.nextUrl.host) referrer = referrerRaw;
    } catch {
      /* ignore malformed referrer */
    }
  }

  try {
    await db.pageView.create({
      data: {
        path: path.slice(0, 512),
        referrer: referrer?.slice(0, 512) ?? null,
        country: req.headers.get("x-vercel-ip-country"),
        device: device.type ?? "desktop",
        sessionHash: hashSession(clientIp(req), ua),
        isBot,
      },
    });
  } catch {
    // Never let analytics failures surface to the client.
  }
  return NO_CONTENT;
}
