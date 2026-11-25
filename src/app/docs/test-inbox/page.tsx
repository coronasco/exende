import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { DocsFrame } from "@/components/docs-frame";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import { testInbox, testInboxActivationNote, testInboxEndpoints, testInboxQuickstart, testInboxStatus } from "@/content/test-inbox";

export const metadata: Metadata = {
  title: "Test Inbox API documentation",
  description: `Create a private test inbox with x402. TypeScript quickstart, token recovery, extraction, limits, and errors. ${testInboxStatus}.`,
  alternates: { canonical: "/docs/test-inbox" },
  openGraph: { title: "Exende Test Inbox documentation", description: "Private inboxes for application email tests, with explicit recovery and extraction results.", url: "/docs/test-inbox", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "Exende Test Inbox documentation", description: `Test Inbox API v1 integration guide and limits. ${testInboxStatus}.`, images: ["/twitter-image"] },
};

const toc = [
  { id: "quickstart", label: "TypeScript quickstart" }, { id: "create", label: "Create an inbox" },
  { id: "recovery", label: "Token & recovery" }, { id: "read-wait", label: "Read, wait & delete" },
  { id: "extraction", label: "Filters & extraction" }, { id: "limits", label: "Limits & errors" },
  { id: "openapi", label: "OpenAPI" },
] as const;
const heading = "font-display text-[1.9rem] leading-tight tracking-[-0.04em] text-white";
const prose = "mt-4 text-base leading-8 text-[var(--color-muted)]";
const section = "surface-rule scroll-mt-28 mt-12 pt-8";
const inboxExample = {
  id: "ib_0000000000000000000000000000000000000000", address: "inbox+0000000000000000000000000000000000000000@test.example.com", expires_at: "2026-10-21T12:00:00.000Z",
  messages_url: "https://api.exende.dev/v1/inboxes/ib_0000000000000000000000000000000000000000/messages",
  wait_url: "https://api.exende.dev/v1/inboxes/ib_0000000000000000000000000000000000000000/wait",
  limits: testInbox.limits, status: "active",
};
const messageExample = {
  id: "im_00000000-0000-4000-8000-000000000000", received_at: "2026-10-20T12:01:00.000Z", from: "no-reply@your-app.example",
  subject: "Verify your account", text: "Your code is 428196", text_truncated: false,
  otp: "428196", verification_url: null, otp_status: "found", link_status: "not_requested",
};

