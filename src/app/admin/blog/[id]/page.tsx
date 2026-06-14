import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getPostByIdAdmin } from "@/lib/posts";
import { PostEditor, type PostEditorData } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getSession())) redirect("/admin/login");
  const { id } = await params;
  const post = await getPostByIdAdmin(id);
  if (!post) notFound();

  const initial: PostEditorData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    contentMarkdown: post.contentMarkdown,
    coverImageUrl: post.coverImageUrl ?? "",
    status: post.status,
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
    keywords: post.keywords,
    crossPosts: post.crossPosts.map((c) => ({
      platform: c.platform,
      label: c.label,
      href: c.href,
    })),
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        Edit post
      </h1>
      <PostEditor initial={initial} />
    </div>
  );
}
