"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { slugify, deriveSeo } from "@/lib/seo";
import { STATUS_TO_DB } from "@/lib/projects";

async function requireAuth() {
  if (!(await getSession())) throw new Error("Unauthorized");
}

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Title is required.").max(160),
  slug: z.string().trim().max(80).optional(),
  description: z.string().trim().min(1, "Description is required.").max(300),
  status: z.enum(["Active", "In Progress", "Shipped"]),
  gradient: z.string().trim().min(1).max(120),
  year: z.string().trim().max(12).default(""),
  overview: z.string().trim().default(""),
  problem: z.string().trim().default(""),
  techStack: z.array(z.string().trim().min(1)).default([]),
  demoUrl: z.string().url().optional().or(z.literal("")).nullable(),
  githubUrl: z.string().url().optional().or(z.literal("")).nullable(),
  coverImageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  metaTitle: z.string().trim().max(70).optional().default(""),
  metaDescription: z.string().trim().max(200).optional().default(""),
  keywords: z.array(z.string().trim().min(1)).default([]),
});

export type ProjectInput = z.input<typeof projectSchema>;
export type SaveResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string };

export async function saveProject(input: ProjectInput): Promise<SaveResult> {
  await requireAuth();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const d = parsed.data;
  const slug = (d.slug?.trim() ? slugify(d.slug) : slugify(d.title)) || `project-${Date.now()}`;

  const clash = await db.project.findFirst({
    where: { slug, ...(d.id ? { NOT: { id: d.id } } : {}) },
    select: { id: true },
  });
  if (clash) return { ok: false, error: `Slug "${slug}" is already in use.` };

  const seo = deriveSeo({
    title: d.title,
    excerpt: d.description,
    contentMarkdown: d.overview,
    techStack: d.techStack,
    metaTitle: d.metaTitle,
    metaDescription: d.metaDescription,
    keywords: d.keywords,
  });

  const data = {
    title: d.title,
    slug,
    description: d.description,
    status: STATUS_TO_DB[d.status],
    gradient: d.gradient,
    year: d.year,
    overview: d.overview,
    problem: d.problem,
    techStack: d.techStack,
    demoUrl: d.demoUrl || null,
    githubUrl: d.githubUrl || null,
    coverImageUrl: d.coverImageUrl || null,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    keywords: seo.keywords,
  };

  const saved = d.id
    ? await db.project.update({ where: { id: d.id }, data, select: { id: true, slug: true } })
    : await db.project.create({ data, select: { id: true, slug: true } });

  revalidatePath("/projects");
  revalidatePath(`/projects/${saved.slug}`);
  revalidatePath("/");
  return { ok: true, id: saved.id, slug: saved.slug };
}

export async function deleteProject(id: string): Promise<{ ok: boolean }> {
  await requireAuth();
  const proj = await db.project.findUnique({ where: { id }, select: { slug: true } });
  await db.project.delete({ where: { id } });
  revalidatePath("/projects");
  if (proj) revalidatePath(`/projects/${proj.slug}`);
  revalidatePath("/");
  return { ok: true };
}
