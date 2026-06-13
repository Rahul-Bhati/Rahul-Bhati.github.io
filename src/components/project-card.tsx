"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project, ProjectStatus } from "@/lib/content";

const statusDot: Record<ProjectStatus, string> = {
  Active: "bg-emerald-500",
  "In Progress": "bg-amber-500",
  Shipped: "bg-neutral-400",
};

const statusText: Record<ProjectStatus, string> = {
  Active: "text-emerald-600 dark:text-emerald-400",
  "In Progress": "text-amber-600 dark:text-amber-400",
  Shipped: "text-neutral-500 dark:text-neutral-400",
};

export function ProjectCard({ project }: { project: Project }) {
  const pathname = usePathname();
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="h-full"
    >
      <Link
        href={`${pathname}?project=${project.slug}`}
        scroll={false}
        className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4 transition-colors hover:border-neutral-300 hover:bg-white hover:shadow-lg hover:shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:shadow-black/40"
      >
        <div className="flex items-start justify-between">
          <span
            className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br ${project.gradient} text-sm font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3`}
            aria-hidden
          >
            {project.title.charAt(0)}
          </span>
          <ArrowUpRight
            size={16}
            strokeWidth={2}
            className="text-neutral-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-500 dark:text-neutral-600 dark:group-hover:text-neutral-400"
            aria-hidden
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
            {project.title}
          </h3>
          <span
            className={`size-1.5 shrink-0 rounded-full ${statusDot[project.status]}`}
            aria-hidden
          />
        </div>

        <p className="mt-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {project.description}
        </p>

        <span className={`mt-3 text-xs font-medium ${statusText[project.status]}`}>
          {project.status}
        </span>
      </Link>
    </motion.div>
  );
}
