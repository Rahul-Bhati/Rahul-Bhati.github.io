import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ProjectEditor } from "@/components/admin/project-editor";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  if (!(await getSession())) redirect("/admin/login");
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">New project</h1>
      <ProjectEditor />
    </div>
  );
}
