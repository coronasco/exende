import { DocsMobileNav } from "@/components/docs-mobile-nav";
import { DocsSearch } from "@/components/docs-search";
import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsToc } from "@/components/docs-toc";
import { DocsContractScene } from "@/components/exende-visuals";
import { docsSequence } from "@/content/docs";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

type DocsFrameProps = {
  currentHref: string;
  title: string;
  intro: string;
  toc?: readonly { id: string; label: string }[];
  children: React.ReactNode;
};

export function DocsFrame({ currentHref, title, intro, toc = [], children }: DocsFrameProps) {
  const currentIndex = docsSequence.findIndex((item) => item.href === currentHref);
  const previous = currentIndex > 0 ? docsSequence[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < docsSequence.length - 1
    ? docsSequence[currentIndex + 1]
    : null;

  return (
    <div className="docs-shell">
      <DocsContractScene />
      <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4 min-[900px]:hidden">
        <div>
          <p className="annotation text-[var(--color-muted)]">Exende Docs</p>
          <p className="mt-2 text-sm text-[var(--color-foreground)]">{title}</p>
        </div>
        <DocsMobileNav currentHref={currentHref} />
      </div>

      <div className="docs-grid">
        <DocsSidebar currentHref={currentHref} />

        <article className="docs-article">
          <DocsSearch />
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
            <Link href="/" className="hover:text-[var(--color-accent)]">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/docs" className="hover:text-[var(--color-accent)]">Docs</Link>
            {currentHref !== "/docs" ? <><ChevronRight className="h-3 w-3" /><span aria-current="page" className="text-white">{title}</span></> : null}
          </nav>
          <div className="mb-6 flex flex-wrap gap-2" aria-label="Documentation product switcher">
            <Link href="/docs/jobs" className="docs-product-switch" data-active={currentHref === "/docs/jobs"}>Jobs Data</Link>
            <Link href="/docs/callback" className="docs-product-switch" data-active={currentHref === "/docs/callback"}>Callback</Link>
            <Link href="/docs/retry" className="docs-product-switch" data-active={currentHref === "/docs/retry"}>Retry</Link>
            <Link href="/docs/resolve" className="docs-product-switch" data-active={currentHref === "/docs/resolve"}>Resolve</Link>
          </div>
          <header className="border-b border-[var(--color-border)] pb-8">
            <h1 className="font-condensed text-[3.2rem] font-semibold uppercase leading-[0.92] tracking-[-0.02em] text-white sm:text-[4rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">{intro}</p>
            <p className="annotation mt-5 text-[var(--color-muted)]">Updated September 6, 2026</p>
          </header>

          <div className="pt-8">{children}</div>

          <nav className="mt-14 grid gap-3 border-t border-[var(--color-border)] pt-7 sm:grid-cols-2" aria-label="Documentation pagination">
            {previous ? (
              <Link href={previous.href} className="docs-page-link">
                <ArrowLeft className="h-4 w-4" />
                <span><small>Previous</small>{previous.label}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={next.href} className="docs-page-link justify-end text-right">
                <span><small>Next</small>{next.label}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </nav>
        </article>

        <DocsToc sections={toc} />
      </div>
    </div>
  );
}
