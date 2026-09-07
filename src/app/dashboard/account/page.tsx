import { AccountManager } from "@/components/dashboard/account-manager";
import { DashboardError } from "@/components/dashboard/dashboard-error";
import { getAccountIdentity } from "@/lib/control-plane";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Account" };

export default async function AccountSettingsPage() {
  const identity = await getAccountIdentity().catch(() => null);
  if (!identity) return <DashboardError />;
  return <AccountManager identity={identity} />;
}
