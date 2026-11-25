import { infrastructurePrices } from "@/content/pricing";
import { jobsIntelligenceEndpoints } from "@/content/jobs-intelligence";

const agentProducts = [
  {
    name: "Callback", slug: "callback", method: "POST", endpoint: "api.exende.dev/v1/callbacks",
    copy: "Give your agent a temporary webhook. Another service sends the event, and your agent reads it when it arrives.",
    unit: "1 temporary webhook", stages: ["Sender", "Webhook", "Agent"],
    action: "See a callback in action", href: "#workflow",
  },
  {
    name: "Retry", slug: "retry", method: "POST", endpoint: "retry.exende.dev/v1/retries",
    copy: "Schedule an HTTPS request. Retry handles temporary failures and keeps each attempt available for inspection.",
    unit: "1 retry job", stages: ["Request", "Retry", "Result"],
    action: "Follow a retry job", href: "/products/retry#workflow",
  },
  {
    name: "Resolve", slug: "resolve", method: "POST", endpoint: "resolve.exende.dev/v1/resolve",
    copy: "Give your agent a public URL and retrieve its content as bounded text, Markdown, JSON, or metadata.",
    unit: "1 resolution job", stages: ["Public URL", "Resolve", "Content"],
    action: "See a Resolve request", href: "/products/resolve#request",
  },
  {
    name: "Test Inbox", slug: "test-inbox", method: "POST", endpoint: "api.exende.dev/v1/inboxes",
    copy: "Give a test run its own private inbox. Send a verification email, then read the code or link from your test.",
    unit: "1 inbox for 24 hours", stages: ["Email", "Private inbox", "Test result"],
    action: "See the email test", href: "/products/test-inbox#workflow",
  },
] as const;

export const networkProducts = [
  {
    name: "Jobs Data", slug: "jobs", method: "GET", endpoint: "data.exende.dev/v1/jobs/search",
    copy: "Search public jobs, track companies, and see what changed over time. Use a scoped API key to bring the records into your product.",
    price: "5 search results = 5 credits", stages: ["Query", "Catalogue", "Job records"],
    action: "Explore sample data", href: "#listing",
  },
  {
    name: "Jobs Intelligence", slug: "jobs-intelligence", method: "GET", endpoint: "api.exende.dev/v1/jobs/search",
    copy: "Ask a hiring question and get a structured answer with coverage and timestamps. Pay per request with USDC on Base.",
    price: `1 job search = ${jobsIntelligenceEndpoints[0].price} USDC`, stages: ["Question", "x402", "Response"],
    action: "Explore seven endpoints", href: "#jobs-intelligence",
  },
  ...agentProducts.map(product => ({
    ...product,
    price: `${product.unit} = ${infrastructurePrices.find(entry => entry.name === product.name)!.price} USDC`,
  })),
];
