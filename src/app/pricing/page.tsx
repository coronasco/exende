import { JsonLd } from "@/components/json-ld";
import { infrastructurePrices } from "@/content/pricing";
import { siteConfig } from "@/content/site";
import { getPublicPlans } from "@/lib/control-plane";
import { ArrowRight, Bot, Check, CircleDollarSign, Database, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing and access",
  description:
    "Exende Data API subscriptions, included credits, and exact x402 pricing for infrastructure APIs.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Exende pricing and access",
    description: "Customer Data API plans with included credits and fixed x402 infrastructure pricing.",
    url: "/pricing",
  },
  twitter: {
    card: "summary",
    title: "Exende pricing and access",
    description: "Customer Data API plans with included credits and fixed x402 infrastructure pricing.",
  },
};

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const plans = await getPublicPlans().catch(() => null);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Exende pricing and access",
          description: "Current and planned access models for Exende data and infrastructure APIs.",
          url: `${siteConfig.url}/pricing`,
        }}
      />

      <section className="pricing-data-hero">
        <div className="pricing-data-hero__motion" aria-hidden="true">
          <span className="pricing-motion__ring" />
          <span className="pricing-motion__core" />
          <span className="pricing-motion__rail pricing-motion__rail--one"><i /></span>
          <span className="pricing-motion__rail pricing-motion__rail--two"><i /></span>
          <span className="pricing-motion__rail pricing-motion__rail--three"><i /></span>
        </div>
        <div className="page-shell pricing-data-hero__inner">
          <p className="eyebrow">Pricing & access</p>
          <h1>Pay for useful access, not a story we cannot support.</h1>
          <p>
            Start with a free monthly allowance, then scale through Stripe-backed subscriptions.
            Credits are enforced by the Data Plane on every customer API request.
          </p>
          <div className="pricing-principles">
            <span><Check /> Clear entitlements</span>
            <span><Check /> Scoped API keys</span>
            <span><Check /> Stripe-hosted checkout</span>
          </div>
        </div>
      </section>

      <section className="pricing-data-section">
        <div className="page-shell">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">Data API access</p>
              <h2>One credit system for a growing API catalogue.</h2>
            </div>
            <p>
              Monthly grants are auditable and expire with their plan period. Usage is metered by
              operation, with zero-result per-record searches costing zero credits.
            </p>
          </div>

          {plans ? <div className="data-plan-grid data-plan-grid--subscriptions">
            {plans.map((plan, index) => (
              <article key={plan.key} className="data-plan" data-live={plan.key === "pro"}>
                <div className="data-plan__top">
                  {index === 0 ? <Database /> : plan.key === "enterprise" ? <ShieldCheck /> : <CircleDollarSign />}
                  <span>{plan.key === "enterprise" ? "Custom" : "Monthly"}</span>
                </div>
                <h3>{plan.name}</h3>
                <strong>{plan.priceEurMonthly === null ? "Custom" : `€${plan.priceEurMonthly}${plan.priceEurMonthly ? "/mo" : ""}`}</strong>
                <p>{plan.description}</p>
                <ul><li><Check /> {plan.monthlyCredits.toLocaleString("en-US")} monthly credits</li><li><Check /> Scoped API credentials</li><li><Check /> Metered usage dashboard</li></ul>
                <Link href={{ pathname: "/account", query: { next: `/dashboard/billing?plan=${plan.key}` } }}>{plan.key === "free" ? "Create free account" : plan.key === "enterprise" ? "Start a conversation" : `Select ${plan.name}`} <ArrowRight /></Link>
              </article>
            ))}
          </div> : <div className="pricing-plans-unavailable"><ShieldCheck /><h3>Plan data is temporarily unavailable.</h3><p>We do not display cached or invented billing values. Please retry shortly.</p></div>}
        </div>
      </section>

      <section className="metered-section">
        <div className="page-shell metered-layout">
          <div>
            <p className="eyebrow">Agent infrastructure</p>
            <h2>Exact metered prices for autonomous calls.</h2>
            <p>
              Callback, Retry, and Resolve are production APIs paid per resource through x402 v2
              exact USDC settlement on Base Mainnet. No subscription is required for these paths.
            </p>
            <Link href="/docs/x402" className="inline-arrow">Read x402 payment docs <ArrowRight /></Link>
          </div>
          <div className="metered-prices">
            {infrastructurePrices.map((item) => (
              <Link href={item.href} key={item.name}>
                <Bot />
                <span><strong>{item.name}</strong><small>{item.unit}</small></span>
                <b>{item.price}</b>
                <ArrowRight />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-boundary">
        <div className="page-shell pricing-boundary__inner">
          <ShieldCheck />
          <div><p className="eyebrow">Architecture boundary</p><h2>Keys belong to organizations, never to frontend code.</h2></div>
          <p>
            Customer keys are created through a signed server-to-server management boundary,
            shown once, stored only as hashes, and scoped to documented product APIs. Internal
            operator credentials are never reused for customers.
          </p>
        </div>
      </section>
    </>
  );
}
