import { formatOverviewTimestamp, getPublicOverview } from "@/lib/dataapi";
import { BriefcaseBusiness, Building2, DatabaseZap, RefreshCw } from "lucide-react";

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BriefcaseBusiness;
  label: string;
  value: string;
}) {
  return (
    <div className="live-metric">
      <Icon aria-hidden="true" className="h-4 w-4" />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export async function LiveOverview() {
  const overview = await getPublicOverview();

  if (!overview) {
    return (
      <div className="live-overview" aria-label="Catalogue overview temporarily unavailable">
        <div className="live-overview__status">
          <span className="status-dot" data-state="neutral" />
          Public catalogue
        </div>
        <p className="live-overview__fallback">
          Catalogue metrics are temporarily unavailable. The product information remains current.
        </p>
        <Metric icon={RefreshCw} label="Data freshness" value="Update pending" />
      </div>
    );
  }

  return (
    <div className="live-overview" aria-label="Current public catalogue overview">
      <div className="live-overview__status">
        <span className="status-dot" />
        Public catalogue
      </div>
      <Metric
        icon={BriefcaseBusiness}
        label="Active jobs"
        value={overview.activeJobs.toLocaleString("en-US")}
      />
      <Metric
        icon={Building2}
        label="Companies observed"
        value={overview.activeCompanies.toLocaleString("en-US")}
      />
      <Metric
        icon={DatabaseZap}
        label="Reviewed sources"
        value={overview.activeSources.toLocaleString("en-US")}
      />
      <Metric
        icon={RefreshCw}
        label="Data freshness"
        value={formatOverviewTimestamp(overview.lastUpdatedAt)}
      />
    </div>
  );
}

export function LiveOverviewFallback() {
  return (
    <div className="live-overview live-overview--loading" aria-label="Loading catalogue overview">
      <div className="live-overview__status">
        <span className="status-dot" data-state="neutral" />
        Public catalogue
      </div>
      {["Active jobs", "Companies observed", "Reviewed sources", "Data freshness"].map((label) => (
        <div className="live-metric" key={label}>
          <span className="metric-skeleton" />
          <div>
            <strong className="metric-skeleton metric-skeleton--value">Loading</strong>
            <span>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
