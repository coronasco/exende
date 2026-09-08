import { BrandMark } from "@/components/brand-mark";
import Link from "next/link";

const footerGroups = [
  {
    label: "Data products",
    links: [
      { label: "Jobs & Hiring Data", href: "/products/jobs" },
      { label: "Jobs API docs", href: "/docs/jobs" },
      { label: "Public overview", href: "/docs/jobs#public-overview" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "Infrastructure",
    links: [
      { label: "Callback API", href: "/products/callback" },
      { label: "Retry API", href: "/products/retry" },
      { label: "Resolve API", href: "/products/resolve" },
    ],
  },
  {
    label: "Documentation",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API index", href: "/api" },
      { label: "x402 payments", href: "/docs/x402" },
      { label: "Account access", href: "/account" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell site-footer__content grid gap-10 py-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:py-16">
        <div>
          <BrandMark className="w-fit" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-[var(--color-muted)]">
            Public hiring data, observed over time. Built for market research, recruiting analytics,
            data products, and autonomous software.
          </p>
          <Link href="/products/jobs" className="text-link mt-6 text-sm">
            Explore the Jobs & Hiring Data product
          </Link>
        </div>

        <nav className="grid gap-8 sm:grid-cols-3 lg:justify-self-end lg:gap-12" aria-label="Footer navigation">
          {footerGroups.map((group) => (
            <div key={group.label}>
              <p className="annotation text-[var(--color-accent)]">{group.label}</p>
              <ul className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="site-footer__base border-t border-[var(--color-border)]">
        <div className="page-shell site-footer__base-inner py-5 text-xs text-[var(--color-muted)]">
          <p>© {new Date().getUTCFullYear()} Exende. Public data infrastructure.</p>
          <nav className="site-footer__legal" aria-label="Legal and support">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <a href="mailto:support@exende.dev">Support</a>
          </nav>
          <p className="font-mono">Jobs data first · Agent infrastructure included</p>
        </div>
      </div>
    </footer>
  );
}
