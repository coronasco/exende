import { PricingGraph } from "@/components/exende-visuals";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import { ArrowRight, Bot, Check, CircleDollarSign, ShieldCheck, WalletCards } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — Callback $0.01 and Retry $0.02",
  description:
    "Pay-as-you-go x402 pricing: $0.01 USDC per Callback and $0.02 USDC per paid Retry job on Base Mainnet.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Exende pay-per-request pricing",
    description: "Callback $0.01 USDC. Retry $0.02 USDC. No subscription or prepaid balance.",
    url: "/pricing",
  },
  twitter: {
    card: "summary",
    title: "Exende pay-per-request pricing",
    description: "Callback $0.01 USDC. Retry $0.02 USDC. No subscription or prepaid balance.",
  },
};

const plans = [
  {
    name: "Callback API",
    price: "$0.01",
    unit: "per callback created",
    tone: "cyan",
    docs: "/docs/callback",
    includes: [
      "One temporary public callback endpoint",
      "10-minute lifetime",
      "Up to 10 received events",
      "Up to 256 KB per event",
      "Token-protected reads, waits, and deletion",
    ],
    note: "Webhook delivery and follow-up operations have no additional Exende payment.",
  },
  {
    name: "Retry API",
    price: "$0.02",
    unit: "per x402-paid Retry job",
    tone: "violet",
    docs: "/docs/retry",
    includes: [
      "One durable outbound HTTPS request job",
      "Up to 8 outbound attempts",
      "Up to 24-hour job lifetime",
      "Automatic retry scheduling and recovery",
      "Status, attempt history, and optional terminal callback",
    ],
    note: "Internal outbound attempts are included. There is no per-attempt surcharge in v1.",
  },
] as const;

export default function PricingPage() {
  return (
    <div className="technical-grid relative min-h-[calc(100svh-72px)] overflow-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Exende API pricing",
          itemListElement: plans.map((plan, index) => ({
            "@type": "Offer",
            position: index + 1,
            name: plan.name,
            price: plan.price.replace("$", ""),
            priceCurrency: "USDC",
            url: `${siteConfig.url}${plan.docs}`,
          })),
        }}
      />
      <div className="pricing-visual absolute inset-y-0 right-[-40%] z-0 w-[145%] opacity-50 sm:right-[-20%] sm:w-[110%] sm:opacity-60 lg:right-[-6%] lg:w-[72%] lg:opacity-80">
        <PricingGraph />
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#02060f] via-[rgba(2,6,15,0.88)] to-[rgba(2,6,15,0.32)]" />

      <div className="page-shell relative z-10 py-14 sm:py-20">
        <header className="max-w-3xl">
          <p className="section-kicker">Pay-as-you-go pricing</p>
          <h1 className="section-title mt-5 text-[clamp(3.6rem,5.2vw,6rem)] leading-[0.84] text-white">
            Pay for work,
            <br />not seats.
          </h1>
          <p className="mt-6 max-w-[640px] text-[1.05rem] leading-8 text-[var(--color-muted)]">
            Fixed per-resource prices settled with x402 v2 in USDC on Base Mainnet. No subscription,
            prepaid balance, or mandatory dashboard.
          </p>
        </header>

        <div className="mt-10 grid max-w-[1180px] gap-5 lg:grid-cols-2">
          {plans.map((plan) => (
            <article key={plan.name} className="pricing-card" data-tone={plan.tone}>
              <p className="annotation text-[var(--color-accent)]">{plan.name}</p>
              <div className="mt-5 flex items-end gap-3">
                <span className="font-condensed text-[5rem] font-semibold leading-none text-white">{plan.price}</span>
                <span className="pb-2 text-sm text-[var(--color-muted)]">USDC</span>
              </div>
              <p className="mt-2 text-sm text-white">{plan.unit}</p>
              <ul className="mt-7 space-y-3 border-y border-[var(--color-border)] py-6 text-sm leading-6 text-[var(--color-muted)]">
                {plan.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 min-h-14 text-sm leading-7 text-[var(--color-muted)]">{plan.note}</p>
              <Link href={plan.docs} className="button-link mt-6" data-variant="accent">
                Read {plan.name.replace(" API", "")} docs <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="feature-strip mt-8 max-w-[1180px]">
          <span><ShieldCheck className="h-6 w-6 text-[var(--color-accent)]" /> No subscription</span>
          <span><Bot className="h-6 w-6 text-[var(--color-violet)]" /> x402 path needs no API key</span>
          <span><WalletCards className="h-6 w-6 text-[var(--color-accent)]" /> Base · eip155:8453</span>
          <span><CircleDollarSign className="h-6 w-6 text-[var(--color-violet)]" /> USDC settlement</span>
        </div>

        <div className="mt-8 max-w-[1180px] rounded border border-[var(--color-border)] bg-[rgba(3,9,18,0.82)] p-5 text-sm leading-7 text-[var(--color-muted)]">
          <strong className="text-white">Retry authentication note:</strong> the x402 path creates a
          job without an Exende account or traditional API key and returns a private read token.
          Exende also supports a separate account-scoped API-key path with up to 20 attempts; usage
          for that path is not the $0.02 x402 job price shown above.
        </div>
      </div>
    </div>
  );
}
