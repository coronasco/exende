"use client";

import { BrandMark } from "@/components/brand-mark";
import type { AccountIdentity } from "@/lib/control-plane-types";
import { BarChart3, BookOpen, CreditCard, KeyRound, LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const dashboardNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/api-keys", label: "API keys", icon: KeyRound },
  { href: "/dashboard/usage", label: "Usage", icon: BarChart3 },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/account", label: "Account", icon: Settings },
] as const;

export function DashboardShell({ identity, children }: { identity: AccountIdentity; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/sign-out", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }).catch(() => null);
    router.replace("/account");
    router.refresh();
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar" data-open={menuOpen}>
        <div className="dashboard-sidebar__brand"><BrandMark /><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close dashboard menu"><X /></button></div>
        <div className="dashboard-org">
          <span>{identity.organization.name.slice(0, 1).toUpperCase()}</span>
          <div><strong>{identity.organization.name}</strong><small>{formatPlan(identity.organization.planKey)} plan</small></div>
        </div>
        <nav aria-label="Dashboard navigation">
          {dashboardNav.map((item) => {
            const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return <Link key={item.href} href={item.href} data-active={active} onClick={() => setMenuOpen(false)}><Icon /><span>{item.label}</span>{active ? <i /> : null}</Link>;
          })}
        </nav>
        <div className="dashboard-sidebar__footer">
          <Link href="/docs/jobs"><BookOpen /> Documentation</Link>
          <button type="button" onClick={signOut} disabled={signingOut}><LogOut /> {signingOut ? "Signing out..." : "Sign out"}</button>
        </div>
      </aside>

      {menuOpen ? <button className="dashboard-backdrop" type="button" aria-label="Close dashboard menu" onClick={() => setMenuOpen(false)} /> : null}
      <div className="dashboard-workspace">
        <header className="dashboard-topbar">
          <button type="button" className="dashboard-menu" onClick={() => setMenuOpen(true)} aria-label="Open dashboard menu"><Menu /></button>
          <div><span className="dashboard-pulse"><i /> DATA PLANE CONNECTED</span></div>
          <div className="dashboard-profile"><span>{identity.user.name.slice(0, 1).toUpperCase()}</span><div><strong>{identity.user.name}</strong><small>{identity.user.email}</small></div></div>
        </header>
        <main className="dashboard-content" id="dashboard-content">{children}</main>
      </div>
    </div>
  );
}

function formatPlan(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
