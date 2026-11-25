import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { JobsIntelligenceEndpointList } from "@/components/jobs-intelligence/endpoint-list";
import { ProductActions, ProductHero, ProductSection, productStyles as s } from "@/components/product/product-ui";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Jobs Intelligence — Seven x402 APIs",
  description: "Structured hiring intelligence for AI agents. Seven APIs, $0.02–$0.25 USDC per request on Base. No API keys or subscriptions required for x402 access.",
  alternates: { canonical: "/products/jobs-intelligence" },
  openGraph: { title: "Exende Jobs Intelligence", description: "Seven hiring intelligence APIs. Pay per request with x402.", url: "/products/jobs-intelligence", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "Exende Jobs Intelligence", description: "Structured hiring intelligence for AI agents, paid per request.", images: ["/twitter-image"] },
};

export default function JobsIntelligenceProductPage() {
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebAPI", name: "Exende Jobs Intelligence", description: "Seven deterministic hiring intelligence APIs, paid per request through x402.", url: `${siteConfig.url}/products/jobs-intelligence`, documentation: `${siteConfig.url}/docs/jobs-intelligence`, provider: { "@type": "Organization", name: "Exende", url: siteConfig.url } }} />
    <ProductHero path="/products/jobs-intelligence" eyebrow="Exende Jobs Intelligence · x402" title={<>Hiring intelligence.<br /><span>One request at a time.</span></>} description="Structured hiring intelligence for AI agents. Search jobs, understand companies, and inspect observed changes. Pay per request with x402.">
      <ProductActions primary="Explore the seven APIs" href="#endpoints" secondary="Read the quickstart" secondaryHref="/docs/jobs-intelligence#quickstart" />
      <p className={s.note}>$0.02–$0.25 USDC per request · Base · No API keys · No subscriptions</p>
    </ProductHero>
    <ProductSection id="endpoints" eyebrow="Seven live APIs" title="Choose the data you need." description="Each request returns bounded, structured JSON from Exende’s existing monitored Jobs catalogue. Prices below are per successful request, paid in USDC.">
      <div className="orbital-directory"><JobsIntelligenceEndpointList /></div>
      <p className={s.note}>All seven routes are part of the existing api.exende.dev service alongside Callback. <Link href="/openapi/jobs-intelligence.json">Download the OpenAPI specification.</Link></p>
    </ProductSection>
    <ProductSection id="access" eyebrow="Pay per request" title="A wallet. A request. Structured data." description="Use a compatible x402 v2 client and USDC on Base. Individual Jobs Intelligence requests require no Exende account, API key, or subscription.">
      <div className={s.protocol}>
        <ol className="space-y-4 text-[var(--color-muted)]">
          <li><strong className="text-white">1. Request the resource.</strong> Send a GET with valid filters. HTTP 402 describes the exact payment requirements.</li>
          <li><strong className="text-white">2. Authorize the quoted payment.</strong> Your client signs a fresh EIP-3009 authorization and repeats the same request.</li>
          <li><strong className="text-white">3. Receive the result.</strong> Successful settlement returns JSON data and a payment receipt. Each authorization can be used once.</li>
        </ol>
        <ProductActions primary="Payment quickstart" href="/docs/jobs-intelligence#payments" secondary="API reference" secondaryHref="/docs/jobs-intelligence" />
      </div>
    </ProductSection>
    <ProductSection id="coverage" eyebrow="Data with context" title="Observed hiring. Clear boundaries." description="Results describe Exende’s monitored catalogue. Every response includes coverage, observation timestamps, methodology, and limitations.">
      <div className={s.protocol}>
        <p className={s.note}>Current calculations use up to 10,000 recent active jobs, scoped to a company first when supplied. Sampled results identify the sample and leave unsupported full totals null. Historical comparisons need sufficient observations and a complete cohort of at most 5,000 jobs.</p>
        <p className={s.note}>Search returns at most 10 jobs; signals at most five companies. The supported window is seven days. No unrestricted pagination or full database export. All calculations are deterministic; these endpoints perform no AI inference.</p>
        <ProductActions primary="Coverage & limits" href="/docs/jobs-intelligence#coverage" secondary="Subscription Jobs Data API" secondaryHref="/products/jobs" />
      </div>
    </ProductSection>
  </>;
}
