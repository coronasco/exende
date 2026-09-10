export const jobsQuickstart = "curl --get \"https://data.exende.dev/v1/jobs/search\" \\\n  --data-urlencode \"q=software engineer\" \\\n  --data-urlencode \"limit=5\" \\\n  -H \"Authorization: Bearer $EXENDE_API_KEY\"";

export const jobsOperations = [
  { id: "search", path: "/v1/jobs/search", title: "Search jobs", scope: "jobs:read", credits: "1 per returned record", description: "Full-text prefix search across title, department, and description. The q parameter is required." },
  { id: "list", path: "/v1/jobs", title: "List jobs", scope: "jobs:read", credits: "1 per returned record", description: "Filter normalized jobs with keyset pagination; active jobs are returned by default." },
  { id: "detail", path: "/v1/jobs/{id}", title: "Job detail", scope: "jobs:read", credits: "1", description: "Inspect a job, available description, normalized skills, and source attribution." },
  { id: "history", path: "/v1/jobs/{id}/history", title: "Job history", scope: "jobs:read", credits: "1 per returned record", description: "Read up to 100 immutable versions, newest first. No pagination cursor is supported." },
  { id: "history-feed", path: "/v1/history", title: "History feed", scope: "jobs:read", credits: "1 per returned record", description: "The latest 100 created, updated, or closed versions across the catalogue. No query parameters or cursor." },
  { id: "companies", path: "/v1/companies/{domain}", title: "Company detail", scope: "companies:read", credits: "2", description: "Company identity, active jobs, and earliest/latest recorded job observation." },
  { id: "company-jobs", path: "/v1/companies/{domain}/jobs", title: "Company jobs", scope: "companies:read", credits: "1 per returned record", description: "Filter and paginate a company’s jobs. The path accepts a canonical domain or company UUID." },
  { id: "company-hiring", path: "/v1/companies/{domain}/hiring", title: "Company hiring", scope: "companies:read", credits: "5", description: "Current role mix and a daily hiring timeline for a 7–90 day observation window." },
  { id: "skills", path: "/v1/skills", title: "Skills", scope: "jobs:read", credits: "1 per returned record", description: "Up to 100 normalized skills associated with active jobs, ordered by count then name. No cursor." },
  { id: "metrics-overview", path: "/v1/metrics/overview", title: "Overview metrics", scope: "signals:read", credits: "2", description: "Active catalogue counts and the available daily observations for the last 14 calendar days." },
  { id: "hiring-metrics", path: "/v1/metrics/hiring", title: "Hiring metrics", scope: "signals:read", credits: "5", description: "Observed hiring changes, role mix, and up to 12 company, location, and country groups." },
] as const;
