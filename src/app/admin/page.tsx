import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function AdminDashboardPage() {
  // Authoritative check (proxy is only an optimistic guard).
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Signed in as {session.email}.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-700">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Analytics &amp; SEO score arrive in <span className="font-medium">M3</span>.
          Blog and project management land in <span className="font-medium">M4–M5</span>.
        </p>
      </div>
    </div>
  );
}
