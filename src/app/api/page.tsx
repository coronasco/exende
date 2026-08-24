import { DocsFrame } from "@/components/docs-frame";
import { JsonLd } from "@/components/json-ld";
import { apiEndpointRows, retryEndpointRows } from "@/content/docs";
import { siteConfig } from "@/content/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "API surface — Callback and Retry",
  description: "Complete production endpoint index for Exende Callback API and Retry API v1.",
  alternates: { canonical: "/api" },
  openGraph: {
    title: "Exende production API surface",
    description: "A concise endpoint index with authentication and payment requirements.",
    url: "/api",
  },
  twitter: {
    card: "summary",
    title: "Exende production API surface",
    description: "A concise endpoint index with authentication and payment requirements.",
  },
};

const toc = [
  { id: "production-surface", label: "Production surface" },
  { id: "callback", label: "Callback endpoints" },
  { id: "retry", label: "Retry endpoints" },
] as const;

const methodColors: Record<string, string> = {
  POST: "text-emerald-300",
  PUT: "text-amber-300",
  PATCH: "text-fuchsia-300",
  GET: "text-sky-300",
  DELETE: "text-rose-300",
};

function EndpointTable({ rows }: { rows: readonly (readonly string[])[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="spec-table min-w-[760px]">
        <thead><tr><th>Method</th><th>Path</th><th>Purpose</th><th>Auth / payment</th></tr></thead>
        <tbody>
          {rows.map(([method, path, purpose, requirement]) => (
            <tr key={`${method}-${path}`}>
              <td><span className={`method-chip ${methodColors[method] ?? "text-white"}`}>{method}</span></td>
              <td className="font-mono text-xs text-white">{path}</td>
              <td>{purpose}</td>
              <td>{requirement}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ApiPage() {
  return (
    <DocsFrame
      currentHref="/api"
      title="Production API surface"
      intro="Callback and Retry are separate products with separate base URLs, contracts, prices, access models, and OpenAPI specifications."
      toc={toc}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Exende production API surface",
          url: `${siteConfig.url}/api`,
          dateModified: "2026-08-24",
          author: { "@type": "Organization", name: "Exende" },
        }}
      />
      <section id="production-surface">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Production surface</h2>
        <table className="spec-table mt-5">
          <tbody>
            <tr><th>Callback API</th><td className="font-mono">{siteConfig.callbackApiBase}</td></tr>
            <tr><th>Callback receiver</th><td className="font-mono">{siteConfig.callbackBase}</td></tr>
            <tr><th>Retry API</th><td className="font-mono">{siteConfig.retryApiBase}</td></tr>
            <tr><th>Callback OpenAPI</th><td><Link href={siteConfig.callbackOpenApi} className="text-link">{siteConfig.callbackOpenApi}</Link></td></tr>
            <tr><th>Retry OpenAPI</th><td><Link href={siteConfig.retryOpenApi} className="text-link">{siteConfig.retryOpenApi}</Link></td></tr>
          </tbody>
        </table>
      </section>

      <section id="callback" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Callback API endpoints</h2>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          Only callback creation requires x402 payment. Public webhook delivery and token-protected
          reads, waits, and deletion do not trigger another Exende payment.
        </p>
        <EndpointTable rows={apiEndpointRows} />
        <Link href="/docs/callback" className="button-link mt-7" data-variant="accent">Callback documentation</Link>
      </section>

      <section id="retry" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Retry API v1 endpoints</h2>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          Creation accepts either an account API key or x402. Paid follow-up reads use a private
          job-scoped read token. Cancellation and aggregate usage are API-key-only.
        </p>
        <EndpointTable rows={retryEndpointRows} />
        <Link href="/docs/retry" className="button-link mt-7" data-variant="accent">Retry documentation</Link>
      </section>
    </DocsFrame>
  );
}
