import { jobsIntelligenceEndpoints } from "@/content/jobs-intelligence";
import { ArrowUpRight, Building2, ChartNoAxesCombined, FileText, History, Radar, Search, Tags } from "lucide-react";
import Link from "next/link";
import styles from "./endpoint-list.module.css";

const icons = { search: Search, company: Building2, signals: Radar, changes: History, skills: Tags, trends: ChartNoAxesCombined, report: FileText };

export function JobsIntelligenceEndpointList({ compact = false }: { compact?: boolean }) {
  return <div className={styles.list} data-compact={compact}>
    {jobsIntelligenceEndpoints.map(endpoint => {
      const Icon = icons[endpoint.id as keyof typeof icons] ?? FileText;
      return <Link className={styles.endpoint} key={endpoint.id} href={`/docs/jobs-intelligence#${endpoint.id}`}>
        <Icon aria-hidden="true" className={styles.icon} />
        <div className={styles.copy}><h3>{endpoint.title}</h3><p>{endpoint.description}</p><code>GET {endpoint.path}</code></div>
        <span className={styles.price}>{endpoint.price} USDC<small>per request</small></span>
        <ArrowUpRight aria-hidden="true" className={styles.arrow} />
      </Link>;
    })}
  </div>;
}
