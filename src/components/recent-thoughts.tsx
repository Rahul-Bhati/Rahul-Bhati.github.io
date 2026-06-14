import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/posts";
import { Reveal } from "./reveal";

export async function RecentThoughts() {
  const recent = (await getPublishedPosts()).slice(0, 3);
  return (
    <section id="writing" className="mt-16 scroll-mt-20">
      <Reveal>
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Blog
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
          >
            View all blog posts
            <ArrowRight size={12} strokeWidth={2.25} aria-hidden />
          </Link>
        </div>
      </Reveal>

      <ul className="mt-4">
        {recent.map((post, i) => (
          <Reveal as="li" key={post.slug} delay={0.08 + i * 0.06}>
            <Link
              href={`/?post=${post.slug}`}
              scroll={false}
              className="group flex items-baseline justify-between gap-4 border-b border-dashed border-neutral-200 py-3 dark:border-neutral-800"
            >
              <span className="min-w-0 truncate text-[15px] text-neutral-700 transition-colors group-hover:text-neutral-950 dark:text-neutral-300 dark:group-hover:text-white">
                {post.title}
              </span>
              <time
                dateTime={post.datetime}
                className="shrink-0 text-sm tabular-nums text-neutral-400 dark:text-neutral-500"
              >
                {post.displayDate}
              </time>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
