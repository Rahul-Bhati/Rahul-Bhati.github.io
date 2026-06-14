import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { blogListJsonLd } from "@/lib/seo";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing on full-stack development, React Native, and the Solana ecosystem by Rahul Bhati.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="pt-12 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd(posts)) }}
      />
      <Reveal>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
          Blog
        </h1>
      </Reveal>
      <Reveal delay={0.06}>
        <p className="mt-2 text-[15px] text-neutral-500 dark:text-neutral-400">
          Notes on building products, shipping on-chain, and the craft of software.
        </p>
      </Reveal>

      {posts.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">No posts yet.</p>
      ) : (
        <ul className="mt-8 border-t border-neutral-200 dark:border-neutral-800">
          {posts.map((post, i) => (
            <Reveal as="li" key={post.slug} delay={0.1 + i * 0.04}>
              <Link
                href={`/blog?post=${post.slug}`}
                scroll={false}
                className="group -mx-2 flex items-baseline justify-between gap-4 rounded-lg border-b border-dashed border-neutral-200 px-2 py-3.5 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50"
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
      )}
    </section>
  );
}
