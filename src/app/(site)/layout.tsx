import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollProgress } from "@/components/scroll-progress";
import { DetailDrawer } from "@/components/detail-drawer";

const SITE_URL = "https://rahulbhati.dev";
const NAME = "Rahul Bhati";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: NAME,
  url: SITE_URL,
  jobTitle: "Full-Stack & React Native Developer",
  worksFor: { "@type": "Organization", name: "Bloomingminds" },
  address: { "@type": "PostalAddress", addressCountry: "India" },
  knowsAbout: ["React", "React Native", "Solana", "Anchor", "Rust", "Web3"],
  sameAs: [
    "https://github.com/rahulbhati",
    "https://twitter.com/animaekun",
    "https://youtube.com/@animaekun",
  ],
};

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
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
    </>
  );
}
