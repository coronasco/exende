import { siteConfig } from "@/content/site";

const callbackId = "cb_9nHT0f4VG4n3L2xC8Q";

export const exampleValues = {
  callbackId,
  eventId: "evt_6ec6e7b4a917d63861a07d9238d4cf6d",
  readToken: "ex_cb_sk_...",
} as const;

export const codeExamples = {
  createCallback: `curl -i -X POST \\
  ${siteConfig.apiBase}/v1/callbacks \\
  -H "Content-Type: application/json" \\
  -d '{}'`,
  sendWebhook: `curl -X POST \\
  ${siteConfig.callbackBase}/hooks/cb_... \\
  -H "Content-Type: application/json" \\
  -d '{"status":"completed","result":"https://example.com/output"}'`,
  waitForEvent: `curl \\
  "${siteConfig.apiBase}/v1/callbacks/cb_.../wait?timeout=30" \\
  -H "Authorization: Bearer ex_cb_sk_..."`,
  readEvents: `curl \\
  ${siteConfig.apiBase}/v1/callbacks/cb_.../events \\
  -H "Authorization: Bearer ex_cb_sk_..."`,
  deleteCallback: `curl -X DELETE \\
  ${siteConfig.apiBase}/v1/callbacks/cb_... \\
  -H "Authorization: Bearer ex_cb_sk_..."`,
  health: `curl ${siteConfig.apiBase}/health`,
  x402Challenge: `HTTP/2 402 Payment Required
PAYMENT-REQUIRED: <base64-encoded x402 challenge>
x-request-id: req_4a87c34d-e4e9-4029-9270-2465c4ee0272`,
} as const;

export const responseExamples = {
  createdCallback: `{
  "id": "cb_...",
  "callback_url": "${siteConfig.callbackBase}/hooks/cb_...",
  "events_url": "${siteConfig.apiBase}/v1/callbacks/cb_.../events",
  "wait_url": "${siteConfig.apiBase}/v1/callbacks/cb_.../wait",
  "read_token": "ex_cb_sk_...",
  "expires_at": "2026-08-22T14:30:00.000Z",
  "limits": {
    "events": 10,
    "payload_bytes": 262144
  }
}`,
  webhookAccepted: `{
  "received": true,
  "event_id": "evt_..."
}`,
  waitReceived: `{
  "received": true,
  "event": {
    "id": "evt_...",
    "method": "POST",
    "body": {
      "status": "completed",
      "result": "https://example.com/output"
    }
  },
  "next_wait_url": "..."
}`,
  waitTimeout: `{
  "received": false,
  "timeout": true
}`,
  events: `{
  "callback_id": "${callbackId}",
  "status": "active",
  "expires_at": "2026-08-22T14:30:00.000Z",
  "event_count": 1,
  "events": [
    {
      "id": "${exampleValues.eventId}",
      "received_at": "2026-08-22T14:05:17.000Z",
      "method": "POST",
      "content_type": "application/json",
      "headers": {
        "content-type": "application/json"
      },
      "body": {
        "status": "completed",
        "result": "https://example.com/output"
      },
      "size_bytes": 63
    }
  ]
}`,
  deleted: `{
  "deleted": true,
  "callback_id": "cb_..."
}`,
  error: `{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "...",
    "request_id": "req_..."
  }
}`,
  health: `{
  "status": "ok",
  "service": "exende-api",
  "version": "0.1.0"
}`,
  x402DecodedSummary: `{
  "x402Version": 2,
  "accepts": [
    {
      "network": "eip155:8453",
      "amount": "10000",
      "extra": {
        "name": "USD Coin",
        "version": "2"
      }
    }
  ],
  "extensions": {
    "bazaar": {
      "routeTemplate": "/v1/callbacks"
    }
  }
}`,
} as const;
