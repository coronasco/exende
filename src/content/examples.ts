import { siteConfig } from "@/content/site";

const callbackId = "cb_3t2cC09baD4yOvoeVMDK2vGQ";

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
  ${siteConfig.callbackBase}/hooks/${callbackId} \\
  -H "Content-Type: application/json" \\
  -d '{"status":"completed","result":"https://example.com/output"}'`,
  waitForEvent: `curl \\
  "${siteConfig.apiBase}/v1/callbacks/${callbackId}/wait?timeout=30" \\
  -H "Authorization: Bearer ex_cb_sk_..."`,
  readEvents: `curl \\
  ${siteConfig.apiBase}/v1/callbacks/${callbackId}/events \\
  -H "Authorization: Bearer ex_cb_sk_..."`,
  deleteCallback: `curl -X DELETE \\
  ${siteConfig.apiBase}/v1/callbacks/${callbackId} \\
  -H "Authorization: Bearer ex_cb_sk_..."`,
  x402Challenge: `HTTP/2 402 Payment Required
PAYMENT-REQUIRED: <base64-encoded x402 challenge>
x-request-id: req_4a87c34d-e4e9-4029-9270-2465c4ee0272`,
} as const;

export const responseExamples = {
  createdCallback: `{
  "id": "${callbackId}",
  "callback_url": "${siteConfig.callbackBase}/hooks/${callbackId}",
  "events_url": "${siteConfig.apiBase}/v1/callbacks/${callbackId}/events",
  "wait_url": "${siteConfig.apiBase}/v1/callbacks/${callbackId}/wait",
  "read_token": "ex_cb_sk_...",
  "expires_at": "2026-08-22T14:30:00.000Z",
  "limits": {
    "events": 10,
    "payload_bytes": 262144
  }
}`,
  webhookAccepted: `{
  "received": true,
  "event_id": "${exampleValues.eventId}"
}`,
  waitReceived: `{
  "received": true,
  "timeout": false,
  "event": {
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
    "size_bytes": 60
  },
  "next_wait_url": "/v1/callbacks/${callbackId}/wait?after=${exampleValues.eventId}&timeout=30"
}`,
  waitTimeout: `{
  "received": false,
  "timeout": true,
  "after": null
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
      "size_bytes": 60
    }
  ]
}`,
  deleted: `{
  "deleted": true,
  "callback_id": "${callbackId}"
}`,
  error: `{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "The read token is invalid.",
    "request_id": "req_81731247-7585-44a8-8716-d9dda3e0ff61"
  }
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

export const resolveExamples = {
  createCurl: `curl -i -X POST \\
  ${siteConfig.resolveApiBase}/v1/resolve \\
  -H "Content-Type: application/json" \\
  --data '{
    "url": "https://example.com/report.pdf",
    "output": "auto",
    "render": "auto"
  }'`,
  createJavaScript: `const endpoint = "${siteConfig.resolveApiBase}/v1/resolve";
const input = {
  url: "https://example.com/article",
  output: "auto",
  render: "auto",
};

const response = await fetch(endpoint, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(input),
});

if (response.status === 402) {
  const challenge = response.headers.get("PAYMENT-REQUIRED");
  // Give the live challenge to your x402 v2 client, then repeat
  // this request with its PAYMENT-SIGNATURE header.
  console.log(challenge);
}`,
  readCurl: `curl \\
  ${siteConfig.resolveApiBase}/v1/resolves/resolve_0123456789abcdef0123456789abcdef \\
  -H "Authorization: Bearer ex_resolve_read_..."`,
  completedResponse: `{
  "id": "resolve_0123456789abcdef0123456789abcdef",
  "status": "completed",
  "resource": {
    "requested_url": "https://example.com/report.pdf",
    "final_url": "https://example.com/report.pdf",
    "content_type": "application/pdf",
    "content_disposition": null,
    "size_bytes": 123456,
    "redirect_count": 0
  },
  "resolved": {
    "type": "document",
    "format": "pdf",
    "text": "Example report text.",
    "markdown": null,
    "data": null,
    "links": null
  },
  "metadata": {
    "title": "Example report",
    "pages": 12,
    "text_available": true
  },
  "processing": {
    "strategy": "pdf_text",
    "browser_used": false,
    "browser_ms_used": null,
    "ocr_used": false,
    "duration_ms": 840,
    "cost_estimate_usd": "0.001100"
  },
  "limits": {
    "truncated": false,
    "output_bytes": 12345
  },
  "status_url": "${siteConfig.resolveApiBase}/v1/resolves/resolve_0123456789abcdef0123456789abcdef",
  "read_token": "ex_resolve_read_..."
}`,
} as const;
