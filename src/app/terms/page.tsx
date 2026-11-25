import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing Exende accounts, data access, API usage, credits, and subscriptions.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Exende Terms of Service",
    description: "Terms governing Exende accounts, data access, API usage, credits, and subscriptions.",
    url: "/terms",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende Terms of Service",
    description: "Terms governing Exende accounts, data access, API usage, credits, and subscriptions.",
    images: ["/twitter-image"],
  },
};

// INTERNAL TODO — source/licensing counsel must approve explicit rules for customer caching/storage,
// in-app use and display, derived analytics, attribution, retention after expiry, and bulk redistribution.
// Public source availability and an operator admission are not a grant of these rights.
// INTERNAL TODO — accountant to confirm VAT position and inclusive price wording against current Stripe
// Price tax_behavior, invoices, countries served and legal operator identity. Do not infer a tax regime.
const updatedDate = "November 25, 2026";

const sections = [
  "1. Operator and contact",
  "2. Account eligibility and security",
  "3. Services and product boundaries",
  "4. Acceptable use",
  "5. Public data and API output",
  "6. Plans, prices, and renewal",
  "7. Credits",
  "8. Cancellation and refunds",
  "9. Availability and changes",
  "10. Suspension and termination",
  "11. Intellectual property",
  "12. Liability",
  "13. Governing law",
  "14. Changes to these terms",
] as const;

export default function TermsPage() {
  return (
    <section className="legal-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Exende Terms of Service",
          url: `${siteConfig.url}/terms`,
          dateModified: "2026-11-25",
        }}
      />
      <div className="page-shell legal-page__layout">
        <header className="legal-page__aside">
          <p className="eyebrow">Legal</p>
          <h1>Terms of Service</h1>
          <p>Updated {updatedDate}. These terms apply to Exende accounts, APIs, data products, and paid plans.</p>
          <details className="legal-contents"><summary>On this page</summary>
            <nav aria-label="On this page"><ol>{sections.map((title,i) => <li key={title}><a href={`#section-${i+1}`}>{title}</a></li>)}</ol></nav>
          </details>
        </header>

        <div className="legal-page__content">
          <LegalSection title={sections[0]}>
            <p>
              <strong>{siteConfig.name}</strong> provides online APIs for hiring data and agent infrastructure. For questions about these terms, contact{" "}
              <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
            </p>
          </LegalSection>

          <LegalSection title={sections[1]}>
            <p>
              You must provide accurate account information and keep passwords and API keys confidential. You are
              responsible for activity performed with credentials issued to your organization. Notify us promptly if
              you suspect unauthorized access.
            </p>
          </LegalSection>

          <LegalSection title={sections[2]}>
            <p>
              Exende provides access to public hiring-data products and independent infrastructure APIs. Product
              availability, endpoints, limits, retention periods, and supported operations are described in the
              applicable documentation. Features marked as previews or coming soon are not production commitments.
            </p>
          </LegalSection>

          <LegalSection title={sections[3]}>
            <p>You may not use Exende to:</p>
            <ul>
              <li>break applicable law or the rights of another person;</li>
              <li>attempt unauthorized access, disrupt the service, or bypass technical limits;</li>
              <li>resell, share, or expose credentials outside the organization for which they were issued;</li>
              <li>submit malware, abusive traffic, or content that creates a security risk;</li>
              <li>misrepresent public hiring data as complete, guaranteed, or real-time.</li>
            </ul>
          </LegalSection>

          <LegalSection title={sections[4]}>
            <p>
              Hiring data is collected from reviewed public career sources, normalized, and observed over time. It may
              be delayed, incomplete, duplicated at source, or later corrected. You must independently evaluate output
              before using it for consequential decisions. Exende does not provide employment, legal, tax, or financial
              advice.
            </p>
          </LegalSection>

          <LegalSection title={sections[5]}>
            <p>
              Paid plans renew monthly until canceled. The price and included credits shown at checkout apply to the
              selected plan. Where the interface states that taxes are included, the displayed amount is the total plan
              price subject to any mandatory adjustment required by law. Stripe processes payments and may collect the
              billing information needed to complete the transaction.
            </p>
          </LegalSection>

          <LegalSection title={sections[6]}>
            <p>
              Credits are service units, not money. They cannot be transferred, redeemed for cash, or used after their
              applicable period ends. Monthly grants do not roll over unless Exende explicitly states otherwise.
              Complimentary onboarding credits may expire at the end of the displayed access period.
            </p>
          </LegalSection>

          <LegalSection title={sections[7]}>
            <p>
              You may cancel a subscription through the billing portal at any time. Cancellation takes effect at the end
              of the current paid period, and access continues until then. Charges are generally non-refundable and are
              not prorated for unused time or credits, except where applicable law requires a refund or withdrawal right.
              Mandatory consumer rights are not limited by these terms. Contact{" "}
              <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a> for a legally required refund
              or withdrawal request.
            </p>
          </LegalSection>

          <LegalSection title={sections[8]}>
            <p>
              We work to keep production services available, but do not guarantee uninterrupted or error-free operation.
              We may change or discontinue features to maintain security, legal compliance, or product quality. Material
              changes affecting an active paid plan will be communicated when reasonably possible.
            </p>
          </LegalSection>

          <LegalSection title={sections[9]}>
            <p>
              We may suspend or terminate access when necessary to address non-payment, abuse, security risk, legal
              requirements, or a material breach of these terms. You may stop using the service and request account
              deletion from the account area, subject to records we must retain by law.
            </p>
          </LegalSection>

          <LegalSection title={sections[10]}>
            <p>
              Exende, its software, documentation, and branding remain the property of their respective owner. These
              terms give you a limited, non-exclusive right to use the service during your authorized access period.
              Rights in third-party source material remain with the relevant owners.
            </p>
          </LegalSection>

          <LegalSection title={sections[11]}>
            <p>
              To the maximum extent permitted by law, Exende is not liable for indirect, incidental, special, or
              consequential loss, lost profits, or decisions made from API output. Nothing in these terms excludes
              liability that cannot legally be excluded, including mandatory consumer protections.
            </p>
          </LegalSection>

          <LegalSection title={sections[12]}>
            <p>
              These terms are governed by the law of the place where the service provider is established. If you are a consumer, mandatory protections and jurisdiction
              rights available in your country of residence continue to apply. Before starting formal proceedings,
              please contact us so we can try to resolve the issue directly.
            </p>
          </LegalSection>

          <LegalSection title={sections[13]}>
            <p>
              We may update these terms as the service develops. The effective date at the top identifies the current
              version. Continued use after an update means the revised terms apply from their stated effective date,
              subject to any notice or consent required by law.
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
