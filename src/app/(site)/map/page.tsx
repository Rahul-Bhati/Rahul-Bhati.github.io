import type { Metadata } from "next";
import { places } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Travel Map",
  description: "A map of the places Rahul Bhati has travelled to and photographed.",
  alternates: { canonical: "/map" },
};

export default function MapPage() {
  return (
    <section className="pt-12 sm:pt-16">
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
          <iframe
            title="Places I've travelled so far"
            src="https://maps.google.com/maps?q=India&z=4&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[320px] w-full sm:h-[380px]"
          />
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h1 className="mt-10 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
          The Wanderland!
        </h1>
      </Reveal>

      <Reveal delay={0.14}>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          <p>
            I didn&rsquo;t know I&rsquo;d love travelling so much until my first
            solo trip. Stepping out alone was equal parts terrifying and
            exciting — and it completely changed how I see new places, people,
            and ideas.
          </p>
          <p>
            The other thing I love about travelling is capturing moments along
            the way. I keep a running map of everywhere I&rsquo;ve been, and
            share most of the photos over on{" "}
            <a
              href="https://instagram.com/animaekun"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-[3px] transition-colors hover:decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-600 dark:hover:decoration-neutral-200"
            >
              Instagram
            </a>
            .
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <h2 className="mt-10 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Some places I&rsquo;ve been
        </h2>
      </Reveal>
      <ul className="mt-3 flex flex-wrap gap-2">
        {places.map((place, i) => (
          <Reveal as="li" key={place.name} delay={0.24 + i * 0.04}>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300">
              {place.name}
              <span className="text-neutral-400 dark:text-neutral-500">
                {place.country}
              </span>
            </span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
