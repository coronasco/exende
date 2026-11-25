"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LandingExperience, MotionToggle } from "@/components/landing/landing-experience";
import "./account-surfaces.css";
import styles from "./product.module.css";

/** Docs and the homepage own their layouts. Keep customer navigation mounted between routes. */
export function RouteExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/docs" || pathname.startsWith("/docs/")) return children;
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return <div className={`${styles.site} orbital-workspace`}>{children}</div>;
  }
  return <LandingExperience key={pathname}>
    <div className={styles.site}>
      {children}
      <div className={styles.motionControl}><MotionToggle /></div>
    </div>
  </LandingExperience>;
}
