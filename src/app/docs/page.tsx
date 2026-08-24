import { DocsFrame } from "@/components/docs-frame";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import { ArrowRight, History, Webhook } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation — Callback and Retry APIs",
  description:
    "Choose Exende Callback or Retry documentation, with real endpoints, x402 payment details, limits, errors, and OpenAPI specifications.",
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "Exende API documentation",
    description: "Canonical Callback and Retry API documentation.",
    url: "/docs",
  },
  twitter: {
    card: "summary",
    title: "Exende API documentation",
    description: "Canonical Callback and Retry API documentation.",
  },
};

const toc = [
  { id: "callback", label: "Callback API" },
  { id: "retry", label: "Retry API" },
  { id: "machine-readable", label: "Machine-readable contracts" },
] as const;

export default function DocsOverviewPage() {
  return (
    <DocsFrame
      currentHref="/docs"
      title="Exende documentation"
      intro="Choose the API that matches your workflow. Callback receives asynchronous events; Retry executes outbound HTTPS requests durably."
      toc={toc}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Exende API documentation",
          description: "Canonical documentation entry point for Exende Callback and Retry APIs.",
          url: `${siteConfig.url}/docs`,
          dateModified: "2026-08-24",
          author: { "@type": "Organization", name: "Exende" },
        }}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section id="callback" className="docs-product-card">
          <Webhook className="h-6 w-6 text-[var(--color-accent)]" />
          <p className="annotation mt-6 text-[var(--color-accent)]">Callback API</p>
          <h2 className="mt-3 text-2xl text-white">Receive external events</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            Create a temporary callback endpoint, give its public URL to an external service, then
            read or long-poll events with a private read token.
          </p>
          <dl className="mt-6 space-y-3 border-y border-[var(--color-border)] py-5 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-[var(--color-muted)]">Create endpoint</dt><dd className="font-mono text-xs text-white">POST /v1/callbacks</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[var(--color-muted)]">Price</dt><dd className="text-white">$0.01 USDC</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[var(--color-muted)]">Lifetime</dt><dd className="text-white">10 minutes</dd></div>
          </dl>
          <Link href="/docs/callback" className="button-link mt-6" data-variant="accent">
            Callback documentation <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section id="retry" className="docs-product-card" data-tone="violet">
          <History className="h-6 w-6 text-[var(--color-violet)]" />
          <p className="annotation mt-6 text-[var(--color-violet)]">Retry API v1</p>
          <h2 className="mt-3 text-2xl text-white">Make outbound HTTP durable</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            Create a durable outbound HTTPS job with retry scheduling, recovery, status polling,
            attempt history, and an optional terminal callback.
          </p>
          <dl className="mt-6 space-y-3 border-y border-[var(--color-border)] py-5 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-[var(--color-muted)]">Create endpoint</dt><dd className="font-mono text-xs text-white">POST /v1/retries</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[var(--color-muted)]">Paid price</dt><dd className="text-white">$0.02 USDC</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[var(--color-muted)]">Paid limit</dt><dd className="text-white">8 attempts · 24h</dd></div>
          </dl>
          <Link href="/docs/retry" className="button-link mt-6" data-variant="accent">
            Retry documentation <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>

      <section id="machine-readable" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Machine-readable contracts</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
          Both products publish separate OpenAPI 3.1 contracts. Exende also exposes a compact API
          catalog and llms.txt for systems that choose to consume those discovery surfaces.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href={siteConfig.callbackOpenApi} className="docs-page-link">Callback OpenAPI <ArrowRight className="ml-auto h-4 w-4" /></Link>
          <Link href={siteConfig.retryOpenApi} className="docs-page-link">Retry OpenAPI <ArrowRight className="ml-auto h-4 w-4" /></Link>
          <Link href="/api/catalog.json" className="docs-page-link">API catalog <ArrowRight className="ml-auto h-4 w-4" /></Link>
          <Link href="/llms.txt" className="docs-page-link">llms.txt <ArrowRight className="ml-auto h-4 w-4" /></Link>
        </div>
      </section>
    </DocsFrame>
  );
}
