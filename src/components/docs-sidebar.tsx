import { docsGroups } from "@/content/docs";
import { BookOpen, Braces, BriefcaseBusiness, ChartNoAxesCombined, ChevronDown, CreditCard, FileSearch, MailCheck, RefreshCw, Rocket, Webhook } from "lucide-react";
import Link from "next/link";

const icons = {
  "/docs": Rocket, "/docs/jobs": BriefcaseBusiness, "/docs/jobs-intelligence": ChartNoAxesCombined,
  "/docs/test-inbox": MailCheck, "/docs/callback": Webhook, "/docs/retry": RefreshCw,
  "/docs/resolve": FileSearch, "/docs/x402": CreditCard, "/api": Braces,
} as const;

export function DocsSidebar({ currentHref }: { currentHref: string }) {
  return <aside className="docs-sidebar">
    <Link href="/docs" className="guide-sidebar-title"><BookOpen size={19} /> Documentation</Link>
    <DocsNavigation currentHref={currentHref} />
  </aside>;
}

export function DocsNavigation({ currentHref, onNavigate }: { currentHref: string; onNavigate?: () => void }) {
  return <nav aria-label="Documentation sections">
      {docsGroups.map((group, index) => {
        const path = group.items[0].href.split("#")[0] as keyof typeof icons;
        const Icon = icons[path];
        const links = group.items.map(item => {
          const current = item.href === currentHref;
          return <Link onClick={onNavigate} key={item.href} className="docs-nav-link" href={item.href} data-active={current} aria-current={current ? "page" : undefined}>{item.label}</Link>;
        });
        if (index === 0) return <div key={group.label} className="guide-start">{links}</div>;
        return <details key={group.label} className="guide-group" open={currentHref === path}>
          <summary><Icon size={16} /><span>{group.label}</span><ChevronDown size={13} /></summary>
          <div>{links}</div>
        </details>;
      })}
    </nav>;
}
