import { siteConfig } from "@/content/site";

export const docsGroups = [
  {
    label: "Start",
    items: [
      { label: "Documentation", href: "/docs" },
      { label: "x402 payments", href: "/docs/x402" },
      { label: "API surface", href: "/api" },
    ],
  },
  {
    label: "Jobs & Hiring Data",
    items: [
      { label: "Public overview", href: "/docs/jobs" },
      { label: "Request", href: "/docs/jobs#request" },
      { label: "Response schema", href: "/docs/jobs#response" },
      { label: "Caching & freshness", href: "/docs/jobs#caching" },
      { label: "Access roadmap", href: "/docs/jobs#access" },
    ],
  },
  {
    label: "Callback API",
    items: [
      { label: "Overview & quickstart", href: "/docs/callback" },
      { label: "Create a callback", href: "/docs/callback#create-callback" },
      { label: "Receive events", href: "/docs/callback#send-webhook" },
      { label: "Read events", href: "/docs/callback#read-events" },
      { label: "Wait for an event", href: "/docs/callback#wait-event" },
      { label: "Errors & limits", href: "/docs/callback#errors" },
    ],
  },
  {
    label: "Retry API v1",
    items: [
      { label: "Overview & quickstart", href: "/docs/retry" },
      { label: "Create a Retry job", href: "/docs/retry#create-job" },
      { label: "Lifecycle & status", href: "/docs/retry#lifecycle" },
      { label: "Attempts & history", href: "/docs/retry#attempts" },
      { label: "Terminal callback", href: "/docs/retry#terminal-callback" },
      { label: "Policies & idempotency", href: "/docs/retry#policies" },
      { label: "Errors & limits", href: "/docs/retry#errors" },
    ],
  },
  {
    label: "Resolve API v1",
    items: [
      { label: "Overview & quickstart", href: "/docs/resolve" },
      { label: "Resolve a resource", href: "/docs/resolve#create-resolve" },
      { label: "Read a result", href: "/docs/resolve#read-result" },
      { label: "Formats & output", href: "/docs/resolve#formats" },
      { label: "Security & limits", href: "/docs/resolve#security" },
      { label: "Errors", href: "/docs/resolve#errors" },
    ],
  },
] as const;

export const docsNavigation = docsGroups.reduce<{ label: string; href: string }[]>(
  (items, group) => [...items, ...group.items],
  [],
);

export const docsSequence = [
  { label: "Documentation", href: "/docs" },
  { label: "Jobs Data public overview", href: "/docs/jobs" },
  { label: "Callback API", href: "/docs/callback" },
  { label: "Retry API v1", href: "/docs/retry" },
  { label: "Resolve API v1", href: "/docs/resolve" },
  { label: "x402 Payments", href: "/docs/x402" },
  { label: "API Surface", href: "/api" },
] as const;

export const callbackFacts = [
  { label: "API version", value: siteConfig.apiVersion },
  { label: "Lifetime", value: "10 minutes" },
  { label: "Maximum events", value: "10" },
  { label: "Maximum payload", value: "262144 bytes (256 KB) per event" },
  { label: "Webhook methods", value: "POST, PUT, PATCH" },
  { label: "Wait timeout", value: "1–30 seconds (default 30)" },
  { label: "Price", value: "$0.01 USDC" },
  { label: "Network", value: "Base Mainnet" },
  { label: "CAIP-2 network", value: "eip155:8453" },
  { label: "Payment protocol", value: "x402 v2" },
] as const;

export const callbackFieldRows = [
  ["id", "Public identifier matching ^cb_[A-Za-z0-9]{24}$ exactly."],
  ["callback_url", "Public send-only webhook URL. Give this URL to the external service."],
  ["events_url", "Authenticated endpoint used to retrieve received events."],
  ["wait_url", "Authenticated long-polling endpoint used to wait for the next event."],
  ["read_token", "Private bearer token used to read, wait for, or delete the callback."],
  ["expires_at", "UTC expiration timestamp."],
  ["limits.events", "Maximum number of events accepted by the callback."],
  ["limits.payload_bytes", "Maximum payload size for each webhook event."],
] as const;

