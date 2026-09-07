import { DocsFrame } from "@/components/docs-frame";
import { JsonLd } from "@/components/json-ld";
import { LiveOverview, LiveOverviewFallback } from "@/components/live-overview";
import { siteConfig } from "@/content/site";
import { AlertCircle, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Jobs Data API",
  description:
    "Use Exende's public aggregate Jobs Data overview with its exact response fields, caching contract, and access boundary.",
  alternates: { canonical: "/docs/jobs" },
  openGraph: {
    title: "Exende Jobs Data public overview API",
    description: "Current catalogue counts and data freshness from one no-key endpoint.",
    url: "/docs/jobs",
  },
  twitter: {
    card: "summary",
    title: "Exende Jobs Data public overview API",
    description: "Current catalogue counts and data freshness from one no-key endpoint.",
  },
};

const toc = [
  { id: "public-overview", label: "Public overview" },
  { id: "request", label: "Request" },
  { id: "response", label: "Response schema" },
  { id: "caching", label: "Caching & freshness" },
  { id: "access", label: "Customer access" },
] as const;

export default function JobsDocsPage() {
  return (
    <DocsFrame
      currentHref="/docs/jobs"
      title="Jobs Data public overview"
      intro="The current public Jobs Data contract is intentionally narrow: one aggregate endpoint for catalogue counts and data freshness. It does not expose job listings or protected operational data."
      toc={toc}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Exende Jobs Data public overview API",
          description: "Exact public aggregate contract for Exende Jobs & Hiring Data.",
          url: `${siteConfig.url}/docs/jobs`,
          dateModified: "2026-09-06",
          author: { "@type": "Organization", name: "Exende" },
        }}
      />

      <section id="public-overview">
        <div className="docs-callout">
          <CheckCircle2 className="h-5 w-5 text-emerald-300" />
          <div><strong>Available now</strong><p>No Exende account or API key is required for this aggregate endpoint.</p></div>
        </div>
        <Suspense fallback={<LiveOverviewFallback />}>
          <LiveOverview />
        </Suspense>
      </section>

      <section id="request" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Request</h2>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          Fetch the overview on page load or through a server loader. Do not poll it aggressively.
        </p>
        <div className="code-surface">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <span className="annotation text-[var(--color-accent)]">GET</span>
            <span className="font-mono text-[0.65rem] text-[var(--color-muted)]">No authorization</span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-7 text-[#a9c9ff]"><code>{`curl "${siteConfig.dataApiOverview}" \\\n  -H "Accept: application/json"`}</code></pre>
        </div>
      </section>

      <section id="response" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Response schema</h2>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          Counts are live values and must be validated as finite non-negative numbers before display.
        </p>
        <table className="spec-table mt-5">
          <thead><tr><th>Field</th><th>Type</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td className="font-mono text-xs">active_jobs</td><td>number</td><td>Current active canonical jobs in the catalogue.</td></tr>
            <tr><td className="font-mono text-xs">active_companies</td><td>number</td><td>Distinct companies with at least one current active job.</td></tr>
            <tr><td className="font-mono text-xs">active_sources</td><td>number</td><td>Enabled reviewed public job sources.</td></tr>
            <tr><td className="font-mono text-xs">last_updated_at</td><td>string | null</td><td>Most recent canonical job observation in ISO 8601 UTC.</td></tr>
          </tbody>
        </table>
      </section>

      <section id="caching" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Caching and freshness</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="docs-callout"><Clock3 className="h-5 w-5" /><div><strong>Cache contract</strong><p><code>max-age=60</code>, <code>s-maxage=300</code>, <code>stale-while-revalidate=600</code>.</p></div></div>
          <div className="docs-callout"><AlertCircle className="h-5 w-5" /><div><strong>Fallback required</strong><p>Do not block a whole page or display invented zeroes if the metric request fails.</p></div></div>
        </div>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
          Display <code>last_updated_at</code> as data freshness, not as a guarantee of real-time market coverage. Use a neutral label such as “Update pending” when it is absent or invalid.
        </p>
      </section>

      <section id="access" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Customer access</h2>
        <div className="docs-callout mt-5">
          <ShieldCheck className="h-5 w-5" />
          <div><strong>Scoped access is available</strong><p>Verified accounts can create customer API keys in the dashboard. Keys are shown once, stored only as hashes, and must be kept in server-side environments.</p></div>
        </div>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
          Customer keys can access documented search, job, company, history, skills, and hiring-metrics routes at <code>{siteConfig.dataApiBase}</code>. Internal source health, raw payloads, operational routes, customer records, and the DataAPI operator dashboard remain private.
        </p>
        <div className="code-surface">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <span className="annotation text-[var(--color-accent)]">FIRST REQUEST</span>
            <span className="font-mono text-[0.65rem] text-[var(--color-muted)]">Scoped key</span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-7 text-[#a9c9ff]"><code>{`curl --get "${siteConfig.dataApiBase}/v1/jobs/search" \\\n+  --data-urlencode "q=software engineer" \\\n+  --data-urlencode "limit=5" \\\n+  -H "Authorization: Bearer $EXENDE_API_KEY"`}</code></pre>
        </div>
      </section>
    </DocsFrame>
  );
}
