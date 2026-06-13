import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects, type ProjectStatus } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Projects",
  description: "Side-projects and product work by Rahul Bhati — full-stack apps, AI tooling, and Solana programs.",
  alternates: { canonical: "/projects" },
};

const badgeStyles: Record<ProjectStatus, string> = {
  Active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "In Progress":
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Shipped:
    "border border-neutral-200 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400",
};

export default function ProjectsPage() {
  return (
    <section className="pt-12 sm:pt-16">
      <Reveal>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
          Side projects
        </h1>
      </Reveal>
      <Reveal delay={0.06}>
        <p className="mt-2 text-[15px] text-neutral-500 dark:text-neutral-400">
          Things I&rsquo;ve built — some shipped, some always in progress.
        </p>
      </Reveal>

      <ul className="mt-8 border-t border-neutral-200 dark:border-neutral-800">
        {projects.map((project, i) => (
          <Reveal as="li" key={project.title} delay={0.1 + i * 0.05}>
            <Link
              href={`/projects?project=${project.slug}`}
              scroll={false}
              className="group -mx-2 flex items-center gap-3 rounded-lg border-b border-dashed border-neutral-200 px-2 py-3.5 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50"
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${project.gradient} text-xs font-bold text-white shadow-sm`}
                aria-hidden
              >
                {project.title.charAt(0)}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="truncate text-[15px] font-medium text-neutral-900 dark:text-neutral-100">
                    {project.title}
                  </h2>
                  <ArrowUpRight
                    size={14}
                    strokeWidth={2}
                    className="shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-500 dark:text-neutral-600 dark:group-hover:text-neutral-400"
                    aria-hidden
                  />
                </div>
                <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                  {project.description}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${badgeStyles[project.status]}`}
              >
                {project.status}
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
