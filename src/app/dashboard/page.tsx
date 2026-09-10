import { DashboardError } from "@/components/dashboard/dashboard-error";
import { getDashboardOverview } from "@/lib/control-plane";
import type { DailyUsage, RecentUsage } from "@/lib/control-plane-types";
import { ArrowRight, Check, CircleDollarSign, Database, KeyRound, Radio, Terminal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Overview" };

export default async function DashboardPage() {
  const overview = await getDashboardOverview().catch(() => null);
  if (!overview) return <DashboardError />;
  const plan = overview.billing.currentPlan;
  const usage = overview.usage;
  const onboarding = [
    { label: "Create a scoped API key", done: usage.activeApiKeys > 0, href: "/dashboard/api-keys" },
    { label: "Make your first Data API request", done: usage.totals.requests > 0, href: "/docs/jobs#quickstart" },
    { label: "Inspect metered usage", done: usage.totals.requests > 0, href: "/dashboard/usage" },
  ];

  return (
    <>
      <header className="dashboard-heading">
        <div><p className="eyebrow">Overview / last 30 days</p><h1>Welcome back, {firstName(overview.user.name)}.</h1><p>Manage your API keys, credits, and observed request usage.</p></div>
        <Link href="/dashboard/api-keys" className="dashboard-action">Create API key <ArrowRight /></Link>
      </header>

      <section className="dashboard-stats" aria-label="Account summary">
        <MetricCard icon={CircleDollarSign} label="Credits remaining" value={formatNumber(overview.credits.balance)} detail={`${formatNumber(overview.credits.lifetimeConsumed)} consumed lifetime`} tone="cyan" />
        <MetricCard icon={Radio} label="API requests" value={formatNumber(usage.totals.requests)} detail="Recorded in the last 30 days" tone="blue" />
        <MetricCard icon={KeyRound} label="Active API keys" value={formatNumber(usage.activeApiKeys)} detail="Revocable at any time" tone="violet" />
        <MetricCard icon={Database} label="Records returned" value={formatNumber(usage.totals.recordsReturned)} detail={`${formatNumber(usage.totals.creditsConsumed)} credits used in period`} tone="cyan" />
      </section>

      <section className="dashboard-main-grid">
        <article className="dashboard-panel dashboard-usage-panel">
          <div className="dashboard-panel__heading"><div><span className="annotation">CREDIT METER</span><h2>Usage over time</h2></div><Link href="/dashboard/usage">Full report <ArrowRight /></Link></div>
          <UsageBars daily={usage.daily.slice(-14)} />
          <div className="dashboard-usage-panel__footer"><span><i data-tone="cyan" /> Credits consumed</span><strong>{formatNumber(usage.totals.creditsConsumed)} <small>/ 30 days</small></strong></div>
        </article>

        <article className="dashboard-panel dashboard-plan-panel">
          <div className="dashboard-panel__heading"><div><span className="annotation">CURRENT ENTITLEMENT</span><h2>{plan.name}</h2></div><span className="dashboard-plan-status"><i /> {overview.organization.subscriptionStatus}</span></div>
          <strong>{plan.priceEurMonthly === null ? "Custom" : `€${plan.priceEurMonthly}`}<small>{plan.priceEurMonthly ? " / month" : ""}</small></strong>
          <p>{plan.description}</p>
          <dl><div><dt>Included credits</dt><dd>{formatNumber(plan.monthlyCredits)}</dd></div><div><dt>Current period ends</dt><dd>{formatDate(overview.organization.currentPeriodEnd)}</dd></div></dl>
          <Link href="/dashboard/billing">Manage plan <ArrowRight /></Link>
        </article>
      </section>

      <section className="dashboard-lower-grid">
        <article className="dashboard-panel dashboard-activity">
          <div className="dashboard-panel__heading"><div><span className="annotation">RECENT REQUESTS</span><h2>Recent activity</h2></div></div>
          {usage.recent.length ? <div className="dashboard-activity__list">{usage.recent.slice(0, 6).map((item) => <ActivityRow key={item.request_id} item={item} />)}</div> : <div className="dashboard-empty"><Terminal /><strong>No API activity yet</strong><p>Create a key and make a request. Real usage will appear here.</p></div>}
        </article>
        <article className="dashboard-panel dashboard-onboarding">
          <span className="annotation">FIRST REQUEST</span><h2>From account to data.</h2><p>Create a key, follow the quickstart, and see your request usage here.</p>
          <ol>{onboarding.map((step, index) => <li key={step.label} data-done={step.done}><span>{step.done ? <Check /> : index + 1}</span><Link href={step.href}>{step.label}<ArrowRight /></Link></li>)}</ol>
        </article>
      </section>
    </>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: typeof Database; label: string; value: string; detail: string; tone: string }) {
  return <article className="dashboard-stat" data-tone={tone}><div><span><Icon /></span><small>{label}</small></div><strong>{value}</strong><p>{detail}</p><i /></article>;
}

function UsageBars({ daily }: { daily: DailyUsage[] }) {
  if (!daily.length) return <div className="dashboard-chart dashboard-chart--empty"><span>No metered usage in this period.</span></div>;
  const maximum = Math.max(...daily.map((item) => finite(item.credits_consumed)));
  return <div className="dashboard-chart" role="img" aria-label="Credits consumed per day">{daily.map((item) => {
    const credits = finite(item.credits_consumed);
    const height = maximum > 0 ? Math.max(6, (credits / maximum) * 100) : 0;
    return <span key={item.day} title={`${item.day}: ${credits} credits`} style={{ "--bar-height": `${height}%` } as React.CSSProperties}><i /><small>{item.day.slice(5)}</small></span>;
  })}</div>;
}

function ActivityRow({ item }: { item: RecentUsage }) {
  return <div><span className="dashboard-activity__icon"><Terminal /></span><div><strong>{readableOperation(item.operation)}</strong><small>{item.endpoint}</small></div><span className="dashboard-activity__status" data-ok={item.status_code < 400}>{item.status_code}</span><div className="dashboard-activity__meta"><strong>{formatNumber(finite(item.credits_consumed))} cr</strong><small>{formatRelative(item.created_at)}</small></div></div>;
}

function readableOperation(value: string): string {
  return value.split(".").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function finite(value: number): number { return Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0; }
function formatNumber(value: number): string { return new Intl.NumberFormat("en-US").format(finite(value)); }
function formatDate(value: string | null): string { return value ? new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value)) : "Not scheduled"; }
function formatRelative(value: string): string {
  const distance = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(distance)) return "Unknown time";
  const minutes = Math.max(0, Math.round(distance / 60_000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`;
}
function firstName(value: string): string { return value.trim().split(/\s+/)[0] || "developer"; }