export const callbackErrorRows = [
  ["400", "INVALID_CALLBACK_ID"],
  ["400", "INVALID_JSON"],
  ["401", "MISSING_AUTHORIZATION"],
  ["401", "INVALID_AUTHORIZATION"],
  ["401", "INVALID_TOKEN"],
  ["404", "CALLBACK_NOT_FOUND"],
  ["404", "EVENT_NOT_FOUND"],
  ["410", "CALLBACK_EXPIRED"],
  ["410", "CALLBACK_EVENT_LIMIT_REACHED"],
  ["413", "PAYLOAD_TOO_LARGE"],
  ["415", "UNSUPPORTED_MEDIA_TYPE"],
  ["429", "RATE_LIMIT_EXCEEDED"],
  ["500", "INTERNAL_ERROR"],
] as const;

export const webhookErrorRows = [
  ["400", "INVALID_CALLBACK_ID"],
  ["400", "INVALID_JSON"],
  ["404", "CALLBACK_NOT_FOUND"],
  ["410", "CALLBACK_EXPIRED"],
  ["410", "CALLBACK_EVENT_LIMIT_REACHED"],
  ["413", "PAYLOAD_TOO_LARGE"],
  ["415", "UNSUPPORTED_MEDIA_TYPE"],
  ["429", "RATE_LIMIT_EXCEEDED"],
  ["500", "INTERNAL_ERROR"],
] as const;

export const authenticatedCallbackErrorRows = [
  ["400", "INVALID_CALLBACK_ID"],
  ["401", "MISSING_AUTHORIZATION"],
  ["401", "INVALID_AUTHORIZATION"],
  ["401", "INVALID_TOKEN"],
  ["404", "CALLBACK_NOT_FOUND"],
  ["410", "CALLBACK_EXPIRED"],
  ["500", "INTERNAL_ERROR"],
] as const;

export const waitErrorRows = [
  ["400", "INVALID_CALLBACK_ID"],
  ["401", "MISSING_AUTHORIZATION"],
  ["401", "INVALID_AUTHORIZATION"],
  ["401", "INVALID_TOKEN"],
  ["404", "CALLBACK_NOT_FOUND"],
  ["404", "EVENT_NOT_FOUND"],
  ["410", "CALLBACK_EXPIRED"],
  ["500", "INTERNAL_ERROR"],
] as const;

export const x402Facts = [
  ["Protocol", "x402 v2"],
  ["Network", "Base Mainnet"],
  ["CAIP-2", "eip155:8453"],
  ["Asset", "USDC"],
  ["Callback price", "$0.01"],
  ["Settlement", "on-chain"],
] as const;

export const apiEndpointRows = [
  [
    "POST",
    "/v1/callbacks",
    "Create a temporary callback.",
    "x402 payment required ($0.01 USDC).",
  ],
  [
    "POST",
    `${siteConfig.callbackBase}/hooks/{id}`,
    "Send a webhook event to a callback.",
    "Public; no auth or additional payment.",
  ],
  [
    "PUT",
    `${siteConfig.callbackBase}/hooks/{id}`,
    "Send a webhook event to a callback.",
    "Public; no auth or additional payment.",
  ],
  [
    "PATCH",
    `${siteConfig.callbackBase}/hooks/{id}`,
    "Send a webhook event to a callback.",
    "Public; no auth or additional payment.",
  ],
  [
    "GET",
    "/v1/callbacks/{id}/events",
    "Read received events.",
    "Bearer read token; no additional payment.",
  ],
  [
    "GET",
    "/v1/callbacks/{id}/wait",
    "Wait for the next event.",
    "Bearer read token; no additional payment.",
  ],
  [
    "DELETE",
    "/v1/callbacks/{id}",
    "Delete callback and events.",
    "Bearer read token; no additional payment.",
  ],
  ["GET", "/health", "Service health.", "None."],
  ["GET", "/openapi.json", "OpenAPI specification.", "None."],
] as const;

export const productionSurface = [
  ["API version", siteConfig.apiVersion],
  ["Base URL", siteConfig.apiBase],
  ["Callback host", siteConfig.callbackBase],
  ["OpenAPI", siteConfig.openapiUrl],
] as const;

export const retryFacts = [
  { label: "API version", value: siteConfig.retryVersion },
  { label: "Paid job price", value: "$0.02 USDC" },
  { label: "Paid maximum attempts", value: "8" },
  { label: "API-key maximum attempts", value: "20" },
  { label: "Maximum job lifetime", value: "24 hours" },
  { label: "Default policy", value: "8 attempts, exponential, 5s initial, 300s maximum" },
  { label: "Retry delay range", value: "2–3600 seconds" },
  { label: "Outbound timeout", value: "20 seconds across the redirect chain" },
  { label: "Redirects", value: "Up to 3, same origin only" },
  { label: "Outbound body", value: "256 KiB maximum" },
  { label: "Creation JSON", value: "320 KiB maximum" },
  { label: "Network", value: "Base Mainnet · eip155:8453" },
] as const;

