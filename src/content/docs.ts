import { siteConfig } from "@/content/site";

export const docsNavigation = [
  { label: "Overview", href: "/docs" },
  { label: "Callback API", href: "/docs/callback" },
  { label: "x402 Payments", href: "/docs/x402" },
] as const;

export const callbackFacts = [
  { label: "Lifetime", value: "10 minutes" },
  { label: "Maximum events", value: "10" },
  { label: "Maximum payload", value: "256 KB" },
  { label: "Webhook methods", value: "POST, PUT, PATCH" },
  { label: "Price", value: "$0.01 USDC" },
  { label: "Network", value: "Base Mainnet" },
  { label: "Payment protocol", value: "x402 v2" },
] as const;

export const callbackFieldRows = [
  ["id", "Public callback identifier."],
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
  ["410", "CALLBACK_EXPIRED"],
  ["410", "CALLBACK_EVENT_LIMIT_REACHED"],
  ["413", "PAYLOAD_TOO_LARGE"],
  ["415", "UNSUPPORTED_MEDIA_TYPE"],
  ["429", "RATE_LIMIT_EXCEEDED"],
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
  ["POST", "/v1/callbacks", "Create a temporary callback.", "x402 payment required."],
  [
    "POST",
    "/hooks/{id}",
    "Send a webhook event to a callback.",
    "Public send-only endpoint on cb.exende.dev.",
  ],
  [
    "PUT",
    "/hooks/{id}",
    "Send a webhook event to a callback.",
    "Public send-only endpoint on cb.exende.dev.",
  ],
  [
    "PATCH",
    "/hooks/{id}",
    "Send a webhook event to a callback.",
    "Public send-only endpoint on cb.exende.dev.",
  ],
  [
    "GET",
    "/v1/callbacks/{id}/events",
    "Read received events.",
    "Bearer read token required.",
  ],
  [
    "GET",
    "/v1/callbacks/{id}/wait",
    "Wait for the next event.",
    "Bearer read token required.",
  ],
  [
    "DELETE",
    "/v1/callbacks/{id}",
    "Delete callback and events.",
    "Bearer read token required.",
  ],
  ["GET", "/health", "Service health.", "None."],
  ["GET", "/openapi.json", "OpenAPI specification.", "None."],
] as const;

export const productionSurface = [
  ["Base URL", siteConfig.apiBase],
  ["Callback host", siteConfig.callbackBase],
  ["OpenAPI", siteConfig.openapiUrl],
] as const;
