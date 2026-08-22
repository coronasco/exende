import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[calc(100dvh-4rem)] items-center justify-center py-20">
      <div className="w-full max-w-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-8 text-center sm:px-8">
        <p className="annotation text-[var(--color-muted)]">404</p>
        <h1 className="font-display mt-4 text-[2.5rem] leading-[0.96] tracking-[-0.04em] text-white">
          Page not found
        </h1>
        <p className="mt-4 text-[1rem] leading-8 text-[var(--color-muted)]">
          The requested page does not exist in the current Exende site structure.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="button-link">
            Home
          </Link>
          <Link href="/docs" className="button-link" data-variant="accent">
            Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