export const retryErrorRows = [
  ["400", "INVALID_REQUEST"],
  ["400", "INVALID_URL"],
  ["400", "URL_NOT_ALLOWED"],
  ["400", "INVALID_HEADERS"],
  ["400", "TOO_MANY_ATTEMPTS"],
  ["400", "INVALID_IDEMPOTENCY_KEY"],
  ["400", "INVALID_USAGE_RANGE"],
  ["400", "PAYMENT_IDENTIFIER_REQUIRED"],
  ["401", "MISSING_AUTHORIZATION"],
  ["401", "INVALID_AUTHORIZATION"],
  ["401", "INVALID_API_KEY"],
  ["401", "INVALID_STATUS_TOKEN"],
  ["402", "PAYMENT_REQUIRED"],
  ["402", "PAYMENT_SETTLEMENT_FAILED"],
  ["404", "RETRY_NOT_FOUND"],
  ["404", "NOT_FOUND"],
  ["409", "RETRY_ALREADY_COMPLETED"],
  ["409", "IDEMPOTENCY_KEY_CONFLICT"],
  ["409", "PAYMENT_IDENTIFIER_CONFLICT"],
  ["409", "PAYMENT_IN_PROGRESS"],
  ["413", "PAYLOAD_TOO_LARGE"],
  ["500", "INTERNAL_ERROR"],
  ["503", "PAYMENT_RECONCILIATION_PENDING"],
] as const;

export const retryEndpointRows = [
  ["POST", "/v1/retries", "Create a durable Retry job.", "API key or x402 payment."],
  ["GET", "/v1/retries/{id}", "Read job status.", "API key or paid-job read token."],
  ["GET", "/v1/retries/{id}/attempts", "Read attempt history.", "API key or paid-job read token."],
  ["GET", "/v1/retries/{id}/callback", "Read safe callback delivery status.", "API key or paid-job read token."],
  ["POST", "/v1/retries/{id}/cancel", "Cancel a non-terminal job.", "API key only."],
  ["GET", "/v1/usage", "Read account-scoped usage.", "API key only."],
  ["GET", "/health", "Service health.", "None."],
] as const;

export const resolveFacts = [
  { label: "API version", value: siteConfig.resolveVersion },
  { label: "Price", value: "$0.03 USDC per Resolve job" },
  { label: "Payment", value: "x402 v2 exact on Base Mainnet" },
  { label: "Input", value: "Public HTTP or HTTPS URL" },
  { label: "Redirects", value: "3 maximum" },
  { label: "Download", value: "10 MiB maximum" },
  { label: "Output", value: "512 KiB maximum" },
  { label: "Browser runtime", value: "30 seconds maximum" },
  { label: "PDF pages", value: "500 maximum" },
  { label: "Retention", value: "72 hours" },
] as const;

export const resolveEndpointRows = [
  ["POST", "/v1/resolve", "Resolve one public resource.", "x402 payment required ($0.03 USDC)."],
  ["GET", "/v1/resolves/{id}", "Read current state or result.", "Job-scoped read token; no additional payment."],
  ["GET", "/health", "Service health.", "None."],
  ["GET", "/openapi.json", "OpenAPI specification.", "None."],
] as const;

export const resolveErrorRows = [
  ["400", "INVALID_REQUEST"],
  ["400", "INVALID_URL"],
  ["400", "UNSUPPORTED_SCHEME"],
  ["400", "PRIVATE_NETWORK_BLOCKED"],
  ["400", "URL_NOT_ALLOWED"],
  ["404", "RESOURCE_NOT_FOUND"],
  ["502", "RESOURCE_FETCH_FAILED"],
  ["413", "RESOURCE_TOO_LARGE"],
  ["415", "UNSUPPORTED_FORMAT"],
  ["422", "PARSE_FAILED"],
  ["502", "RENDER_FAILED"],
  ["504", "TIMEOUT"],
  ["413 / 502", "LIMIT_EXCEEDED"],
  ["401", "INVALID_READ_TOKEN"],
  ["404", "RESOLVE_NOT_FOUND"],
  ["400", "PAYMENT_IDENTIFIER_REQUIRED"],
  ["409", "PAYMENT_IDENTIFIER_CONFLICT"],
  ["409", "PAYMENT_IN_PROGRESS"],
  ["503", "PAYMENT_RECONCILIATION_PENDING"],
  ["500", "INTERNAL_ERROR"],
] as const;
