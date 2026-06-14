import type { ComponentType, SVGProps } from "react";
import { Code2, Hexagon, Briefcase, MapPin, Sparkles } from "lucide-react";
import {
  YoutubeIcon,
  YoutubeSolidIcon,
  MailIcon,
  XIcon,
  InstagramIcon,
  LinkedinIcon,
  GithubIcon,
  MediumIcon,
} from "@/components/icons";

type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }
>;

export const socials = {
  email: "mailto:hello@rahulbhati.dev",
  twitter: "https://twitter.com/animaekun",
  instagram: "https://instagram.com/animaekun",
  linkedin: "https://linkedin.com/in/rahulbhati",
  github: "https://github.com/rahulbhati",
  youtube: "https://youtube.com/@animaekun",
};

/** Soft-tinted pill palette — pastel in light mode, translucent in dark. */
export type PillTone =
  | "neutral"
  | "emerald"
  | "blue"
  | "amber"
  | "violet"
  | "rose";

export type Pill = {
  icon: IconComponent;
  label: string;
  tone: PillTone;
  href?: string;
};

export const pills: Pill[] = [
  { icon: Code2, label: "Full-Stack & React Native Developer", tone: "neutral" },
  {
    icon: Hexagon,
    label: "Building on Solana (Anchor & Rust)",
    tone: "emerald",
  },
  {
    icon: Briefcase,
    label: "Developer at Bloomingminds",
    tone: "blue",
    href: "https://bloomingminds.in",
  },
  { icon: MapPin, label: "Based in India", tone: "amber" },
  { icon: Sparkles, label: "Open to new projects & collabs", tone: "violet" },
  {
    icon: YoutubeIcon,
    label: "Creator behind @animaekun",
    tone: "rose",
    href: socials.youtube,
  },
  { icon: XIcon, label: "Thoughts on Twitter", tone: "neutral", href: socials.twitter },
];

export type SocialLink = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
};

export const socialLinks: SocialLink[] = [
  { label: "Email", href: socials.email, icon: MailIcon },
  { label: "Twitter / X", href: socials.twitter, icon: XIcon },
  { label: "Instagram", href: socials.instagram, icon: InstagramIcon },
  { label: "LinkedIn", href: socials.linkedin, icon: LinkedinIcon },
  { label: "GitHub", href: socials.github, icon: GithubIcon },
];

export type ProjectStatus = "Active" | "In Progress" | "Shipped";

export type Project = {
  slug: string;
  title: string;
  description: string;
  status: ProjectStatus;
  /** Tailwind gradient classes for the app-icon tile. */
  gradient: string;
  year: string;
  /** Longer overview shown in the detail drawer. */
  overview: string;
  /** The problem this project set out to solve. */
  problem: string;
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "creati-v",
    title: "Creati-V",
    description: "Full-stack AI content generator using Next.js & Gemini",
    status: "Active",
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
    status: "In Progress",
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
    status: "Shipped",
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

export type CrossPost = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
};

export type Post = {
  slug: string;
  title: string;
  date: string; // display string
  datetime: string; // ISO for <time>
  readingTime: string;
  excerpt: string;
  /** Body paragraphs shown in the detail drawer. */
  content: string[];
  /** Where this piece is also published / discussed. */
  crossPosts: CrossPost[];
};

