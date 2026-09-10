import { DocsFrame } from "@/components/docs-frame";
import { CodeBlock } from "@/components/code-block";
import { JobsApiReference } from "@/components/jobs-api-reference";
import { JsonLd } from "@/components/json-ld";
import { jobsOperations, jobsQuickstart } from "@/content/jobs";
import { siteConfig } from "@/content/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Jobs Data API",
  description:
    "Use Exende Jobs Data APIs with exact public overview, customer authentication, route scopes, and credit metering.",
  alternates: { canonical: "/docs/jobs" },
  openGraph: {
    title: "Exende Jobs Data API reference",
    description: "Search, jobs, company hiring, history, skills, credits, and API errors.",
    url: "/docs/jobs",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende Jobs Data API reference",
    description: "Search, jobs, company hiring, history, skills, credits, and API errors.",
    images: ["/twitter-image"],
  },
};
const toc = [
  { id: "quickstart", label: "Quickstart" }, { id: "access", label: "Authentication" },
  { id: "search", label: "Search & job routes" }, { id: "companies", label: "Company routes" },
  { id: "hiring-metrics", label: "Skills & metrics" }, { id: "pagination", label: "Pagination & limits" },
  { id: "credits", label: "Credits" }, { id: "errors", label: "Errors" },
  { id: "public-overview", label: "Public overview" }, { id: "public-search", label: "Limited preview" }, { id: "caching", label: "Freshness & caching" },
] as const;
export default function JobsDocsPage() {
 return <DocsFrame currentHref="/docs/jobs" title="Jobs Data API" intro="Search normalized job listings, explore company hiring, and read observed changes with a scoped customer key. Start with a small query, then inspect the response and credit usage." toc={toc}>
   <JsonLd data={{ "@context": "https://schema.org", "@type": "TechArticle", headline: "Exende Jobs Data API reference", description: "Customer routes, authentication, response schemas, pagination and credits.", url: `${siteConfig.url}/docs/jobs`, dateModified: "2026-09-10", author: { "@type": "Organization", name: "Exende" } }} />
   <section id="quickstart">
     <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Quickstart</h2>
     <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-[var(--color-muted)]"><li><Link className="text-link" href="/account?mode=signup&next=/dashboard/api-keys">Create an account</Link> and verify your email. New verified organizations receive 2,500 onboarding credits for 14 days.</li><li>In <Link className="text-link" href="/dashboard/api-keys">API keys</Link>, create a key with <code>jobs:read</code>. Copy it while it is shown and store it in a server environment variable named <code>EXENDE_API_KEY</code>.</li><li>Run this request. Five returned records cost five credits; an empty result costs zero.</li></ol>
     <div id="request" className="mt-6"><CodeBlock code={jobsQuickstart} language="bash" title="Search for up to five jobs" /></div>
     <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">The response is <code>&#123; data: Job[], nextCursor: string | null &#125;</code>. Each job has a canonical ID, company, title, available location and normalized fields, source URL, and observation timestamps. See the complete response below. Your request appears in <Link href="/dashboard/usage" className="text-link">Usage</Link> after it is recorded.</p>
     <p className="mt-4 text-sm leading-7"><Link href="/openapi/jobs.json" className="text-link">Download the Jobs OpenAPI 3.1 contract</Link></p>
   </section>
   <section id="access" className="surface-rule mt-12 pt-8"><h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Authentication & scopes</h2><p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">Base URL: <code>https://data.exende.dev</code>. Send <code>Authorization: Bearer $EXENDE_API_KEY</code>. Keys belong to your organization, are shown once, and can be revoked in the dashboard. Keep them out of browser code, URLs, and logs.</p><table className="spec-table mt-5"><thead><tr><th>Scope</th><th>Access</th></tr></thead><tbody><tr><td><code>jobs:read</code></td><td>Jobs, search, job history, history feed, and skills.</td></tr><tr><td><code>companies:read</code></td><td>Company detail, company jobs, and company hiring.</td></tr><tr><td><code>signals:read</code></td><td>Overview and hiring metrics.</td></tr></tbody></table><p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">Only the documented customer routes are supported. Jobs Data keys and credits are separate from the x402 infrastructure payment model.</p></section>
   <JobsApiReference />
   <section id="pagination" className="surface-rule mt-12 pt-8"><h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Pagination & request limits</h2><p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">Jobs list, search, and company jobs use keyset pagination. The default is 50 records and the maximum is 100. Keep filters unchanged and send the returned <code>nextCursor</code> as <code>cursor</code>. Stop when it is null. Records are ordered by <code>last_seen_at DESC, id DESC</code>; ongoing catalogue changes mean pages are not a frozen snapshot.</p><p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">Job history accepts <code>limit</code> (default 50, max 100) with no cursor. Skills and the history feed return at most 100 records and do not accept pagination parameters. The hiring window is 7–90 days, default 30; grouped companies, locations, and countries are capped at 12.</p><p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">The current backend falls back to 50 for an invalid numeric limit and 30 for invalid numeric days. Other invalid filters and malformed cursors return 400. Unknown query parameters on customer routes are ignored, so use the parameters documented for each operation. The strict public preview instead rejects every parameter other than q.</p></section>
   <section id="credits" className="surface-rule mt-12 pt-8"><h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Credit metering</h2><p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">Credits are not requests. Per-record operations cost one credit per returned record: 5 results = 5 credits, 50 results = 50 credits. Empty lists and failed requests cost zero. Successful fixed-cost aggregate objects still incur their fixed cost when their numeric counts are zero.</p><table className="spec-table mt-5"><thead><tr><th>GET route</th><th>Scope</th><th>Credits</th></tr></thead><tbody>{jobsOperations.map(op => <tr key={op.id}><td><code>{op.path}</code></td><td><code>{op.scope}</code></td><td>{op.credits}</td></tr>)}</tbody></table><p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">The authoritative credit debit must succeed before customer data is returned. Insufficient balance returns 402 with <code>insufficient_credits</code>. This is a Jobs Data credit error, not an x402 payment challenge.</p></section>
   <section id="errors" className="surface-rule mt-12 pt-8"><h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Errors & rate limits</h2><CodeBlock language="json" title="Example insufficient-credit error" code={JSON.stringify({error:{code:"insufficient_credits",message:"This account does not have enough credits for this operation."}},null,2)} /><table className="spec-table mt-5"><thead><tr><th>HTTP</th><th>Code</th><th>Action</th></tr></thead><tbody>{[["400","invalid_request","Check parameter values and cursor. Validation responses can include error.details."],["401","unauthorized","Check the key, expiry, revocation, and organization status."],["402","insufficient_credits","Use a smaller result limit or add a suitable plan."],["403","insufficient_scope","Create a key with the route’s required scope."],["404","not_found","Check the route or record identifier. Empty lists use 200 instead."],["429","rate_limited","Respect Retry-After: 60. Apply backoff and avoid retry bursts."],["503","service_unavailable","Retry with bounded backoff; a required service is unavailable."]].map(([status,code,meaning])=><tr key={code}><td>{status}</td><td><code>{code}</code></td><td>{meaning}</td></tr>)}</tbody></table><p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">Production has a pre-authentication abuse limiter (240/minute per connection IP) and an authenticated limiter (120/minute per key). Cloudflare limits are location-local and eventually consistent. Shared-IP traffic can share a limit. Store the <code>X-Request-ID</code> response header for support. Unexpected upstream failures may return a non-JSON body; handle HTTP status before parsing.</p></section>
   <section id="caching" className="surface-rule mt-12 pt-8"><h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Freshness, metrics & caching</h2><p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">Public overview cache: <code>max-age=60, s-maxage=300, stale-while-revalidate=600</code>. The latest observation timestamp does not mean every source was checked at that time. Authenticated metrics can reuse a server-side five-minute calculation cache; authentication and metering still occur on each request, and client responses use <code>private, no-store</code>.</p><p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">Hiring velocity is recorded created versions divided by days. Acceleration compares recent and preceding creation rates and is null until the earliest immutable history spans the requested window. <code>history_complete</code> is that readiness gate; it does not prove uninterrupted or whole-market observation. Company timelines include zero-event days; the overall hiring timeline includes days with events. Country nulls remain unclassified. See <Link href="/coverage" className="text-link">Coverage & methodology</Link>.</p></section>
 </DocsFrame>;
}
