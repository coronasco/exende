import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-10T00:00:00.000Z");

  const updatedPublicPage = new Date("2026-11-25T00:00:00.000Z");

  return [
    { url: siteConfig.url, lastModified: updatedPublicPage, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${siteConfig.url}/products`, lastModified: updatedPublicPage, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteConfig.url}/products/jobs`, lastModified: updatedPublicPage, changeFrequency: "daily" as const, priority: 0.95 },
    { url: `${siteConfig.url}/products/jobs-intelligence`, lastModified: updatedPublicPage, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteConfig.url}/products/test-inbox`, lastModified: updatedPublicPage, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteConfig.url}/products/callback`, lastModified: updatedPublicPage, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteConfig.url}/products/retry`, lastModified: updatedPublicPage, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteConfig.url}/products/resolve`, lastModified: updatedPublicPage, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteConfig.url}/coverage`, lastModified: updatedPublicPage, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/pricing`, lastModified: updatedPublicPage, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs/jobs`, lastModified, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${siteConfig.url}/docs/jobs-intelligence`, lastModified: new Date("2026-10-19T00:00:00.000Z"), changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${siteConfig.url}/docs/test-inbox`, lastModified: new Date("2026-10-20T00:00:00.000Z"), changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${siteConfig.url}/docs/callback`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs/retry`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs/resolve`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/docs/x402`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteConfig.url}/api`, lastModified: updatedPublicPage, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${siteConfig.url}/terms`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${siteConfig.url}/privacy`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
