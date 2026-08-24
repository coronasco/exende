"use client";

import { docsGroups } from "@/content/docs";
import { Braces, CreditCard, Menu, RefreshCw, Rocket, Webhook, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type DocsMobileNavProps = {
  currentHref: string;
};

export function DocsMobileNav({ currentHref }: DocsMobileNavProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const icons = {
    "/docs": Rocket,
    "/docs/callback": Webhook,
    "/docs/retry": RefreshCw,
    "/docs/x402": CreditCard,
    "/api": Braces,
  } as const;

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="button-link min-w-0 px-4 py-3 min-[900px]:hidden"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="docs-mobile-navigation"
      >
        <Menu className="h-4 w-4" />
        Menu
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-[rgba(6,8,13,0.8)] min-[900px]:hidden" onClick={() => setOpen(false)}>
          <div
            ref={panelRef}
            id="docs-mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Documentation navigation"
            className="absolute inset-y-0 left-0 flex w-[84vw] max-w-sm flex-col border-r border-[var(--color-border)] bg-[var(--color-background)] p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-display text-[1.5rem] tracking-[0.08em] text-[var(--color-foreground)]">EXENDE</p>
                <p className="annotation mt-2 text-[var(--color-muted)]">Documentation</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center border border-[var(--color-border)] text-[var(--color-foreground)]"
                onClick={() => setOpen(false)}
                aria-label="Close documentation navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pb-8">
              {docsGroups.map((group) => (
                <div key={group.label}>
                  <p className="annotation py-2 text-[var(--color-muted)]">{group.label}</p>
                  {group.items.map((item) => {
                    const baseHref = item.href.split("#")[0] as keyof typeof icons;
                    const active = !item.href.includes("#") && baseHref === currentHref;
                    const Icon = icons[baseHref];

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between border-b border-[var(--color-border)] py-3 text-sm ${
                          active ? "text-[var(--color-accent)]" : "text-[var(--color-foreground)]"
                        }`}
                      >
                        <span className="flex items-center gap-3"><Icon className="h-4 w-4" />{item.label}</span>
                        <span className="annotation">{active ? "active" : "open"}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
