import { CodeBlock } from "@/components/code-block";
import { CallbackDiagram } from "@/components/exende-visuals";
import { JsonLd } from "@/components/json-ld";
import { codeExamples } from "@/content/examples";
import { siteConfig } from "@/content/site";
import { ArrowRight, Eye, Plus, Webhook } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Callback API — Temporary webhooks for AI agents",
  description:
    "Create a temporary callback endpoint, receive external webhook events, and read or wait for them through HTTP for $0.01 USDC.",
  alternates: { canonical: "/products/callback" },
  openGraph: {
    title: "Exende Callback API",
    description: "Temporary public webhook endpoints with token-protected reads and long polling.",
    url: "/products/callback",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende Callback API",
    description: "Temporary public webhook endpoints with token-protected reads and long polling.",
    images: ["/twitter-image"],
  },
};

const steps = [
  {
    number: "01",
    title: "Create",
    description: "Create a temporary callback endpoint using a single x402-paid request.",
    endpoint: "POST https://api.exende.dev/v1/callbacks",
    icon: Plus,
    tone: "cyan",
  },
  {
    number: "02",
    title: "Receive",
    description: "Your upstream system sends an event to the unique public endpoint.",
    endpoint: "POST https://cb.exende.dev/hooks/{id}",
    icon: Webhook,
    tone: "violet",
  },
  {
    number: "03",
    title: "Read or wait",
    description: "Retrieve the event immediately or wait for it for up to 30 seconds.",
    endpoint: "GET https://api.exende.dev/v1/callbacks/{id}/wait",
    icon: Eye,
    tone: "cyan",
  },
] as const;

export default function CallbackProductPage() {
  return (
    <div className="technical-grid min-h-[calc(100svh-72px)]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Exende Callback API",
          url: `${siteConfig.url}/products/callback`,
          description: "Temporary webhook endpoints for AI agents and automated workflows.",
          provider: { "@type": "Organization", name: "Exende", url: siteConfig.url },
          offers: {
            "@type": "Offer",
            price: "0.01",
            priceCurrency: "USDC",
            description: "One temporary callback creation on Base Mainnet.",
          },
        }}
      />
      <section className="page-shell relative z-10 grid min-h-[650px] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[0.76fr_1.24fr] lg:py-24">
        <div>
          <p className="section-kicker">Exende Callback</p>
          <h1 className="section-title mt-7 text-[clamp(3.7rem,5vw,5.6rem)] leading-[0.86] text-white">
            Webhooks for
            <br />
            agents that
            <br />
            can&apos;t wait around.
          </h1>
          <p className="mt-7 max-w-[540px] text-[1rem] leading-7 text-[var(--color-muted)]">
            Create a temporary endpoint, receive an external event, then retrieve it or wait for it through one clean API.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link href="/docs/callback" className="button-link" data-variant="solid">
              Read the docs <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing" className="button-link">
              View pricing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="product-hero-art lg:w-full lg:max-w-[940px] lg:justify-self-end">
          <CallbackDiagram />
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[rgba(2,7,15,0.88)] py-5 sm:py-7">
        <div className="page-shell grid lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.number} className="workflow-step">
                <p className="font-mono text-[0.82rem] text-[var(--color-accent)]">{step.number}</p>
                <div className="mt-4 flex gap-5">
                  <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-md border border-[var(--color-border-strong)] ${step.tone === "violet" ? "text-[var(--color-violet)]" : "text-[var(--color-accent)]"}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-lg uppercase tracking-[0.14em] text-white">{step.title}</h2>
                    <p className="mt-1 text-[0.85rem] leading-6 text-[var(--color-muted)]">{step.description}</p>
                  </div>
                </div>
                <div className={step.tone === "violet" ? "endpoint-strip !text-[var(--color-violet)]" : "endpoint-strip"}>{step.endpoint}</div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="page-shell flex flex-wrap justify-center gap-x-8 gap-y-2 py-10 text-center text-[0.83rem] text-[var(--color-muted)] sm:py-12">
        <span>Temporary by default</span><span className="text-[var(--color-accent)]">•</span>
        <span>Token-protected reads</span><span className="text-[var(--color-accent)]">•</span>
        <span>Webhook host: {siteConfig.callbackBase}</span>
      </div>

      <section className="border-t border-[var(--color-border)] bg-[rgba(2,7,15,0.92)] py-20 sm:py-28">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="section-kicker">Minimal HTTP workflow</p>
            <h2 className="section-title mt-5 text-[clamp(2.8rem,4vw,4.7rem)] leading-[0.9] text-white">
              Receive a result without deploying a receiver.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">
              The x402-paid create request returns a public callback URL and a private read token.
              Webhook delivery, reads, waits, and deletion do not require another Exende payment.
            </p>
            <dl className="mt-7 grid grid-cols-2 gap-4 text-sm">
              <div className="fact-tile"><dt>Price</dt><dd>$0.01 USDC</dd></div>
              <div className="fact-tile"><dt>Lifetime</dt><dd>10 minutes</dd></div>
              <div className="fact-tile"><dt>Event limit</dt><dd>10</dd></div>
              <div className="fact-tile"><dt>Payload limit</dt><dd>256 KB</dd></div>
            </dl>
          </div>
          <CodeBlock code={codeExamples.createCallback} language="bash" title="Create a callback — initial request returns HTTP 402" />
        </div>
      </section>
    </div>
  );
}
