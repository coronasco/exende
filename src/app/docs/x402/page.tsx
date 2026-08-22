import { CodeBlock } from "@/components/code-block";
import { DocsFrame } from "@/components/docs-frame";
import { x402Facts } from "@/content/docs";
import { codeExamples, responseExamples } from "@/content/examples";
import { siteConfig } from "@/content/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "x402 Payments",
  alternates: { canonical: "/docs/x402" },
};

const toc = [
  { id: "flow", label: "Flow" },
  { id: "configuration", label: "Configuration" },
  { id: "discovery", label: "Bazaar discovery" },
] as const;

export default function X402DocsPage() {
  return (
    <DocsFrame
      currentHref="/docs/x402"
      title="x402 Payments"
      intro="Exende uses x402 to charge directly at the HTTP request layer. There are no Exende accounts, API keys, prepaid credits or subscriptions."
      toc={toc}
    >
      <section id="flow" className="surface-rule pt-8">
        <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white">
          Flow
        </h2>
        <ol className="mt-5 space-y-3 text-[1rem] leading-8 text-[var(--color-muted)]">
          <li>1. Client sends POST /v1/callbacks.</li>
          <li>2. Exende responds HTTP 402 with PAYMENT-REQUIRED.</li>
          <li>3. x402-compatible client authorizes payment.</li>
          <li>4. Request is retried with payment.</li>
          <li>5. Payment is verified and settled.</li>
          <li>6. Exende returns HTTP 201 with the callback.</li>
        </ol>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CodeBlock code={codeExamples.x402Challenge} language="http" title="HTTP 402 response" />
          <CodeBlock code={responseExamples.x402DecodedSummary} language="json" title="Decoded challenge summary" />
        </div>
      </section>

      <section id="configuration" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white">
          Current production configuration
        </h2>
        <table className="spec-table mt-4">
          <tbody>
            {x402Facts.map(([label, value]) => (
              <tr key={label}>
                <th>{label}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">
          The x402 payment is required only when creating the callback. Reading events, waiting for
          events, receiving webhooks, and deleting an existing callback do not require another
          payment.
        </p>
      </section>

      <section id="discovery" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white">
          Bazaar discovery
        </h2>
        <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">
          Exende is discoverable through Coinbase x402 Bazaar. x402-compatible clients and agents
          can discover and purchase the API programmatically through Coinbase x402 Bazaar.
        </p>
        <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4">
          <p className="annotation text-[var(--color-accent)]">Live resource</p>
          <p className="mt-3 font-mono text-[0.9rem] text-white">{siteConfig.apiBase}/v1/callbacks</p>
          <p className="mt-2 text-[0.95rem] leading-7 text-[var(--color-muted)]">
            Payment metadata and Bazaar discovery details are exposed from the live create endpoint.
          </p>
        </div>
      </section>
    </DocsFrame>
  );
}
