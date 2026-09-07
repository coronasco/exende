import { CodeBlock } from "@/components/code-block";
import { DocsFrame } from "@/components/docs-frame";
import { JsonLd } from "@/components/json-ld";
import { resolveEndpointRows, resolveErrorRows, resolveFacts } from "@/content/docs";
import { resolveExamples } from "@/content/examples";
import { siteConfig } from "@/content/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resolve API v1 documentation",
  description: "Resolve public web, document, data, text, and image resources into bounded machine-readable output with x402 on Base.",
  alternates: { canonical: "/docs/resolve" },
  openGraph: {
    title: "Exende Resolve API v1 documentation",
    description: "Endpoints, examples, formats, limits, security, errors, and x402 payment behavior for Resolve.",
    url: "/docs/resolve",
  },
  twitter: {
    card: "summary",
    title: "Exende Resolve API v1 documentation",
    description: "Canonical developer documentation for Exende Resolve.",
  },
};

const toc = [
  { id: "quickstart", label: "Quickstart" },
  { id: "create-resolve", label: "Resolve a resource" },
  { id: "read-result", label: "Read a result" },
  { id: "formats", label: "Formats and output" },
  { id: "x402", label: "x402 payment" },
  { id: "security", label: "Security and limits" },
  { id: "errors", label: "Errors" },
] as const;

