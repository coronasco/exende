# Exende website

Production marketing site and developer documentation for Exende.

Exende is positioned around Jobs & Hiring Data: reviewed public career sources, normalized records, current catalogue counts, and historical observation. The site also documents the existing Callback, Retry, and Resolve infrastructure APIs.

## Public DataAPI integration

The only DataAPI route consumed by the public website is:

```text
GET https://dataapi-api-production.daniel-zaharia-dev.workers.dev/v1/public/overview
```

It requires no key and returns aggregate catalogue counts plus a nullable freshness timestamp. The site fetches it through one server data client, validates the payload, caches it for five minutes, and renders a stable fallback if the request is unavailable.

No operator dashboard, protected DataAPI route, internal credential, job listing, company profile, or source-health data is exposed by this repository.

## Product status

- Jobs Data public aggregate overview: available.
- Customer authentication, subscriptions, entitlements, and scoped API-key delivery: coming soon.
- Product-safe customer job search, company data, and historical analysis APIs: coming soon.
- Callback, Retry, and Resolve infrastructure APIs: available and documented.

Infrastructure paid paths use x402 v2 exact USDC settlement on Base Mainnet. Their canonical contracts are under `public/openapi/`, and the combined machine-readable catalogue is `public/api/catalog.json`.

## Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

`EXENDE_CONTROL_PLANE_URL` is the server-only origin used for authentication,
account management, API keys, credits, usage, and billing. `EXENDE_DATA_API_URL`
is used only to render customer request examples. Never expose either as a
`NEXT_PUBLIC_` variable and never place service credentials in this repository.

For the local end-to-end stack, run the Exende Control Plane on port `8787` and
the Jobs Data Plane on port `8788` before starting Next.js on port `3000`.

Run the full validation suite with:

```bash
npm run verify
```

This repository is the website only. DataAPI and infrastructure backend repositories are separate and must not be modified from this project.
