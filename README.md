# Exende

Infrastructure APIs for autonomous software.

Exende provides agent-native infrastructure APIs accessed directly over HTTP and paid per request using x402.

## Live

Website:
https://www.exende.dev

Documentation:
https://www.exende.dev/docs

API:
https://api.exende.dev

OpenAPI:
https://api.exende.dev/openapi.json

## Callback API

The first live Exende service is Callback API.

It creates a temporary public webhook endpoint for asynchronous workflows.

Typical flow:

1. Client creates callback
2. x402 payment is settled
3. Exende returns callback_url + read_token
4. External service sends webhook to callback_url
5. Client waits or reads events
6. Callback expires automatically

## Production

- API version: 1.0.0
- Price: $0.01 USDC per callback creation
- Network: Base Mainnet (`eip155:8453`)
- Protocol: x402 v2
- Lifetime: 10 minutes
- Maximum events: 10
- Maximum payload: 262144 bytes (256 KB) per event
- Webhook methods: POST, PUT, PATCH
- Callback ID format: `^cb_[A-Za-z0-9]{24}$`
- Event ID format: `^evt_[a-f0-9]{32}$`
- Wait timeout: missing or non-finite values default to 30 seconds; finite values are floored and clamped to 1–30 seconds

## Endpoints

POST /v1/callbacks

Create callback. x402 payment required.

GET /v1/callbacks/{id}/events

Read received events.

GET /v1/callbacks/{id}/wait

Wait for next event.

DELETE /v1/callbacks/{id}

Delete callback.

POST / PUT / PATCH

https://cb.exende.dev/hooks/{id}

Receive webhook event.

## x402

Exende uses x402 for pay-per-request access.

There are no Exende accounts, subscriptions, prepaid balances or API keys required to create a callback.

Only callback creation requires payment. Reading events, waiting, webhook delivery and deletion do not trigger another Exende payment.

## Bazaar

Exende Callback is discoverable through Coinbase x402 Bazaar.

## Development

Install dependencies and start the local development server:

```bash
npm install
npm run dev
```

Run validation and create a production build:

```bash
npm run lint
npm run build
```
