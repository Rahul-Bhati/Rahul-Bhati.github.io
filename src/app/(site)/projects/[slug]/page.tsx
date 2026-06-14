import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import { buildProjectMetadata, projectJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { GithubIcon } from "@/components/icons";

const badgeStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Shipped: "border border-neutral-200 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400",
};

export async function generateStaticParams() {
  // Resilient: a transient DB issue at build time shouldn't fail the whole deploy.
  try {
    return (await getProjectSlugs()).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await getProjectBySlug(slug);
  if (!found) return { title: "Project not found" };
  return buildProjectMetadata(found.raw);
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getProjectBySlug(slug);
  if (!found) notFound();
  const { raw, dto } = found;

  return (
    <article className="pt-12 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(raw)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
              { name: dto.title, path: `/projects/${dto.slug}` },
            ]),
          ),
        }}
      />

      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        <ArrowLeft size={15} strokeWidth={2} aria-hidden />
        All projects
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <span
          className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${dto.gradient} text-lg font-bold text-white shadow-sm`}
          aria-hidden
        >
          {dto.title.charAt(0)}
        </span>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {dto.title}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${badgeStyles[dto.status]}`}>
              {dto.status}
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">{dto.year}</span>
          </div>
        </div>
      </div>

      {dto.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dto.coverImageUrl}
          alt={dto.title}
          className="mt-6 w-full rounded-2xl border border-neutral-200 object-cover dark:border-neutral-800"
        />
      )}

      {(dto.demoUrl || dto.githubUrl) && (
        <div className="mt-6 flex flex-wrap gap-2">
          {dto.demoUrl && (
            <a href={dto.demoUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900">
              <ExternalLink size={15} strokeWidth={2} />
              Live demo
            </a>
          )}
          {dto.githubUrl && (
            <a href={dto.githubUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800">
              <GithubIcon size={15} />
              Source
            </a>
          )}
        </div>
      )}

      <section className="mt-8 space-y-6 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Overview</h2>
          <p className="mt-2">{dto.overview}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">The problem</h2>
          <p className="mt-2">{dto.problem}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Tech stack</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {dto.techStack.map((tech) => (
              <li key={tech} className="rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-300">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
