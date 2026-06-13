import type { MetadataRoute } from "next";

const SITE_URL = "https://rahulbhati.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-12");
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/projects`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/map`, lastModified, changeFrequency: "yearly", priority: 0.5 },
  ];
}
