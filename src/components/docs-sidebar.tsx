import { docsNavigation } from "@/content/docs";
import Link from "next/link";

type DocsSidebarProps = {
  currentHref: string;
};

export function DocsSidebar({ currentHref }: DocsSidebarProps) {
  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] overflow-y-auto border-r border-[var(--color-border)] pr-6 md:block">
      <div className="space-y-7 pb-8">
        <div>
          <p className="annotation text-[var(--color-muted)]">Documentation</p>
        </div>

        <nav className="space-y-1">
          {docsNavigation.map((item) => {
            const active = item.href === currentHref;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block border-b border-[var(--color-border)] py-3 text-sm transition ${
                  active
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-foreground)] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
