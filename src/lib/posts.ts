import "server-only";
import { db } from "@/lib/db";
import { calcReadingTime } from "@/lib/seo";

export type CrossPostDTO = { platform: string; label: string; href: string };

export type PostListItem = {
  slug: string;
  title: string;
  displayDate: string;
  datetime: string;
  readingTime: string;
  excerpt: string;
};

export type PostDetail = PostListItem & {
  contentMarkdown: string;
  coverImageUrl: string | null;
  crossPosts: CrossPostDTO[];
};

function fmtDate(d: Date | null): string {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

function toListItem(p: {
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  readingTime: string | null;
  publishedAt: Date | null;
  createdAt: Date;
}): PostListItem {
  const date = p.publishedAt ?? p.createdAt;
  return {
    slug: p.slug,
    title: p.title,
    displayDate: fmtDate(date),
    datetime: date.toISOString().slice(0, 10),
    readingTime: p.readingTime || calcReadingTime(p.contentMarkdown),
    excerpt: p.excerpt,
  };
}

/** Published posts, newest first — for /blog, home, and the drawer. */
export async function getPublishedPosts(): Promise<PostListItem[]> {
  const posts = await db.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return posts.map(toListItem);
}

/** Published posts with full detail — for the drawer quick-view. */
export async function getPublishedPostDetails(): Promise<PostDetail[]> {
  const posts = await db.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: { crossPosts: { orderBy: { order: "asc" } } },
  });
  return posts.map((p) => ({
    ...toListItem(p),
    contentMarkdown: p.contentMarkdown,
    coverImageUrl: p.coverImageUrl,
    crossPosts: p.crossPosts.map((c) => ({
      platform: c.platform,
      label: c.label,
      href: c.href,
    })),
  }));
}

/** A single published post by slug — for /blog/[slug]. Returns the raw row + DTO. */
export async function getPublishedPostBySlug(slug: string) {
  const post = await db.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { crossPosts: { orderBy: { order: "asc" } } },
  });
  if (!post) return null;
  return {
    raw: post,
    detail: {
      ...toListItem(post),
      contentMarkdown: post.contentMarkdown,
      coverImageUrl: post.coverImageUrl,
      crossPosts: post.crossPosts.map((c) => ({
        platform: c.platform,
        label: c.label,
        href: c.href,
      })),
    } satisfies PostDetail,
  };
}

export async function getPublishedSlugs(): Promise<string[]> {
  const rows = await db.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

/** All posts (any status) for the admin list. */
export async function getAllPostsAdmin() {
  return db.post.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
}

/** A single post by id (admin edit), incl. cross-posts. */
export async function getPostByIdAdmin(id: string) {
  return db.post.findUnique({
    where: { id },
    include: { crossPosts: { orderBy: { order: "asc" } } },
  });
}
