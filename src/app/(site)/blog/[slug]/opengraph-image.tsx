import { getPublishedPostBySlug } from "@/lib/posts";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Blog post by Rahul Bhati";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = await getPublishedPostBySlug(slug);
  return renderOgImage({ kicker: "Blog", title: found?.detail.title ?? "Rahul Bhati" });
}
