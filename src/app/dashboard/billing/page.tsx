import { BillingManager } from "@/components/dashboard/billing-manager";
import { DashboardError } from "@/components/dashboard/dashboard-error";
import { getBilling } from "@/lib/control-plane";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage() {
  const billing = await getBilling().catch(() => null);
  if (!billing) return <DashboardError />;
  return <BillingManager billing={billing} />;
}
