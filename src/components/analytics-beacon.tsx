"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fires a lightweight pageview beacon on each route change.
 * Skips admin/api paths and honors Do Not Track. No cookies, no PII.
 */
export function AnalyticsBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }
    // Honor browser Do Not Track / Global Privacy Control.
    const dnt =
      navigator.doNotTrack === "1" ||
      (navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
    if (dnt) return;

    const body = JSON.stringify({ path: pathname });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/track", { method: "POST", body, keepalive: true });
      }
    } catch {
      /* analytics must never break the page */
    }
  }, [pathname]);

  return null;
}
