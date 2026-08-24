import { CodeBlock } from "@/components/code-block";
import { OrbitField, RetryDiagram } from "@/components/exende-visuals";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import { ArrowRight, BellRing, Clock3, History, RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Retry API v1 — Durable HTTP retries for AI agents",
  description:
    "Execute outbound HTTPS requests as durable jobs with automatic retries, status polling, attempt history, and optional terminal callbacks.",
  alternates: { canonical: "/products/retry" },
  openGraph: {
    title: "Exende Retry API v1",
    description: "Durable outbound HTTP jobs with recovery and up to 8 attempts for $0.02 USDC.",
    url: "/products/retry",
  },
  twitter: {
    card: "summary",
    title: "Exende Retry API v1",
    description: "Durable outbound HTTP jobs with recovery and up to 8 attempts for $0.02 USDC.",
  },
};

const createRetry = `curl -i -X POST \\
  ${siteConfig.retryApiBase}/v1/retries \\
  -H "Content-Type: application/json" \\
  --data '{
    "request": {
      "method": "GET",
      "url": "https://httpbin.org/status/204"
    },
    "retry": {
      "max_attempts": 8,
      "strategy": "exponential",
      "initial_delay_seconds": 5,
      "max_delay_seconds": 300
    }
  }'`;

const steps = [
  {
    number: "01",
    title: "Create",
    description: "Submit the outbound request and retry policy in one x402-paid POST.",
    icon: RefreshCw,
  },
  {
    number: "02",
    title: "Recover",
    description: "The durable worker schedules retryable failures and recovers interrupted work.",
    icon: Clock3,
  },
  {
    number: "03",
    title: "Observe",
    description: "Poll status and attempt history or receive an optional signed terminal callback.",
    icon: History,
  },
] as const;

export default function RetryProductPage() {
  return (
    <div className="technical-grid relative min-h-[calc(100svh-72px)] overflow-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Exende Retry API v1",
          url: `${siteConfig.url}/products/retry`,
          description: "Durable outbound HTTPS request jobs for AI agents and automated workflows.",
          provider: { "@type": "Organization", name: "Exende", url: siteConfig.url },
          offers: {
            "@type": "Offer",
            price: "0.02",
            priceCurrency: "USDC",
            description: "One paid Retry job with up to 8 outbound attempts and a 24-hour lifetime.",
          },
        }}
      />
      <OrbitField variant="products" className="opacity-35" />
      <section className="page-shell relative z-10 grid min-h-[680px] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[0.76fr_1.24fr] lg:py-24">
        <div>
          <p className="section-kicker text-[var(--color-violet)]">Exende Retry API v1</p>
          <h1 className="section-title mt-7 text-[clamp(3.7rem,5vw,5.8rem)] leading-[0.86] text-white">
            Make any HTTP
            <br />tool call durable.
          </h1>
          <p className="mt-7 max-w-[570px] text-base leading-8 text-[var(--color-muted)]">
            Execute an outbound HTTPS request as a durable job. Retry handles transient failures,
            schedules backoff, recovers interrupted work, and exposes status plus attempt history.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link href="/docs/retry" className="button-link" data-variant="solid">
              Read the docs <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing" className="button-link">
              View pricing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="retry-console">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
            <p className="annotation text-[var(--color-violet)]">retry.execute</p>
            <span className="product-status">Available</span>
          </div>
          <div className="p-5 sm:p-7">
            <RetryDiagram />
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="fact-tile"><dt>State</dt><dd>Durable</dd></div>
              <div className="fact-tile"><dt>Attempts</dt><dd>Up to 8</dd></div>
              <div className="fact-tile"><dt>Lifetime</dt><dd>Up to 24h</dd></div>
              <div className="fact-tile"><dt>History</dt><dd>Per attempt</dd></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[rgba(2,7,15,0.9)] py-5 sm:py-7">
        <div className="page-shell grid lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.number} className="workflow-step">
                <p className="font-mono text-[0.82rem] text-[var(--color-violet)]">{step.number}</p>
                <div className="mt-4 flex gap-5">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md border border-[var(--color-border-strong)] text-[var(--color-violet)]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-lg uppercase tracking-[0.14em] text-white">{step.title}</h2>
                    <p className="mt-1 text-[0.85rem] leading-6 text-[var(--color-muted)]">{step.description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-shell relative z-10 grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="section-kicker">Real production request</p>
          <h2 className="section-title mt-5 text-[clamp(2.8rem,4vw,4.7rem)] leading-[0.9] text-white">
            One payment covers the entire job.
          </h2>
          <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">
            The initial unauthenticated request returns HTTP 402 with x402 v2 payment metadata.
            After settlement, the response includes a private read token for status and attempts.
          </p>
          <div className="mt-7 flex items-start gap-3 rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-7 text-[var(--color-muted)]">
            <BellRing className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
            A terminal callback is optional. When configured, Retry signs delivery with HMAC and
            retries callback failures independently.
          </div>
        </div>
        <CodeBlock code={createRetry} language="bash" title="Create a Retry job — initial request returns HTTP 402" />
      </section>
    </div>
  );
}
