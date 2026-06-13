import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDashboardStats } from "@/lib/analytics";
import { getPageSpeed } from "@/lib/pagespeed";
import {
  StatCard,
  ViewsChart,
  ScoreGauge,
  RankTable,
} from "@/components/admin/dashboard-widgets";

// Always render fresh analytics.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [stats, psi] = await Promise.all([getDashboardStats(30), getPageSpeed()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Signed in as {session.email}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total views" value={stats.totalViews.toLocaleString()} hint="All time, bots excluded" />
        <StatCard label="Unique visitors" value={stats.uniqueVisitors.toLocaleString()} hint="Distinct daily sessions" />
        <StatCard label="Views (7 days)" value={stats.viewsLast7.toLocaleString()} hint="Last 7 days" />
      </div>

      <ViewsChart daily={stats.daily} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RankTable
          title="Top pages"
          rows={stats.topPaths.map((p) => ({ label: p.path, views: p.views }))}
          emptyLabel="No views recorded yet."
        />
        <RankTable
          title="Top referrers"
          rows={stats.topReferrers.map((r) => ({ label: r.referrer, views: r.views }))}
          emptyLabel="No external referrers yet."
        />
      </div>

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            SEO &amp; performance
          </h2>
          {psi.ok && (
            <span className="truncate text-xs text-neutral-400 dark:text-neutral-500">
              {psi.analyzedUrl} · mobile
            </span>
          )}
        </div>
        {psi.ok ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <ScoreGauge label="SEO" value={psi.scores.seo} />
            <ScoreGauge label="Performance" value={psi.scores.performance} />
            <ScoreGauge label="Accessibility" value={psi.scores.accessibility} />
            <ScoreGauge label="Best practices" value={psi.scores.bestPractices} />
          </div>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {psi.reason === "no-key"
              ? "Add a PAGESPEED_API_KEY to .env.local to show live Lighthouse SEO/performance scores."
              : `Couldn't fetch PageSpeed scores${psi.message ? ` (${psi.message})` : ""}. The site URL must be publicly reachable.`}
          </p>
        )}
      </section>
    </div>
  );
}
