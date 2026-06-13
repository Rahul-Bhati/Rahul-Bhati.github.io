import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { PostEditor } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  if (!(await getSession())) redirect("/admin/login");
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        New post
      </h1>
      <PostEditor />
    </div>
  );
}
