import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/links", label: "Links" },
];

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  // Unauthenticated (login screen): no chrome, just a centered slot.
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-[#111]/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Admin
            </span>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-2.5 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-neutral-400 sm:inline dark:text-neutral-500">
              {session.email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-6">{children}</main>
    </div>
  );
}
