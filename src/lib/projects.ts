import "server-only";
import { db } from "@/lib/db";
import type { Project, ProjectStatus } from "@/lib/content";
import type { ProjectStatus as DbProjectStatus } from "@prisma/client";

// DB enum <-> display label.
const TO_DISPLAY: Record<DbProjectStatus, ProjectStatus> = {
  ACTIVE: "Active",
  IN_PROGRESS: "In Progress",
  SHIPPED: "Shipped",
};
export const STATUS_TO_DB: Record<ProjectStatus, DbProjectStatus> = {
  Active: "ACTIVE",
  "In Progress": "IN_PROGRESS",
  Shipped: "SHIPPED",
};

/** Public project DTO — matches the static `Project` shape the UI already expects. */
export type ProjectDTO = Project & { coverImageUrl: string | null };

type ProjectRow = {
  slug: string;
  title: string;
  description: string;
  status: DbProjectStatus;
  gradient: string;
  year: string;
  overview: string;
  problem: string;
  techStack: string[];
  demoUrl: string | null;
  githubUrl: string | null;
  coverImageUrl: string | null;
};

function toDTO(p: ProjectRow): ProjectDTO {
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    status: TO_DISPLAY[p.status],
    gradient: p.gradient,
    year: p.year,
    overview: p.overview,
    problem: p.problem,
    techStack: p.techStack,
    demoUrl: p.demoUrl ?? undefined,
    githubUrl: p.githubUrl ?? undefined,
    coverImageUrl: p.coverImageUrl,
  };
}

// Order: Active → In Progress → Shipped, then newest year.
const orderBy = [{ status: "asc" as const }, { year: "desc" as const }];

export async function getAllProjects(): Promise<ProjectDTO[]> {
  const rows = await db.project.findMany({ orderBy });
  return rows.map(toDTO);
}

export async function getProjectBySlug(slug: string) {
  const row = await db.project.findUnique({ where: { slug } });
  if (!row) return null;
  return { raw: row, dto: toDTO(row) };
}

export async function getProjectSlugs(): Promise<string[]> {
  const rows = await db.project.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getAllProjectsAdmin() {
  return db.project.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, title: true, status: true, updatedAt: true },
  });
}

export async function getProjectByIdAdmin(id: string) {
  return db.project.findUnique({ where: { id } });
}
