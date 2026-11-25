import { DocsMobileNav } from "@/components/docs-mobile-nav";
import { DocsSearch } from "@/components/docs-search";
import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsToc } from "@/components/docs-toc";
import { ProtocolFigure } from "@/components/product/protocol-figure";
import { docsSequence } from "@/content/docs";
import { ArrowLeft, ArrowRight, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import "./docs-guide.css";

const guides = {
  "/docs": "network", "/docs/jobs": "records", "/docs/jobs-intelligence": "intelligence",
  "/docs/callback": "callback", "/docs/retry": "retry", "/docs/resolve": "resolve",
  "/docs/test-inbox": "inbox", "/docs/x402": "payment",
} as const;

type DocsFrameProps = {
  currentHref: keyof typeof guides;
  title: string;
  intro: string;
  toc?: readonly { id: string; label: string }[];
  updatedAt?: string;
  children: React.ReactNode;
};

export function DocsFrame({ currentHref, title, intro, toc = [], updatedAt = "September 8, 2026", children }: DocsFrameProps) {
  const currentIndex = docsSequence.findIndex(item => item.href === currentHref);
  const previous = currentIndex > 0 ? docsSequence[currentIndex - 1] : null;
  const next = currentIndex >= 0 ? docsSequence[currentIndex + 1] : null;

  return <div className="docs-shell exende-guide">
    <div className="guide-mobile-bar"><span><BookOpen size={16} /> Documentation</span><DocsMobileNav currentHref={currentHref} /></div>
    <div className="docs-grid">
      <DocsSidebar currentHref={currentHref} />
      <article className="docs-article">
        <div className="guide-tools">
          <nav aria-label="Breadcrumb" className="guide-crumb">
            <Link href="/">Exende</Link><ChevronRight />
            {currentHref === "/docs" ? <span aria-current="page">Docs</span> :
              <><Link href="/docs">Docs</Link><ChevronRight /><span aria-current="page">{title}</span></>}
          </nav>
          <DocsSearch />
        </div>
        <header className="guide-cover">
          <div className="guide-title"><h1>{title}</h1><p>{intro}</p><small>Updated {updatedAt}</small></div>
          <div className="guide-diagram" aria-hidden="true"><ProtocolFigure kind={guides[currentHref]} /></div>
        </header>
        <div className="guide-content">{children}</div>
        <nav className="guide-pager" aria-label="Documentation pagination">
          {previous ? <Link href={previous.href} className="docs-page-link"><ArrowLeft size={17} /><span><small>Previous</small>{previous.label}</span></Link> : <span />}
          {next && <Link href={next.href} className="docs-page-link justify-end text-right"><span><small>Next</small>{next.label}</span><ArrowRight size={17} /></Link>}
        </nav>
      </article>
      <DocsToc sections={toc} />
    </div>
  </div>;
}
