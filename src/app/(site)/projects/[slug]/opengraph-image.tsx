import { getProjectBySlug } from "@/lib/projects";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Project by Rahul Bhati";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = await getProjectBySlug(slug);
  return renderOgImage({ kicker: "Project", title: found?.dto.title ?? "Rahul Bhati" });
}
