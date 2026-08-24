"use client";

import { BrandMark } from "@/components/brand-mark";
import { topNav } from "@/content/site";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="page-shell flex h-[72px] items-center justify-between gap-6">
        <BrandMark />

        <nav className="hidden h-full items-center gap-12 md:flex" aria-label="Primary navigation">
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
                data-active={pathname.startsWith(item.href)}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

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
                      pathname.startsWith(item.href)
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-foreground)]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="annotation">{pathname.startsWith(item.href) ? "active" : "open"}</span>
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
