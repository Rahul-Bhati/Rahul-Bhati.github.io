import type { PillTone } from "@/lib/content";
import { getPills } from "@/lib/links";
import { iconFor } from "@/lib/icon-registry";
import { Reveal } from "./reveal";

type PillData = { label: string; href: string | null; tone: string | null; platform: string };

const toneStyles: Record<PillTone, { chip: string; icon: string }> = {
  neutral: {
    chip: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300",
    icon: "text-neutral-400 dark:text-neutral-500",
  },
  emerald: {
    chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    icon: "text-emerald-500 dark:text-emerald-400",
  },
  blue: {
    chip: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
    icon: "text-blue-500 dark:text-blue-400",
  },
  amber: {
    chip: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    icon: "text-amber-500 dark:text-amber-400",
  },
  violet: {
    chip: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
    icon: "text-violet-500 dark:text-violet-400",
  },
  rose: {
    chip: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    icon: "text-rose-500 dark:text-rose-400",
  },
};

function PillBadge({ pill }: { pill: PillData }) {
  const Icon = iconFor(pill.platform);
  const tone = toneStyles[(pill.tone as PillTone) in toneStyles ? (pill.tone as PillTone) : "neutral"];
  const base = `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ${tone.chip}`;
  const content = (
    <>
      <Icon size={15} strokeWidth={2} className={`shrink-0 ${tone.icon}`} aria-hidden />
      {pill.label}
    </>
  );

  if (pill.href) {
    return (
      <a
        href={pill.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} transition-opacity hover:opacity-80`}
      >
        {content}
      </a>
    );
  }
  return <span className={base}>{content}</span>;
}

export async function Hero() {
  const pills = await getPills();
  return (
    <section className="pt-12 sm:pt-16">
      <Reveal>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">
          Hi <span className="inline-block">👋</span>, I&rsquo;m{" "}
          <span className="font-bold">Rahul Bhati!</span>
        </h1>
      </Reveal>

      <ul className="mt-6 flex flex-wrap gap-2">
        {pills.map((pill, i) => (
          <Reveal as="li" key={pill.id} delay={0.06 + i * 0.04}>
            <PillBadge pill={pill} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
