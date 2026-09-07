import { siteConfig } from "@/content/site";

export type PublicOverview = {
  activeJobs: number;
  activeCompanies: number;
  activeSources: number;
  lastUpdatedAt: string | null;
};

type OverviewPayload = {
  data?: {
    active_jobs?: unknown;
    active_companies?: unknown;
    active_sources?: unknown;
    last_updated_at?: unknown;
  };
};

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function parseTimestamp(value: unknown): string | null {
  if (value === null) return null;
  if (typeof value !== "string") return null;
  return Number.isNaN(Date.parse(value)) ? null : value;
}

export async function getPublicOverview(): Promise<PublicOverview | null> {
  try {
    const response = await fetch(siteConfig.dataApiOverview, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as OverviewPayload;
    const data = payload.data;

    if (
      !data ||
      !isCount(data.active_jobs) ||
      !isCount(data.active_companies) ||
      !isCount(data.active_sources)
    ) {
      return null;
    }

    return {
      activeJobs: data.active_jobs,
      activeCompanies: data.active_companies,
      activeSources: data.active_sources,
      lastUpdatedAt: parseTimestamp(data.last_updated_at),
    };
  } catch {
    return null;
  }
}

export function formatOverviewTimestamp(value: string | null): string {
  if (!value) return "Update pending";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
  }).format(new Date(value)) + " UTC";
}
