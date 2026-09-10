import "server-only";
import { siteConfig } from "@/content/site";

// This is an explicitly public origin. Never pass a private Data Plane URL or credentials to clients.
export function publicDataOrigin(): string {
  const origin = process.env.EXENDE_PUBLIC_DATA_ORIGIN;
  if (!origin) return new URL(siteConfig.dataApiOverview).origin;
  const parsed = new URL(origin);
  if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash ||
      (parsed.protocol !== "https:" && !(process.env.NODE_ENV === "development" && parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname)))) throw new Error("Invalid public Data API origin");
  return parsed.origin;
}
