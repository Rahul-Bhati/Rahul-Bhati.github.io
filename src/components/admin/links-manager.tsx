"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveLink, deleteLink, type LinkInput } from "@/app/admin/links/actions";

type Group = "SOCIAL" | "PILL" | "FOOTER";
export type LinkRow = {
  id: string;
  group: Group;
  platform: string;
  label: string;
  href: string | null;
  tone: string | null;
  order: number;
  visible: boolean;
};

const PLATFORMS = ["github", "x", "twitter", "linkedin", "instagram", "youtube", "medium", "email", "code", "hexagon", "briefcase", "mappin", "sparkles"];
const TONES = ["neutral", "emerald", "blue", "amber", "violet", "rose"];

const field =
  "rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100";

function blankRow(group: Group): LinkRow {
  return { id: "", group, platform: PLATFORMS[0], label: "", href: "", tone: group === "PILL" ? "neutral" : null, order: 99, visible: true };
}

function Row({ row, isPill }: { row: LinkRow; isPill: boolean }) {
  const router = useRouter();
  const [data, setData] = useState<LinkRow>(row);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const set = <K extends keyof LinkRow>(k: K, v: LinkRow[K]) => setData((d) => ({ ...d, [k]: v }));

  function save() {
    setMsg(null);
    const input: LinkInput = {
      id: data.id || undefined,
      group: data.group,
      platform: data.platform,
      label: data.label,
      href: data.href ?? "",
      tone: isPill ? data.tone ?? "" : "",
      order: data.order,
      visible: data.visible,
    };
    startTransition(async () => {
      const res = await saveLink(input);
      if (res.ok) { setData((d) => ({ ...d, id: res.id })); setMsg("Saved"); router.refresh(); }
      else setMsg(res.error);
    });
  }
  function remove() {
    if (!data.id || !confirm("Delete this link?")) return;
    startTransition(async () => { await deleteLink(data.id); router.refresh(); });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
      <select className={`${field} w-28`} value={data.platform} onChange={(e) => set("platform", e.target.value)}>
        {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <input className={`${field} w-40`} placeholder="Label" value={data.label} onChange={(e) => set("label", e.target.value)} />
      <input className={`${field} flex-1 min-w-[180px]`} placeholder="https://… (or mailto:)" value={data.href ?? ""} onChange={(e) => set("href", e.target.value)} />
      {isPill && (
        <select className={`${field} w-24`} value={data.tone ?? "neutral"} onChange={(e) => set("tone", e.target.value)}>
          {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      )}
      <input className={`${field} w-16`} type="number" value={data.order} onChange={(e) => set("order", Number(e.target.value))} title="Order" />
      <label className="flex items-center gap-1 text-xs text-neutral-500">
        <input type="checkbox" checked={data.visible} onChange={(e) => set("visible", e.target.checked)} /> visible
      </label>
      <button type="button" disabled={pending} onClick={save}
        className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900">
        {pending ? "…" : "Save"}
      </button>
      {data.id && (
        <button type="button" onClick={remove} className="text-sm text-rose-600 hover:underline dark:text-rose-400">Delete</button>
      )}
      {msg && <span className={`text-xs ${msg === "Saved" ? "text-emerald-600" : "text-rose-600"}`}>{msg}</span>}
    </div>
  );
}

function Section({ title, group, rows, isPill }: { title: string; group: Group; rows: LinkRow[]; isPill: boolean }) {
  const [adding, setAdding] = useState<LinkRow[]>([]);
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
        <button type="button" onClick={() => setAdding((a) => [...a, blankRow(group)])}
          className="text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300">+ Add</button>
      </div>
      {rows.map((r) => <Row key={r.id} row={r} isPill={isPill} />)}
      {adding.map((r, i) => <Row key={`new-${i}`} row={r} isPill={isPill} />)}
      {rows.length === 0 && adding.length === 0 && (
        <p className="text-sm text-neutral-400 dark:text-neutral-500">None yet.</p>
      )}
    </section>
  );
}

export function LinksManager({ links }: { links: LinkRow[] }) {
  return (
    <div className="space-y-8">
      <Section title="Hero pills" group="PILL" isPill rows={links.filter((l) => l.group === "PILL")} />
      <Section title="Social links (navbar + footer)" group="SOCIAL" isPill={false} rows={links.filter((l) => l.group === "SOCIAL")} />
    </div>
  );
}
