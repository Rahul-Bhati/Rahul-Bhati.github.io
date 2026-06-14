"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { supabaseAdmin, MEDIA_BUCKET } from "@/lib/supabase";
import { slugify, deriveSeo, calcReadingTime } from "@/lib/seo";

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

// ---- Media upload ---------------------------------------------------------

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];
const MAX_IMAGE = 8 * 1024 * 1024; // 8MB
const MAX_VIDEO = 50 * 1024 * 1024; // 50MB (Supabase free-tier cap)

export type UploadResult =
  | { ok: true; url: string; kind: "image" | "video" }
  | { ok: false; error: string };

export async function uploadMedia(formData: FormData): Promise<UploadResult> {
  await requireAuth();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file provided." };
  }

  const isImage = IMAGE_TYPES.includes(file.type);
  const isVideo = VIDEO_TYPES.includes(file.type);
  if (!isImage && !isVideo) {
    return { ok: false, error: "Unsupported file type (images or mp4/webm video only)." };
  }
  if (isImage && file.size > MAX_IMAGE) return { ok: false, error: "Image exceeds 8MB." };
  if (isVideo && file.size > MAX_VIDEO) return { ok: false, error: "Video exceeds 50MB." };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const safe = slugify(file.name.replace(/\.[^.]+$/, "")) || "file";
  const key = `${Date.now()}-${safe}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = supabaseAdmin();
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(key, buffer, { contentType: file.type, upsert: false });
  if (error) return { ok: false, error: `Upload failed: ${error.message}` };

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(key);
  return { ok: true, url: data.publicUrl, kind: isImage ? "image" : "video" };
}

// ---- Post CRUD ------------------------------------------------------------

const crossPostSchema = z.object({
  platform: z.string().trim().min(1).max(40),
  label: z.string().trim().min(1).max(80),
  href: z.string().trim().url(),
});

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Title is required.").max(160),
  slug: z.string().trim().max(80).optional(),
  excerpt: z.string().trim().max(300).optional().default(""),
  contentMarkdown: z.string().default(""),
  coverImageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  metaTitle: z.string().trim().max(70).optional().default(""),
  metaDescription: z.string().trim().max(200).optional().default(""),
  keywords: z.array(z.string().trim().min(1)).default([]),
  crossPosts: z.array(crossPostSchema).default([]),
});

export type PostInput = z.input<typeof postSchema>;
export type SaveResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string };

export async function savePost(input: PostInput): Promise<SaveResult> {
  await requireAuth();

  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const d = parsed.data;

  const slug = (d.slug?.trim() ? slugify(d.slug) : slugify(d.title)) || `post-${Date.now()}`;

  // Ensure slug uniqueness (excluding self).
  const clash = await db.post.findFirst({
    where: { slug, ...(d.id ? { NOT: { id: d.id } } : {}) },
    select: { id: true },
  });
  if (clash) return { ok: false, error: `Slug "${slug}" is already in use.` };

  const seo = deriveSeo({
    title: d.title,
    excerpt: d.excerpt,
    contentMarkdown: d.contentMarkdown,
    metaTitle: d.metaTitle,
    metaDescription: d.metaDescription,
    keywords: d.keywords,
  });
  const readingTime = calcReadingTime(d.contentMarkdown);
  const cover = d.coverImageUrl ? d.coverImageUrl : null;

  const baseData = {
    title: d.title,
    slug,
    excerpt: d.excerpt || seo.metaDescription,
    contentMarkdown: d.contentMarkdown,
    coverImageUrl: cover,
    readingTime,
    status: d.status,
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    keywords: seo.keywords,
    publishedAt:
      d.status === "PUBLISHED" ? undefined : null, // set below for new publishes
  };

  let saved: { id: string; slug: string };

  if (d.id) {
    const existing = await db.post.findUnique({
      where: { id: d.id },
      select: { publishedAt: true },
    });
    const publishedAt =
      d.status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : null;
    const post = await db.post.update({
      where: { id: d.id },
      data: {
        ...baseData,
        publishedAt,
        crossPosts: {
          deleteMany: {},
          create: d.crossPosts.map((c, i) => ({ ...c, order: i })),
        },
      },
      select: { id: true, slug: true },
    });
    saved = post;
  } else {
    const post = await db.post.create({
      data: {
        ...baseData,
        publishedAt: d.status === "PUBLISHED" ? new Date() : null,
        crossPosts: { create: d.crossPosts.map((c, i) => ({ ...c, order: i })) },
      },
      select: { id: true, slug: true },
    });
    saved = post;
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${saved.slug}`);
  revalidatePath("/");
  return { ok: true, id: saved.id, slug: saved.slug };
}

export async function deletePost(id: string): Promise<{ ok: boolean }> {
  await requireAuth();
  const post = await db.post.findUnique({ where: { id }, select: { slug: true } });
  await db.post.delete({ where: { id } });
  revalidatePath("/blog");
  if (post) revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
  return { ok: true };
}
