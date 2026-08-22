import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-08-22T00:00:00.000Z");

  return [
    { url: siteConfig.url, lastModified: now },
    { url: `${siteConfig.url}/docs`, lastModified: now },
    { url: `${siteConfig.url}/docs/callback`, lastModified: now },
    { url: `${siteConfig.url}/docs/x402`, lastModified: now },
    { url: `${siteConfig.url}/api`, lastModified: now },
  ];
}
