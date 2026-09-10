import type { PublicOverview } from "@/lib/dataapi";
import { siteConfig } from "@/content/site";
import { CopyButton } from "./copy-button";
import styles from "./landing.module.css";

type OverviewProps = { overview: Promise<PublicOverview | null> };
const labels = ["Active jobs", "Companies observed", "Reviewed sources", "Data freshness"];
const definitions = ["Current active canonical jobs in the catalogue.", "Companies with at least one active job.", "Enabled, reviewed public job sources."];

export async function CatalogueMetrics({ overview }: OverviewProps) {
  const data = await overview;
  if (!data) return <div className={styles.catalogueUnavailable} role="status"><span className={styles.statusDot} />Catalogue metrics are temporarily unavailable. <a href={siteConfig.dataApiOverview}>Check the public endpoint ↗</a></div>;
  const timestamp = data.lastUpdatedAt ? new Date(data.lastUpdatedAt) : null;
  const date = timestamp ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(timestamp) : "Update pending";
  const time = timestamp ? new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "UTC" }).format(timestamp) + " UTC" : null;
  return <dl className={styles.metrics} aria-label="Current public catalogue overview">
    {[data.activeJobs, data.activeCompanies, data.activeSources].map((value, index) => <div key={labels[index]}><dt>{labels[index]}</dt><dd>{value.toLocaleString("en-US")}</dd><dd className={styles.metricDefinition}>{definitions[index]}</dd></div>)}
    <div className={styles.freshness}><dt>Data freshness</dt><dd>{timestamp ? <time dateTime={data.lastUpdatedAt!}>{date}<small>{time}</small></time> : date}</dd><dd className={styles.metricDefinition}>Most recent canonical job observation, in UTC.</dd></div>
  </dl>;
}

export function CatalogueLoading() {
  return <dl className={`${styles.metrics} ${styles.loading}`} aria-label="Loading catalogue overview" aria-busy="true">{labels.map(label => <div key={label}><dt>{label}</dt><dd><span /></dd></div>)}</dl>;
}

export async function OverviewTerminal({ overview }: OverviewProps) {
  const data = await overview;
  const response = data ? JSON.stringify({ data: { active_jobs: data.activeJobs, active_companies: data.activeCompanies, active_sources: data.activeSources, last_updated_at: data.lastUpdatedAt } }, null, 2) : null;
  const command = `curl ${siteConfig.dataApiOverview}`;
  return <div className={styles.terminal}>
    <div className={styles.terminalTop}><span><i /> Public overview</span><b>GET</b></div>
    <div className={styles.command}><code><span>$</span> {command}</code><CopyButton text={command} label="Copy public overview request" /></div>
    <div className={styles.response}>
      <div className={styles.responseTop}><span>{data ? "Catalogue snapshot" : "Response fields"}</span>{response ? <CopyButton text={response} label="Copy catalogue response" /> : null}</div>
      {response ? <pre><code>{response.split("\n").map((line, index) => <span key={index} className={line.includes(":") ? styles.codeField : undefined}>{line}{"\n"}</span>)}</code></pre> : <><p className={styles.responseFallback}>The public overview is temporarily unavailable.</p><dl className={styles.responseSchema}><div><dt>active_jobs</dt><dd>number</dd></div><div><dt>active_companies</dt><dd>number</dd></div><div><dt>active_sources</dt><dd>number</dd></div><div><dt>last_updated_at</dt><dd>UTC timestamp or null</dd></div></dl></>}
    </div>
  </div>;
}
