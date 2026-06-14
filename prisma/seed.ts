/**
 * Seed the database from the site's original hardcoded content.
 * Data is inlined (not imported from src/lib/content.ts) so the seed runs
 * under plain `tsx`/Node without React/JSX, lucide, or @ path-alias resolution.
 * Idempotent: clears the seeded tables first, then re-inserts.
 */
import { PrismaClient, PostStatus, ProjectStatus, LinkGroup } from "@prisma/client";

const db = new PrismaClient();

const projects = [
  {
    slug: "creati-v",
    title: "Creati-V",
    description: "Full-stack AI content generator using Next.js & Gemini",
    status: ProjectStatus.ACTIVE,
    gradient: "from-violet-500 to-fuchsia-500",
    year: "2026",
    overview:
      "Creati-V turns a single prompt into ready-to-publish content — blog posts, captions, and thumbnails — with a streaming editor and brand-voice presets. Built as a full-stack Next.js app with Gemini powering generation and a credits-based usage model.",
    problem:
      "Creators waste hours on the blank-page problem and on stitching together five different tools. Creati-V collapses ideation, drafting, and asset generation into one fast, opinionated workflow.",
    techStack: ["Next.js", "TypeScript", "Gemini API", "Tailwind CSS", "Postgres", "Vercel"],
    demoUrl: "https://example.com/creati-v",
    githubUrl: "https://github.com/rahulbhati/creati-v",
  },
  {
    slug: "second-brain",
    title: "Second-Brain",
    description: "AI-integrated content hub with Langchain",
    status: ProjectStatus.IN_PROGRESS,
    gradient: "from-amber-400 to-orange-500",
    year: "2026",
    overview:
      "A personal knowledge hub that ingests articles, notes, and bookmarks, embeds them, and lets you chat with your own library. Langchain orchestrates retrieval while a vector store keeps recall fast and grounded.",
    problem:
      "Saved links and notes pile up and never get revisited. Second-Brain makes everything you've read instantly searchable and conversational, so your past inputs actually compound.",
    techStack: ["Next.js", "Langchain", "OpenAI Embeddings", "pgvector", "Prisma", "tRPC"],
    demoUrl: "https://example.com/second-brain",
    githubUrl: "https://github.com/rahulbhati/second-brain",
  },
  {
    slug: "solana-liquidity-bot",
    title: "Solana Liquidity Bot",
    description: "On-chain market-making bot in Rust & Anchor",
    status: ProjectStatus.SHIPPED,
    gradient: "from-emerald-400 to-teal-500",
    year: "2025",
    overview:
      "An automated market-making bot for Solana DEXs. It quotes both sides of the book, rebalances inventory, and manages risk with configurable spreads — written in Rust with an Anchor program for the on-chain settlement logic.",
    problem:
      "Manual liquidity provision is slow and emotional. This bot enforces a disciplined strategy on-chain, reacting to price in milliseconds while keeping inventory and slippage in check.",
    techStack: ["Rust", "Anchor", "Solana Web3.js", "TypeScript", "Jupiter API"],
    githubUrl: "https://github.com/rahulbhati/solana-liquidity-bot",
  },
];

type SeedCrossPost = { platform: string; label: string; href: string };