function EndpointTable() {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="spec-table min-w-[720px]">
        <thead><tr><th>Method</th><th>Path</th><th>Purpose</th><th>Auth / payment</th></tr></thead>
        <tbody>{resolveEndpointRows.map(([method, path, purpose, auth]) => <tr key={`${method}-${path}`}><td><span className="method-chip text-sky-300">{method}</span></td><td className="font-mono text-xs text-white">{path}</td><td>{purpose}</td><td>{auth}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

export default function ResolveDocsPage() {
  return (
    <DocsFrame
      currentHref="/docs/resolve"
      title="Resolve API v1"
      intro="Turn one public HTTP or HTTPS resource into bounded, machine-readable web content, document text, structured data, plain text, or image metadata."
      toc={toc}
    >
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "Exende Resolve API v1 documentation",
        description: "Canonical endpoint, payment, format, security, limit, and error documentation for Exende Resolve.",
        url: `${siteConfig.url}/docs/resolve`,
        dateModified: "2026-08-26",
        author: { "@type": "Organization", name: "Exende" },
      }} />

      <section id="quickstart">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Quickstart</h2>
          <span className="product-status">Available</span>
        </div>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
          Use Resolve when an agent has a public URL but cannot reliably consume it directly, such
          as a JavaScript-rendered page, PDF, CSV/JSON download, text resource, or image that needs metadata.
        </p>
        <EndpointTable />
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {resolveFacts.slice(0, 6).map((fact) => <div key={fact.label} className="fact-tile"><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
        </div>
      </section>

      <section id="create-resolve" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Resolve a resource</h2>
        <p className="mt-3 font-mono text-sm text-white">POST {siteConfig.resolveApiBase}/v1/resolve</p>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          The required <code>url</code> must point to a public HTTP or HTTPS resource. <code>output</code>
          accepts <code>auto</code>, <code>markdown</code>, <code>text</code>, or <code>json</code>.
          <code>render</code> accepts <code>auto</code>, <code>always</code>, or <code>never</code>.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CodeBlock code={resolveExamples.createCurl} language="bash" title="curl — initial request returns HTTP 402" />
          <CodeBlock code={resolveExamples.createJavaScript} language="javascript" title="JavaScript — read the live x402 challenge" />
        </div>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
          After a valid x402 payment, completed synchronous work returns HTTP 201. Recovery of an
          already-paid job that is still processing can return HTTP 202. Always build payment from
          the live 402 challenge instead of hardcoding the recipient or token contract.
        </p>
        <div className="mt-6"><CodeBlock code={resolveExamples.completedResponse} language="json" title="Completed PDF result" /></div>
      </section>

      <section id="read-result" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Read a result</h2>
        <p className="mt-3 font-mono text-sm text-white">GET /v1/resolves/{`{id}`}</p>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
          Creation returns a job-scoped <code>read_token</code>. Pass it as a Bearer token or in
          <code>X-Resolve-Read-Token</code>. Read responses never repeat the token and use
          <code>Cache-Control: private, no-store</code>. Follow-up reads need no second Exende payment.
        </p>
        <div className="mt-6"><CodeBlock code={resolveExamples.readCurl} language="bash" title="Read current state or result" /></div>
      </section>

      <section id="formats" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Formats and output</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="spec-table min-w-[680px]">
            <thead><tr><th>Detected resource</th><th>Processing path</th><th>Normalized output</th></tr></thead>
            <tbody>
              <tr><td>Static HTML</td><td>Bounded HTTP fetch and extraction</td><td>Text, Markdown, metadata, and links</td></tr>
              <tr><td>Client-rendered HTML</td><td>Browser Run only when needed or requested</td><td>Rendered text, Markdown, metadata, and links</td></tr>
              <tr><td>PDF</td><td>Deterministic text-layer parsing</td><td>Document text and page metadata</td></tr>
              <tr><td>JSON, CSV, XML, text</td><td>Format-specific bounded parsing</td><td>Structured data or normalized text</td></tr>
              <tr><td>PNG, JPEG, GIF, WebP</td><td>Header and metadata inspection</td><td>Image format, dimensions, and MIME metadata</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">Resolve v1 does not provide OCR, archive extraction, screenshots, DOCX/XLSX extraction, or LLM-based parsing.</p>
      </section>

      <section id="x402" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">x402 payment</h2>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
          One Resolve job costs $0.03 USDC using x402 v2, the exact scheme, and Base Mainnet
          (<code>eip155:8453</code>). The server returns HTTP 402 before resource probing. Reuse the
          same payment identifier only when recovering the same logical paid request; a changed
          request returns <code>PAYMENT_IDENTIFIER_CONFLICT</code>.
        </p>
        <Link href="/docs/x402" className="button-link mt-6" data-variant="accent">Shared x402 documentation</Link>
      </section>

      <section id="security" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Security and limits</h2>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
          Resolve permits standard-port public HTTP and HTTPS targets only. It rejects embedded
          credentials, direct IP URLs, local/private/metadata hosts, internal Exende hosts, and DNS
          results that resolve to non-public addresses. Redirects are followed manually and every
          destination is revalidated. Browser document requests pass through the same public-target controls.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="spec-table min-w-[640px]"><tbody>{resolveFacts.slice(4).map((fact) => <tr key={fact.label}><th>{fact.label}</th><td>{fact.value}</td></tr>)}</tbody></table>
        </div>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
          Additional v1 limits include 2 MiB HTML/text, 5 MiB CSV, 10 MiB PDF/image, a 100:1
          decompression ratio, 250 content-bearing browser requests, four document navigations,
          200 extracted links, and zero internal retries. Stored outcomes are encrypted and retained for 72 hours.
        </p>
      </section>

      <section id="errors" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Errors</h2>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">Every error uses a stable JSON envelope with <code>error.code</code>, <code>error.message</code>, and <code>error.request_id</code>. <code>LIMIT_EXCEEDED</code> can be 413 for bounded input/output limits or 502 for an invalid/excessive upstream redirect chain.</p>
        <div className="mt-5 overflow-x-auto"><table className="spec-table min-w-[540px]"><thead><tr><th>HTTP</th><th>Code</th></tr></thead><tbody>{resolveErrorRows.map(([status, code]) => <tr key={`${status}-${code}`}><td>{status}</td><td className="font-mono text-xs text-white">{code}</td></tr>)}</tbody></table></div>
      </section>
    </DocsFrame>
  );
}
