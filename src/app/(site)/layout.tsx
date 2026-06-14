import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollProgress } from "@/components/scroll-progress";
import { DetailDrawer } from "@/components/detail-drawer";
import { AnalyticsBeacon } from "@/components/analytics-beacon";
import { getPublishedPostDetails } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { getSocials } from "@/lib/links";
import { SITE_URL } from "@/lib/seo";

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

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [postDetails, projects, socials] = await Promise.all([
    getPublishedPostDetails(),
    getAllProjects(),
    getSocials(),
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <AnalyticsBeacon />
      <SmoothScroll />
      <ScrollProgress />
      <Navbar socials={socials.map((s) => ({ platform: s.platform, label: s.label, href: s.href }))} />
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <main>{children}</main>
        <Footer />
      </div>
      <Suspense fallback={null}>
        <DetailDrawer posts={postDetails} projects={projects} />
      </Suspense>
    </>
  );
}
