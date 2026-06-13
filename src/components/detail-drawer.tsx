"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ExternalLink, ArrowUpRight, Calendar, Clock } from "lucide-react";
import type { ProjectStatus } from "@/lib/content";
import type { PostDetail } from "@/lib/posts";
import type { ProjectDTO } from "@/lib/projects";
import { GithubIcon } from "./icons";
import { iconFor } from "@/lib/icon-registry";
import { Markdown } from "./markdown";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

const statusBadge: Record<ProjectStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Shipped:
    "border border-neutral-200 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400",
};

type Active =
  | { type: "project"; data: ProjectDTO }
  | { type: "post"; data: PostDetail };

export function DetailDrawer({
  posts,
  projects,
}: {
  posts: PostDetail[];
  projects: ProjectDTO[];
}) {
  const params = useSearchParams();
  const router = useRouter();

  const project = projects.find((p) => p.slug === params.get("project"));
  const post = posts.find((p) => p.slug === params.get("post"));
  const current: Active | null = project
    ? { type: "project", data: project }
    : post
      ? { type: "post", data: post }
      : null;
  const open = current !== null;

  const lastRef = useRef<Active | null>(current);
  if (current) lastRef.current = current;
  const shown = current ?? lastRef.current;

  const [render, setRender] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setRender(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = setTimeout(() => setRender(false), 320);
    return () => clearTimeout(t);
  }, [open]);

  const close = useCallback(() => router.back(), [router]);

  useEffect(() => {
    if (!render) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [render, close]);

  if (!render || !shown) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close panel"
        onClick={close}
        className={`absolute inset-0 h-full w-full cursor-default bg-neutral-950/40 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-neutral-200 bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-neutral-800 dark:bg-[#141414] ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div
          className={`flex-1 overflow-y-auto overscroll-contain px-6 py-6 transition-all duration-500 delay-100 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {shown.type === "project" && <ProjectBody project={shown.data} />}
          {shown.type === "post" && <PostBody post={shown.data} />}
        </div>
      </aside>
    </div>
  );
}

function ProjectBody({ project }: { project: ProjectDTO }) {
  return (
    <div className="space-y-7">
      <div className="flex items-start gap-3">
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${project.gradient} text-base font-bold text-white shadow-sm`}
          aria-hidden
        >
          {project.title.charAt(0)}
        </span>
        <div className="min-w-0">
          <h2
            id="drawer-title"
            className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
          >
            {project.title}
          </h2>
          <div className="mt-1.5 flex items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusBadge[project.status]}`}>
              {project.status}
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">{project.year}</span>
          </div>
        </div>
      </div>

      {(project.demoUrl || project.githubUrl) && (
        <div className="flex flex-wrap gap-2">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900">
              <ExternalLink size={15} strokeWidth={2} />
              Live demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800">
              <GithubIcon size={15} />
              Source
            </a>
          )}
        </div>
      )}

      <Section title="Overview">
        <p>{project.overview}</p>
      </Section>
      <Section title="The problem">
        <p>{project.problem}</p>
      </Section>

      <div>
        <SectionLabel>Tech stack</SectionLabel>
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <li key={tech} className="rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-300">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PostBody({ post }: { post: PostDetail }) {
  return (
    <div className="space-y-7">
      <div>
        <h2
          id="drawer-title"
          className="text-2xl font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-100"
        >
          {post.title}
        </h2>
        <div className="mt-3 flex items-center gap-4 text-xs text-neutral-400 dark:text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={13} strokeWidth={2} />
            <time dateTime={post.datetime}>{post.displayDate}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} strokeWidth={2} />
            {post.readingTime}
          </span>
        </div>
      </div>

      {post.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImageUrl} alt={post.title} className="w-full rounded-xl" />
      )}

      <div className="text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
        <Markdown>{post.contentMarkdown}</Markdown>
      </div>

      <Link
        href={`/blog/${post.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 hover:underline dark:text-neutral-100"
      >
        Read full post
        <ArrowUpRight size={15} strokeWidth={2} />
      </Link>

      {post.crossPosts.length > 0 && (
        <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
          <SectionLabel>Also published on</SectionLabel>
          <ul className="mt-3 space-y-1">
            {post.crossPosts.map((cp) => {
              const Icon = iconFor(cp.platform);
              return (
                <li key={cp.label}>
                  <a href={cp.href} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100">
                    <Icon size={16} />
                    <span className="flex-1">{cp.label}</span>
                    <ArrowUpRight size={14} strokeWidth={2}
                      className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-500 dark:text-neutral-600 dark:group-hover:text-neutral-400" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
      {children}
    </h3>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SectionLabel>{title}</SectionLabel>
      <div className="mt-2 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
        {children}
      </div>
    </div>
  );
}
