import { BrandMark } from "@/components/brand-mark";
import { siteConfig } from "@/content/site";
import Link from "next/link";

const footerGroups = [
  {
    label: "Products",
    links: [
      { label: "Callback API", href: "/products/callback" },
      { label: "Retry API", href: "/products/retry" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "Documentation",
    links: [
      { label: "Callback docs", href: "/docs/callback" },
      { label: "Retry docs", href: "/docs/retry" },
      { label: "x402 payments", href: "/docs/x402" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-[minmax(0,1fr)_auto] md:py-16">
        <div>
          <BrandMark className="w-fit" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-[var(--color-muted)]">
            HTTP infrastructure for AI agents and automated workflows. Pay per resource with x402
            on Base Mainnet.
          </p>
          <a
            href={siteConfig.bazaarSearch}
            target="_blank"
            rel="noreferrer"
            className="text-link mt-6 text-sm"
          >
            View verified resources in x402 Bazaar
          </a>
        </div>

        <nav className="grid gap-8 sm:grid-cols-2 md:w-[440px] md:justify-self-end md:gap-14 lg:w-[500px] lg:gap-20" aria-label="Footer navigation">
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
      <div className="border-t border-[var(--color-border)]">
        <div className="page-shell flex flex-col gap-2 py-5 text-xs text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getUTCFullYear()} Exende. Agent-native infrastructure.</p>
          <p className="font-mono">x402 v2 · Base Mainnet</p>
        </div>
      </div>
    </footer>
  );
}