const posts: {
  slug: string;
  title: string;
  datetime: string;
  readingTime: string;
  excerpt: string;
  content: string[];
  crossPosts: SeedCrossPost[];
}[] = [
  {
    slug: "shipping-a-solana-program-with-anchor",
    title: "Shipping a Solana program with Anchor, end to end",
    datetime: "2026-05-18",
    readingTime: "8 min read",
    excerpt:
      "From a fresh anchor init to a deployed, tested program on devnet — the workflow I wish I had when I started.",
    content: [
      "Anchor takes most of the ceremony out of writing Solana programs, but the gap between a hello-world and something you'd actually deploy is still wide. This is the end-to-end path I follow now.",
      "I start by modelling accounts before writing a single instruction. Getting the account layout and PDAs right up front saves painful migrations later — rent, ownership, and seeds are decisions you don't want to revisit on mainnet.",
      "Tests come next, not last. Anchor's TypeScript test harness lets you assert on-chain state directly, so I treat each instruction as a small spec: happy path, the obvious failure, and the sneaky arithmetic edge case.",
      "Finally, deployment is a checklist: bump the program version, verify the IDL, run against devnet with a throwaway keypair, and only then promote. Boring on purpose — boring is what you want when real value is at stake.",
    ],
    crossPosts: [
      { platform: "medium", label: "Read on Medium", href: "https://medium.com/@animaekun" },
      { platform: "x", label: "Discussion on X", href: "https://twitter.com/animaekun" },
      { platform: "linkedin", label: "Shared on LinkedIn", href: "https://linkedin.com/in/rahulbhati" },
    ],
  },
  {
    slug: "react-native-before-going-fully-native",
    title: "Why I reach for React Native before going fully native",
    datetime: "2026-04-02",
    readingTime: "6 min read",
    excerpt: "Native isn't the default it used to be. Here's the decision framework I actually use.",
    content: [
      "The 'just go native' advice is usually given without knowing the constraints. For most product teams, React Native gets you 95% of the way with a fraction of the headcount.",
      "I reach for native modules only when a feature is genuinely platform-specific — deep camera control, background processing, or a performance-critical animation that the bridge can't keep up with.",
      "The trick is keeping the native surface small and well-documented, so the React side stays the source of truth and onboarding stays fast.",
    ],
    crossPosts: [
      { platform: "medium", label: "Read on Medium", href: "https://medium.com/@animaekun" },
      { platform: "linkedin", label: "Shared on LinkedIn", href: "https://linkedin.com/in/rahulbhati" },
    ],
  },
  {
    slug: "building-a-second-brain-with-langchain",
    title: "Building a second brain with Langchain and embeddings",
    datetime: "2026-02-11",
    readingTime: "7 min read",
    excerpt:
      "How I turned a pile of saved articles into something I can actually have a conversation with.",
    content: [
      "Embeddings finally made my bookmark graveyard useful. The idea is simple: chunk everything you save, embed it, and retrieve the relevant chunks at query time.",
      "Langchain handles the orchestration, but the quality lives in the chunking strategy and the prompt that grounds the model in retrieved context. Get those wrong and you get confident nonsense.",
      "The result is a knowledge hub where past reading compounds instead of decaying — exactly what I wanted from a 'second brain'.",
    ],
    crossPosts: [
      { platform: "medium", label: "Read on Medium", href: "https://medium.com/@animaekun" },
      { platform: "x", label: "Discussion on X", href: "https://twitter.com/animaekun" },
    ],
  },
  {
    slug: "lessons-from-running-a-youtube-channel",
    title: "Lessons from running a YouTube channel as a developer",
    datetime: "2026-01-09",
    readingTime: "5 min read",
    excerpt: "Shipping videos taught me more about shipping software than I expected.",
    content: [
      "Running @animaekun on the side forced me to treat content like a product: a tight feedback loop, a clear audience, and ruthless editing.",
      "The biggest lesson was that consistency beats polish. The videos I almost didn't publish often did the best.",
    ],
    crossPosts: [
      { platform: "youtube", label: "Watch on YouTube", href: "https://youtube.com/@animaekun" },
      { platform: "linkedin", label: "Shared on LinkedIn", href: "https://linkedin.com/in/rahulbhati" },
    ],
  },
  {
    slug: "pragmatic-guide-to-server-components",
    title: "A pragmatic guide to server components in 2026",
    datetime: "2025-12-12",
    readingTime: "9 min read",
    excerpt: "Server components are great — once you stop fighting them. A field guide.",
    content: [
      "Most server-component pain comes from porting client-component mental models wholesale. The mindset shift is to push data fetching down and interactivity to the leaves.",
      "Once you draw the server/client boundary deliberately, the model gets quiet and fast — less client JS, simpler data flow, fewer loading spinners.",
    ],
    crossPosts: [
      { platform: "medium", label: "Read on Medium", href: "https://medium.com/@animaekun" },
    ],
  },
  {
    slug: "how-i-structure-a-nextjs-tailwind-project",
    title: "How I structure a Next.js + Tailwind project",
    datetime: "2025-11-03",
    readingTime: "6 min read",
    excerpt: "A folder structure and a set of conventions that have survived many projects.",
    content: [
      "Structure is a feature. I keep a thin app/ layer for routing, a components/ layer for UI, and a lib/ layer for data and pure logic — and I resist the urge to over-abstract early.",
      "Tailwind stays maintainable when you treat repeated class strings as a smell and lift them into small, named components rather than @apply soup.",
    ],
    crossPosts: [
      { platform: "medium", label: "Read on Medium", href: "https://medium.com/@animaekun" },
      { platform: "linkedin", label: "Shared on LinkedIn", href: "https://linkedin.com/in/rahulbhati" },
    ],
  },
  {
    slug: "token-math-avoiding-rounding-bugs",
    title: "Token math: avoiding rounding bugs on-chain",
    datetime: "2025-10-21",
    readingTime: "7 min read",
    excerpt: "Integer math, decimals, and the subtle bugs that cost real money.",
    content: [
      "On-chain, there are no floats — and that's a good thing, as long as you respect it. Every rounding decision needs to be explicit and consistent.",
      "I always round in the protocol's favor, document the direction, and fuzz-test the boundaries. The bugs that survive code review are almost always off-by-one-lamport.",
    ],
    crossPosts: [
      { platform: "medium", label: "Read on Medium", href: "https://medium.com/@animaekun" },
      { platform: "x", label: "Discussion on X", href: "https://twitter.com/animaekun" },
    ],
  },
];

