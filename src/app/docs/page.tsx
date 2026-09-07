import { DocsFrame } from "@/components/docs-frame";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import { ArrowRight, BriefcaseBusiness, FileSearch, History, ShieldCheck, Webhook } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation — Data and infrastructure APIs",
  description:
    "Canonical documentation for Exende Jobs Data, Callback, Retry, Resolve, x402 payments, and machine-readable contracts.",
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "Exende API documentation",
    description: "Jobs Data and infrastructure API documentation with explicit product boundaries.",
    url: "/docs",
  },
  twitter: {
    card: "summary",
    title: "Exende API documentation",
    description: "Jobs Data and infrastructure API documentation with explicit product boundaries.",
  },
};

const toc = [
  { id: "jobs-data", label: "Jobs Data" },
  { id: "infrastructure", label: "Infrastructure APIs" },
  { id: "machine-readable", label: "Machine-readable contracts" },
] as const;

const infrastructure = [
  { icon: Webhook, name: "Callback", href: "/docs/callback", detail: "Temporary event capture", price: "$0.01 USDC" },
  { icon: History, name: "Retry", href: "/docs/retry", detail: "Durable outbound HTTP", price: "$0.02 USDC" },
  { icon: FileSearch, name: "Resolve", href: "/docs/resolve", detail: "Public resource resolution", price: "$0.03 USDC" },
] as const;

export default function DocsOverviewPage() {
  return (
    <DocsFrame
      currentHref="/docs"
      title="Exende documentation"
      intro="Start with Jobs & Hiring Data for public catalogue aggregates. Use the separate infrastructure documentation for Callback, Retry, Resolve, and x402-paid agent access."
      toc={toc}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Exende API documentation",
          description: "Documentation entry point for Exende data and infrastructure APIs.",
          url: `${siteConfig.url}/docs`,
          dateModified: "2026-09-06",
          author: { "@type": "Organization", name: "Exende" },
        }}
      />

      <section id="jobs-data" className="docs-featured-product">
        <div>
          <BriefcaseBusiness className="h-7 w-7 text-[#72a4ff]" />
          <p className="annotation mt-6 text-[#72a4ff]">Primary data product</p>
          <h2>Jobs & Hiring Data</h2>
          <p>
            Use the public aggregate endpoint for current catalogue counts and freshness. Job search,
            company data, customer authentication, and scoped keys are clearly marked as coming soon.
          </p>
          <Link href="/docs/jobs" className="button-link mt-6" data-variant="accent">Public overview docs <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <dl>
          <div><dt>Public endpoint</dt><dd className="font-mono">GET /v1/public/overview</dd></div>
          <div><dt>Authentication</dt><dd>None</dd></div>
          <div><dt>Payload</dt><dd>Aggregate counts only</dd></div>
          <div><dt>Customer APIs</dt><dd>Coming soon</dd></div>
        </dl>
      </section>

      <section id="infrastructure" className="surface-rule mt-12 pt-8">
        <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-[var(--color-accent)]" /><h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Infrastructure APIs</h2></div>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          Independent production contracts for event capture, durable requests, and public-resource resolution.
        </p>
        <div className="docs-infra-list mt-6">
          {infrastructure.map(({ icon: Icon, ...item }) => (
            <Link href={item.href} key={item.name}>
              <Icon /><span><strong>{item.name}</strong><small>{item.detail}</small></span><b>{item.price}</b><ArrowRight />
            </Link>
          ))}
        </div>
      </section>

      <section id="machine-readable" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Machine-readable contracts</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
          The public Jobs Data overview is documented as a narrow aggregate contract. Each infrastructure
          product publishes a separate OpenAPI 3.1 specification and appears in the public API catalog.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/docs/jobs" className="docs-page-link">Jobs overview contract <ArrowRight className="ml-auto h-4 w-4" /></Link>
          <Link href={siteConfig.callbackOpenApi} className="docs-page-link">Callback OpenAPI <ArrowRight className="ml-auto h-4 w-4" /></Link>
          <Link href={siteConfig.retryOpenApi} className="docs-page-link">Retry OpenAPI <ArrowRight className="ml-auto h-4 w-4" /></Link>
          <Link href={siteConfig.resolveOpenApi} className="docs-page-link">Resolve OpenAPI <ArrowRight className="ml-auto h-4 w-4" /></Link>
          <Link href="/api/catalog.json" className="docs-page-link">API catalog <ArrowRight className="ml-auto h-4 w-4" /></Link>
          <Link href="/llms.txt" className="docs-page-link">llms.txt <ArrowRight className="ml-auto h-4 w-4" /></Link>
        </div>
      </section>
    </DocsFrame>
  );
}
