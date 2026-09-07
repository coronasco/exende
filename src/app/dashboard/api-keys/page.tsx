import { ApiKeysManager } from "@/components/dashboard/api-keys-manager";
import { DashboardError } from "@/components/dashboard/dashboard-error";
import { siteConfig } from "@/content/site";
import { getApiKeys } from "@/lib/control-plane";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "API keys" };

export default async function ApiKeysPage() {
  const keys = await getApiKeys().catch(() => null);
  if (!keys) return <DashboardError />;
  const dataApiUrl = process.env.EXENDE_DATA_API_URL ?? siteConfig.dataApiBase;
  return <ApiKeysManager initialKeys={keys} dataApiUrl={dataApiUrl} />;
}
