import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-24T00:00:00.000Z");

  return [
    { url: siteConfig.url, lastModified, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${siteConfig.url}/products`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteConfig.url}/products/callback`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteConfig.url}/products/retry`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteConfig.url}/pricing`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs/callback`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs/retry`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs/x402`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/api`, lastModified, changeFrequency: "weekly" as const, priority: 0.7 },
  ];
}
