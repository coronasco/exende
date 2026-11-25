"use client";

import { DocsNavigation } from "@/components/docs-sidebar";
import { BookOpen, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type DocsMobileNavProps = {
  currentHref: string;
};

export function DocsMobileNav({ currentHref }: DocsMobileNavProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
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
          'a[href], summary, button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(element => element.getClientRects().length > 0);
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
              <strong className="guide-drawer-title"><BookOpen size={19} /> Documentation</strong>
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

            <div className="min-h-0 flex-1 overflow-y-auto pb-8">
              <DocsNavigation currentHref={currentHref} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
