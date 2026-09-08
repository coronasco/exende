import { DashboardError } from "@/components/dashboard/dashboard-error";
import { getCredits, getUsage } from "@/lib/control-plane";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, CircleDollarSign, Database, Radio } from "lucide-react";

export const metadata: Metadata = { title: "Usage" };

const perRecordCreditRoutes = [
  ["Job search", "/v1/jobs/search"],
  ["Job catalogue", "/v1/jobs"],
  ["Job history", "/v1/jobs/{id}/history"],
  ["Company jobs", "/v1/companies/{domain}/jobs"],
  ["Skills", "/v1/skills"],
  ["History feed", "/v1/history"],
] as const;

const fixedCreditRoutes = [
  ["Job detail", "/v1/jobs/{id}", 1],
  ["Company detail", "/v1/companies/{domain}", 2],
  ["Company hiring", "/v1/companies/{domain}/hiring", 5],
  ["Overview metrics", "/v1/metrics/overview", 2],
  ["Hiring metrics", "/v1/metrics/hiring", 5],
] as const;

export default async function UsagePage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const selected = Number((await searchParams).days);
  const days = selected === 7 || selected === 90 ? selected : 30;
  const accountUsage = await Promise.all([getCredits(), getUsage(days)]).catch(() => null);
  if (!accountUsage) return <DashboardError />;
  const [credits, usage] = accountUsage;
  const maximum = Math.max(0, ...usage.daily.map((item) => finite(item.credits_consumed)));
  return (
    <>
        <header className="dashboard-heading">
          <div><p className="eyebrow">Metered consumption</p><h1>Usage</h1><p>Every billable Data API operation is recorded without request or response payloads.</p></div>
          <nav className="usage-period" aria-label="Usage period">{[7, 30, 90].map((period) => <Link key={period} href={`/dashboard/usage?days=${period}`} data-active={days === period}>{period}D</Link>)}</nav>
        </header>

        <section className="dashboard-stats dashboard-stats--usage">
          <UsageMetric icon={CircleDollarSign} label="Credits remaining" value={formatNumber(credits.balance)} />
          <UsageMetric icon={CircleDollarSign} label="Credits consumed" value={formatNumber(usage.totals.creditsConsumed)} />
          <UsageMetric icon={Radio} label="Requests" value={formatNumber(usage.totals.requests)} />
          <UsageMetric icon={Database} label="Records returned" value={formatNumber(usage.totals.recordsReturned)} />
        </section>

        <section className="dashboard-panel usage-costs">
          <div className="dashboard-panel__heading">
            <div><span className="annotation">CREDIT COSTS</span><h2>Know the cost before you request</h2></div>
            <Link href="/docs/jobs#credits">Metering guide <ArrowRight /></Link>
          </div>
          <div className="usage-costs__notice">
            <span><CircleDollarSign /></span>
            <p><strong>Only successful requests that return data consume credits.</strong> Failed requests and per-record endpoints returning zero records cost 0 credits. <code>GET /v1/public/overview</code> is free and keyless.</p>
          </div>
          <div className="usage-costs__grid">
            <article className="usage-cost-group usage-cost-group--variable">
              <header><div><span>PER RETURNED RECORD</span><h3>1 credit <small>/ record</small></h3></div><i>VARIABLE</i></header>
              <p>Your cost follows the number of records in the response. For example, 5 returned records cost 5 credits.</p>
              <div className="usage-cost-routes">
                {perRecordCreditRoutes.map(([label, route]) => <div key={route}><span>{label}</span><code>GET {route}</code><strong>1 / result</strong></div>)}
              </div>
            </article>
            <article className="usage-cost-group usage-cost-group--fixed">
              <header><div><span>FIXED COST</span><h3>Per successful response</h3></div><i>FIXED</i></header>
              <p>Detail and aggregate endpoints use a predictable fixed debit when the request returns data.</p>
              <div className="usage-cost-routes">
                {fixedCreditRoutes.map(([label, route, cost]) => <div key={route}><span>{label}</span><code>GET {route}</code><strong>{cost} {cost === 1 ? "credit" : "credits"}</strong></div>)}
              </div>
            </article>
          </div>
        </section>

        <section className="dashboard-panel usage-timeline">
          <div className="dashboard-panel__heading"><div><span className="annotation">DAILY CREDIT CONSUMPTION</span><h2>{days}-day timeline</h2></div><span>{usage.daily.length} active {usage.daily.length === 1 ? "day" : "days"}</span></div>
          {usage.daily.length ? <div className="usage-timeline__chart">{usage.daily.map((item) => {
            const value = finite(item.credits_consumed);
            const height = maximum > 0 ? Math.max(5, value / maximum * 100) : 0;
            return <div key={item.day}><span><i style={{ height: `${height}%` }} /></span><strong>{value || ""}</strong><small>{item.day.slice(5)}</small></div>;
          })}</div> : <div className="dashboard-empty"><BarChart3 /><strong>No metered usage</strong><p>Requests made with a customer API key will appear here.</p></div>}
        </section>

        <section className="dashboard-main-grid dashboard-main-grid--usage">
          <article className="dashboard-panel usage-products">
            <div className="dashboard-panel__heading"><div><span className="annotation">PRODUCT DISTRIBUTION</span><h2>Usage by API</h2></div></div>
            {usage.byProduct.length ? usage.byProduct.map((product) => {
              const total = Math.max(1, usage.totals.creditsConsumed);
              const percentage = Math.round(finite(product.credits_consumed) / total * 100);
              return <div className="usage-product" key={product.product}><div><span>{readable(product.product)}</span><strong>{formatNumber(finite(product.credits_consumed))} credits</strong></div><span><i style={{ width: `${percentage}%` }} /></span><small>{formatNumber(finite(product.requests))} requests · {formatNumber(finite(product.records_returned))} records</small></div>;
            }) : <div className="dashboard-empty dashboard-empty--compact"><Database /><strong>No product usage yet</strong></div>}
          </article>
          <article className="dashboard-panel usage-credit-ledger">
            <div className="dashboard-panel__heading"><div><span className="annotation">ACCOUNT BALANCE</span><h2>Credit ledger</h2></div></div>
            <dl><div><dt>Lifetime granted</dt><dd>{formatNumber(credits.lifetimeGranted)}</dd></div><div><dt>Lifetime consumed</dt><dd>{formatNumber(credits.lifetimeConsumed)}</dd></div><div><dt>Available now</dt><dd>{formatNumber(credits.balance)}</dd></div></dl>
            <p>Available balance excludes expired credit lots. Every grant and debit remains auditable in the Data Plane ledger.</p>
          </article>
        </section>

        <section className="dashboard-panel usage-log">
          <div className="dashboard-panel__heading"><div><span className="annotation">REQUEST LOG</span><h2>Recent operations</h2></div><small>90-day retention</small></div>
          {usage.recent.length ? <div className="usage-log__table"><div><span>Time</span><span>Operation</span><span>Endpoint</span><span>Status</span><span>Records</span><span>Credits</span><span>Latency</span><span>Request ID</span></div>{usage.recent.map((item) => <div key={item.request_id}><time dateTime={item.created_at}>{formatTimestamp(item.created_at)}</time><strong>{readable(item.operation)}</strong><code>{item.endpoint}</code><span data-ok={item.status_code < 400}>{item.status_code}</span><span>{formatNumber(finite(item.records_returned))}</span><span>{formatNumber(finite(item.credits_consumed))}</span><span>{formatNumber(finite(item.latency_ms))} ms</span><code>{shortRequestId(item.request_id)}</code></div>)}</div> : <div className="dashboard-empty"><Radio /><strong>No requests recorded</strong><p>The log intentionally contains metadata only, never API keys or response payloads.</p></div>}
        </section>
    </>
  );
}

function UsageMetric({ icon: Icon, label, value }: { icon: typeof Database; label: string; value: string }) { return <article className="dashboard-stat"><div><span><Icon /></span><small>{label}</small></div><strong>{value}</strong></article>; }
function finite(value: number): number { return Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0; }
function formatNumber(value: number): string { return new Intl.NumberFormat("en-US").format(finite(value)); }
function readable(value: string): string { return value.split(/[._]/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
function formatTimestamp(value: string): string { return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "UTC", timeZoneName: "short" }).format(new Date(value)); }
function shortRequestId(value: string): string { return value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-4)}` : value; }
