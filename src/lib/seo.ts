import type { Metadata } from "next";

/**
 * Single source of truth for the site's absolute URL. Priority:
 *   1. NEXT_PUBLIC_SITE_URL  — set this once you connect a custom domain
 *   2. VERCEL_PROJECT_PRODUCTION_URL — auto-injected by Vercel (the *.vercel.app URL)
 *   3. localhost fallback (dev)
 * So a fresh Vercel deploy works with no config; connecting a domain is a one-var change.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
export const AUTHOR = "Rahul Bhati";

/** URL-safe slug from a title. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Strip markdown/HTML to plain text for descriptions. */
export function stripMarkdown(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → text
    .replace(/<[^>]+>/g, "") // html tags
    .replace(/[#>*_`~-]/g, " ") // md symbols
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, max = 155): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

/** ~200 wpm reading-time estimate. */
export function calcReadingTime(md: string): string {
  const words = stripMarkdown(md).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

type SeoInput = {
  title: string;
  excerpt?: string | null;
  contentMarkdown?: string | null;
  techStack?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[];
};

export type DerivedSeo = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

/**
 * Fill SEO fields from content when not explicitly set. Explicit values win.
 */
export function deriveSeo(input: SeoInput): DerivedSeo {
  const metaTitle = (input.metaTitle?.trim() || input.title).slice(0, 70);

  const fallbackDesc =
    input.excerpt?.trim() ||
    (input.contentMarkdown ? stripMarkdown(input.contentMarkdown) : "");
  const metaDescription = truncate(
    input.metaDescription?.trim() || fallbackDesc,
    155,
  );

  const keywords =
    input.keywords && input.keywords.length > 0
      ? input.keywords
      : input.techStack && input.techStack.length > 0
        ? input.techStack
        : [];

  return { metaTitle, metaDescription, keywords };
}

type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  coverImageUrl?: string | null;
  ogImageUrl?: string | null;
  publishedAt?: Date | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[];
};

export function buildPostMetadata(post: PostMeta): Metadata {
  const seo = deriveSeo(post);
  const url = `${SITE_URL}/blog/${post.slug}`;

  // og:image / twitter:image come from the generated opengraph-image.tsx in this segment.
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords.length ? seo.keywords : undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title: seo.metaTitle,
      description: seo.metaDescription,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [AUTHOR],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
  };
}

type ProjectMeta = {
  slug: string;
  title: string;
  description: string;
  overview: string;
  problem: string;
  techStack: string[];
  coverImageUrl?: string | null;
  ogImageUrl?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[];
};

export function buildProjectMetadata(project: ProjectMeta): Metadata {
  const seo = deriveSeo({
    title: project.title,
    excerpt: project.description,
    contentMarkdown: project.overview,
    techStack: project.techStack,
    metaTitle: project.metaTitle,
    metaDescription: project.metaDescription,
    keywords: project.keywords,
  });
  const url = `${SITE_URL}/projects/${project.slug}`;

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords.length ? seo.keywords : undefined,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "website",
      url,
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
  };
}

export function projectJsonLd(project: ProjectMeta) {
  const seo = deriveSeo({
    title: project.title,
    excerpt: project.description,
    contentMarkdown: project.overview,
    techStack: project.techStack,
    metaDescription: project.metaDescription,
    keywords: project.keywords,
  });
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: seo.metaDescription,
    url: project.demoUrl || `${SITE_URL}/projects/${project.slug}`,
    codeRepository: project.githubUrl || undefined,
    author: { "@type": "Person", name: AUTHOR, url: SITE_URL },
    keywords: project.techStack.join(", ") || undefined,
    image: project.ogImageUrl || project.coverImageUrl || undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function blogListJsonLd(posts: { slug: string; title: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${AUTHOR} — Blog`,
    url: `${SITE_URL}/blog`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
    })),
  };
}

export function postJsonLd(post: PostMeta) {
  const seo = deriveSeo(post);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: seo.metaDescription,
    datePublished: post.publishedAt?.toISOString(),
    author: { "@type": "Person", name: AUTHOR, url: SITE_URL },
    image: post.ogImageUrl || post.coverImageUrl || undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    keywords: seo.keywords.join(", ") || undefined,
  };
}
