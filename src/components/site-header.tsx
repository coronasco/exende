"use client";

import { topNav } from "@/content/site";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname === "/") {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[rgba(6,8,13,0.92)] backdrop-blur-md">
      <div className="page-shell flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-[1.9rem] font-semibold tracking-[0.08em] text-[var(--color-foreground)]"
        >
          EXENDE
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {topNav.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="annotation text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={`annotation transition ${
                  pathname.startsWith(item.href)
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-[var(--color-border)] text-[var(--color-foreground)] md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] md:hidden">
          <div className="page-shell py-4">
            <div className="grid gap-1">
              {topNav.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between border-b border-[var(--color-border)] py-3 text-sm text-[var(--color-foreground)]"
                  >
                    <span>{item.label}</span>
                    <span className="annotation">open</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between border-b border-[var(--color-border)] py-3 text-sm ${
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
