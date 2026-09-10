const dashboardPaths = new Set(["/dashboard", "/dashboard/api-keys", "/dashboard/usage", "/dashboard/billing", "/dashboard/account"]);
export const paidPlanKeys = ["starter", "pro", "scale"] as const;
export type PaidPlan = typeof paidPlanKeys[number];
export function selectedPlan(value: unknown): PaidPlan | null {
  return typeof value === "string" && paidPlanKeys.includes(value as PaidPlan) ? value as PaidPlan : null;
}

/** Reconstruct an allowlisted local destination; never forward arbitrary redirect parameters. */
export function accountDestination(value: unknown, planValue?: unknown): string {
  let pathname = "/dashboard";
  let plan = selectedPlan(planValue);
  if (typeof value === "string" && value.length <= 250 && value.startsWith("/") && !value.startsWith("//") && !/[\\\u0000-\u0020]/.test(value)) {
    try {
      const url = new URL(value, "https://www.exende.dev");
      if (url.origin === "https://www.exende.dev" && dashboardPaths.has(url.pathname)) {
        pathname = url.pathname;
        plan ??= selectedPlan(url.searchParams.get("plan"));
      }
    } catch { /* Invalid destinations return to the dashboard. */ }
  }
  return plan ? `/dashboard/billing?plan=${plan}` : pathname;
}
export function accountHref(mode: "signin" | "signup" = "signup", next = "/dashboard", plan?: unknown): string {
  const query = new URLSearchParams({ mode, next: accountDestination(next, plan) });
  return `/account?${query}`;
}
