"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { socialLinks } from "@/lib/content";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Projects", href: "/projects" },
  { label: "Travel Map", href: "/map" },
];

export function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md dark:border-neutral-800/70 dark:bg-[#111]/80">
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-5 sm:px-6">
        <div className="flex items-center gap-0.5">
          <Link
            href="/"
            aria-label="Home"
            aria-current={isActive("/") ? "page" : undefined}
            className={`grid size-9 place-items-center rounded-lg transition-colors ${
              isActive("/")
                ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800/80 dark:text-neutral-100"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <Home size={17} strokeWidth={2} />
          </Link>
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800/80 dark:text-neutral-100"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="-mr-1.5 hidden items-center gap-0.5 sm:flex">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                className="grid size-8 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
