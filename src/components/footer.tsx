import { socials } from "@/lib/content";
import { GithubIcon } from "./icons";
import { ThemeControl } from "./theme-control";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-200 pt-6 pb-12 dark:border-neutral-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ThemeControl />
        <a
          href={socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <GithubIcon size={15} />
          Code on GitHub
        </a>
      </div>
      <p className="mt-6 text-xs text-neutral-400 dark:text-neutral-600">
        &copy; 2026 Rahul Bhati &middot; Built with Next.js &amp; Tailwind
      </p>
    </footer>
  );
}
