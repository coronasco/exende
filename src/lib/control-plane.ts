import "server-only";

import type { AccountIdentity, ApiKeyMetadata, BillingSummary, CreditSummary, DashboardOverview, PlanDefinition, UsageSummary } from "@/lib/control-plane-types";
import { cookies } from "next/headers";
import { cache } from "react";

export class ControlPlaneError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) {
    super(message);
    this.name = "ControlPlaneError";
  }
}

export function controlPlaneBaseUrl(): URL | null {
  const raw = process.env.EXENDE_CONTROL_PLANE_URL ?? (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8787" : "");
  if (!raw) return null;
  const url = new URL(raw);
  if (url.pathname !== "/" || url.search || url.hash) throw new Error("EXENDE_CONTROL_PLANE_URL must be an origin");
  if (url.protocol !== "https:" && !isLocalHost(url.hostname)) {
    throw new Error("EXENDE_CONTROL_PLANE_URL must use HTTPS unless it targets loopback");
  }
  return url;
}

export async function controlPlaneFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const baseUrl = controlPlaneBaseUrl();
  if (!baseUrl) throw new ControlPlaneError(503, "control_plane_unavailable", "Customer access is not configured");
  const url = new URL(path, baseUrl);
  if (url.origin !== baseUrl.origin) throw new Error("Control Plane request left the configured origin");
  return fetch(url, { ...init, signal: init.signal ?? AbortSignal.timeout(10_000), cache: "no-store" });
}

async function authenticatedData<T>(path: string): Promise<T> {
  const cookieHeader = (await cookies()).toString();
  let response: Response;
  try {
    response = await controlPlaneFetch(path, { headers: cookieHeader ? { cookie: cookieHeader } : undefined });
  } catch (error) {
    if (error instanceof ControlPlaneError) throw error;
    throw new ControlPlaneError(503, "control_plane_unavailable", "Customer services are temporarily unavailable");
  }
  const payload = await parsePayload(response);
  if (!response.ok) {
    const failure = payload as { error?: { code?: unknown; message?: unknown } };
    throw new ControlPlaneError(
      response.status,
      typeof failure.error?.code === "string" ? failure.error.code : "control_plane_error",
      typeof failure.error?.message === "string" ? failure.error.message : "The request could not be completed"
    );
  }
  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    throw new ControlPlaneError(502, "invalid_control_plane_response", "Customer services returned an invalid response");
  }
  return (payload as { data: T }).data;
}

export const getAccountIdentity = cache(() => authenticatedData<AccountIdentity>("/v1/me"));
export const getDashboardOverview = cache(() => authenticatedData<DashboardOverview>("/v1/overview"));
export const getApiKeys = cache(() => authenticatedData<ApiKeyMetadata[]>("/v1/api-keys"));
export const getCredits = cache(() => authenticatedData<CreditSummary>("/v1/credits"));
export const getUsage = cache((days = 30) => authenticatedData<UsageSummary>(`/v1/usage?days=${days}`));
export const getBilling = cache(() => authenticatedData<BillingSummary>("/v1/billing"));
export const getPublicPlans = cache(async (): Promise<PlanDefinition[]> => {
  let response: Response;
  try {
    response = await controlPlaneFetch("/v1/plans");
  } catch (error) {
    if (error instanceof ControlPlaneError) throw error;
    throw new ControlPlaneError(503, "control_plane_unavailable", "Plan information is temporarily unavailable");
  }
  const payload = await parsePayload(response);
  if (!response.ok || !payload || typeof payload !== "object" || !("data" in payload) || !Array.isArray((payload as { data: unknown }).data)) {
    throw new ControlPlaneError(502, "invalid_control_plane_response", "Plan information is temporarily unavailable");
  }
  return (payload as { data: PlanDefinition[] }).data;
});

async function parsePayload(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}
