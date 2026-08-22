export const siteConfig = {
  name: "Exende",
  title: "Exende — Infrastructure APIs for Autonomous Software",
  description:
    "Agent-native infrastructure APIs accessed directly over HTTP and paid per request using x402.",
  url: "https://exende.dev",
  apiBase: "https://api.exende.dev",
  callbackBase: "https://cb.exende.dev",
  openapiUrl: "https://api.exende.dev/openapi.json",
} as const;

export const topNav: { label: string; href: string; external?: boolean }[] = [
  { label: "Docs", href: "/docs" },
  { label: "API", href: "/api" },
  { label: "OpenAPI", href: siteConfig.openapiUrl, external: true },
] as const;
