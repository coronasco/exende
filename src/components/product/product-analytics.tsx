"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { productEvent } from "@/lib/product-events";
import { selectedPlan } from "@/lib/account-intent";

export function stripAnalyticsQuery(event: BeforeSendEvent) {
  try { const url = new URL(event.url); url.search = ""; url.hash = ""; return { ...event, url: url.toString() }; } catch { return null; }
}
export function ProductAnalytics() {
  const pathname = usePathname();
  useEffect(() => { if (pathname === "/pricing") productEvent("pricing_viewed"); }, [pathname]);
  useEffect(() => {
    function click(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const url = new URL(link.href, window.location.origin);
      if (url.origin !== window.location.origin || url.pathname !== "/account" || url.searchParams.get("mode") !== "signup") return;
      const next = new URL(url.searchParams.get("next") ?? "/dashboard", window.location.origin);
      const plan = selectedPlan(url.searchParams.get("plan")) ?? selectedPlan(next.searchParams.get("plan"));
      const surface = window.location.pathname.startsWith("/products/") ? "product" : window.location.pathname === "/pricing" ? "pricing" : window.location.pathname === "/" ? "homepage" : "site";
      productEvent("signup_cta_clicked", { surface });
      if (plan) productEvent("plan_clicked", { plan, surface });
    }
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return <Analytics beforeSend={stripAnalyticsQuery} />;
}
