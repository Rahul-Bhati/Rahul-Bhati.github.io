import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllLinksAdmin } from "@/lib/links";
import { LinksManager, type LinkRow } from "@/components/admin/links-manager";

export const dynamic = "force-dynamic";

export default async function AdminLinksPage() {
  if (!(await getSession())) redirect("/admin/login");
  const links = (await getAllLinksAdmin()) as LinkRow[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Links</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Hero pills and social links shown across the site. Changes reflect live after saving.
        </p>
      </div>
      <LinksManager links={links} />
    </div>
  );
}
