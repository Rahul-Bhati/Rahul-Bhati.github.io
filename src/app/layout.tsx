import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollProgress } from "@/components/scroll-progress";
import { DetailDrawer } from "@/components/detail-drawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://rahulbhati.dev";
const NAME = "Rahul Bhati";
const ROLE = "Full-Stack & React Native Developer";
const DESCRIPTION =
  "Rahul Bhati — Full-Stack & React Native developer building on the Solana ecosystem with Anchor & Rust. Developer at Bloomingminds, based in India.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${NAME} — ${ROLE}`,
    template: `%s — ${NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "Rahul Bhati",
    "Full-Stack Developer",
    "React Native Developer",
    "Solana",
    "Anchor",
    "Rust",
    "Web3",
    "Bloomingminds",
  ],
  authors: [{ name: NAME, url: SITE_URL }],
  creator: NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: NAME,
    title: `${NAME} — ${ROLE}`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${NAME} — ${ROLE}`,
    description: DESCRIPTION,
    creator: "@animaekun",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: NAME,
  url: SITE_URL,
  jobTitle: ROLE,
  worksFor: { "@type": "Organization", name: "Bloomingminds" },
  address: { "@type": "PostalAddress", addressCountry: "India" },
  knowsAbout: ["React", "React Native", "Solana", "Anchor", "Rust", "Web3"],
  sameAs: [
    "https://github.com/rahulbhati",
    "https://twitter.com/animaekun",
    "https://youtube.com/@animaekun",
  ],
};

// Runs before paint to set the theme class, avoiding a flash of the wrong theme.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="min-h-full bg-white text-neutral-900 antialiased transition-colors duration-300 dark:bg-[#111] dark:text-neutral-200">
        <SmoothScroll />
        <ScrollProgress />
        <Navbar />
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <main>{children}</main>
          <Footer />
        </div>
        <Suspense fallback={null}>
          <DetailDrawer />
        </Suspense>
      </body>
    </html>
  );
}
