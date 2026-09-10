"use client";

import { track } from "@vercel/analytics";

export type ProductEvent = "catalogue_search" | "catalogue_results" | "sample_json_opened" | "signup_cta_clicked" | "pricing_viewed" | "plan_clicked" | "signup_started" | "signup_completed" | "api_key_created" | "first_successful_api_request" | "checkout_initiated" | "paid_plan_activated";
type EventProperties = { plan?: string; surface?: string; hasResults?: boolean; scopeCount?: number; billingMode?: string };
export function productEvent(name: ProductEvent, properties: EventProperties = {}) {
  // Callers pass only controlled categories, never search text, keys, email, IDs or response data.
  try { track(name, properties); } catch { /* Analytics must never block a product action. */ }
}
