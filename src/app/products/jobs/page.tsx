import { JsonLd } from "@/components/json-ld";
import { LiveOverview, LiveOverviewFallback } from "@/components/live-overview";
import { siteConfig } from "@/content/site";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Clock3,
  Database,
  Radar,
  Search,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Jobs & Hiring Data",
  description:
    "Reviewed public career sources, normalized job records, current catalogue counts, and historical observation for hiring intelligence.",
  alternates: { canonical: "/products/jobs" },
  openGraph: {
    title: "Exende Jobs & Hiring Data",
    description: "Public hiring data, observed over time.",
    url: "/products/jobs",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende Jobs & Hiring Data",
    description: "Public hiring data, observed over time.",
    images: ["/twitter-image"],
  },
};

export default function JobsProductPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Exende Jobs & Hiring Data",
          description: "Reviewed public hiring data with current catalogue counts and historical observation.",
          url: `${siteConfig.url}/products/jobs`,
          brand: { "@type": "Brand", name: "Exende" },
        }}
      />

      <section className="product-data-hero">
        <div className="product-data-hero__art" aria-hidden="true">
          <Image
            src="/media/exende-data-api-core-v1.png"
            alt=""
            fill
            preload
            quality={90}
            sizes="100vw"
          />
        </div>
        <div className="page-shell product-data-hero__inner">
          <div className="product-data-hero__copy">
            <p className="eyebrow">Jobs & Hiring Data</p>
            <h1>Public hiring data, observed over time.</h1>
            <p>
              A normalized data layer for teams researching roles, companies, sources, and hiring
              movement across reviewed public career pages.
            </p>
            <div className="data-hero__actions">
              <Link href="/docs/jobs" className="primary-cta">Read the public API <ArrowRight className="h-4 w-4" /></Link>
              <Link href="#access" className="secondary-cta">Customer access</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="jobs-proof">
        <div className="page-shell">
          <Suspense fallback={<LiveOverviewFallback />}>
            <LiveOverview />
          </Suspense>
        </div>
      </section>

      <section className="data-section">
        <div className="page-shell">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">A deliberate pipeline</p>
              <h2>From public source to usable observation.</h2>
            </div>
            <p>
              Exende focuses on reviewed structured career sources. It does not claim complete
              global coverage, guaranteed real-time delivery, or access to private company data.
            </p>
          </div>

          <div className="jobs-method">
            <article><span>01</span><Radar /><h3>Review</h3><p>Sources are enabled deliberately rather than accepted as an unbounded crawl target.</p></article>
            <article><span>02</span><Database /><h3>Normalize</h3><p>Public observations are transformed into a consistent canonical structure.</p></article>
            <article><span>03</span><Clock3 /><h3>Observe</h3><p>Changes are retained over time so research can move beyond a single snapshot.</p></article>
            <article><span>04</span><Search /><h3>Deliver</h3><p>Product-safe customer access is delivered through explicitly scoped API keys.</p></article>
          </div>
        </div>
      </section>

      <section className="product-depth-section">
        <div className="page-shell product-depth-layout">
          <div>
            <p className="eyebrow">What the data supports</p>
            <h2>Research with context, not invented conclusions.</h2>
          </div>
          <div className="product-depth-list">
            <div><BriefcaseBusiness /><span><strong>Normalized job research</strong>Study current public listings through a consistent data model.</span></div>
            <div><Building2 /><span><strong>Company hiring context</strong>Understand visible activity for companies represented in reviewed sources.</span></div>
            <div><Clock3 /><span><strong>Historical movement</strong>Analyze observations over time once sufficient continuous history is available.</span></div>
          </div>
        </div>
      </section>

      <section className="data-section" id="access">
        <div className="page-shell access-roadmap">
          <div className="access-roadmap__copy">
            <p className="eyebrow">Customer access</p>
            <h2>Public proof and scoped API access, live now.</h2>
            <p>
              The aggregate overview remains public. Verified accounts receive complimentary
              onboarding credits and can create scoped keys for search, company, and historical data.
            </p>
          </div>
          <div className="access-roadmap__steps">
            <div data-state="live"><span>Live</span><strong>Aggregate overview</strong><small>No key required</small></div>
            <div data-state="live"><span>Live</span><strong>Customer accounts</strong><small>Authentication and onboarding credits</small></div>
            <div data-state="live"><span>Live</span><strong>Product-safe APIs</strong><small>Scoped keys and documented routes</small></div>
          </div>
          <div className="access-security">
            <ShieldCheck />
            <p><strong>Security boundary</strong>The DataAPI operator dashboard, protected routes, internal source health, raw payloads, and management credentials remain private.</p>
          </div>
        </div>
      </section>
    </>
  );
}
