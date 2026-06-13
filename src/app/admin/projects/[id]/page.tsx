import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getProjectByIdAdmin } from "@/lib/projects";
import { ProjectEditor, type ProjectEditorData } from "@/components/admin/project-editor";

export const dynamic = "force-dynamic";

const statusLabel = {
  ACTIVE: "Active",
  IN_PROGRESS: "In Progress",
  SHIPPED: "Shipped",
} as const;

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getSession())) redirect("/admin/login");
  const { id } = await params;
  const p = await getProjectByIdAdmin(id);
  if (!p) notFound();

  const initial: ProjectEditorData = {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    status: statusLabel[p.status],
    gradient: p.gradient,
    year: p.year,
    overview: p.overview,
    problem: p.problem,
    techStack: p.techStack,
    demoUrl: p.demoUrl ?? "",
    githubUrl: p.githubUrl ?? "",
    coverImageUrl: p.coverImageUrl ?? "",
    metaTitle: p.metaTitle ?? "",
    metaDescription: p.metaDescription ?? "",
    keywords: p.keywords,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Edit project</h1>
      <ProjectEditor initial={initial} />
    </div>
  );
}
