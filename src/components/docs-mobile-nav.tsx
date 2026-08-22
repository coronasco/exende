"use client";

import { docsNavigation } from "@/content/docs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type DocsMobileNavProps = {
  currentHref: string;
};

export function DocsMobileNav({ currentHref }: DocsMobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="button-link min-w-0 px-4 py-3 md:hidden" onClick={() => setOpen(true)}>
        <Menu className="h-4 w-4" />
        Menu
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-[rgba(6,8,13,0.8)] md:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute inset-y-0 left-0 w-[84vw] max-w-sm border-r border-[var(--color-border)] bg-[var(--color-background)] p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-display text-[1.5rem] tracking-[0.08em] text-[var(--color-foreground)]">EXENDE</p>
                <p className="annotation mt-2 text-[var(--color-muted)]">Documentation</p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center border border-[var(--color-border)] text-[var(--color-foreground)]"
                onClick={() => setOpen(false)}
                aria-label="Close documentation navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              {docsNavigation.map((item) => {
                const active = item.href === currentHref;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between border-b border-[var(--color-border)] py-3 text-sm ${
                      active ? "text-[var(--color-accent)]" : "text-[var(--color-foreground)]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="annotation">{active ? "active" : "open"}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
