"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProject, deleteProject, type ProjectInput } from "@/app/admin/projects/actions";
import { MediaUploader } from "./media-uploader";

export type ProjectEditorData = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  status: "Active" | "In Progress" | "Shipped";
  gradient: string;
  year: string;
  overview: string;
  problem: string;
  techStack: string[];
  demoUrl: string;
  githubUrl: string;
  coverImageUrl: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

const GRADIENTS = [
  "from-violet-500 to-fuchsia-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-blue-500 to-cyan-500",
  "from-rose-500 to-pink-500",
  "from-neutral-600 to-neutral-800",
];

const empty: ProjectEditorData = {
  title: "", slug: "", description: "", status: "Active",
  gradient: GRADIENTS[0], year: "2026", overview: "", problem: "",
  techStack: [], demoUrl: "", githubUrl: "", coverImageUrl: "",
  metaTitle: "", metaDescription: "", keywords: [],
};

const field =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-300";
const labelCls = "block text-sm font-medium text-neutral-700 dark:text-neutral-300";

export function ProjectEditor({ initial }: { initial?: ProjectEditorData }) {
  const router = useRouter();
  const [data, setData] = useState<ProjectEditorData>(initial ?? empty);
  const [techStr, setTechStr] = useState((initial?.techStack ?? []).join(", "));
  const [keywordStr, setKeywordStr] = useState((initial?.keywords ?? []).join(", "));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof ProjectEditorData>(k: K, v: ProjectEditorData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  function save() {
    setError(null);
    const input: ProjectInput = {
      ...data,
      techStack: techStr.split(",").map((s) => s.trim()).filter(Boolean),
      keywords: keywordStr.split(",").map((s) => s.trim()).filter(Boolean),
    };
    startTransition(async () => {
      const res = await saveProject(input);
      if (res.ok) { router.push("/admin/projects"); router.refresh(); }
      else setError(res.error);
    });
  }

  function remove() {
    if (!data.id || !confirm("Delete this project permanently?")) return;
    startTransition(async () => {
      await deleteProject(data.id!);
      router.push("/admin/projects");
      router.refresh();
    });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="title">Title</label>
          <input id="title" className={field} value={data.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="slug">Slug <span className="text-neutral-400">(auto if blank)</span></label>
          <input id="slug" className={field} value={data.slug} onChange={(e) => set("slug", e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="description">Short description</label>
        <input id="description" className={field} value={data.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="status">Status</label>
          <select id="status" className={field} value={data.status} onChange={(e) => set("status", e.target.value as ProjectEditorData["status"])}>
            <option>Active</option><option>In Progress</option><option>Shipped</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="year">Year</label>
          <input id="year" className={field} value={data.year} onChange={(e) => set("year", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="gradient">Icon gradient</label>
          <select id="gradient" className={field} value={data.gradient} onChange={(e) => set("gradient", e.target.value)}>
            {GRADIENTS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br ${data.gradient} text-sm font-bold text-white shadow-sm`}>
          {data.title.charAt(0) || "?"}
        </span>
        <span className="text-xs text-neutral-400">Icon preview</span>
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="overview">Overview</label>
        <textarea id="overview" rows={4} className={field} value={data.overview} onChange={(e) => set("overview", e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="problem">The problem</label>
        <textarea id="problem" rows={3} className={field} value={data.problem} onChange={(e) => set("problem", e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="tech">Tech stack <span className="text-neutral-400">(comma-separated)</span></label>
        <input id="tech" className={field} value={techStr} onChange={(e) => setTechStr(e.target.value)} placeholder="Next.js, TypeScript, Postgres" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="demoUrl">Live demo URL</label>
          <input id="demoUrl" className={field} value={data.demoUrl} onChange={(e) => set("demoUrl", e.target.value)} placeholder="https://…" />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="githubUrl">GitHub URL</label>
          <input id="githubUrl" className={field} value={data.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/…" />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelCls}>Cover image</label>
        {data.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.coverImageUrl} alt="cover" className="h-32 rounded-lg object-cover" />
        )}
        <div className="flex items-center gap-3">
          <MediaUploader label="Upload cover image" accept="image/*" onUploaded={(url) => set("coverImageUrl", url)} />
          {data.coverImageUrl && (
            <button type="button" onClick={() => set("coverImageUrl", "")} className="text-sm text-rose-600 hover:underline dark:text-rose-400">Remove</button>
          )}
        </div>
      </div>

      <fieldset className="space-y-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">SEO (auto-filled if blank)</legend>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="metaTitle">Meta title</label>
          <input id="metaTitle" className={field} value={data.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="metaDescription">Meta description</label>
          <textarea id="metaDescription" rows={2} className={field} value={data.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="keywords">Keywords <span className="text-neutral-400">(comma-separated; defaults to tech stack)</span></label>
          <input id="keywords" className={field} value={keywordStr} onChange={(e) => setKeywordStr(e.target.value)} />
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button type="button" disabled={pending} onClick={save}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-neutral-900">
          {pending ? "Saving…" : "Save project"}
        </button>
        {data.id && (
          <button type="button" disabled={pending} onClick={remove}
            className="ml-auto text-sm text-rose-600 hover:underline dark:text-rose-400">Delete</button>
        )}
      </div>
    </div>
  );
}
