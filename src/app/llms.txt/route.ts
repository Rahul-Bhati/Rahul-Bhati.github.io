import { db } from "@/lib/db";
import { SITE_URL, AUTHOR } from "@/lib/seo";

export const dynamic = "force-dynamic";

// GEO: a plain-text map of the site for LLMs / AI search engines.
// Spec: https://llmstxt.org
export async function GET() {
  const [posts, projects] = await Promise.all([
    db.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }],
      select: { slug: true, title: true, excerpt: true },
    }),
    db.project.findMany({
      orderBy: [{ status: "asc" }, { year: "desc" }],
      select: { slug: true, title: true, description: true },
    }),
  ]);

  const lines: string[] = [
    `# ${AUTHOR}`,
    "",
    "> Full-Stack & React Native developer building on the Solana ecosystem (Anchor & Rust). Developer at Bloomingminds, based in India.",
    "",
    `Site: ${SITE_URL}`,
    "",
    "## Blog",
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`),
    "",
    "## Projects",
    ...projects.map((p) => `- [${p.title}](${SITE_URL}/projects/${p.slug}): ${p.description}`),
    "",
    "## Pages",
    `- [Home](${SITE_URL})`,
    `- [Blog](${SITE_URL}/blog)`,
    `- [Projects](${SITE_URL}/projects)`,
    `- [Travel Map](${SITE_URL}/map)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
