"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePost, deletePost, type PostInput } from "@/app/admin/blog/actions";
import { MediaUploader } from "./media-uploader";

type CrossPost = { platform: string; label: string; href: string };

export type PostEditorData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  coverImageUrl: string;
  status: "DRAFT" | "PUBLISHED";
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  crossPosts: CrossPost[];
};

const empty: PostEditorData = {
  title: "",
  slug: "",
  excerpt: "",
  contentMarkdown: "",
  coverImageUrl: "",
  status: "DRAFT",
  metaTitle: "",
  metaDescription: "",
  keywords: [],
  crossPosts: [],
};

const field =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-300";
const labelCls = "block text-sm font-medium text-neutral-700 dark:text-neutral-300";

export function PostEditor({ initial }: { initial?: PostEditorData }) {
  const router = useRouter();
  const [data, setData] = useState<PostEditorData>(initial ?? empty);
  const [keywordStr, setKeywordStr] = useState((initial?.keywords ?? []).join(", "));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof PostEditorData>(k: K, v: PostEditorData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  function submit(status: "DRAFT" | "PUBLISHED") {
    setError(null);
    const input: PostInput = {
      ...data,
      status,
      keywords: keywordStr.split(",").map((s) => s.trim()).filter(Boolean),
    };
    startTransition(async () => {
      const res = await savePost(input);
      if (res.ok) {
        router.push("/admin/blog");
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  function remove() {
    if (!data.id || !confirm("Delete this post permanently?")) return;
    startTransition(async () => {
      await deletePost(data.id!);
      router.push("/admin/blog");
      router.refresh();
    });
  }

  function addCrossPost() {
    set("crossPosts", [...data.crossPosts, { platform: "medium", label: "", href: "" }]);
  }
  function updateCrossPost(i: number, patch: Partial<CrossPost>) {
    set(
      "crossPosts",
      data.crossPosts.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    );
  }
  function removeCrossPost(i: number) {
    set("crossPosts", data.crossPosts.filter((_, idx) => idx !== i));
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="title">Title</label>
        <input id="title" className={field} value={data.title}
          onChange={(e) => set("title", e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="slug">Slug <span className="text-neutral-400">(auto from title if blank)</span></label>
        <input id="slug" className={field} value={data.slug} placeholder="my-post-title"
          onChange={(e) => set("slug", e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="excerpt">Excerpt</label>
        <textarea id="excerpt" rows={2} className={field} value={data.excerpt}
          onChange={(e) => set("excerpt", e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className={labelCls}>Cover image</label>
        {data.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.coverImageUrl} alt="cover" className="h-32 rounded-lg object-cover" />
        )}
        <div className="flex items-center gap-3">
          <MediaUploader label="Upload cover image" accept="image/*"
            onUploaded={(url) => set("coverImageUrl", url)} />
          {data.coverImageUrl && (
            <button type="button" onClick={() => set("coverImageUrl", "")}
              className="text-sm text-rose-600 hover:underline dark:text-rose-400">Remove</button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelCls} htmlFor="content">Content (Markdown)</label>
          <MediaUploader label="Insert image / video"
            onUploaded={(url, kind) => {
              const snippet = kind === "image" ? `\n\n![](${url})\n\n` : `\n\n<video src="${url}"></video>\n\n`;
              set("contentMarkdown", data.contentMarkdown + snippet);
            }} />
        </div>
        <textarea id="content" rows={16} className={`${field} font-mono`} value={data.contentMarkdown}
          onChange={(e) => set("contentMarkdown", e.target.value)}
          placeholder="Write your post in Markdown. Uploaded media is appended as Markdown/HTML." />
      </div>

      <fieldset className="space-y-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">SEO (auto-filled if blank)</legend>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="metaTitle">Meta title</label>
          <input id="metaTitle" className={field} value={data.metaTitle}
            onChange={(e) => set("metaTitle", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="metaDescription">Meta description</label>
          <textarea id="metaDescription" rows={2} className={field} value={data.metaDescription}
            onChange={(e) => set("metaDescription", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="keywords">Keywords <span className="text-neutral-400">(comma-separated)</span></label>
          <input id="keywords" className={field} value={keywordStr}
            onChange={(e) => setKeywordStr(e.target.value)} placeholder="react, solana, next.js" />
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">Also published on</legend>
        {data.crossPosts.map((c, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <select className={`${field} w-28`} value={c.platform}
              onChange={(e) => updateCrossPost(i, { platform: e.target.value })}>
              {["medium", "x", "linkedin", "youtube", "github", "instagram"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input className={`${field} flex-1`} placeholder="Label (e.g. Read on Medium)" value={c.label}
              onChange={(e) => updateCrossPost(i, { label: e.target.value })} />
            <input className={`${field} flex-1`} placeholder="https://…" value={c.href}
              onChange={(e) => updateCrossPost(i, { href: e.target.value })} />
            <button type="button" onClick={() => removeCrossPost(i)}
              className="text-sm text-rose-600 hover:underline dark:text-rose-400">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addCrossPost}
          className="text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300">+ Add cross-post link</button>
      </fieldset>

      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button type="button" disabled={pending} onClick={() => submit("PUBLISHED")}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-neutral-900">
          {pending ? "Saving…" : "Publish"}
        </button>
        <button type="button" disabled={pending} onClick={() => submit("DRAFT")}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800">
          Save draft
        </button>
        {data.id && (
          <button type="button" disabled={pending} onClick={remove}
            className="ml-auto text-sm text-rose-600 hover:underline dark:text-rose-400">Delete</button>
        )}
      </div>
    </div>
  );
}
