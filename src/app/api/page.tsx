import { apiEndpointRows, productionSurface } from "@/content/docs";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "API",
  alternates: { canonical: "/api" },
};

const methodColors: Record<string, string> = {
  POST: "text-emerald-300",
  PUT: "text-amber-300",
  PATCH: "text-fuchsia-300",
  GET: "text-sky-300",
  DELETE: "text-rose-300",
};

export default function ApiPage() {
  return (
    <div className="page-shell py-8 sm:py-10">
      <div className="mx-auto max-w-[1040px]">
        <header className="border-b border-[var(--color-border)] pb-8">
          <p className="annotation text-[var(--color-muted)]">Reference</p>
          <h1 className="font-display mt-5 text-[2.7rem] leading-[0.96] tracking-[-0.04em] text-white sm:text-[3.5rem]">
            Exende API
          </h1>
          <p className="mt-5 text-[1rem] leading-8 text-[var(--color-muted)]">
            HTTP infrastructure for autonomous software.
          </p>
        </header>

        <section className="surface-rule pt-8">
          <table className="spec-table">
            <tbody>
              {productionSurface.map(([label, value]) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td className="font-mono text-[0.9rem]">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">
            Callback management and authenticated reads use api.exende.dev. Public webhook
            delivery uses cb.exende.dev.
          </p>
        </section>

        <section className="surface-rule mt-12 pt-8">
          <p className="annotation text-[var(--color-muted)]">Live endpoints</p>
          <div className="mt-5 overflow-x-auto">
            <table className="spec-table min-w-full">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Path</th>
                  <th>Purpose</th>
                  <th>Auth / Payment</th>
                </tr>
              </thead>
              <tbody>
                {apiEndpointRows.map(([method, path, purpose, requirement]) => (
                  <tr key={`${method}-${path}`}>
                    <td>
                      <span className={`method-chip ${methodColors[method] ?? "text-white"}`}>{method}</span>
                    </td>
                    <td className="font-mono text-[0.85rem] text-white">{path}</td>
                    <td className="text-[var(--color-muted)]">{purpose}</td>
                    <td className="text-[var(--color-muted)]">{requirement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">
            Only POST /v1/callbacks requires x402 payment. Webhook delivery, event reads, waiting,
            and deletion do not trigger another payment.
          </p>
        </section>

        <section className="surface-rule mt-12 flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="annotation text-[var(--color-muted)]">Next</p>
            <p className="mt-2 text-[1rem] leading-8 text-[var(--color-muted)]">
              Read the full Callback API documentation.
            </p>
          </div>
          <Link href="/docs/callback" className="button-link" data-variant="accent">
            Read Callback documentation
          </Link>
        </section>
      </div>
    </div>
  );
}
