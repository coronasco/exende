import { CodeBlock } from "@/components/code-block";
import { DocsFrame } from "@/components/docs-frame";
import { JsonLd } from "@/components/json-ld";
import { codeExamples, responseExamples } from "@/content/examples";
import { siteConfig } from "@/content/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "x402 payments for Exende APIs",
  description:
    "How Exende Callback, Retry, and Resolve use x402 v2 exact USDC payments on Base Mainnet.",
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
      intro="Exende uses x402 v2 for accountless, pay-per-resource access. Payment requirements are returned directly by the API and settled in USDC on Base Mainnet."
      toc={toc}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "x402 payments for Exende APIs",
          url: `${siteConfig.url}/docs/x402`,
          dateModified: "2026-08-24",
          author: { "@type": "Organization", name: "Exende" },
        }}
      />

      <section id="flow">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">HTTP payment flow</h2>
        <ol className="mt-5 list-inside list-decimal space-y-3 text-base leading-8 text-[var(--color-muted)]">
          <li>Client sends the product creation POST without an Exende API key.</li>
          <li>Exende returns HTTP 402 and a machine-readable PAYMENT-REQUIRED header.</li>
          <li>An x402-compatible client creates a signed payment payload from those requirements.</li>
          <li>The client repeats the same request with PAYMENT-SIGNATURE.</li>
          <li>Exende verifies and settles the payment, then returns HTTP 201 with the resource.</li>
        </ol>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CodeBlock code={codeExamples.x402Challenge} language="http" title="HTTP 402 response" />
          <CodeBlock code={responseExamples.x402DecodedSummary} language="json" title="Decoded Callback declaration" />
        </div>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
          Always use the live requirements returned by the server. Do not hardcode the recipient,
          USDC contract, timeout, or other settlement details.
        </p>
      </section>

      <section id="products" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Production product prices</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="spec-table min-w-[680px]">
            <thead><tr><th>Product</th><th>Paid operation</th><th>Price</th><th>Included</th></tr></thead>
            <tbody>
              <tr>
                <td>Callback API</td><td className="font-mono">POST /v1/callbacks</td><td>$0.01 USDC</td>
                <td>One 10-minute callback; reads, waits, delivery, and deletion need no additional payment.</td>
              </tr>
              <tr>
                <td>Retry API</td><td className="font-mono">POST /v1/retries</td><td>$0.02 USDC</td>
                <td>One job, up to 8 attempts and 24 hours; internal attempts have no surcharge.</td>
              </tr>
              <tr>
                <td>Resolve API</td><td className="font-mono">POST /v1/resolve</td><td>$0.03 USDC</td>
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
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Paid replay safety</h2>
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
