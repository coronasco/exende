export const dataAccessPlans = [
  {
    name: "Explore",
    audience: "For evaluating the public catalogue and methodology.",
    status: "Available now",
    price: "Free public overview",
    features: ["Aggregate catalogue counts", "No API key required", "Documented caching contract"],
    href: "/docs/jobs",
    cta: "Use the overview",
  },
  {
    name: "Build",
    audience: "For product teams integrating normalized hiring data.",
    status: "Coming soon",
    price: "Plans in preparation",
    features: ["Product-safe search APIs", "Scoped customer API keys", "Usage and entitlement controls"],
    href: "/products/jobs#access",
    cta: "View roadmap",
  },
  {
    name: "Research",
    audience: "For teams working with historical hiring observations.",
    status: "Coming soon",
    price: "Plans in preparation",
    features: ["Historical movement", "Company hiring context", "Documented coverage boundaries"],
    href: "/products/jobs#access",
    cta: "View roadmap",
  },
] as const;

export const infrastructurePrices = [
  { name: "Callback", price: "$0.01", unit: "per callback creation", href: "/docs/callback" },
  { name: "Retry", price: "$0.02", unit: "per x402-paid job", href: "/docs/retry" },
  { name: "Resolve", price: "$0.03", unit: "per x402-paid job", href: "/docs/resolve" },
] as const;
