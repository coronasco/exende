import { CodeBlock } from "@/components/code-block";
import { DocsFrame } from "@/components/docs-frame";
import { JsonLd } from "@/components/json-ld";
import { retryErrorRows, retryFacts } from "@/content/docs";
import { siteConfig } from "@/content/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Retry API v1 documentation",
  description:
    "Complete Exende Retry API v1 reference: x402 and API-key creation, lifecycle, status, attempt history, callbacks, backoff, errors, limits, and OpenAPI.",
  alternates: { canonical: "/docs/retry" },
  openGraph: {
    title: "Exende Retry API v1 documentation",
    description: "Canonical reference for durable outbound HTTP Retry jobs.",
    url: "/docs/retry",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende Retry API v1 documentation",
    description: "Canonical reference for durable outbound HTTP Retry jobs.",
    images: ["/twitter-image"],
  },
};

const toc = [
  { id: "overview", label: "Overview" },
  { id: "x402", label: "x402 quickstart" },
  { id: "create-job", label: "Create a Retry job" },
  { id: "lifecycle", label: "Lifecycle and status" },
  { id: "attempts", label: "Attempts and history" },
  { id: "terminal-callback", label: "Terminal callback" },
  { id: "policies", label: "Policies and idempotency" },
  { id: "account-operations", label: "API-key operations" },
  { id: "errors", label: "Errors and limits" },
  { id: "openapi", label: "OpenAPI and discovery" },
] as const;

const unpaidCreate = `curl -i -X POST \\
  ${siteConfig.retryApiBase}/v1/retries \\
  -H "Content-Type: application/json" \\
  --data '{
    "request": {
      "method": "GET",
      "url": "https://httpbin.org/status/204"
    },
    "retry": {
      "max_attempts": 8,
      "strategy": "exponential",
      "initial_delay_seconds": 5,
      "max_delay_seconds": 300
    }
  }'`;

const paidCreated = `{
  "id": "retry_0123456789abcdef0123456789abcdef",
  "status": "pending",
  "attempts": 0,
  "max_attempts": 8,
  "created_at": "2026-08-24T12:00:00.000Z",
  "next_attempt_at": "2026-08-24T12:00:00.000Z",
  "status_url": "https://retry.exende.dev/v1/retries/retry_0123456789abcdef0123456789abcdef",
  "read_token": "ex_retry_read_..."
}`;

const apiKeyCreate = `curl --fail-with-body -sS \\
  -X POST '${siteConfig.retryApiBase}/v1/retries' \\
  -H "Authorization: Bearer $EXENDE_API_KEY" \\
  -H 'Content-Type: application/json' \\
  -H 'Idempotency-Key: refresh-customer-42-v1' \\
  --data '{
    "request": {
      "method": "POST",
      "url": "https://api.example.com/customers/42/refresh",
      "headers": {"Content-Type":"application/json"},
      "body": {"source":"agent"}
    },
    "retry": {
      "max_attempts": 5,
      "strategy": "exponential",
      "initial_delay_seconds": 5,
      "max_delay_seconds": 120
    },
    "retry_status_codes": [408,425,429,500,502,503,504],
    "callback_url": "https://agent.example.com/events/exende",
    "callback_secret": "client-generated-secret-at-least-32-characters"
  }'`;

const readStatus = `curl --fail-with-body -sS \\
  '${siteConfig.retryApiBase}/v1/retries/retry_0123456789abcdef0123456789abcdef' \\
  -H "Authorization: Bearer ex_retry_read_..."`;

const statusResponse = `{
  "id": "retry_0123456789abcdef0123456789abcdef",
  "status": "retrying",
  "request": {"method":"POST","destination_host":"api.example.com"},
  "attempts": 1,
  "max_attempts": 5,
  "generation": 1,
  "retry": {
    "strategy": "exponential",
    "initial_delay_seconds": 5,
    "max_delay_seconds": 120
  },
  "last_status_code": 503,
  "last_error_code": null,
  "created_at": "2026-08-24T12:00:00.000Z",
  "updated_at": "2026-08-24T12:00:01.000Z",
  "next_attempt_at": "2026-08-24T12:00:06.000Z",
  "completed_at": null,
  "expires_at": "2026-08-25T12:00:00.000Z",
  "attempts_url": "https://retry.exende.dev/v1/retries/retry_0123456789abcdef0123456789abcdef/attempts"
}`;

