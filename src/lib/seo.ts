import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rahulbhati.dev";
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
  const ogImage = post.ogImageUrl || post.coverImageUrl || undefined;

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
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
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
