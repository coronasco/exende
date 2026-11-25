import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { ProductActions, ProductHero, ProductSection, productStyles as s } from "@/components/product/product-ui";
import { testInbox, testInboxActivationNote, testInboxStatus } from "@/content/test-inbox";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Test Inbox — Email verification for agent tests",
  description: `A private inbox for signup, password reset, and OTP tests. $0.02 USDC per 24-hour inbox, up to three emails. ${testInboxStatus}.`,
  alternates: { canonical: "/products/test-inbox" },
  openGraph: { title: "Exende Test Inbox", description: "Check the email step in your application tests. Private inboxes with structured OTP and link extraction.", url: "/products/test-inbox", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "Exende Test Inbox", description: `Email verification for agent tests. ${testInboxStatus}.`, images: ["/twitter-image"] },
};

export default function TestInboxProductPage() {
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebAPI", name: "Exende Test Inbox", description: `${testInboxStatus}. Private temporary inboxes for testing an application's email flows.`, url: `${siteConfig.url}/products/test-inbox`, documentation: `${siteConfig.url}/docs/test-inbox`, provider: { "@type": "Organization", name: "Exende", url: siteConfig.url } }} />
    <ProductHero path="/products/test-inbox" eyebrow="Exende Test Inbox · x402" title={<>Test Inbox API.<br /><span>Catch the email.</span></>} description="Give your agent a private address for each signup, password reset, or OTP test. Receive structured email results and continue your test with the matching code or verification link.">
      <p className={s.note} role="status">{testInboxStatus}</p>
      <ProductActions primary="Read the integration guide" href="/docs/test-inbox#quickstart" secondary="Inspect the API contract" secondaryHref={testInbox.openapi} />
      <p className={s.note}>$0.02 USDC per inbox · 24 hours · Up to 3 emails · Base</p>
    </ProductHero>
    <ProductSection id="workflow" eyebrow="One inbox for one test" title="Close the loop in your test runner." description="A small API for the email step in your own application. Each inbox has a private access token that your client creates and saves before payment.">
      <div className={s.protocol}><ol className="space-y-5 text-[var(--color-muted)]">
        <li><strong className="text-white">1. Create a private inbox.</strong> Specify the exact sender mailbox and optional subject filter. Pay $0.02 USDC through x402.</li>
        <li><strong className="text-white">2. Trigger your application.</strong> Use the returned address in your signup or password-reset flow. Your application sends the email.</li>
        <li><strong className="text-white">3. Wait for the result.</strong> Wait up to 60 seconds, then inspect the message, OTP, and allowed verification URL. Missing and ambiguous results are explicit.</li>
      </ol></div>
    </ProductSection>
    <ProductSection id="included" eyebrow="A bounded test resource" title="One price. A clear lifetime." description="The creation price covers the inbox and its authenticated reads, waits, recovery, and deletion. It is separate from Jobs Data subscription credits.">
      <dl className={s.creditExamples}><div><dt>Lifetime</dt><dd>24 hours</dd></div><div><dt>Accepted messages</dt><dd>Up to 3</dd></div><div><dt>Per email</dt><dd>1 MiB maximum</dd></div><div><dt>Wait per call</dt><dd>Up to 60 seconds</dd></div></dl>
      <p className={s.note}>No outbound email or attachment support. OTP extraction uses a requested length of 4–8 digits, default six. A verification URL is returned only for an exact HTTPS hostname you specify. Exende never opens that URL.</p>
    </ProductSection>
    <ProductSection id="recovery" eyebrow="Keep the test recoverable" title="Save the token before the payment." description="If the create response is lost, look up the inbox using your saved bearer token. Repeating the same create request with the same token and body returns the existing inbox without another charge while it is active.">
      <div className={s.protocol}>
        <p className={s.note}>The sender filter matches the SMTP envelope sender. It does not authenticate the sender or prove that an email is trustworthy. Use Test Inbox for applications and test flows you control.</p>
        <ProductActions primary="Token & recovery guide" href="/docs/test-inbox#recovery" secondary="Limits & extraction" secondaryHref="/docs/test-inbox#extraction" />
        <p className={s.note}>{testInboxActivationNote} <Link href="/docs/test-inbox">Read the complete contract.</Link></p>
      </div>
    </ProductSection>
  </>;
}
