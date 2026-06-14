import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Admin sign in
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Restricted area — authorized access only.
        </p>
      </div>
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/40">
        <LoginForm />
      </div>
    </div>
  );
}
