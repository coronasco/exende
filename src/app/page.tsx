import { OrbitField } from "@/components/exende-visuals";
import { ArrowRight, History, Radio, ShieldCheck, Webhook } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Agent-native Callback and Retry APIs",
  description:
    "Temporary webhook endpoints and durable outbound HTTP retries for AI agents, paid per resource with x402 on Base.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Exende — Callback and Retry APIs for AI agents",
    description: "HTTP-native infrastructure for asynchronous events and durable outbound requests.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Exende — Callback and Retry APIs for AI agents",
    description: "HTTP-native infrastructure for asynchronous events and durable outbound requests.",
  },
};

export default function HomePage() {
  return (
    <>
      <section className="home-hero technical-grid relative isolate flex min-h-[calc(100svh-73px)] overflow-hidden">
        <OrbitField className="z-0 opacity-35" />
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(2,8,18,0.14)_0%,rgba(2,6,15,0.28)_48%,rgba(2,6,15,0.9)_100%)]" />

        <div className="page-shell relative z-10 flex min-h-full flex-1 flex-col items-center justify-center py-12 text-center sm:py-14">
          <h1 className="hero-title max-w-[1180px] text-[clamp(4rem,8.4vw,8.1rem)] leading-[0.82]">
            <span className="block">Temporary webhooks.</span>
            <span className="hero-title__accent block">Durable retries.</span>
          </h1>
          <p className="mt-7 max-w-[650px] text-[clamp(1rem,1.35vw,1.22rem)] leading-7 text-[#adb7c2] sm:leading-8">
            Exende provides temporary endpoints for incoming webhook events and durable Retry jobs
            for outbound HTTPS requests.
          </p>

          <div className="mt-10 flex w-full max-w-xl flex-col justify-center gap-4 sm:flex-row sm:items-center">
            <Link href="/products" className="button-link" data-variant="accent">
              Explore the APIs <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/docs" className="text-link justify-center px-4 py-3 sm:px-6">
              Read the docs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 flex w-full max-w-[1050px] items-center gap-8 text-[0.62rem] text-[var(--color-accent)] sm:mt-16">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-border-strong)]" />
            <span className="font-mono uppercase tracking-[0.32em]">Callback&nbsp;&nbsp;/&nbsp;&nbsp; Retry&nbsp;&nbsp;/&nbsp;&nbsp; x402</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-border-strong)]" />
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[rgba(2,7,15,0.92)] py-20 sm:py-24">
        <div className="page-shell">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <header>
              <p className="section-kicker">Two production APIs</p>
              <h2 className="section-title mt-5 text-[clamp(3rem,5vw,5.4rem)] leading-[0.88] text-white">
                Small primitives.
                <br />Durable workflows.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-[var(--color-muted)]">
                Each product has one clear job, a stable HTTP contract, usage-based pricing,
                and no mandatory dashboard.
              </p>
            </header>

            <div className="grid gap-5 md:grid-cols-2">
              <article className="product-card">
                <div className="product-card__icon"><Webhook className="h-6 w-6" /></div>
                <p className="annotation text-[var(--color-accent)]">Callback API</p>
                <h3 className="mt-4 text-2xl text-white">Receive asynchronous events</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  Create a temporary public webhook, give it to an external service, then read or
                  long-poll the captured events with a private token.
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-3 border-y border-[var(--color-border)] py-5 text-sm">
                  <div><dt className="annotation text-[var(--color-muted)]">Endpoint</dt><dd className="mt-2 text-white">Temporary</dd></div>
                  <div><dt className="annotation text-[var(--color-muted)]">Access</dt><dd className="mt-2 text-white">Read or wait</dd></div>
                </dl>
                <Link href="/products/callback" className="text-link mt-6 text-sm">Explore Callback <ArrowRight className="h-4 w-4" /></Link>
              </article>

              <article className="product-card" data-tone="violet">
                <div className="product-card__icon"><History className="h-6 w-6" /></div>
                <p className="annotation text-[var(--color-violet)]">Retry API v1</p>
                <h3 className="mt-4 text-2xl text-white">Make outbound HTTP durable</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  Run an HTTPS request as a durable job with automatic retry scheduling, recovery,
                  status polling, attempt history, and an optional terminal callback.
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-3 border-y border-[var(--color-border)] py-5 text-sm">
                  <div><dt className="annotation text-[var(--color-muted)]">Execution</dt><dd className="mt-2 text-white">Durable job</dd></div>
                  <div><dt className="annotation text-[var(--color-muted)]">Visibility</dt><dd className="mt-2 text-white">Status + history</dd></div>
                </dl>
                <Link href="/products/retry" className="text-link mt-6 text-sm">Explore Retry <ArrowRight className="h-4 w-4" /></Link>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="page-shell grid gap-4 md:grid-cols-3">
          {[
            [Radio, "HTTP-native", "Create, operate, and inspect resources through regular HTTP calls."],
            [ShieldCheck, "Purpose-scoped access", "x402-paid resources return private capability tokens for follow-up reads."],
            [History, "No control plane required", "Create resources, check status, and inspect history without depending on a dashboard."],
          ].map(([Icon, title, description]) => {
            const ItemIcon = Icon as typeof Radio;
            return (
              <article key={title as string} className="feature-card">
                <ItemIcon className="h-5 w-5 text-[var(--color-accent)]" />
                <h2 className="mt-5 text-lg text-white">{title as string}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{description as string}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
