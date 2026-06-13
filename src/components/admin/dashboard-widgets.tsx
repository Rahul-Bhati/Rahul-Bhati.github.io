// Pure presentational, server-rendered dashboard widgets (no client JS, no chart deps).

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">{hint}</p>}
    </div>
  );
}

export function ViewsChart({ daily }: { daily: { day: string; views: number }[] }) {
  const max = Math.max(1, ...daily.map((d) => d.views));
  const W = 720;
  const H = 160;
  const gap = 3;
  const barW = daily.length ? (W - gap * (daily.length - 1)) / daily.length : 0;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Views — last {daily.length} days
        </h2>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">peak {max}/day</span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-40 w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Daily views bar chart"
      >
        {daily.map((d, i) => {
          const h = Math.max(d.views > 0 ? 2 : 0, (d.views / max) * (H - 4));
          return (
            <rect
              key={d.day}
              x={i * (barW + gap)}
              y={H - h}
              width={barW}
              height={h}
              rx={1.5}
              className="fill-neutral-800 dark:fill-neutral-300"
            >
              <title>{`${d.day}: ${d.views} views`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-neutral-400 dark:text-neutral-500">
        <span>{daily[0]?.day}</span>
        <span>{daily[daily.length - 1]?.day}</span>
      </div>
    </div>
  );
}

function scoreColor(v: number): string {
  if (v >= 90) return "text-emerald-500";
  if (v >= 50) return "text-amber-500";
  return "text-rose-500";
}

export function ScoreGauge({ label, value }: { label: string; value: number | null }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const pct = value ?? 0;
  const dash = (pct / 100) * c;

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-neutral-200 dark:stroke-neutral-800" />
        {value !== null && (
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            className={`${scoreColor(pct)} stroke-current`}
          />
        )}
      </svg>
      <span className="text-sm font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
        {value === null ? "—" : value}
      </span>
      <span className="text-xs text-neutral-500 dark:text-neutral-400">{label}</span>
    </div>
  );
}

export function RankTable({
  title,
  rows,
  emptyLabel,
}: {
  title: string;
  rows: { label: string; views: number }[];
  emptyLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
      <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-neutral-400 dark:text-neutral-500">{emptyLabel}</p>
      ) : (
        <ul className="space-y-1.5">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-neutral-700 dark:text-neutral-300">{r.label}</span>
              <span className="shrink-0 tabular-nums text-neutral-400 dark:text-neutral-500">
                {r.views}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
