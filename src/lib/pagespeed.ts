import "server-only";
import { SITE_URL } from "@/lib/seo";

export type PageSpeedScores = {
  performance: number | null;
  seo: number | null;
  accessibility: number | null;
  bestPractices: number | null;
};

export type PageSpeedResult =
  | { ok: true; scores: PageSpeedScores; analyzedUrl: string }
  | { ok: false; reason: "no-key" | "error"; message?: string };

const CATEGORIES = ["performance", "seo", "accessibility", "best-practices"] as const;

/**
 * Fetch Lighthouse category scores from the Google PageSpeed Insights API.
 * Cached for 6h. Degrades gracefully when PAGESPEED_API_KEY is unset.
 */
export async function getPageSpeed(
  url = SITE_URL,
): Promise<PageSpeedResult> {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) return { ok: false, reason: "no-key" };

  const endpoint = new URL(
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
  );
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("key", key);
  endpoint.searchParams.set("strategy", "mobile");
  for (const c of CATEGORIES) endpoint.searchParams.append("category", c);

  try {
    const res = await fetch(endpoint, { next: { revalidate: 21600 } });
    if (!res.ok) {
      return { ok: false, reason: "error", message: `PSI ${res.status}` };
    }
    const data = await res.json();
    const cats = data?.lighthouseResult?.categories ?? {};
    const pct = (v: unknown) =>
      typeof v === "number" ? Math.round(v * 100) : null;
    return {
      ok: true,
      analyzedUrl: url,
      scores: {
        performance: pct(cats.performance?.score),
        seo: pct(cats.seo?.score),
        accessibility: pct(cats.accessibility?.score),
        bestPractices: pct(cats["best-practices"]?.score),
      },
    };
  } catch (e) {
    return { ok: false, reason: "error", message: (e as Error).message };
  }
}
