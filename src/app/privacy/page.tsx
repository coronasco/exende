import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Exende handles account, API, billing, support, security, and analytics data.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Exende Privacy Policy",
    description: "How Exende handles account, API, billing, support, security, and analytics data.",
    url: "/privacy",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende Privacy Policy",
    description: "How Exende handles account, API, billing, support, security, and analytics data.",
    images: ["/twitter-image"],
  },
};

const updatedDate = "November 25, 2026";

const sections = [
  "1. Controller and contact",
  "2. Data we process",
  "3. Why we process data",
  "4. Service providers",
  "5. Cookies and analytics",
  "6. Retention",
  "7. Security",
  "8. Your rights",
  "9. Public hiring data",
  "10. Children",
  "11. Changes to this policy",
] as const;

export default function PrivacyPage() {
  return (
    <section className="legal-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "PrivacyPolicy",
          name: "Exende Privacy Policy",
          url: `${siteConfig.url}/privacy`,
          dateModified: "2026-11-25",
        }}
      />
      <div className="page-shell legal-page__layout">
        <header className="legal-page__aside">
          <p className="eyebrow">Legal</p>
          <h1>Privacy Policy</h1>
          <p>Updated {updatedDate}. This policy explains the personal data handled when you visit or use Exende.</p>
          <details className="legal-contents"><summary>On this page</summary>
            <nav aria-label="On this page"><ol>{sections.map((title,i) => <li key={title}><a href={`#section-${i+1}`}>{title}</a></li>)}</ol></nav>
          </details>
        </header>

        <div className="legal-page__content">
          <LegalSection title={sections[0]}>
            <p>
              <strong>{siteConfig.name}</strong> is the online API service covered by this policy. To contact the controller about your personal data or exercise your privacy rights, email <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
            </p>
          </LegalSection>

          <LegalSection title={sections[1]}>
            <ul>
              <li><strong>Account data:</strong> name, email address, verification status, organization membership, and account settings.</li>
              <li><strong>Authentication data:</strong> password hashes, session identifiers, device or browser information, and security-related IP information.</li>
              <li><strong>Developer data:</strong> API-key fingerprints, scopes, creation and revocation records, usage totals, and request metadata. Full API-key secrets are shown once and are not retained by Exende.</li>
              <li><strong>Test Inbox data:</strong> temporary recipient addresses, sender and subject filters, incoming sender addresses, subjects, message text, timestamps, and extracted verification codes or links. This content is processed to provide the email tests you request. Your client-generated access token protects the inbox; application code does not log that token.</li>
              <li><strong>Billing data:</strong> plan, subscription status, credit grants, and Stripe customer, subscription, invoice, and payment references. Exende does not store complete payment-card numbers.</li>
              <li><strong>x402 payment data:</strong> payment authorizations and minimal payment and recovery records, including transaction references. Blockchain transactions are public and are separate from temporary inbox content.</li>
              <li><strong>Support data:</strong> messages and information you choose to provide when contacting support.</li>
              <li><strong>Website analytics:</strong> page visits, referral sources, browser and device information, broad location information, and usage measurements provided by Vercel Web Analytics and Google Analytics.</li>
            </ul>
          </LegalSection>

          <LegalSection title={sections[2]}>
            <p>We process personal data to:</p>
            <ul>
              <li>create accounts, authenticate users, and deliver requested services;</li>
              <li>issue and enforce scoped API credentials, entitlements, and credits;</li>
              <li>process subscriptions, maintain invoices, and meet accounting obligations;</li>
              <li>protect Exende, its users, and its infrastructure from abuse and security threats;</li>
              <li>answer support requests and communicate material service information;</li>
              <li>understand aggregate website usage and improve product reliability.</li>
            </ul>
            <p>
              The legal bases are performance of a contract, steps requested before entering a contract, compliance
              with legal obligations, and legitimate interests in security, support, and service improvement. Where
              consent is legally required, we rely on consent and allow it to be withdrawn.
            </p>
          </LegalSection>

          <LegalSection title={sections[3]}>
            <p>We use carefully scoped providers to operate Exende:</p>
            <ul>
              <li><strong>Cloudflare:</strong> DNS, network delivery, Workers, databases, Durable Objects, security, and inbound email routing. Test Inbox email passes through Cloudflare and its operational processing; Exende’s application retention is not a claim that Cloudflare keeps no service logs.</li>
              <li><strong>Vercel:</strong> website hosting and privacy-focused aggregate Web Analytics.</li>
              <li><strong>Google:</strong> Google Analytics for website traffic, page navigation, and usage measurement.</li>
              <li><strong>Stripe:</strong> checkout, subscriptions, invoices, tax-related checkout fields, payment methods, and the customer billing portal.</li>
              <li><strong>Resend:</strong> transactional account email such as verification and password-reset messages.</li>
              <li><strong>DataAPI infrastructure:</strong> product-safe hiring-data access, scoped credential enforcement, and usage accounting.</li>
            </ul>
            <p>
              Providers process data under their own contractual and security obligations. Data may be processed outside
              your country when legally permitted and protected by an applicable transfer mechanism.
            </p>
          </LegalSection>

          <LegalSection title={sections[4]}>
            <p>
              Exende uses essential storage required for secure sign-in and session operation. These mechanisms are not
              used for advertising. Vercel Web Analytics reports aggregate traffic without third-party cookies or
              persistent cross-site identifiers. Google Analytics is also installed and may use first-party cookies
              to distinguish browsers and measure visits and navigation. Google receives page and referrer URLs and
              browser and device information through its tag. You can control cookies and tracking through your
              browser settings.
            </p>
            <p>
              Product events sent to Vercel help us understand catalogue use, account creation, API-key setup, and
              checkout. These custom events exclude search text, API keys, emails, and record contents; Vercel
              analytics URLs omit query strings and fragments.
            </p>
          </LegalSection>

          <LegalSection title={sections[5]}>
            <p>
              Test Inbox access expires 24 hours after creation. Message content is stored temporarily in Cloudflare
              Durable Objects for the inbox lifetime and scheduled cleanup removes it. Deleting an inbox revokes
              access. Minimal payment and recovery records are retained in D1 for 30 days, separately from message
              content. Deleting an inbox does not erase its public blockchain transaction.
            </p>
            <p>
              Account and organization records are kept while the account is active and for a limited period afterward
              when needed for security, dispute resolution, or legal obligations. Billing and accounting records are
              kept for the period required by applicable law. Security logs, sessions, and usage metadata are retained
              only as long as reasonably necessary for their stated purposes. Deletion requests do not require us to
              erase records that must legally be retained.
            </p>
          </LegalSection>

          <LegalSection title={sections[6]}>
            <p>
              We use access controls, scoped credentials, one-way credential storage, transport encryption, secret
              separation, and audit records. No system can guarantee absolute security, so you should keep credentials
              private and report suspected compromise immediately.
            </p>
          </LegalSection>

          <LegalSection title={sections[7]}>
            <p>
              Depending on applicable law, you may request access, correction, deletion, restriction, portability, or
              objection to processing. You may also withdraw consent where processing depends on consent and lodge a
              complaint with your data-protection authority. Send requests to{" "}
              <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>. We may need to verify your
              identity before acting on a request.
            </p>
          </LegalSection>

          <LegalSection title={sections[8]}>
            <p>
              Exende observes reviewed public career sources. The public-data product is separate from customer account
              data. If you believe a public record contains personal information that should be corrected or removed,
              contact support with the relevant source and record details.
            </p>
          </LegalSection>

          <LegalSection title={sections[9]}>
            <p>
              Exende is a business and developer service and is not directed to children. Do not create an account if
              you are not legally able to enter the applicable agreement.
            </p>
          </LegalSection>

          <LegalSection title={sections[10]}>
            <p>
              We may update this policy to reflect product, provider, or legal changes. The effective date at the top
              identifies the current version, and material changes will be communicated when required.
            </p>
          </LegalSection>
        </div>
      </div>
    </section>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="legal-section" id={`section-${title.split(".")[0]}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
