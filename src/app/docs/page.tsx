import { DocsFrame } from "@/components/docs-frame";
import { callbackFacts } from "@/content/docs";
import { siteConfig } from "@/content/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation",
  alternates: { canonical: "/docs" },
};

const toc = [
  { id: "callback-api", label: "Callback API" },
  { id: "links", label: "Resources" },
] as const;

export default function DocsOverviewPage() {
  return (
    <DocsFrame
      currentHref="/docs"
      title="Exende Documentation"
      intro="Exende provides infrastructure APIs designed for autonomous software and AI agents. Callback creation is accessed directly over HTTP and paid per request using x402."
      toc={toc}
    >
      <section id="callback-api" className="surface-rule pt-8">
        <p className="annotation text-[var(--color-muted)]">First live API</p>
        <h2 className="font-display mt-4 text-[2rem] leading-tight tracking-[-0.04em] text-white">
          Callback API
        </h2>
        <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">
          Create a temporary public webhook endpoint, give it to an external service, and wait for
          the asynchronous result.
        </p>

        <table className="spec-table mt-8">
          <tbody>
            {callbackFacts.map((fact) => (
              <tr key={fact.label}>
                <th>{fact.label}</th>
                <td>{fact.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="links" className="surface-rule mt-12 pt-8">
        <p className="annotation text-[var(--color-muted)]">Explore</p>
        <div className="mt-4 grid gap-3">
          <Link
            href="/docs/callback"
            className="flex items-center justify-between border-b border-[var(--color-border)] py-4 text-sm text-white transition hover:text-[var(--color-accent)]"
          >
            <span>Read Callback API docs</span>
            <span className="annotation">/docs/callback</span>
          </Link>
          <Link
            href="/docs/x402"
            className="flex items-center justify-between border-b border-[var(--color-border)] py-4 text-sm text-white transition hover:text-[var(--color-accent)]"
          >
            <span>Understand x402</span>
            <span className="annotation">/docs/x402</span>
          </Link>
          <a
            href={siteConfig.openapiUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between border-b border-[var(--color-border)] py-4 text-sm text-white transition hover:text-[var(--color-accent)]"
          >
            <span>OpenAPI specification</span>
            <span className="annotation">openapi.json</span>
          </a>
        </div>
      </section>
    </DocsFrame>
  );
}
