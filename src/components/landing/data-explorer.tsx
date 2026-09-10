"use client";

import { ArrowRight, Database, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import styles from "./landing.module.css";

const capabilities = [
  { title: "Job search", heading: "Search normalized jobs.", description: "Search current public listings through a consistent, canonical data layer.", route: "/v1/jobs/search", rows: [["Required scope", "jobs:read"], ["Access", "Scoped customer key"], ["Credits", "1 per returned record"], ["Request limit", "Up to 100 records"]] },
  { title: "Companies", heading: "Connect the company context.", description: "Explore company details, current job listings, and observed hiring activity.", route: "/v1/companies/{domain}", rows: [["Required scope", "companies:read"], ["Access", "Scoped customer key"], ["Company detail", "2 credits"], ["Hiring context", "/v1/companies/{domain}/hiring"]] },
  { title: "History", heading: "Look beyond the latest listing.", description: "Access recorded job observations and research changes across the available history.", route: "/v1/jobs/{id}/history", rows: [["Required scope", "jobs:read"], ["Access", "Scoped customer key"], ["Credits", "1 per returned record"], ["Cross-job history", "/v1/history"]] },
  { title: "Metrics", heading: "Build with hiring context.", description: "Use documented aggregate metrics to understand hiring activity within reviewed coverage.", route: "/v1/metrics/hiring", rows: [["Required scope", "signals:read"], ["Access", "Scoped customer key"], ["Hiring metrics", "5 credits"], ["Overview metrics", "2 credits"]] },
];

export function DataExplorer() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % capabilities.length;
    else if (event.key === "ArrowLeft") next = (index + capabilities.length - 1) % capabilities.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = capabilities.length - 1;
    else return;
    event.preventDefault(); setSelected(next); tabs.current[next]?.focus();
  }
  return <div className={styles.explorer}>
    <div className={styles.tabs} role="tablist" aria-label="Explore Jobs Data capabilities">
      {capabilities.map((item, index) => <button key={item.title} type="button" ref={node => { tabs.current[index] = node; }} role="tab" id={`data-tab-${index}`} aria-selected={selected === index} aria-controls={`data-panel-${index}`} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => navigate(event, index)}>{item.title}</button>)}
    </div>
    {capabilities.map((item, index) => <div key={item.title} className={styles.record} role="tabpanel" id={`data-panel-${index}`} aria-labelledby={`data-tab-${index}`} tabIndex={0} hidden={selected !== index}>
      <div className={styles.recordLabel}><Database /><span>Jobs &amp; Hiring Data API</span></div>
      <h3>{item.heading}</h3><p>{item.description}</p>
      <div className={styles.recordRoute}><span>GET</span><code>{item.route}</code></div>
      <dl>{item.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <div className={styles.recordFooter}><span><KeyRound /> Scoped access</span><Link href="/docs/jobs#access">Read the API docs <ArrowRight /></Link></div>
    </div>)}
  </div>;
}
