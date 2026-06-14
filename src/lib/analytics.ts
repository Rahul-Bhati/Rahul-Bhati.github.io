import "server-only";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";

/**
 * Daily-rotating, salted session hash. No raw IP/UA is ever stored — only this
 * one-way digest, which also rotates each day so visitors can't be tracked
 * across days. Used to approximate "unique visitors".
 */
export function hashSession(ip: string, ua: string): string {
  const salt = process.env.AUTH_SECRET ?? "fallback-salt";
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  return createHash("sha256").update(`${ip}|${ua}|${day}|${salt}`).digest("hex");
}

export type DashboardStats = {
  totalViews: number;
  uniqueVisitors: number;
  viewsLast7: number;
  daily: { day: string; views: number }[];
  topPaths: { path: string; views: number }[];
  topReferrers: { referrer: string; views: number }[];
};

/** Aggregate analytics for the dashboard. Bots are always excluded. */
export async function getDashboardStats(days = 30): Promise<DashboardStats> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (days - 1));
  since.setUTCHours(0, 0, 0, 0);

  const [totals, dailyRows, topPaths, topReferrers] = await Promise.all([
    db.$queryRaw<{ total: bigint; unique: bigint; last7: bigint }[]>`
      SELECT
        COUNT(*) FILTER (WHERE "isBot" = false) AS total,
        COUNT(DISTINCT "sessionHash") FILTER (WHERE "isBot" = false) AS unique,
        COUNT(*) FILTER (WHERE "isBot" = false AND "createdAt" >= NOW() - INTERVAL '7 days') AS last7
      FROM "PageView"
    `,
    db.$queryRaw<{ day: Date; views: bigint }[]>`
      SELECT date_trunc('day', "createdAt") AS day, COUNT(*) AS views
      FROM "PageView"
      WHERE "isBot" = false AND "createdAt" >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `,
    db.pageView.groupBy({
      by: ["path"],
      where: { isBot: false },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 8,
    }),
    db.pageView.groupBy({
      by: ["referrer"],
      where: { isBot: false, referrer: { not: null } },
      _count: { referrer: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 8,
    }),
  ]);

  // Fill gaps so the chart always shows `days` buckets.
  const byDay = new Map(
    dailyRows.map((r) => [r.day.toISOString().slice(0, 10), Number(r.views)]),
  );
  const daily: { day: string; views: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    daily.push({ day: key, views: byDay.get(key) ?? 0 });
  }

  const t = totals[0];
  return {
    totalViews: Number(t?.total ?? 0),
    uniqueVisitors: Number(t?.unique ?? 0),
    viewsLast7: Number(t?.last7 ?? 0),
    daily,
    topPaths: topPaths.map((p) => ({ path: p.path, views: p._count.path })),
    topReferrers: topReferrers
      .filter((r) => r.referrer)
      .map((r) => ({ referrer: r.referrer as string, views: r._count.referrer })),
  };
}