// SiteLink rows (socials, hero pills, footer) — platform maps to an icon at render time.
const siteLinks: {
  group: LinkGroup;
  platform: string;
  label: string;
  href: string | null;
  tone: string | null;
  order: number;
}[] = [
  // Hero pills
  { group: LinkGroup.PILL, platform: "code", label: "Full-Stack & React Native Developer", href: null, tone: "neutral", order: 0 },
  { group: LinkGroup.PILL, platform: "hexagon", label: "Building on Solana (Anchor & Rust)", href: null, tone: "emerald", order: 1 },
  { group: LinkGroup.PILL, platform: "briefcase", label: "Developer at Bloomingminds", href: "https://bloomingminds.in", tone: "blue", order: 2 },
  { group: LinkGroup.PILL, platform: "mappin", label: "Based in India", href: null, tone: "amber", order: 3 },
  { group: LinkGroup.PILL, platform: "sparkles", label: "Open to new projects & collabs", href: null, tone: "violet", order: 4 },
  { group: LinkGroup.PILL, platform: "youtube", label: "Creator behind @animaekun", href: "https://youtube.com/@animaekun", tone: "rose", order: 5 },
  { group: LinkGroup.PILL, platform: "x", label: "Thoughts on Twitter", href: "https://twitter.com/animaekun", tone: "neutral", order: 6 },
  // Footer / social icons
  { group: LinkGroup.SOCIAL, platform: "email", label: "Email", href: "mailto:hello@rahulbhati.dev", tone: null, order: 0 },
  { group: LinkGroup.SOCIAL, platform: "x", label: "Twitter / X", href: "https://twitter.com/animaekun", tone: null, order: 1 },
  { group: LinkGroup.SOCIAL, platform: "instagram", label: "Instagram", href: "https://instagram.com/animaekun", tone: null, order: 2 },
  { group: LinkGroup.SOCIAL, platform: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/rahulbhati", tone: null, order: 3 },
  { group: LinkGroup.SOCIAL, platform: "github", label: "GitHub", href: "https://github.com/rahulbhati", tone: null, order: 4 },
];

const places = [
  { name: "Udaipur", country: "India", order: 0 },
  { name: "Jaipur", country: "India", order: 1 },
  { name: "Goa", country: "India", order: 2 },
  { name: "Manali", country: "India", order: 3 },
  { name: "Bengaluru", country: "India", order: 4 },
  { name: "Rishikesh", country: "India", order: 5 },
];

async function main() {
  console.log("Clearing existing seed data…");
  await db.crossPost.deleteMany();
  await db.media.deleteMany();
  await db.post.deleteMany();
  await db.project.deleteMany();
  await db.siteLink.deleteMany();
  await db.place.deleteMany();

  console.log("Seeding projects…");
  for (const p of projects) {
    await db.project.create({ data: p });
  }

  console.log("Seeding posts…");
  for (const post of posts) {
    const { content, crossPosts, datetime, ...rest } = post;
    await db.post.create({
      data: {
        ...rest,
        contentMarkdown: content.join("\n\n"),
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(datetime),
        crossPosts: {
          create: crossPosts.map((cp, i) => ({
            platform: cp.platform,
            label: cp.label,
            href: cp.href,
            order: i,
          })),
        },
      },
    });
  }

  console.log("Seeding site links…");
  await db.siteLink.createMany({ data: siteLinks });

  console.log("Seeding places…");
  await db.place.createMany({ data: places });

  const [projectCount, postCount, linkCount, placeCount] = await Promise.all([
    db.project.count(),
    db.post.count(),
    db.siteLink.count(),
    db.place.count(),
  ]);
  console.log(
    `Done: ${projectCount} projects, ${postCount} posts, ${linkCount} links, ${placeCount} places.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
