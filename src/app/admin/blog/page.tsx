import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllPostsAdmin } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function AdminBlogListPage() {
  if (!(await getSession())) redirect("/admin/login");
  const posts = await getAllPostsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Blog posts
        </h1>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No posts yet. Create your first one.</p>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/blog/${p.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
              >
                <span className="min-w-0 truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {p.title}
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                      p.status === "PUBLISHED"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {p.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">
                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(p.updatedAt)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
