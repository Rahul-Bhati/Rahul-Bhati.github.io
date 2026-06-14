import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllProjectsAdmin } from "@/lib/projects";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  ACTIVE: "Active",
  IN_PROGRESS: "In Progress",
  SHIPPED: "Shipped",
};

export default async function AdminProjectsListPage() {
  if (!(await getSession())) redirect("/admin/login");
  const projects = await getAllProjectsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Projects</h1>
        <Link href="/admin/projects/new"
          className="rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900">
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No projects yet.</p>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/projects/${p.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                <span className="min-w-0 truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{p.title}</span>
                <span className="shrink-0 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  {statusLabel[p.status] ?? p.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
