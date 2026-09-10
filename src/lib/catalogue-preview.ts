export type PublicSample = {
  id: string; title: string; company: string; location: string | null; country_code: string | null;
  employment_type: string; workplace_type: string; status: "active";
  first_seen_at: string | null; last_seen_at: string | null;
};
export type CatalogueGroup = { value: string; active_jobs: number };
export type CataloguePreview = {
  query: string;
  summary: { active_jobs: number; companies: number; countries: number; locations: number; country_unclassified_jobs: number; first_observed_at: string | null; last_observed_at: string | null };
  top_locations: CatalogueGroup[]; top_countries: CatalogueGroup[]; top_roles: CatalogueGroup[]; top_companies: CatalogueGroup[];
  sample_jobs: PublicSample[];
};
function object(value: unknown): Record<string, unknown> { if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid preview"); return value as Record<string,unknown>; }
function text(value: unknown, limit: number): string { if (typeof value !== "string" || value.length > limit) throw new Error("Invalid preview text"); return value; }
function nullable(value: unknown, limit: number) { return value === null ? null : text(value,limit); }
function count(value: unknown): number { if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error("Invalid count"); return value; }
function time(value: unknown) { const date=nullable(value,40); if (date && !Number.isFinite(Date.parse(date))) throw new Error("Invalid observation"); return date; }
function groups(value: unknown): CatalogueGroup[] { if (!Array.isArray(value) || value.length > 5) throw new Error("Invalid groups"); return value.map(item => { const row=object(item); return {value:text(row.value,180),active_jobs:count(row.active_jobs)}; }); }
export function parseCataloguePreview(payload: unknown): CataloguePreview {
  const data=object(object(payload).data), summary=object(data.summary), boundary=object(data.preview);
  if (boundary.sample_limit !== 5 || boundary.pool_limit !== 12 || boundary.pagination !== false || boundary.projection !== "limited_public_fields" || count(boundary.enrolled_samples) > 12 || !Array.isArray(data.sample_jobs) || data.sample_jobs.length > 5) throw new Error("Invalid preview boundary");
  return {
    query:text(data.query,80),
    summary:{active_jobs:count(summary.active_jobs),companies:count(summary.companies),countries:count(summary.countries),locations:count(summary.locations),country_unclassified_jobs:count(summary.country_unclassified_jobs),first_observed_at:time(summary.first_observed_at),last_observed_at:time(summary.last_observed_at)},
    top_locations:groups(data.top_locations),top_countries:groups(data.top_countries),top_roles:groups(data.top_roles),top_companies:groups(data.top_companies),
    sample_jobs:data.sample_jobs.map(item=>{ const row=object(item); if(row.status!=="active") throw new Error("Invalid sample status"); return {
      id:text(row.id,36),title:text(row.title,180),company:text(row.company,100),location:nullable(row.location,160),country_code:nullable(row.country_code,2),employment_type:text(row.employment_type,20),workplace_type:text(row.workplace_type,20),status:"active",first_seen_at:time(row.first_seen_at),last_seen_at:time(row.last_seen_at),
    }; }),
  };
}
export function countryName(code: string) { try { return new Intl.DisplayNames(["en"],{type:"region"}).of(code) ?? code; } catch { return code; } }
