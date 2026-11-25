import { CodeBlock } from "@/components/code-block";
import { DocsFrame } from "@/components/docs-frame";
import { JsonLd } from "@/components/json-ld";
import { codeExamples, responseExamples } from "@/content/examples";
import { jobsIntelligenceEndpoints } from "@/content/jobs-intelligence";
import { siteConfig } from "@/content/site";
import { testInboxStatus } from "@/content/test-inbox";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "x402 payments for Exende APIs",
  description:
    "How Exende Jobs Intelligence, Callback, Retry, and Resolve use x402 v2 exact USDC payments on Base Mainnet.",
  alternates: { canonical: "/docs/x402" },
  openGraph: {
    title: "Exende x402 payment documentation",
    description: "Pay per Callback, Retry, or Resolve job with exact USDC settlement on Base.",
    url: "/docs/x402",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende x402 payment documentation",
    description: "Pay per Callback, Retry, or Resolve job with exact USDC settlement on Base.",
    images: ["/twitter-image"],
  },
};

const toc = [
  { id: "flow", label: "HTTP payment flow" },
  { id: "products", label: "Product prices" },
  { id: "replay", label: "Paid replay safety" },
  { id: "discovery", label: "Bazaar discovery" },
] as const;

export default function X402DocsPage() {
  return (
    <DocsFrame
      currentHref="/docs/x402"
      title="x402 payments"
      intro="Exende uses x402 v2 for pay-per-request Jobs Intelligence and pay-per-resource infrastructure. Payment requirements are returned by the API and settled in USDC on Base Mainnet. No account is required for these x402 requests."
      toc={toc}
      updatedAt="October 20, 2026"
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "x402 payments for Exende APIs",
          url: `${siteConfig.url}/docs/x402`,
          dateModified: "2026-10-20",
          author: { "@type": "Organization", name: "Exende" },
        }}
      />

      <section id="flow">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">HTTP payment flow</h2>
        <ol className="mt-5 list-inside list-decimal space-y-3 text-base leading-8 text-[var(--color-muted)]">
          <li>Client sends a Jobs Intelligence GET or infrastructure creation POST without an Exende API key.</li>
          <li>Exende returns HTTP 402 and a machine-readable PAYMENT-REQUIRED header.</li>
          <li>An x402-compatible client creates a signed payment payload from those requirements.</li>
          <li>The client repeats the same request with PAYMENT-SIGNATURE.</li>
          <li>Exende verifies and settles the payment, then returns HTTP 200 with the Jobs Intelligence response or HTTP 201 with the created infrastructure resource.</li>
        </ol>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CodeBlock code={codeExamples.x402Challenge} language="http" title="HTTP 402 response" />
          <CodeBlock code={responseExamples.x402DecodedSummary} language="json" title="Decoded Callback declaration" />
        </div>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
          Always use the live requirements returned by the server. Do not hardcode the recipient,
          USDC contract, timeout, or other settlement details.
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">Jobs Intelligence supports EIP-3009 payment authorization for exact USDC on Base. Other payment representations are rejected before data access or settlement. <Link href="/docs/jobs-intelligence#payments" className="text-link">Read the Jobs Intelligence payment contract.</Link></p>
      </section>

      <section id="products" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Product prices</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="spec-table min-w-[680px]">
            <thead><tr><th>Product</th><th>Paid operation</th><th>Price</th><th>Included</th></tr></thead>
            <tbody>
              {jobsIntelligenceEndpoints.map(endpoint => <tr key={endpoint.id}><td><Link href={`/docs/jobs-intelligence#${endpoint.id}`}>{endpoint.title}</Link></td><td className="font-mono">GET {endpoint.path}</td><td>{endpoint.price} USDC</td><td>{endpoint.description}</td></tr>)}
              <tr>
                <td><Link href="/docs/test-inbox">Test Inbox</Link><small className="mt-2 block">{testInboxStatus}</small></td><td className="font-mono">POST /v1/inboxes</td><td>$0.02 USDC</td>
                <td>One 24-hour inbox, up to three emails; authenticated reads, waits, lookup, and deletion included.</td>
              </tr>
              <tr>
                <td>Callback API</td><td className="font-mono">POST /v1/callbacks</td><td>$0.01 USDC</td>
                <td>One 10-minute callback; reads, waits, delivery, and deletion need no additional payment.</td>
              </tr>
              <tr>
                <td>Retry API</td><td className="font-mono">POST /v1/retries</td><td>$0.02 USDC</td>
                <td>One job, up to 8 attempts and 24 hours; internal attempts have no surcharge.</td>
              </tr>
              <tr>
                <td>Resolve API</td><td className="font-mono">POST /v1/resolve</td><td>$0.01 USDC</td>
                <td>One public resource resolution; token-protected result reads need no additional payment.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <table className="spec-table mt-7">
          <tbody>
            <tr><th>Protocol</th><td>x402 v2</td></tr>
            <tr><th>Scheme</th><td>exact</td></tr>
            <tr><th>Network</th><td>Base Mainnet · eip155:8453</td></tr>
            <tr><th>Asset</th><td>USDC · 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913</td></tr>
          </tbody>
        </table>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
          Callback creation is x402-only. Retry also has a separate API-key path for account-scoped
          usage and up to 20 attempts; sending any Authorization header selects that path and an
          invalid key does not fall back to x402.
        </p>
      </section>

      <section id="replay" className="surface-rule mt-12 pt-8">
        <p className="mb-6 text-base leading-8 text-[var(--color-muted)]">Test Inbox uses a client-generated access token saved before payment. Lookup recovers the inbox; repeating creation with the same token and identical body recovers the active resource without another charge. <Link href="/docs/test-inbox#recovery" className="text-link">Read the Test Inbox recovery contract.</Link></p>
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Paid replay safety</h2>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">Jobs Intelligence accepts each signed payment authorization once. A repeated authorization returns HTTP 409, with no second settlement or stored response replay. After an uncertain request outcome, inspect its settlement status before authorizing another payment. <Link href="/docs/jobs-intelligence#payments" className="text-link">Jobs Intelligence payment details.</Link></p>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
          Paid Retry clients must include the x402 v2 payment-identifier extension. Generate one
          identifier per logical job and reuse it only when repeating that same request after
          transport uncertainty. A settled replay returns or recovers the original job; a changed
          request returns PAYMENT_IDENTIFIER_CONFLICT.
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          PAYMENT_IN_PROGRESS means the same paid request is being processed.
          PAYMENT_RECONCILIATION_PENDING means settlement succeeded but durable job reconciliation
          is still pending. Retry the same logical request and identifier; do not create a second payment.
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          Resolve uses the same payment-identifier recovery model. Reuse an identifier only for the
          same URL, output, and render request after transport uncertainty; changed input returns
          PAYMENT_IDENTIFIER_CONFLICT.
        </p>
      </section>

      <section id="discovery" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Bazaar discovery</h2>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">The seven Jobs Intelligence routes extend the existing <a href="https://agentic.market/services/api-exende-dev" target="_blank" rel="noreferrer" className="text-link">api.exende.dev service</a> alongside Callback. Their live 402 responses publish input and output schemas, examples, and per-request prices. Marketplace indexing is asynchronous.</p>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
          Callback and Retry paid resources are indexed by Coinbase x402 Bazaar with their exact
          production URLs, Base network, USDC asset, and prices. Their unpaid 402 responses also
          include Bazaar input and output schemas for programmatic discovery.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="annotation text-[var(--color-accent)]">Callback resource</p>
            <p className="mt-3 break-all font-mono text-xs text-white">{siteConfig.callbackApiBase}/v1/callbacks</p>
          </div>
          <div className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:col-span-2">
            <p className="annotation text-[var(--color-accent)]">Resolve resource</p>
            <p className="mt-3 break-all font-mono text-xs text-white">{siteConfig.resolveApiBase}/v1/resolve</p>
            <p className="mt-2 text-xs leading-6 text-[var(--color-muted)]">The live 402 response declares Bazaar discovery metadata. No separate verified listing URL is claimed here.</p>
          </div>
          <div className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="annotation text-[var(--color-violet)]">Retry resource</p>
            <p className="mt-3 break-all font-mono text-xs text-white">{siteConfig.retryApiBase}/v1/retries</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={siteConfig.bazaarSearch} target="_blank" rel="noreferrer" className="button-link" data-variant="accent">Search verified Bazaar resources</a>
          <Link href="/docs/retry#x402" className="button-link">Retry paid quickstart</Link>
        </div>
      </section>
    </DocsFrame>
  );
}
