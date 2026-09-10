import { ProductHero, ProductActions, ProductSection, productStyles as s } from "@/components/product/product-ui";
import { apiEndpointRows, resolveEndpointRows, retryEndpointRows } from "@/content/docs";
import { jobsOperations } from "@/content/jobs";
import { siteConfig } from "@/content/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "API surface — Data and infrastructure",
  description: "Jobs Data customer APIs, public catalogue proof, and separate x402 infrastructure contracts.",
  alternates: { canonical: "/api" },
  openGraph: {
    title: "Exende API surface",
    description: "A concise endpoint index with availability, authentication, and payment boundaries.",
    url: "/api",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende API surface",
    description: "A concise endpoint index with availability, authentication, and payment boundaries.",
    images: ["/twitter-image"],
  },
};
export default function ApiPage() {
  return <>
    <ProductHero eyebrow="Exende API index" title={<>One catalogue.<br /><span>Explicit contracts.</span></>} description="Jobs Data is the primary data API. Explore its customer operations, public proof, and machine-readable contract, alongside independent tools for agent workflows.">
      <ProductActions primary="Jobs API quickstart" href="/docs/jobs#quickstart" secondary="Jobs OpenAPI 3.1" secondaryHref="/openapi/jobs.json" />
    </ProductHero>
    <ProductSection id="jobs-data" eyebrow="Jobs & Hiring Data" title="Customer Jobs Data API." description="Base URL: https://data.exende.dev. Authenticate with a scoped organization API key. Successful operations consume subscription or onboarding credits.">
      <div className={s.tableWrap} data-reveal><table className={s.table}><thead><tr><th>Operation</th><th>GET route</th><th>Scope</th><th>Credits</th></tr></thead><tbody>{jobsOperations.map(op => <tr key={op.id}><td><Link href={`/docs/jobs#${op.id}`}>{op.title}</Link></td><td><code>{op.path}</code></td><td><code>{op.scope}</code></td><td>{op.credits}</td></tr>)}</tbody></table></div>
      <p className={s.note}>Per-record operations returning an empty list cost 0 credits. <Link href="/docs/jobs#pagination">Read the exact pagination and response contracts.</Link></p>
    </ProductSection>
    <ProductSection id="public-proof" eyebrow="No-key access" title="Public catalogue proof." description="The overview publishes aggregate counts and the latest canonical job observation. The explorer adds strictly limited public samples and matching aggregates. Full customer records, keys, billing, and operator information are private.">
      <div className={s.protocol} data-reveal><code>GET {siteConfig.dataApiOverview}</code><p className={s.note}><code>GET https://data.exende.dev/v1/public/search?q=engineer</code><br />q only; maximum 5 samples from a fixed pool of 12. No pagination or full descriptions. <Link href="/docs/jobs#public-search">Preview contract</Link>.</p><p className={s.note}>No authorization. Cache-Control: max-age=60, s-maxage=300, stale-while-revalidate=600.</p><ProductActions primary="Coverage & methodology" href="/coverage" secondary="Public overview contract" secondaryHref="/docs/jobs#public-overview" /></div>
    </ProductSection>
    {[
      { id: "callback", title: "Callback API", base: siteConfig.callbackApiBase, rows: apiEndpointRows },
      { id: "retry", title: "Retry API", base: siteConfig.retryApiBase, rows: retryEndpointRows },
      { id: "resolve", title: "Resolve API", base: siteConfig.resolveApiBase, rows: resolveEndpointRows },
    ].map(product => <ProductSection key={product.id} id={product.id} eyebrow="Agent infrastructure" title={product.title} description={`Base URL: ${product.base}. Uses its own authentication and x402 payment contract, separate from Jobs Data credits.`}>
      <div className={s.tableWrap} data-reveal><table className={s.table}><thead><tr><th>Method</th><th>Route</th><th>Purpose</th><th>Access</th></tr></thead><tbody>{product.rows.map(([method,path,purpose,auth]) => <tr key={`${method}:${path}`}><td><code>{method}</code></td><td><code>{path}</code></td><td>{purpose}</td><td>{auth}</td></tr>)}</tbody></table></div><ProductActions primary={`${product.title} docs`} href={`/docs/${product.id}`} secondary="OpenAPI 3.1" secondaryHref={`/openapi/${product.id}.json`} />
    </ProductSection>)}
  </>;
}
