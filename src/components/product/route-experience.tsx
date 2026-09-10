"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LandingExperience, MotionToggle } from "@/components/landing/landing-experience";
import styles from "./product.module.css";

/** The existing homepage and Docs retain their own presentation. */
export function RouteExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/docs" || pathname.startsWith("/docs/")) return children;
  return <LandingExperience key={pathname}>
    <div className={styles.site}>
      {children}
      <div className={styles.motionControl}><MotionToggle /></div>
    </div>
  </LandingExperience>;
}