const attemptsResponse = `{
  "retry_id": "retry_0123456789abcdef0123456789abcdef",
  "count": 2,
  "attempts": [
    {
      "attempt_number": 1,
      "outcome": "http_failure",
      "status_code": 503,
      "error_code": null,
      "duration_ms": 241,
      "retry_scheduled": true,
      "retry_delay_seconds": 5,
      "retry_after_seconds": null,
      "created_at": "2026-08-24T12:00:01.000Z"
    },
    {
      "attempt_number": 2,
      "outcome": "success",
      "status_code": 204,
      "error_code": null,
      "duration_ms": 198,
      "retry_scheduled": false,
      "retry_delay_seconds": null,
      "retry_after_seconds": null,
      "created_at": "2026-08-24T12:00:07.000Z"
    }
  ]
}`;

const callbackPayload = `{
  "event": "retry.succeeded",
  "retry_id": "retry_0123456789abcdef0123456789abcdef",
  "status": "succeeded",
  "attempts": 2,
  "max_attempts": 5,
  "last_status_code": 204,
  "last_error_code": null,
  "completed_at": "2026-08-24T12:02:00.000Z"
}`;

const callbackHeaders = `Content-Type: application/json
X-Exende-Event: retry.succeeded
X-Exende-Delivery: <stable-delivery-id>
X-Exende-Timestamp: <unix-seconds>
X-Exende-Signature: <hmac-sha256-signature>`;

const errorExample = `{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Human-readable explanation."
  }
}`;

const statusRows = [
  ["pending", "Created and awaiting its first execution claim."],
  ["running", "An outbound attempt currently owns the execution lease."],
  ["retrying", "A retryable failure was recorded and another attempt is scheduled."],
  ["succeeded", "A configured success status was received."],
  ["failed", "A terminal result occurred or attempts were exhausted."],
  ["cancelled", "An API-key client cancelled the job."],
  ["expired", "The 24-hour lifetime ended before completion."],
] as const;

