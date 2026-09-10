import { DashboardError } from "@/components/dashboard/dashboard-error";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ControlPlaneError, getAccountIdentity } from "@/lib/control-plane";
import type { AccountIdentity } from "@/lib/control-plane-types";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { accountHref } from "@/lib/account-intent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s — Exende Dashboard" },
  description: "Manage Exende API access, credits, usage, and billing.",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const identity = await loadIdentity();
  if (identity === "unauthorized") redirect(accountHref("signin", (await headers()).get("x-exende-dashboard-destination") ?? "/dashboard"));
  if (!identity) return <div className="dashboard-shell dashboard-shell--unavailable"><DashboardError /></div>;
  return <DashboardShell identity={identity}>{children}</DashboardShell>;
}

async function loadIdentity(): Promise<AccountIdentity | "unauthorized" | null> {
  try {
    return await getAccountIdentity();
  } catch (error) {
    return error instanceof ControlPlaneError && error.status === 401 ? "unauthorized" : null;
  }
}