export default function TestInboxDocsPage() {
  return <DocsFrame currentHref="/docs/test-inbox" title="Test Inbox" intro="A private, temporary inbox for signup, password-reset, and OTP tests. Create once through x402, then read, wait, recover, or delete with the access token you generated before payment." toc={toc} updatedAt="October 20, 2026">
    <JsonLd data={{ "@context": "https://schema.org", "@type": "TechArticle", headline: "Exende Test Inbox API documentation", description: metadata.description, url: `${siteConfig.url}/docs/test-inbox`, dateModified: "2026-10-20", author: { "@type": "Organization", name: "Exende" } }} />
    <p className="rounded border border-[var(--color-border)] p-4 text-sm leading-7 text-[var(--color-accent)]" role="status">{testInboxStatus}. {testInboxActivationNote} The examples below are integration examples, not evidence of live email delivery.</p>
    <section id="quickstart" className={section}>
      <h2 className={heading}>A recoverable TypeScript quickstart</h2>
      <p className={prose}>Use Node.js 22 or later. Install the pinned x402 client versions below. Save the TypeScript example as <code>test-inbox.ts</code>. Configure <code>X402_PRIVATE_KEY</code> through your secret environment for a wallet holding USDC on Base. The create command authorizes a $0.02 payment.</p>
      <CodeBlock code="npm install --save-exact @x402/fetch@2.23.0 @x402/evm@2.23.0 viem@2.55.19\nnpm install --save-dev --save-exact tsx@4.23.12" language="bash" title="Pinned client dependencies" />
      <p className={prose}>Set <code>EXPECTED_FROM</code> to your application’s exact SMTP envelope sender. Optionally set <code>SUBJECT_CONTAINS</code> and <code>LINK_HOST</code>. The script creates a private state file before payment, checks recovery first, and preserves the same request across retries. Add <code>.private/</code> to your <code>.gitignore</code>; keep the token and received OTPs out of shared logs.</p>
      <CodeBlock code={testInboxQuickstart} language="typescript" title="test-inbox.ts · create, recover, read, wait, delete" />
      <CodeBlock code="npx tsx test-inbox.ts create\n# Trigger your own app's email flow with the returned address.\nnpx tsx test-inbox.ts wait\nnpx tsx test-inbox.ts read\nnpx tsx test-inbox.ts delete" language="bash" title="Run each step when your test is ready" />
      <p className={prose}>One state file represents one test inbox. Use an isolated working directory per parallel test. To start a new test, archive or remove the old state after the inbox is no longer needed. Never replace the token to recover an uncertain payment outcome.</p>
    </section>
    <section id="create" className={section}>
      <h2 className={heading}>Create an inbox · $0.02 USDC</h2>
      <p className={prose}><code>POST https://api.exende.dev/v1/inboxes</code> accepts JSON. A new inbox requires x402 v2 exact payment on Base (<code>eip155:8453</code>). The price covers its lifetime, up to three accepted messages, reads, waits, recovery, and deletion. No Exende account or subscription is required.</p>
      <div className="mt-6 overflow-x-auto"><table className="spec-table"><thead><tr><th>Field</th><th>Contract</th></tr></thead><tbody>{[
        ["access_token", "Required. 64 lowercase hexadecimal characters from 32 cryptographically random bytes. Generate and save on the client before paying."],
        ["expected_from", "Required. Exact SMTP envelope sender mailbox, compared without case sensitivity. This is not the display From header."],
        ["subject_contains", "Optional case-insensitive subject substring filter, 1–120 printable characters."], ["otp_length", "Optional integer from 4 to 8; defaults to 6."],
        ["link_host", "Optional exact DNS hostname without a scheme, port, wildcard, or path. Required to return a verification_url; only HTTPS links on that host qualify."],
      ].map(([field, contract]) => <tr key={field}><td><code>{field}</code></td><td>{contract}</td></tr>)}</tbody></table></div>
      <p className={prose}>Read the current <code>PAYMENT-REQUIRED</code> challenge for recipient and settlement requirements. The client sends its proof in <code>PAYMENT-SIGNATURE</code>; a settled response carries <code>PAYMENT-RESPONSE</code>. Preserve your receipt when diagnosing an uncertain outcome.</p>
      <CodeBlock code={JSON.stringify(inboxExample, null, 2)} language="json" title="Illustrative inbox metadata · synthetic identifiers and address" />
      <p className={prose}>Use the address returned by the API. The synthetic <code>test.example.com</code> address above cannot receive your test email. The server does not generate or return another read token.</p>
    </section>
    <section id="recovery" className={section}>
      <h2 className={heading}>Recover without paying again</h2>
      <p className={prose}>Send <code>GET /v1/inboxes/lookup</code> with <code>Authorization: Bearer &lt;access_token&gt;</code> to recover the same metadata returned by creation. All read, wait, lookup, and delete requests use that same bearer token. Tokens belong in the header, never the URL.</p>
      <p className={prose}>While the inbox is active, repeating <code>POST /v1/inboxes</code> with the same token and identical body returns HTTP 200 without another payment. Reusing the token with a different body returns HTTP 409. After a network error, keep the token and exact body, try lookup, then retry that saved request if needed.</p>
      <p className={prose}>The token controls the inbox. Losing it prevents recovery. An inbox expires 24 hours after creation; replay does not extend its lifetime.</p>
      <p className={prose}>If payment settlement is unconfirmed, creation returns HTTP 502 and lookup returns HTTP 409 while that outcome is pending. Preserve the same token and request body. Do not authorize a second independent payment; use lookup to check recovery.</p>
    </section>
    <section id="read-wait" className={section}>
      <h2 className={heading}>Read, wait, and delete</h2>
      <div className="mt-6 overflow-x-auto"><table className="spec-table"><thead><tr><th>Method</th><th>Route</th><th>Behavior</th></tr></thead><tbody>{testInboxEndpoints.slice(1).map(([method, path, purpose]) => <tr key={path}><td>{method}</td><td><code>{path}</code></td><td>{purpose}</td></tr>)}</tbody></table></div>
      <p className={prose}>Messages returns <code>{'{ inbox_id, status: "active", expires_at, messages: [...] }'}</code>. Wait is one bounded call, up to 60 seconds. Pass <code>next_after</code> from a received result as the next <code>after</code> cursor; it must identify a message in this inbox. An unknown cursor returns HTTP 400.</p>
      <CodeBlock code={JSON.stringify({ received: true, timeout: false, message: messageExample, next_after: messageExample.id }, null, 2)} language="json" title="Illustrative wait response · HTTP 200" />
      <CodeBlock code={JSON.stringify({ received: false, timeout: true, message: null, next_after: null }, null, 2)} language="json" title="Wait timeout · HTTP 200 · next_after preserves a supplied cursor" />
      <p className={prose}>A timeout means no matching message arrived during that wait. It does not prove that your application failed to send. Use a deadline in your test runner rather than an endless wait loop. DELETE returns <code>{'{ "id": "…", "deleted": true }'}</code>.</p>
    </section>
    <section id="extraction" className={section}>
      <h2 className={heading}>Explicit extraction results</h2>
      <p className={prose}>Each accepted message includes <code>id</code>, <code>received_at</code>, <code>from</code>, <code>subject</code>, <code>text</code>, <code>text_truncated</code>, <code>otp</code>, <code>verification_url</code>, <code>otp_status</code>, and <code>link_status</code>.</p>
      <ul className={`${prose} list-disc space-y-3 pl-5`}>
        <li><code>found</code>: one eligible OTP or link was found. Check this status before using the corresponding value.</li>
        <li><code>not_found</code>: no eligible value was found; the value is null.</li>
        <li><code>ambiguous</code>: multiple eligible values were found; the value is null, so the client must not guess.</li>
        <li><code>link_status: not_requested</code>: no <code>link_host</code> was supplied, so <code>verification_url</code> is null.</li>
      </ul>
      <p className={prose}>The SMTP envelope sender filter is not sender authentication. It does not establish ownership or trust in the message. An exact HTTPS hostname filter constrains which URL can be returned; Exende never visits, follows, or validates the destination. Your test decides whether to open it.</p>
    </section>
    <section id="limits" className={section}>
      <h2 className={heading}>Limits and error handling</h2>
      <p className={prose}>Creation JSON is limited to 4,096 bytes; unknown fields are rejected. Each inbox lasts 86,400 seconds and accepts at most three messages, each no larger than 1,048,576 bytes (1 MiB). Attachments and outbound email are unsupported. A wait lasts at most 60 seconds. Read results are private; protect your token and stored messages.</p>
      <p className={prose}>Each inbox also has a maximum of 30 incoming email processing attempts. Invalid MIME and subject mismatches count toward this processing budget, even when no message is stored. The stored-message limit remains three.</p>
      <div className="mt-6 overflow-x-auto"><table className="spec-table"><thead><tr><th>HTTP</th><th>Action</th></tr></thead><tbody>{[
        ["400", "Correct the request fields or after cursor."], ["401", "Supply the saved bearer access token."], ["402", "A new inbox requires the quoted x402 payment."],
        ["404", "Check the token and inbox identifier; use lookup for recovery."], ["409", "Keep the original body when reusing a token; inspect the error before retrying."],
        ["410", "The inbox has expired or is no longer usable; inspect the error code."], ["413 / 415", "Use an application/json create body of at most 4,096 bytes."], ["429", "Respect the service's request limit and retry guidance."],
        ["502", "Payment settlement is unconfirmed. Keep the same token and use lookup; a pending lookup returns 409."],
        ["503", "Receiving configuration or service is unavailable."],
      ].map(([status, action]) => <tr key={status}><td>{status}</td><td>{action}</td></tr>)}</tbody></table></div>
      <p className={prose}>Errors use <code>{'{ "error": { "code", "message", "request_id" } }'}</code>. Inspect the API error code before deciding to retry. A lost response is not permission to authorize a second independent payment: recover using the saved token first.</p>
    </section>
    <section id="openapi" className={section}>
      <h2 className={heading}>Machine-readable contract</h2>
      <p className={prose}>The OpenAPI document defines the v1 request and response schemas. Test Inbox is a separate resource on the existing Exende API host.</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link href={testInbox.openapi} className="button-link" data-variant="accent">Test Inbox OpenAPI</Link><Link href="/products/test-inbox" className="button-link">Product overview</Link></div>
    </section>
  </DocsFrame>;
}
