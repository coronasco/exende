import { CodeBlock } from "@/components/code-block";
import { DocsFrame } from "@/components/docs-frame";
import { JsonLd } from "@/components/json-ld";
import {
  authenticatedCallbackErrorRows,
  callbackErrorRows,
  callbackFacts,
  callbackFieldRows,
  waitErrorRows,
  webhookErrorRows,
} from "@/content/docs";
import { codeExamples, responseExamples } from "@/content/examples";
import { siteConfig } from "@/content/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Callback API documentation",
  description:
    "Complete Exende Callback API reference: x402 creation, webhook delivery, event reads, long polling, errors, limits, and examples.",
  alternates: { canonical: "/docs/callback" },
  openGraph: {
    title: "Exende Callback API documentation",
    description: "Canonical reference for temporary callback endpoints and captured webhook events.",
    url: "/docs/callback",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende Callback API documentation",
    description: "Canonical reference for temporary callback endpoints and captured webhook events.",
    images: ["/twitter-image"],
  },
};

const toc = [
  { id: "create-callback", label: "Create Callback" },
  { id: "send-webhook", label: "Send a Webhook" },
  { id: "wait-event", label: "Wait for an Event" },
  { id: "read-events", label: "Read All Events" },
  { id: "delete-callback", label: "Delete Callback" },
  { id: "expiration", label: "Expiration" },
  { id: "limits", label: "Limits" },
  { id: "errors", label: "Errors" },
  { id: "workflow", label: "Typical AI Agent Workflow" },
  { id: "openapi", label: "OpenAPI specification" },
] as const;

