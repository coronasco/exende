import { docsGroups } from "@/content/docs";
import { BookOpen, Braces, CreditCard, RefreshCw, Rocket, Webhook } from "lucide-react";
import Link from "next/link";

type DocsSidebarProps = {
  currentHref: string;
};

export function DocsSidebar({ currentHref }: DocsSidebarProps) {
  const icons = {
    "/docs": Rocket,
    "/docs/callback": Webhook,
    "/docs/retry": RefreshCw,
    "/docs/x402": CreditCard,
    "/api": Braces,
  } as const;

  return (
    <aside className="docs-sidebar">
      <div className="relative z-10 pb-6 pt-4">
        <p className="docs-sidebar__title flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.17em] text-[var(--color-muted)]">
          <BookOpen className="h-4 w-4" /> Documentation
        </p>
        <nav className="docs-sidebar__nav" aria-label="Documentation sections">
          {docsGroups.map((group) => (
            <div key={group.label} className="docs-sidebar__group">
              <p className="docs-sidebar__group-label font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {group.label}
              </p>
              {group.items.map((item, itemIndex) => {
                const baseHref = item.href.split("#")[0] as keyof typeof icons;
                const active = !item.href.includes("#") && baseHref === currentHref;
                const Icon = icons[baseHref];

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="docs-nav-link"
                    data-active={active}
                    data-child={item.href.includes("#")}
                  >
                    {itemIndex === 0 ? <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} /> : <span className="docs-nav-link__marker" />}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
