import { ApiKeysManager } from "@/components/dashboard/api-keys-manager";
import { DashboardError } from "@/components/dashboard/dashboard-error";
import { getApiKeys } from "@/lib/control-plane";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "API keys" };

export default async function ApiKeysPage() {
  const keys = await getApiKeys().catch(() => null);
  if (!keys) return <DashboardError />;
  const dataApiUrl = process.env.EXENDE_DATA_API_URL ?? "https://dataapi-api-production.daniel-zaharia-dev.workers.dev";
  return <ApiKeysManager initialKeys={keys} dataApiUrl={dataApiUrl} />;
}