export default function CallbackDocsPage() {
  return (
    <DocsFrame
      currentHref="/docs/callback"
      title="Callback API"
      intro="Temporary public webhook endpoints for AI agents, scripts and automated workflows."
      toc={toc}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Exende Callback API documentation",
          description: "Canonical Callback API v1 documentation.",
          url: `${siteConfig.url}/docs/callback`,
          dateModified: "2026-08-24",
          author: { "@type": "Organization", name: "Exende" },
        }}
      />
      <section id="create-callback" className="surface-rule pt-8">
        <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white">
          Create Callback
        </h2>
        <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">
          Create a callback, give the public callback URL to an external service, then read or wait
          for the resulting events. No account, API key or subscription is required. Callback
          creation is paid per request using x402.
        </p>
        <div className="mt-6">
          <p className="annotation text-[var(--color-muted)]">Endpoint</p>
          <p className="mt-2 font-mono text-[0.95rem] text-white">
            POST {siteConfig.apiBase}/v1/callbacks
          </p>
        </div>
        <p className="mt-5 text-[1rem] leading-8 text-[var(--color-muted)]">
          Without a valid x402 payment, the server responds with HTTP 402 Payment Required. This is
          the only operation that requires payment; receiving webhooks, reading events, waiting,
          and deleting the callback do not trigger another x402 payment.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/products/callback" className="button-link">Callback product</Link>
          <Link href="/pricing" className="button-link">Pricing</Link>
          <Link href={siteConfig.callbackOpenApi} className="button-link" data-variant="accent">OpenAPI</Link>
        </div>
        <CodeBlock code={codeExamples.createCallback} language="bash" title="Create callback" />
        <div className="mt-6">
          <p className="annotation text-[var(--color-muted)]">Payment-required advertises</p>
          <table className="spec-table mt-3">
            <tbody>
              <tr>
                <th>x402 version</th>
                <td>2</td>
              </tr>
              <tr>
                <th>Network</th>
                <td>Base Mainnet</td>
              </tr>
              <tr>
                <th>CAIP-2</th>
                <td>eip155:8453</td>
              </tr>
              <tr>
                <th>Asset</th>
                <td>USDC</td>
              </tr>
              <tr>
                <th>Price</th>
                <td>$0.01</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <CodeBlock code={responseExamples.createdCallback} language="json" title="HTTP 201 response" />
        </div>
        <table className="spec-table mt-6">
          <thead>
            <tr>
              <th>Field</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {callbackFieldRows.map(([field, meaning]) => (
              <tr key={field}>
                <td className="font-mono text-[0.82rem] text-white">{field}</td>
                <td className="text-[var(--color-muted)]">{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4">
          <p className="annotation text-[var(--color-accent)]">Security note</p>
          <p className="mt-3 text-[0.98rem] leading-7 text-[var(--color-muted)]">
            The read_token is secret. Never give it to the service sending the webhook. Only
            callback_url is public.
          </p>
        </div>
      </section>

      <section id="send-webhook" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white">
          Send a Webhook
        </h2>
        <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">
          The external service sends an event using POST, PUT, or PATCH on the callback host:{" "}
          {siteConfig.callbackBase}/hooks/{"{callback_id}"}.
        </p>
        <CodeBlock code={codeExamples.sendWebhook} language="bash" title="Webhook event" />
        <div className="mt-6">
          <CodeBlock code={responseExamples.webhookAccepted} language="json" title="Successful response" />
        </div>
        <table className="spec-table mt-6">
          <tbody>
            <tr>
              <th>Supported payload types</th>
              <td>application/json, text/*, application/x-www-form-urlencoded</td>
            </tr>
            <tr>
              <th>Missing Content-Type</th>
              <td>Accepted and stored as text</td>
            </tr>
            <tr>
              <th>Event cap</th>
              <td>10 events per callback</td>
            </tr>
            <tr>
              <th>Event ID format</th>
              <td className="font-mono text-[0.82rem]">{"^evt_[a-f0-9]{32}$"}</td>
            </tr>
            <tr>
              <th>Rate limit</th>
              <td>30 requests per 60 seconds per callback</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">
          JSON bodies are validated before storage. Binary and file uploads are not supported. Only
          content-type, user-agent, stripe-signature, svix-id, svix-timestamp, svix-signature,
          x-hub-signature, x-hub-signature-256, webhook-id, webhook-timestamp, webhook-signature,
          x-signature, and x-webhook-signature headers are retained.
        </p>
        <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">
          Callback ID validation and per-callback rate limiting run before callback lookup and body
          parsing. POST, PUT, and PATCH use the same handler and return the same response and error
          shapes.
        </p>
        <table className="spec-table mt-6">
          <thead>
            <tr>
              <th>Status</th>
              <th>Webhook error</th>
            </tr>
          </thead>
          <tbody>
            {webhookErrorRows.map(([status, code]) => (
              <tr key={`${status}-${code}`}>
                <td className="font-mono text-[0.82rem] text-white">{status}</td>
                <td className="font-mono text-[0.82rem] text-[var(--color-muted)]">{code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="wait-event" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white">
          Wait for an Event
        </h2>
        <p className="mt-4 font-mono text-[0.95rem] text-white">
          GET {siteConfig.apiBase}/v1/callbacks/{"{id}"}/wait
        </p>
        <p className="mt-3 text-[1rem] leading-8 text-[var(--color-muted)]">
          Authentication: Authorization: Bearer ex_cb_sk_...
        </p>
        <CodeBlock code={codeExamples.waitForEvent} language="bash" title="Long poll" />
        <table className="spec-table mt-6">
          <tbody>
            <tr>
              <th>timeout</th>
              <td>
                Coerced with JavaScript Number. Missing or non-finite values default to 30. Finite
                values are floored, then clamped to 1–30 seconds. Examples: 1.9 → 1, 0 → 1, 31 →
                30, invalid → 30.
              </td>
            </tr>
            <tr>
              <th>after</th>
              <td>Optional event ID; wait only for the next event after it</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CodeBlock code={responseExamples.waitReceived} language="json" title="Event received" />
          <CodeBlock code={responseExamples.waitTimeout} language="json" title="Timed out" />
        </div>
        <p className="mt-5 text-[1rem] leading-8 text-[var(--color-muted)]">
          When an event is received, the response includes received: true, timeout: false, the full
          event object, and a relative next_wait_url. A timeout returns received: false, timeout:
          true, and after as the supplied event ID or null. An unknown after event returns HTTP 404
          EVENT_NOT_FOUND.
        </p>
        <table className="spec-table mt-6">
          <thead>
            <tr>
              <th>Status</th>
              <th>Wait error</th>
            </tr>
          </thead>
          <tbody>
            {waitErrorRows.map(([status, code]) => (
              <tr key={`${status}-${code}`}>
                <td className="font-mono text-[0.82rem] text-white">{status}</td>
                <td className="font-mono text-[0.82rem] text-[var(--color-muted)]">{code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="read-events" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white">
          Read All Events
        </h2>
        <p className="mt-4 font-mono text-[0.95rem] text-white">
          GET {siteConfig.apiBase}/v1/callbacks/{"{id}"}/events
        </p>
        <p className="mt-3 text-[1rem] leading-8 text-[var(--color-muted)]">
          Authentication: Authorization: Bearer ex_cb_sk_...
        </p>
        <CodeBlock code={codeExamples.readEvents} language="bash" title="Read events" />
        <div className="mt-6">
          <CodeBlock code={responseExamples.events} language="json" title="Events response" />
        </div>
        <p className="mt-5 text-[1rem] leading-8 text-[var(--color-muted)]">
          Returns callback_id, status, expires_at, event_count, and all stored events ordered by
          received_at ascending. Each event includes id, received_at, method, content_type, filtered
          headers, body, and size_bytes. JSON bodies are returned as parsed JSON; text and form
          bodies remain strings. Events with the same second-level received_at timestamp preserve
          deterministic receipt order. Events are read-only.
        </p>
        <table className="spec-table mt-6">
          <thead>
            <tr>
              <th>Status</th>
              <th>Events error</th>
            </tr>
          </thead>
          <tbody>
            {authenticatedCallbackErrorRows.map(([status, code]) => (
              <tr key={`${status}-${code}`}>
                <td className="font-mono text-[0.82rem] text-white">{status}</td>
                <td className="font-mono text-[0.82rem] text-[var(--color-muted)]">{code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="delete-callback" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white">
          Delete Callback
        </h2>
        <p className="mt-4 font-mono text-[0.95rem] text-white">
          DELETE {siteConfig.apiBase}/v1/callbacks/{"{id}"}
        </p>
        <p className="mt-3 text-[1rem] leading-8 text-[var(--color-muted)]">
          Authentication: Authorization: Bearer ex_cb_sk_...
        </p>
        <CodeBlock code={codeExamples.deleteCallback} language="bash" title="Delete callback" />
        <div className="mt-6">
          <CodeBlock code={responseExamples.deleted} language="json" title="Delete response" />
        </div>
        <p className="mt-5 text-[1rem] leading-8 text-[var(--color-muted)]">
          Deletes the callback and its stored events before automatic expiration.
        </p>
        <table className="spec-table mt-6">
          <thead>
            <tr>
              <th>Status</th>
              <th>Delete error</th>
            </tr>
          </thead>
          <tbody>
            {authenticatedCallbackErrorRows.map(([status, code]) => (
              <tr key={`${status}-${code}`}>
                <td className="font-mono text-[0.82rem] text-white">{status}</td>
                <td className="font-mono text-[0.82rem] text-[var(--color-muted)]">{code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="expiration" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white">
          Expiration
        </h2>
        <p className="mt-4 text-[1rem] leading-8 text-[var(--color-muted)]">
          Callbacks live for 10 minutes. Expired callbacks are automatically cleaned up.
        </p>
      </section>

      <section id="limits" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white">
          Limits
        </h2>
        <table className="spec-table mt-4">
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

      <section id="errors" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white">
          Errors
        </h2>
        <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">
          These are the standard error codes used across the Callback API. Each endpoint section
          above lists the subset it can return.
        </p>
        <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">
          Authenticated routes validate the callback ID first, then the Authorization header and
          Bearer scheme, callback existence, read token, and expiration in that order.
        </p>
        <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">
          A missing Authorization header returns MISSING_AUTHORIZATION. A non-Bearer header returns
          INVALID_AUTHORIZATION. An empty or incorrect Bearer token returns INVALID_TOKEN.
        </p>
        <table className="spec-table mt-4">
          <thead>
            <tr>
              <th>Status</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>
            {callbackErrorRows.map(([status, code]) => (
              <tr key={`${status}-${code}`}>
                <td className="font-mono text-[0.82rem] text-white">{status}</td>
                <td className="font-mono text-[0.82rem] text-[var(--color-muted)]">{code}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6">
          <CodeBlock code={responseExamples.error} language="json" title="Error response shape" />
        </div>
        <p className="mt-5 text-[1rem] leading-8 text-[var(--color-muted)]">
          Error responses include request_id.
        </p>
      </section>

      <section id="workflow" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white">
          Typical AI Agent Workflow
        </h2>

        <div className="mt-6 hidden grid-cols-[repeat(9,minmax(0,1fr))] items-center gap-4 lg:grid">
          <div className="col-span-2 border border-[var(--color-border)] px-4 py-4 text-center font-mono text-[0.78rem] uppercase tracking-[0.14em] text-white">
            AI Agent
          </div>
          <div className="h-px bg-[var(--color-border-strong)]" />
          <div className="col-span-2 border border-[var(--color-accent)] px-4 py-4 text-center font-mono text-[0.78rem] uppercase tracking-[0.14em] text-white">
            Exende callback
          </div>
          <div className="h-px bg-[var(--color-border-strong)]" />
          <div className="col-span-2 border border-[var(--color-border)] px-4 py-4 text-center font-mono text-[0.78rem] uppercase tracking-[0.14em] text-white">
            External service
          </div>
          <div className="col-span-9 mt-4 grid grid-cols-[repeat(5,minmax(0,1fr))] gap-4 text-[0.86rem] leading-6 text-[var(--color-muted)]">
            <p>create Exende callback</p>
            <p>x402 payment</p>
            <p>receives callback_url + read_token</p>
            <p>service POSTs result to Exende</p>
            <p>agent calls /wait and continues</p>
          </div>
        </div>

        <div className="mt-6 space-y-3 lg:hidden">
          {[
            "AI Agent → create Exende callback",
            "x402 payment",
            "receives callback_url + read_token",
            "gives callback_url to external service",
            "external job runs asynchronously",
            "service POSTs result to Exende",
            "agent calls /wait",
            "result received",
            "workflow continues",
          ].map((item) => (
            <div key={item} className="border-b border-[var(--color-border)] py-3 text-[0.95rem] text-[var(--color-muted)]">
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-[1rem] leading-8 text-[var(--color-muted)]">
            An AI agent starts an asynchronous video generation job. The video service requires a
            webhook URL for completion. The agent creates an Exende callback for $0.01, passes
            callback_url to the video service, and waits using wait_url. When rendering finishes,
            the service sends the result to Exende and the agent continues automatically.
          </p>
          <ul className="space-y-2 text-[1rem] leading-8 text-[var(--color-muted)]">
            <li>asynchronous image/video generation</li>
            <li>long-running scraping jobs</li>
            <li>background processing</li>
            <li>payment notifications</li>
            <li>third-party webhook integrations</li>
            <li>agent workflows without a public server</li>
          </ul>
        </div>
      </section>

      <section id="openapi" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white">
          OpenAPI specification
        </h2>
        <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[var(--color-muted)]">
          The static OpenAPI 3.1 contract mirrors the production Callback surface and includes
          authentication, request and response schemas, errors, limits, and x402 payment notes.
        </p>
        <Link href={siteConfig.callbackOpenApi} className="button-link mt-6" data-variant="accent">
          Open Callback OpenAPI
        </Link>
      </section>
    </DocsFrame>
  );
}
