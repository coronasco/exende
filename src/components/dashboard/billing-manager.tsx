"use client";

import type { BillingSummary, PlanChange, PlanChangeResult } from "@/lib/control-plane-types";
import { ArrowRight, CalendarClock, Check, CircleDollarSign, CreditCard, ShieldCheck, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

const PLAN_ORDER: Readonly<Record<string, number>> = { starter: 0, pro: 1, scale: 2 };

export function BillingManager({ billing }: { billing: BillingSummary }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState<PlanChange | null>(null);
  const [, startRefresh] = useTransition();
  const checkoutState = searchParams.get("checkout");
  const checkoutAvailable = billing.checkoutAvailable;
  const sandboxBilling = billing.mode === "test" && checkoutAvailable;
  const billingInDevelopment = !checkoutAvailable;
  const hasSubscription = billing.subscription !== null;

  async function openCheckout(planKey: string) {
    setPending(planKey);
    setError(null);
    try {
      const { url } = await billingRequest<{ url: string }>("/api/control/billing/checkout", { planKey });
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
      const { url } = await billingRequest<{ url: string }>("/api/control/billing/portal", {});
      window.location.assign(url);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Billing management could not be opened.");
      setPending(null);
    }
  }

  async function previewChange(planKey: string) {
    setPending(`preview:${planKey}`);
    setError(null);
    setSuccess(null);
    try {
      const change = await billingRequest<PlanChange>("/api/control/billing/plan-change/preview", { planKey });
      setPreview(change);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The plan change could not be previewed.");
    } finally {
      setPending(null);
    }
  }

  async function confirmChange() {
    if (!preview) return;
    setPending(`confirm:${preview.id}`);
    setError(null);
    setSuccess(null);
    try {
      const result = await billingRequest<PlanChangeResult>("/api/control/billing/plan-change", { previewId: preview.id });
      if (result.paymentUrl) {
        window.location.assign(result.paymentUrl);
        return;
      }
      setPreview(null);
      setSuccess(
        result.status === "scheduled"
          ? `${result.toPlan.name} is scheduled for ${formatDate(result.effectiveAt)}.`
          : result.status === "payment_pending"
            ? `Payment is still required before ${result.toPlan.name} can be activated.`
            : `Your ${result.toPlan.name} plan is now active.`
      );
      startRefresh(() => router.refresh());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The plan change could not be completed.");
    } finally {
      setPending(null);
    }
  }

  async function cancelScheduledChange() {
    setPending("cancel-change");
    setError(null);
    setSuccess(null);
    try {
      await billingRequest<PlanChangeResult>("/api/control/billing/plan-change/cancel", {});
      setSuccess("The scheduled plan change was canceled. Your current plan will continue.");
      startRefresh(() => router.refresh());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The scheduled change could not be canceled.");
    } finally {
      setPending(null);
    }
  }

  function selectPlan(planKey: string) {
    if (hasSubscription) void previewChange(planKey);
    else void openCheckout(planKey);
  }

  return (
    <>
      <header className="dashboard-heading">
        <div><p className="eyebrow">Subscription & entitlement</p><h1>Billing</h1><p>{billingInDevelopment ? "Your complimentary onboarding credits are active. Paid subscriptions and plan upgrades are currently in development." : sandboxBilling ? "Test the complete subscription flow with Stripe sandbox checkout. No real payment will be collected." : "Manage checkout, payment methods, invoices, and your subscription. Exende grants credits only after confirmed payment."}</p></div>
        {billing.customerPortalAvailable ? <button className="dashboard-action dashboard-action--secondary" type="button" onClick={openPortal} disabled={pending !== null}><CreditCard /> {pending === "portal" ? "Opening..." : "Manage billing"}</button> : null}
      </header>

      {checkoutState === "success" ? <p className="billing-notice" data-tone="success"><Check /> Checkout completed. Stripe is synchronizing your subscription and credits.</p> : null}
      {checkoutState === "canceled" ? <p className="billing-notice">Checkout was canceled. Your current entitlement has not changed.</p> : null}
      {sandboxBilling ? <p className="billing-notice" data-tone="success"><ShieldCheck /> Sandbox billing is enabled for this workspace. Use Stripe test cards only; no real charge will be made.</p> : null}
      {billingInDevelopment ? <p className="billing-notice">Billing is in development. No payment method is required, and paid plan selection is temporarily unavailable.</p> : null}
      {error ? <p className="billing-notice" data-tone="error">{error}</p> : null}
      {success ? <p className="billing-notice" data-tone="success"><Check /> {success}</p> : null}
      {billing.pendingPlanChange ? <PendingPlanChangeNotice
        change={billing.pendingPlanChange}
        pending={pending}
        onCancel={cancelScheduledChange}
      /> : null}

      <section className="dashboard-panel current-plan">
        <div className="current-plan__mark"><CircleDollarSign /></div>
        <div><p className="annotation">CURRENT PLAN</p><h2>{billing.currentPlan.name}</h2><p>{billing.currentPlan.description}</p></div>
        <dl><div><dt>Monthly price</dt><dd>{price(billing.currentPlan.priceEurMonthly)}</dd></div><div><dt>Included credits</dt><dd>{formatNumber(billing.currentPlan.monthlyCredits)}</dd></div><div><dt>Status</dt><dd data-status={billing.subscription?.status ?? "active"}>{billing.subscription?.status ?? "active"}</dd></div><div><dt>{billing.subscription?.cancelAtPeriodEnd ? "Access until" : "Period ends"}</dt><dd>{formatDate(billing.subscription?.currentPeriodEnd ?? null)}</dd></div></dl>
      </section>

      <div className="billing-policy"><ShieldCheck /><div><strong>{billingInDevelopment ? "Complimentary preview access." : "Credits follow paid periods."}</strong><p>{billingInDevelopment ? "Your initial onboarding grant is available at no cost for its displayed access period. Paid plans will become selectable only when production billing is ready." : "Monthly grants expire at the end of their billing period and do not roll over. Failed payments do not create new grants; existing unexpired credits remain available during the past-due state."}</p></div></div>

      {preview ? <section className="billing-change" aria-live="polite">
        <div className="billing-change__heading">
          <div>
            <p className="annotation">{preview.direction === "upgrade" ? "CONFIRM UPGRADE" : "SCHEDULE DOWNGRADE"}</p>
            <h2>{preview.fromPlan.name} <ArrowRight /> {preview.toPlan.name}</h2>
          </div>
          <button type="button" aria-label="Close plan change preview" onClick={() => setPreview(null)} disabled={pending !== null}><X /></button>
        </div>
        <div className="billing-change__details">
          <div><span>{preview.direction === "upgrade" ? "Estimated charge now" : "Charge today"}</span><strong>{formatMoney(preview.amountDue, preview.currency)}</strong></div>
          <div><span>{preview.direction === "upgrade" ? "New plan starts" : "Current plan remains until"}</span><strong>{preview.direction === "upgrade" ? "After payment" : formatDate(preview.effectiveAt)}</strong></div>
          <p>{preview.direction === "upgrade"
            ? "Stripe will charge the saved payment method for the prorated difference. Taxes are included where applicable, and the upgrade is applied only after successful payment."
            : `No payment is taken now. ${preview.toPlan.name} starts at the next billing period and can be canceled before then.`}</p>
        </div>
        <div className="billing-change__actions">
          <button type="button" onClick={() => setPreview(null)} disabled={pending !== null}>Keep current plan</button>
          <button className="dashboard-action" type="button" onClick={confirmChange} disabled={pending !== null}>
            {pending === `confirm:${preview.id}` ? "Processing..." : preview.direction === "upgrade" ? `Pay and upgrade to ${preview.toPlan.name}` : `Schedule ${preview.toPlan.name}`}
            <ArrowRight />
          </button>
        </div>
      </section> : null}

      <section className="billing-plan-grid" aria-label={billingInDevelopment ? "Plans in development" : "Available plans"}>
        {billing.plans.map((plan) => {
          const current = plan.key === billing.currentPlan.key;
          const direction = planDirection(billing.currentPlan.key, plan.key);
          const waitingForPreview = pending === `preview:${plan.key}`;
          const waitingForCheckout = pending === plan.key;
          const pendingTarget = billing.pendingPlanChange?.toPlan.key === plan.key;
          const blockedByPendingPayment = billing.pendingPlanChange?.status === "payment_pending" || billing.pendingPlanChange?.status === "processing";
          const unavailable = hasSubscription && !billing.planChangesAvailable;
          const disabled = current || billingInDevelopment || pending !== null || unavailable || blockedByPendingPayment || pendingTarget;
          const action = current
            ? "Current plan"
            : billingInDevelopment
              ? "Coming soon"
              : waitingForPreview
                ? "Calculating..."
                : waitingForCheckout
                  ? "Opening checkout..."
                : pendingTarget
                  ? billing.pendingPlanChange?.status === "scheduled" ? "Scheduled" : "Payment pending"
                  : hasSubscription
                    ? direction === "upgrade" ? `Upgrade to ${plan.name}` : `Schedule ${plan.name}`
                    : `Select ${plan.name}`;
          return <article key={plan.key} className="billing-plan" data-featured={plan.key === "pro"} data-current={current}>
            <div><span className="annotation">{billingInDevelopment ? "IN DEVELOPMENT" : plan.key === "pro" ? "PRODUCTION" : plan.key.toUpperCase()}</span>{current ? <span className="billing-plan__current"><Check /> Current</span> : null}</div>
            <h2>{plan.name}</h2><strong>{price(plan.priceEurMonthly)}<small> / month</small></strong><p>{plan.description}</p>
            <ul><li><Check /> Taxes included in listed price</li><li><Check /> {formatNumber(plan.monthlyCredits)} monthly credits</li><li><Check /> Scoped customer API keys</li><li><Check /> Usage and request metadata</li><li><Check /> {billingInDevelopment ? "Paid access coming later" : "Secure billing portal"}</li></ul>
            <button type="button" disabled={disabled} onClick={() => selectPlan(plan.key)}>{action} {!current && !disabled ? <ArrowRight /> : null}</button>
          </article>;
        })}
      </section>
    </>
  );
}

function PendingPlanChangeNotice({
  change,
  pending,
  onCancel
}: {
  change: PlanChange;
  pending: string | null;
  onCancel: () => void;
}) {
  if (change.status === "scheduled") {
    return <div className="billing-pending-change" data-tone="scheduled">
      <CalendarClock />
      <div><strong>{change.toPlan.name} is scheduled</strong><p>Your current plan remains active until {formatDate(change.effectiveAt)}.</p></div>
      <button type="button" onClick={onCancel} disabled={pending !== null}>{pending === "cancel-change" ? "Canceling..." : "Cancel change"}</button>
    </div>;
  }
  return <div className="billing-pending-change" data-tone="payment">
    <CreditCard />
    <div><strong>Payment required for {change.toPlan.name}</strong><p>The upgrade will be applied after Stripe confirms the outstanding payment.</p></div>
  </div>;
}

async function billingRequest<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const payload = await response.json().catch(() => null) as { data?: T; error?: { message?: string } } | null;
  if (!response.ok || payload?.data === undefined) throw new Error(payload?.error?.message ?? "Billing is temporarily unavailable.");
  return payload.data;
}

function price(value: number | null): string { return value === null ? "Custom" : value === 0 ? "€0" : `€${value}`; }
function formatNumber(value: number): string { return new Intl.NumberFormat("en-US").format(Number.isFinite(value) ? Math.max(0, value) : 0); }
function formatDate(value: string | null): string { return value ? new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value)) : "Not scheduled"; }
function formatMoney(value: number, currency: string): string {
  return new Intl.NumberFormat("en", { style: "currency", currency: currency.toUpperCase() }).format(Math.max(0, value) / 100);
}
function planDirection(fromPlan: string, toPlan: string): "upgrade" | "downgrade" | null {
  const from = PLAN_ORDER[fromPlan];
  const to = PLAN_ORDER[toPlan];
  if (from === undefined || to === undefined || from === to) return null;
  return to > from ? "upgrade" : "downgrade";
}