export default function RetryDocsPage() {
  return (
    <DocsFrame
      currentHref="/docs/retry"
      title="Retry API v1"
      intro="Turn an outbound HTTPS request into a durable job with retry scheduling, recovery, status polling, attempt history, and an optional signed terminal callback."
      toc={toc}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Exende Retry API v1 documentation",
          description: "Canonical Retry API v1 documentation.",
          url: `${siteConfig.url}/docs/retry`,
          dateModified: "2026-08-24",
          author: { "@type": "Organization", name: "Exende" },
        }}
      />

      <section id="overview">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Overview</h2>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
          Retry schedules attempt one immediately, records execution metadata, and retries only
          configured temporary failures. It does not persist or return upstream response bodies.
          Status responses expose the request method and destination hostname, not request secrets.
        </p>
        <table className="spec-table mt-6">
          <tbody>
            <tr><th>Base URL</th><td className="font-mono">{siteConfig.retryApiBase}</td></tr>
            <tr><th>Create</th><td className="font-mono">POST /v1/retries</td></tr>
            <tr><th>Paid job price</th><td>$0.02 USDC through x402 v2</td></tr>
            <tr><th>Paid capability</th><td>Up to 8 attempts and a 24-hour lifetime</td></tr>
            <tr><th>API-key path</th><td>Account-scoped creation with up to 20 attempts</td></tr>
          </tbody>
        </table>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/products/retry" className="button-link">Retry product</Link>
          <Link href="/pricing" className="button-link">Pricing</Link>
          <Link href={siteConfig.retryOpenApi} className="button-link" data-variant="accent">OpenAPI</Link>
        </div>
      </section>

      <section id="x402" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">x402 quickstart</h2>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
          Send an unauthenticated creation request. The first response is HTTP 402 with a
          <code className="mx-1 font-mono text-sm text-white">PAYMENT-REQUIRED</code> header that
          advertises x402 v2, exact settlement, 20,000 atomic USDC units, and Base
          <code className="mx-1 font-mono text-sm text-white">eip155:8453</code>. Use the returned
          requirements rather than hardcoding the recipient.
        </p>
        <CodeBlock code={unpaidCreate} language="bash" title="Initial unpaid request" />
        <div className="mt-6">
          <CodeBlock code={paidCreated} language="json" title="HTTP 201 after settlement" />
        </div>
        <div className="mt-6 rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-7 text-[var(--color-muted)]">
          Store <code className="font-mono text-white">read_token</code> securely. It can read only
          that paid job&apos;s status, attempts, and callback status. A paid response also includes
          <code className="mx-1 font-mono text-white">PAYMENT-RESPONSE</code> and
          <code className="ml-1 font-mono text-white">Cache-Control: private, no-store</code>.
        </div>
      </section>

      <section id="create-job" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Create a Retry job</h2>
        <p className="mt-4 font-mono text-sm text-white">POST {siteConfig.retryApiBase}/v1/retries</p>
        <div className="mt-6 overflow-x-auto">
          <table className="spec-table min-w-[720px]">
            <thead><tr><th>Field</th><th>Required</th><th>Behavior</th></tr></thead>
            <tbody>
              <tr><td className="font-mono">request.method</td><td>Yes</td><td>GET, POST, PUT, PATCH, or DELETE.</td></tr>
              <tr><td className="font-mono">request.url</td><td>Yes</td><td>Public HTTPS URL, at most 2048 bytes.</td></tr>
              <tr><td className="font-mono">request.headers</td><td>No</td><td>String values; blocked names and size limits apply.</td></tr>
              <tr><td className="font-mono">request.body</td><td>No</td><td>JSON-compatible value or string, up to 256 KiB; forbidden for GET.</td></tr>
              <tr><td className="font-mono">retry.max_attempts</td><td>No</td><td>Default 8; maximum 8 for x402 and 20 for API keys.</td></tr>
              <tr><td className="font-mono">retry.strategy</td><td>No</td><td>fixed or exponential; default exponential.</td></tr>
              <tr><td className="font-mono">retry.initial_delay_seconds</td><td>No</td><td>2–3600; default 5.</td></tr>
              <tr><td className="font-mono">retry.max_delay_seconds</td><td>No</td><td>2–3600; default 300 and not below initial delay.</td></tr>
              <tr><td className="font-mono">retry_status_codes</td><td>No</td><td>Exact retryable HTTP codes; at most 100.</td></tr>
              <tr><td className="font-mono">success_codes</td><td>No</td><td>Exact success set; omitted means all 2xx.</td></tr>
              <tr><td className="font-mono">callback_url</td><td>No</td><td>Public HTTPS terminal callback URL.</td></tr>
              <tr><td className="font-mono">callback_secret</td><td>With callback</td><td>Client-generated HMAC secret, 32–512 characters.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
          If the outbound body is JSON, set Content-Type inside request.headers. Exende serializes
          the value but does not infer the upstream content type. success_codes and
          retry_status_codes cannot overlap.
        </p>
        <CodeBlock code={apiKeyCreate} language="bash" title="API-key creation with idempotency and callback" />
      </section>

      <section id="lifecycle" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Job lifecycle and status</h2>
        <p className="mt-4 font-mono text-sm text-white">GET /v1/retries/{"{id}"}</p>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          Authenticate with the same account API key or the matching paid-job read token.
        </p>
        <CodeBlock code={readStatus} language="bash" title="Poll job status" />
        <div className="mt-6"><CodeBlock code={statusResponse} language="json" title="Retrying job" /></div>
        <table className="spec-table mt-6">
          <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
          <tbody>
            {statusRows.map(([status, meaning]) => (
              <tr key={status}><td className="font-mono text-white">{status}</td><td>{meaning}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
          generation is monotonic concurrency metadata. Clients should make workflow decisions from
          status and timestamps rather than generation.
        </p>
      </section>

      <section id="attempts" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Attempts and history</h2>
        <p className="mt-4 font-mono text-sm text-white">GET /v1/retries/{"{id}"}/attempts</p>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          Attempt outcomes are success, http_failure, timeout, network_error, blocked_redirect, or
          cancelled. Entries include timing, status/error metadata, and the scheduled delay without
          persisting upstream response bodies.
        </p>
        <CodeBlock code={attemptsResponse} language="json" title="Attempt history response" />
      </section>

      <section id="terminal-callback" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Optional terminal callback</h2>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
          Configure callback_url and callback_secret at creation. Retry schedules one independent
          delivery workflow for retry.succeeded, retry.failed, or retry.cancelled. Expired jobs do
          not emit a callback in v1.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CodeBlock code={callbackHeaders} language="http" title="Callback request headers" />
          <CodeBlock code={callbackPayload} language="json" title="Signed callback payload" />
        </div>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
          Delivery is at-least-once. Any 2xx response succeeds. Network errors, timeouts, and 408,
          425, 429, 500, 502, 503, or 504 are retried up to 8 times within 24 hours. Retries keep the
          same X-Exende-Delivery value and use a fresh timestamp and signature. Verify HMAC against
          the exact raw body and deduplicate only after your business operation succeeds.
        </p>
        <p className="mt-4 font-mono text-sm text-white">GET /v1/retries/{"{id}"}/callback</p>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          This protected endpoint returns safe delivery metadata only. It never exposes callback_url,
          callback_secret, raw payload, lease data, or internal generation.
        </p>
      </section>

      <section id="policies" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Retry policies and idempotency</h2>
        <h3 className="mt-6 text-lg text-white">Retry behavior</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          Default retryable statuses are 408, 425, 429, 500, 502, 503, and 504. Timeouts and network
          errors are retryable. Attempt one runs immediately. Fixed delay starts at the configured
          initial delay; exponential delay doubles by attempt, is capped by max_delay_seconds, and
          is jittered. A valid Retry-After is a minimum delay capped by the configured maximum.
        </p>
        <h3 className="mt-7 text-lg text-white">API-key idempotency</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          Idempotency-Key is optional, 1–255 characters, scoped to account plus key, and retained for
          24 hours. An equivalent replay returns the original 201 response with
          Idempotency-Replayed: true; a different request returns 409 IDEMPOTENCY_KEY_CONFLICT.
        </p>
        <h3 className="mt-7 text-lg text-white">x402 replay safety</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          Paid clients must include the x402 v2 payment-identifier extension. Reuse one identifier
          only for retries of the same logical paid creation. Exende binds it to the endpoint,
          payment requirements, and full request. This prevents duplicate Exende jobs but does not
          make a non-idempotent upstream operation exactly-once.
        </p>
      </section>

      <section id="account-operations" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">API-key-only operations</h2>
        <table className="spec-table mt-5">
          <thead><tr><th>Endpoint</th><th>Behavior</th></tr></thead>
          <tbody>
            <tr><td className="font-mono">POST /v1/retries/{"{id}"}/cancel</td><td>Cancels a non-terminal account-owned job. A request already sent upstream cannot be recalled.</td></tr>
            <tr><td className="font-mono">GET /v1/usage?from=&amp;to=</td><td>Account-scoped outbound attempt usage. from is inclusive, to exclusive, and the maximum span is 90 days.</td></tr>
          </tbody>
        </table>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
          Paid x402 jobs are covered by the fixed job price and do not appear as API-key billable
          attempts. A paid-job read token cannot cancel a job or read aggregate usage.
        </p>
      </section>

      <section id="errors" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">Errors, security, and limits</h2>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          Clients should branch on error.code rather than message. Retry accepts public HTTPS
          destinations only, blocks IP literals and private/internal/Exende hosts, revalidates up to
          three same-origin redirects, and applies a 20-second timeout across the complete chain.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="spec-table min-w-[560px]">
            <thead><tr><th>HTTP</th><th>Error code</th></tr></thead>
            <tbody>
              {retryErrorRows.map(([status, code]) => (
                <tr key={`${status}-${code}`}><td className="font-mono text-white">{status}</td><td className="font-mono">{code}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6"><CodeBlock code={errorExample} language="json" title="Error response" /></div>
        <h3 className="mt-8 text-lg text-white">Production limits</h3>
        <table className="spec-table mt-4">
          <tbody>
            {retryFacts.map((fact) => <tr key={fact.label}><th>{fact.label}</th><td>{fact.value}</td></tr>)}
            <tr><th>Retention</th><td>Approximately 30 days for terminal jobs and attempt/callback records; approximately 90 days for usage events.</td></tr>
          </tbody>
        </table>
      </section>

      <section id="openapi" className="surface-rule mt-12 pt-8">
        <h2 className="font-display text-[1.9rem] tracking-[-0.04em] text-white">OpenAPI and Bazaar discovery</h2>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
          The static OpenAPI 3.1 specification describes both creation paths and every public Retry
          endpoint. The paid POST resource is also currently discoverable through Coinbase x402
          Bazaar with the exact $0.02 Base USDC requirement.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={siteConfig.retryOpenApi} className="button-link" data-variant="accent">Open Retry OpenAPI</Link>
          <a href={siteConfig.bazaarSearch} target="_blank" rel="noreferrer" className="button-link">Search x402 Bazaar</a>
        </div>
      </section>
    </DocsFrame>
  );
}
