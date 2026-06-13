import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Calendar, Clock } from "lucide-react";
import { getPublishedPostBySlug, getPublishedSlugs } from "@/lib/posts";
import { buildPostMetadata, postJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { iconFor } from "@/lib/icon-registry";
import { Markdown } from "@/components/markdown";

export async function generateStaticParams() {
  return (await getPublishedSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await getPublishedPostBySlug(slug);
  if (!found) return { title: "Post not found" };
  return buildPostMetadata(found.raw);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getPublishedPostBySlug(slug);
  if (!found) notFound();
  const { raw, detail } = found;

  return (
    <article className="pt-12 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd(raw)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: detail.title, path: `/blog/${detail.slug}` },
            ]),
          ),
        }}
      />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        <ArrowLeft size={15} strokeWidth={2} aria-hidden />
        All posts
      </Link>

      <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-neutral-100">
        {detail.title}
      </h1>

      <div className="mt-3 flex items-center gap-4 text-sm text-neutral-400 dark:text-neutral-500">
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={14} strokeWidth={2} aria-hidden />
          <time dateTime={detail.datetime}>{detail.displayDate}</time>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} strokeWidth={2} aria-hidden />
          {detail.readingTime}
        </span>
      </div>

      {detail.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={detail.coverImageUrl}
          alt={detail.title}
          className="mt-6 w-full rounded-2xl border border-neutral-200 object-cover dark:border-neutral-800"
        />
      )}

      <div className="mt-8 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
        <Markdown>{detail.contentMarkdown}</Markdown>
      </div>

      {detail.crossPosts.length > 0 && (
        <div className="mt-10 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Also published on
          </h2>
          <ul className="mt-3 space-y-1">
            {detail.crossPosts.map((cp) => {
              const Icon = iconFor(cp.platform);
              return (
                <li key={cp.label}>
                  <a
                    href={cp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  >
                    <Icon size={16} />
                    <span>{cp.label}</span>
                    <ArrowUpRight size={14} strokeWidth={2} className="text-neutral-300 dark:text-neutral-600" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </article>
  );
}
