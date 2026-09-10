"use client";

import { BrandMark } from "@/components/brand-mark";
import { topNav } from "@/content/site";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import landingStyles from "@/components/landing/landing.module.css";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isNavActive = (href: string) => {
    if (href === "/products/jobs") return pathname.startsWith("/products/jobs");
    if (href === "/products") {
      return pathname === "/products" || ["/products/callback", "/products/retry", "/products/resolve"].some((path) => pathname.startsWith(path));
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  return (
    <header data-dashboard-active={pathname === "/dashboard" || pathname.startsWith("/dashboard/")} className={pathname === "/docs" || pathname.startsWith("/docs/") ? "site-header" : `site-header ${landingStyles.landingHeader}`}>
      <div className="page-shell site-header__inner">
        <BrandMark />

        <nav className="site-header__nav" aria-label="Primary navigation">
          {topNav.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="site-nav-link"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="site-nav-link"
                data-active={isNavActive(item.href)}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="site-header__actions">
          <Link href="/account" className="site-header__signin">Sign in</Link>
          <Link href="/account?mode=signup&next=/dashboard" className="site-header__cta">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--color-border)] text-[var(--color-foreground)] md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {menuOpen ? (
        <div id="mobile-navigation" className="border-t border-[var(--color-border)] bg-[rgba(2,6,15,0.98)] md:hidden">
          <div className="page-shell py-4">
            <div className="grid gap-1">
              {topNav.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between border-b border-[var(--color-border)] py-4 text-sm text-[var(--color-foreground)]"
                  >
                    <span>{item.label}</span>
                    <span className="annotation">open</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between border-b border-[var(--color-border)] py-4 text-sm ${
                      isNavActive(item.href)
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-foreground)]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="annotation">{isNavActive(item.href) ? "active" : "open"}</span>
                  </Link>
                ),
              )}
              <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-[var(--color-border)] py-4 text-sm text-[var(--color-foreground)]">
                <span>Sign in</span><span className="annotation">secure access</span>
              </Link>
              <Link href="/account?mode=signup&next=/dashboard" onClick={() => setMenuOpen(false)} className="button-link mt-4" data-variant="solid">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
