export const siteConfig = {
  name: "Exende",
  title: "Jobs Data API & Hiring Intelligence | Exende",
  description:
    "Reviewed public hiring data for market research, recruiting analytics, and data products, with infrastructure APIs for autonomous software.",
  url: "https://www.exende.dev",
  dataApiBase: "https://data.exende.dev",
  dataApiOverview: "https://data.exende.dev/v1/public/overview",
  callbackVersion: "1.0.0",
  callbackApiBase: "https://api.exende.dev",
  callbackBase: "https://cb.exende.dev",
  retryVersion: "1.0.0",
  retryApiBase: "https://retry.exende.dev",
  resolveVersion: "1.0.0",
  resolveApiBase: "https://resolve.exende.dev",
  jobsOpenApi: "/openapi/jobs.json",
  callbackOpenApi: "/openapi/callback.json",
  retryOpenApi: "/openapi/retry.json",
  resolveOpenApi: "/openapi/resolve.json",
  bazaarSearch:
    "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?urlSubstring=exende.dev&network=eip155%3A8453&scheme=exact&limit=20",
  x402Docs: "https://docs.x402.org/",
  supportEmail: "support@exende.dev",
  legalOperator: "Daniel Zaharia",
  legalAddress: "Largo Valgioie 22, Italy",
  // Legacy Callback aliases retained while the documentation is split by product.
  apiVersion: "1.0.0",
  apiBase: "https://api.exende.dev",
  openapiUrl: "/openapi/callback.json",
} as const;

// Backward-compatible aliases used by the existing Callback documentation.
export const callbackApiBase = siteConfig.callbackApiBase;

export const topNav: { label: string; href: string; external?: boolean }[] = [
  { label: "Data API", href: "/products/jobs" },
  { label: "Products", href: "/products" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
] as const;
