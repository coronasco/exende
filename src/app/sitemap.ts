import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-08T00:00:00.000Z");

  return [
    { url: siteConfig.url, lastModified, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${siteConfig.url}/products`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteConfig.url}/products/jobs`, lastModified, changeFrequency: "daily" as const, priority: 0.95 },
    { url: `${siteConfig.url}/products/callback`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteConfig.url}/products/retry`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteConfig.url}/products/resolve`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteConfig.url}/pricing`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs/jobs`, lastModified, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${siteConfig.url}/docs/callback`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs/retry`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs/resolve`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs/x402`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/api`, lastModified, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${siteConfig.url}/terms`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${siteConfig.url}/privacy`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
