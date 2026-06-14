import { Hero } from "@/components/hero";
import { SelectedWork } from "@/components/selected-work";
import { RecentThoughts } from "@/components/recent-thoughts";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <RecentThoughts />
    </>
  );
}
