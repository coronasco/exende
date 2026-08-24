export const siteConfig = {
  name: "Exende",
  title: "Exende — Infrastructure APIs for Autonomous Software",
  description:
    "Agent-native Callback and Retry APIs accessed directly over HTTP and paid per request using x402.",
  url: "https://exende.dev",
  callbackVersion: "1.0.0",
  callbackApiBase: "https://api.exende.dev",
  callbackBase: "https://cb.exende.dev",
  retryVersion: "1.0.0",
  retryApiBase: "https://retry.exende.dev",
  callbackOpenApi: "/openapi/callback.json",
  retryOpenApi: "/openapi/retry.json",
  bazaarSearch:
    "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?urlSubstring=exende.dev&network=eip155%3A8453&scheme=exact&limit=20",
  x402Docs: "https://docs.x402.org/",
  analyticsId: "G-51HMFG32YE",
  // Legacy Callback aliases retained while the documentation is split by product.
  apiVersion: "1.0.0",
  apiBase: "https://api.exende.dev",
  openapiUrl: "/openapi/callback.json",
} as const;

// Backward-compatible aliases used by the existing Callback documentation.
export const callbackApiBase = siteConfig.callbackApiBase;

export const topNav: { label: string; href: string; external?: boolean }[] = [
  { label: "Products", href: "/products" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
] as const;
