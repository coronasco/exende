import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { DocsFrame } from "@/components/docs-frame";
import { JsonLd } from "@/components/json-ld";
import { jobsIntelligenceEndpoints } from "@/content/jobs-intelligence";
import { siteConfig } from "@/content/site";
import specification from "../../../../public/openapi/jobs-intelligence.json";

export const metadata: Metadata = {
  title: "Jobs Intelligence API documentation",
  description: "Seven x402 hiring intelligence APIs: prices, filters, examples, payments, data coverage, limits, and errors.",
  alternates: { canonical: "/docs/jobs-intelligence" },
  openGraph: { title: "Exende Jobs Intelligence documentation", description: "The complete reference for seven x402 hiring intelligence endpoints.", url: "/docs/jobs-intelligence", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "Exende Jobs Intelligence documentation", description: "Pay-per-request hiring intelligence with documented data boundaries.", images: ["/twitter-image"] },
};

const toc = [
  { id: "quickstart", label: "Quickstart" }, { id: "payments", label: "x402 payments" },
  ...jobsIntelligenceEndpoints.map(endpoint => ({ id: endpoint.id, label: endpoint.title })),
  { id: "coverage", label: "Coverage & methodology" }, { id: "limits", label: "Limits" },
  { id: "errors", label: "Errors" }, { id: "openapi", label: "OpenAPI" },
];
const heading = "font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white";
const prose = "mt-4 text-base leading-8 text-[var(--color-muted)]";
const paths = specification.paths as Record<string, { get: { responses: { "200": { content: { "application/json": { examples: { synthetic: { value: unknown } } } } } } } }>;

