# Exende website

Production marketing site and developer documentation for Exende.

Exende is positioned around Jobs & Hiring Data: reviewed public career sources, normalized records, current catalogue counts, and historical observation. The site also documents the existing Callback, Retry, and Resolve infrastructure APIs.

## Public DataAPI integration

The homepage keeps a compact aggregate overview. “Explore sample data” opens a native, keyboard-accessible modal; its search code and data load only when opened.

- `GET https://data.exende.dev/v1/public/overview`: server-rendered canonical counts, cached for five minutes. Freshness means the latest canonical job observation.
- `GET https://data.exende.dev/v1/public/search?q=...`: restricted public demonstration, not customer API access. Only `q` is accepted (80 characters, six terms). At most five records are returned from a fixed pool of at most 12 across all searches, alongside capped aggregate groups. No pagination, descriptions, bulk export, customer or operator data.

Search matches canonical roles, source location labels, companies and normalized skills. Exact supported country names/codes filter explicit country evidence. Locations are not normalized cities. The client validates and explicitly projects the response again before showing any record or JSON.

The matching backend change is in the separate Exende backend repository: migrations `0019_customer_product_milestones.sql` and `0020_public_catalogue_samples.sql`, the API preview handler, and gateway rate-limit bindings. These changes must be reviewed and released together; committing the website does not publish the endpoint or apply migrations.

## Product status

- Jobs Data public aggregate overview: available.
- Customer authentication, onboarding credits, and scoped API-key delivery: available.
- Product-safe customer job search, company data, and historical analysis APIs: available with a scoped key.
- Paid Data API subscriptions and plan upgrades: available through the configured authenticated checkout; plan selection never starts a payment automatically.
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

`EXENDE_PUBLIC_DATA_ORIGIN` optionally selects a credential-free public preview origin. It defaults to `https://data.exende.dev`; a localhost HTTP origin is permitted only in development. This public value is passed to the modal. Never set it to a private service origin.

For the local end-to-end stack, run the Exende Control Plane on port `8787` and
the Jobs Data Plane on port `8788` before starting Next.js on port `3000`.

Run the full validation suite with:

```bash
npm run verify
```

DataAPI and infrastructure backend repositories are separate. Coordinate changes to customer contracts and public preview boundaries with the backend; do not change or deploy an unrelated service.

## Discovery and indexing

Public product and documentation pages render meaningful HTML, canonical metadata and structured data. `/api`, `/api/catalog.json`, `/llms.txt`, `/llms-full.txt` and `/openapi/jobs.json` distinguish the Jobs Data bearer-key/credit model from the three x402 agent products. Account and dashboard routes are `noindex`; private management paths are excluded from robots and the sitemap.

Docs retain their existing presentation. Jobs reference content is derived from the checked-in OpenAPI contract; response examples are explicitly structural, not invented live records.

## Release review

`codex/exende-product-upgrade` is a review-only Git branch; `vercel.json` disables automatic Vercel deployments for this exact branch. No production deployment or remote migration is part of this change. `npm run build -- --webpack` is a supported local build fallback when Turbopack IPC is restricted by the host sandbox.

Before a release, review the internal Terms TODOs for data-storage/display/redistribution rights and the tax wording against the actual commercial configuration. Never infer additional source rights from public availability.
