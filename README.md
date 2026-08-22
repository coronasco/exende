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

## Production configuration

Price: $0.01 USDC

Network: Base Mainnet

x402: v2

Lifetime: 10 minutes

Events: 10

Payload: 256 KB

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