export default function JobsIntelligenceDocsPage() {
  return <DocsFrame currentHref="/docs/jobs-intelligence" title="Jobs Intelligence" intro="Structured hiring intelligence for AI agents. Seven GET APIs on api.exende.dev, paid per request with x402. No API keys or subscriptions are required for individual x402 requests." toc={toc} updatedAt="October 19, 2026">
    <JsonLd data={{ "@context": "https://schema.org", "@type": "TechArticle", headline: "Exende Jobs Intelligence API documentation", description: metadata.description, url: `${siteConfig.url}/docs/jobs-intelligence`, dateModified: "2026-10-19", author: { "@type": "Organization", name: "Exende" } }} />
    <section id="quickstart" className="surface-rule scroll-mt-28 pt-8">
      <h2 className={heading}>Start with an unpaid request</h2>
      <p className={prose}>Send a valid GET request to inspect its price and payment requirements. This curl command contains no payment authorization and spends no funds. HTTP 402 is the expected first response.</p>
      <CodeBlock code="curl -i 'https://api.exende.dev/v1/jobs/search?keyword=engineer&limit=3'" language="bash" title="Unpaid probe · expected HTTP 402" />
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/products/jobs-intelligence" className="button-link">Product overview</Link><Link href="/openapi/jobs-intelligence.json" className="button-link" data-variant="accent">OpenAPI & response schemas</Link></div>
    </section>
    <section id="payments" className="surface-rule scroll-mt-28 mt-12 pt-8">
      <h2 className={heading}>Pay through x402</h2>
      <p className={prose}>Use an x402 v2 client supporting exact USDC payments on Base Mainnet (<code>eip155:8453</code>) through EIP-3009. Read the current <code>PAYMENT-REQUIRED</code> challenge and verify its resource, amount, asset, network, and recipient. Sign a fresh authorization and repeat the exact request with <code>PAYMENT-SIGNATURE</code>. Successful settlement returns HTTP 200, the data, and <code>PAYMENT-RESPONSE</code>.</p>
      <p className={prose}>Permit2 is not supported for these routes. Invalid parameters are rejected before payment. A payment proof can be used only once; protect it as a sensitive authorization. If an outcome is ambiguous, reconcile the payment receipt before authorizing another payment. EIP-3009 signs payment details; it does not sign URL query parameters.</p>
      <p className={prose}>These routes share Exende’s existing Callback service and payment recipient. Use the live challenge for authoritative requirements. <Link href="/docs/x402" className="text-[var(--color-accent)]">See the x402 payment guide.</Link></p>
    </section>
    {jobsIntelligenceEndpoints.map(endpoint => <section id={endpoint.id} className="surface-rule scroll-mt-28 mt-12 pt-8" key={endpoint.id}>
      <p className="annotation text-[var(--color-accent)]">GET · {endpoint.price} USDC per request</p>
      <h2 className={`${heading} mt-3`}>{endpoint.title}</h2>
      <p className="mt-4 break-all font-mono text-sm text-white">GET {endpoint.path}</p>
      <p className={prose}>{endpoint.description}</p>
      <p className={prose}><strong className="text-white">Parameters:</strong> {endpoint.parameters}.</p>
      <p className={prose}><strong className="text-white">Returns:</strong> {endpoint.returns}</p>
      <CodeBlock code={`curl -i '${endpoint.example}'`} language="bash" title="Unpaid probe · no funds spent" />
      <details className="mt-6 rounded border border-[var(--color-border)] p-4">
        <summary className="cursor-pointer text-sm text-white">Synthetic JSON response example</summary>
        <p className={prose}>Illustrative schema values, not live catalogue statistics.</p>
        <CodeBlock code={JSON.stringify(paths[endpoint.path].get.responses["200"].content["application/json"].examples.synthetic.value, null, 2)} language="json" title="Illustrative successful response" />
      </details>
    </section>)}
    <section id="coverage" className="surface-rule scroll-mt-28 mt-12 pt-8">
      <h2 className={heading}>Coverage, freshness & methodology</h2>
      <p className={prose}>Every response includes <code>data</code> and <code>meta</code> with observation period, freshness, coverage, methodology, and limitations. Results represent Exende’s monitored catalogue, not the entire labour market. Generation time is calculation time; source observation timestamps can be older.</p>
      <p className={prose}>Current queries inspect up to 10,000 recent active jobs, scoped to a company first when supplied. Filters apply within that cohort. Check <code>meta.coverage.sampled</code>: incomplete cohorts expose sample counts and return null for unsupported full totals. Older matching jobs may be omitted.</p>
      <p className={prose}>The hiring activity score is <code>round(100 × recently_observed_jobs / observed_sample_jobs, 2)</code>, or zero for an empty sample. Recent jobs are active matching jobs first observed within seven days. This measures observed activity, not company growth; adding a monitored source can affect it.</p>
      <p className={prose}>Historical comparisons require sufficient boundary observations and a complete cohort of at most 5,000 jobs. Company Changes returns HTTP 422 when this is unavailable. Trends and Report retain current statistics and label the history section unavailable. A disappearing job does not prove a hire. Skills use existing current structured associations and do not reconstruct historical skill demand.</p>
      <p className={prose}>All calculations use the existing Jobs data source and deterministic code. No endpoint performs AI inference.</p>
    </section>
    <section id="limits" className="surface-rule scroll-mt-28 mt-12 pt-8">
      <h2 className={heading}>Filters & response limits</h2>
      <ul className={`${prose} list-disc space-y-2 pl-5`}>
        <li>Search: 1–10 jobs, default 10. Signals: 1–5 companies, default five. Other ranked lists are bounded to 10 items; report company statistics to five.</li>
        <li>The only supported period is <code>7d</code>. Company and Changes require a company domain; use a company present in the monitored catalogue. The <code>stripe.com</code> examples were verified on October 19, 2026.</li>
        <li>Keyword: 2–120 characters. Role, location, and department: 2–80 characters. Text filters require one to eight words of at least two characters.</li>
        <li>Company is an ASCII domain. Role matches title; location matches source text; department matches the recorded value without case sensitivity. Industry is unsupported.</li>
        <li><code>remote=true</code> selects remote jobs; <code>remote=false</code> selects known on-site jobs, excluding hybrid and unknown. Employment types: full_time, part_time, contract, temporary, internship, unknown.</li>
        <li>Unknown or duplicate parameters, arbitrary SQL, pagination, and export requests are rejected.</li>
        <li>Default admission limits: 30 requests/minute per IP, 10/minute per verified payer, 50/day per payer, and 500/day across the service. Admitted failures count toward daily limits. Distributed provider limits may be locally enforced.</li>
        <li>Eight-second upstream budget and 128 KiB response ceiling. Public data responses use private/no-store; underlying calculations may be cached for five minutes. Cached calculations still require a new verified payment.</li>
      </ul>
    </section>
    <section id="errors" className="surface-rule scroll-mt-28 mt-12 pt-8">
      <h2 className={heading}>Error responses</h2>
      <p className={prose}>Errors use <code>{'{ "error": { "code", "message", "request_id" } }'}</code>. Inspect the error code and payment receipt; do not automatically pay again after an ambiguous response.</p>
      <div className="mt-6 overflow-x-auto"><table className="spec-table"><thead><tr><th>HTTP</th><th>Meaning</th></tr></thead><tbody>{[
        ["400", "Invalid or unsupported parameters"], ["402", "Missing or invalid payment, or unsuccessful settlement"], ["404", "Unknown company or resource"], ["405", "Unsupported method; GET required"], ["409", "Payment authorization already used"], ["422", "Insufficient historical observations"], ["429", "Rate or daily admission limit reached"], ["502 / 503", "Upstream failure or unavailable service configuration"], ["504", "Upstream timeout"],
      ].map(([status,meaning]) => <tr key={status}><td>{status}</td><td>{meaning}</td></tr>)}</tbody></table></div>
    </section>
    <section id="openapi" className="surface-rule scroll-mt-28 mt-12 pt-8">
      <h2 className={heading}>Machine-readable reference</h2>
      <p className={prose}>The OpenAPI specification defines every parameter, nullable field, response schema, example, and payment header. Jobs Intelligence extends the existing Exende x402 service alongside Callback.</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link href="/openapi/jobs-intelligence.json" className="button-link" data-variant="accent">Jobs Intelligence OpenAPI</Link><a href="https://api.exende.dev/openapi.json" className="button-link">Combined service OpenAPI</a></div>
    </section>
  </DocsFrame>;
}