export const posts: Post[] = [
  {
    slug: "shipping-a-solana-program-with-anchor",
    title: "Shipping a Solana program with Anchor, end to end",
    date: "May 18, 2026",
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
      { label: "Read on Medium", href: "https://medium.com/@animaekun", icon: MediumIcon },
      { label: "Discussion on X", href: "https://twitter.com/animaekun", icon: XIcon },
      { label: "Shared on LinkedIn", href: "https://linkedin.com/in/rahulbhati", icon: LinkedinIcon },
    ],
  },
  {
    slug: "react-native-before-going-fully-native",
    title: "Why I reach for React Native before going fully native",
    date: "Apr 2, 2026",
    datetime: "2026-04-02",
    readingTime: "6 min read",
    excerpt:
      "Native isn't the default it used to be. Here's the decision framework I actually use.",
    content: [
      "The 'just go native' advice is usually given without knowing the constraints. For most product teams, React Native gets you 95% of the way with a fraction of the headcount.",
      "I reach for native modules only when a feature is genuinely platform-specific — deep camera control, background processing, or a performance-critical animation that the bridge can't keep up with.",
      "The trick is keeping the native surface small and well-documented, so the React side stays the source of truth and onboarding stays fast.",
    ],
    crossPosts: [
      { label: "Read on Medium", href: "https://medium.com/@animaekun", icon: MediumIcon },
      { label: "Shared on LinkedIn", href: "https://linkedin.com/in/rahulbhati", icon: LinkedinIcon },
    ],
  },
  {
    slug: "building-a-second-brain-with-langchain",
    title: "Building a second brain with Langchain and embeddings",
    date: "Feb 11, 2026",
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
      { label: "Read on Medium", href: "https://medium.com/@animaekun", icon: MediumIcon },
      { label: "Discussion on X", href: "https://twitter.com/animaekun", icon: XIcon },
    ],
  },
  {
    slug: "lessons-from-running-a-youtube-channel",
    title: "Lessons from running a YouTube channel as a developer",
    date: "Jan 9, 2026",
    datetime: "2026-01-09",
    readingTime: "5 min read",
    excerpt:
      "Shipping videos taught me more about shipping software than I expected.",
    content: [
      "Running @animaekun on the side forced me to treat content like a product: a tight feedback loop, a clear audience, and ruthless editing.",
      "The biggest lesson was that consistency beats polish. The videos I almost didn't publish often did the best.",
    ],
    crossPosts: [
      { label: "Watch on YouTube", href: "https://youtube.com/@animaekun", icon: YoutubeSolidIcon },
      { label: "Shared on LinkedIn", href: "https://linkedin.com/in/rahulbhati", icon: LinkedinIcon },
    ],
  },
  {
    slug: "pragmatic-guide-to-server-components",
    title: "A pragmatic guide to server components in 2026",
    date: "Dec 12, 2025",
    datetime: "2025-12-12",
    readingTime: "9 min read",
    excerpt:
      "Server components are great — once you stop fighting them. A field guide.",
    content: [
      "Most server-component pain comes from porting client-component mental models wholesale. The mindset shift is to push data fetching down and interactivity to the leaves.",
      "Once you draw the server/client boundary deliberately, the model gets quiet and fast — less client JS, simpler data flow, fewer loading spinners.",
    ],
    crossPosts: [
      { label: "Read on Medium", href: "https://medium.com/@animaekun", icon: MediumIcon },
    ],
  },
  {
    slug: "how-i-structure-a-nextjs-tailwind-project",
    title: "How I structure a Next.js + Tailwind project",
    date: "Nov 3, 2025",
    datetime: "2025-11-03",
    readingTime: "6 min read",
    excerpt: "A folder structure and a set of conventions that have survived many projects.",
    content: [
      "Structure is a feature. I keep a thin app/ layer for routing, a components/ layer for UI, and a lib/ layer for data and pure logic — and I resist the urge to over-abstract early.",
      "Tailwind stays maintainable when you treat repeated class strings as a smell and lift them into small, named components rather than @apply soup.",
    ],
    crossPosts: [
      { label: "Read on Medium", href: "https://medium.com/@animaekun", icon: MediumIcon },
      { label: "Shared on LinkedIn", href: "https://linkedin.com/in/rahulbhati", icon: LinkedinIcon },
    ],
  },
  {
    slug: "token-math-avoiding-rounding-bugs",
    title: "Token math: avoiding rounding bugs on-chain",
    date: "Oct 21, 2025",
    datetime: "2025-10-21",
    readingTime: "7 min read",
    excerpt: "Integer math, decimals, and the subtle bugs that cost real money.",
    content: [
      "On-chain, there are no floats — and that's a good thing, as long as you respect it. Every rounding decision needs to be explicit and consistent.",
      "I always round in the protocol's favor, document the direction, and fuzz-test the boundaries. The bugs that survive code review are almost always off-by-one-lamport.",
    ],
    crossPosts: [
      { label: "Read on Medium", href: "https://medium.com/@animaekun", icon: MediumIcon },
      { label: "Discussion on X", href: "https://twitter.com/animaekun", icon: XIcon },
    ],
  },
];

export type Place = {
  name: string;
  country: string;
};

export const places: Place[] = [
  { name: "Udaipur", country: "India" },
  { name: "Jaipur", country: "India" },
  { name: "Goa", country: "India" },
  { name: "Manali", country: "India" },
  { name: "Bengaluru", country: "India" },
  { name: "Rishikesh", country: "India" },
];
