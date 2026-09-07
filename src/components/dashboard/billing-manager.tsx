"use client";

import type { BillingSummary } from "@/lib/control-plane-types";
import { ArrowRight, Check, CircleDollarSign, CreditCard, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function BillingManager({ billing }: { billing: BillingSummary }) {
  const searchParams = useSearchParams();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const checkoutState = searchParams.get("checkout");
  const billingInDevelopment = !billing.configured;

  async function openCheckout(planKey: string) {
    setPending(planKey);
    setError(null);
    try {
      const { url } = await billingRequest("/api/control/billing/checkout", { planKey });
      window.location.assign(url);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Checkout could not be opened.");
      setPending(null);
    }
  }

  async function openPortal() {
    setPending("portal");
    setError(null);
    try {
      const { url } = await billingRequest("/api/control/billing/portal", {});
      window.location.assign(url);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Billing management could not be opened.");
      setPending(null);
    }
  }

  return (
    <>
      <header className="dashboard-heading">
        <div><p className="eyebrow">Subscription & entitlement</p><h1>Billing</h1><p>{billingInDevelopment ? "Your complimentary onboarding credits are active. Paid subscriptions and plan upgrades are currently in development." : "Manage checkout, payment methods, invoices, and subscription changes. Exende grants credits only after confirmed payment."}</p></div>
        {billing.customerPortalAvailable ? <button className="dashboard-action dashboard-action--secondary" type="button" onClick={openPortal} disabled={pending !== null}><CreditCard /> {pending === "portal" ? "Opening..." : "Manage billing"}</button> : null}
      </header>

      {checkoutState === "success" ? <p className="billing-notice" data-tone="success"><Check /> Checkout completed. Stripe is synchronizing your subscription and credits.</p> : null}
      {checkoutState === "canceled" ? <p className="billing-notice">Checkout was canceled. Your current entitlement has not changed.</p> : null}
      {billingInDevelopment ? <p className="billing-notice">Billing is in development. No payment method is required, and paid plan selection is temporarily unavailable.</p> : null}
      {error ? <p className="billing-notice" data-tone="error">{error}</p> : null}

      <section className="dashboard-panel current-plan">
        <div className="current-plan__mark"><CircleDollarSign /></div>
        <div><p className="annotation">CURRENT PLAN</p><h2>{billing.currentPlan.name}</h2><p>{billing.currentPlan.description}</p></div>
        <dl><div><dt>Monthly price</dt><dd>{price(billing.currentPlan.priceEurMonthly)}</dd></div><div><dt>Included credits</dt><dd>{formatNumber(billing.currentPlan.monthlyCredits)}</dd></div><div><dt>Status</dt><dd data-status={billing.subscription?.status ?? "active"}>{billing.subscription?.status ?? "active"}</dd></div><div><dt>{billing.subscription?.cancelAtPeriodEnd ? "Access until" : "Period ends"}</dt><dd>{formatDate(billing.subscription?.currentPeriodEnd ?? null)}</dd></div></dl>
      </section>

      <div className="billing-policy"><ShieldCheck /><div><strong>{billingInDevelopment ? "Complimentary preview access." : "Credits follow paid periods."}</strong><p>{billingInDevelopment ? "Your initial onboarding grant is available at no cost for its displayed access period. Paid plans will become selectable only when production billing is ready." : "Monthly grants expire at the end of their billing period and do not roll over. Failed payments do not create new grants; existing unexpired credits remain available during the past-due state."}</p></div></div>

      <section className="billing-plan-grid" aria-label={billingInDevelopment ? "Plans in development" : "Available plans"}>
        {billing.plans.map((plan) => {
          const current = plan.key === billing.currentPlan.key;
          return <article key={plan.key} className="billing-plan" data-featured={plan.key === "pro"} data-current={current}>
            <div><span className="annotation">{billingInDevelopment ? "IN DEVELOPMENT" : plan.key === "pro" ? "PRODUCTION" : plan.key.toUpperCase()}</span>{current ? <span className="billing-plan__current"><Check /> Current</span> : null}</div>
            <h2>{plan.name}</h2><strong>{price(plan.priceEurMonthly)}<small> / month</small></strong><p>{plan.description}</p>
            <ul><li><Check /> {formatNumber(plan.monthlyCredits)} monthly credits</li><li><Check /> Scoped customer API keys</li><li><Check /> Usage and request metadata</li><li><Check /> {billingInDevelopment ? "Paid access coming later" : "Secure billing portal"}</li></ul>
            <button type="button" disabled={current || billingInDevelopment || pending !== null} onClick={() => billing.customerPortalAvailable ? openPortal() : openCheckout(plan.key)}>{current ? "Current plan" : billingInDevelopment ? "Coming soon" : pending === plan.key || pending === "portal" ? "Opening billing..." : billing.customerPortalAvailable ? `Change to ${plan.name}` : `Select ${plan.name}`} {!current ? <ArrowRight /> : null}</button>
          </article>;
        })}
      </section>
    </>
  );
}

async function billingRequest(path: string, body: Record<string, unknown>): Promise<{ url: string }> {
  const response = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const payload = await response.json().catch(() => null) as { data?: { url?: unknown }; error?: { message?: string } } | null;
  if (!response.ok || typeof payload?.data?.url !== "string") throw new Error(payload?.error?.message ?? "Billing is temporarily unavailable.");
  return { url: payload.data.url };
}

function price(value: number | null): string { return value === null ? "Custom" : value === 0 ? "€0" : `€${value}`; }
function formatNumber(value: number): string { return new Intl.NumberFormat("en-US").format(Number.isFinite(value) ? Math.max(0, value) : 0); }
function formatDate(value: string | null): string { return value ? new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value)) : "Not scheduled"; }
