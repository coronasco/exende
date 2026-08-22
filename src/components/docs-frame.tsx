import { DocsMobileNav } from "@/components/docs-mobile-nav";
import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsToc } from "@/components/docs-toc";

type DocsFrameProps = {
  currentHref: string;
  title: string;
  intro: string;
  toc?: readonly { id: string; label: string }[];
  children: React.ReactNode;
};

export function DocsFrame({ currentHref, title, intro, toc = [], children }: DocsFrameProps) {
  return (
    <div className="page-shell py-8 sm:py-10">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5 md:hidden">
        <div>
          <p className="annotation text-[var(--color-muted)]">Exende Docs</p>
          <p className="mt-2 text-sm text-[var(--color-foreground)]">{title}</p>
        </div>
        <DocsMobileNav currentHref={currentHref} />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[180px_minmax(0,1fr)] xl:grid-cols-[180px_minmax(0,760px)_180px]">
        <DocsSidebar currentHref={currentHref} />

        <article className="min-w-0">
          <header className="border-b border-[var(--color-border)] pb-8">
            <p className="annotation text-[var(--color-muted)]">Docs</p>
            <h1 className="font-display mt-5 text-[2.6rem] leading-[0.96] tracking-[-0.04em] text-white sm:text-[3.3rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">{intro}</p>
          </header>

          <div className="pt-10">{children}</div>
        </article>

        <DocsToc sections={toc} />
      </div>
    </div>
  );
}
