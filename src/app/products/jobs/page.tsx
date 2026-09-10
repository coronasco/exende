import { PublicCatalogue } from "@/components/catalogue/public-catalogue";
import { JsonLd } from "@/components/json-ld";
import { ProductHero, ProductActions, ProductSection, ProductClosing, FeatureCard, productStyles as s } from "@/components/product/product-ui";
import { CatalogueMetrics, CatalogueLoading } from "@/components/landing/catalogue";
import { DataExplorer } from "@/components/landing/data-explorer";
import { jobsQuickstart } from "@/content/jobs";
import { CodeBlock } from "@/components/code-block";
import { getPublicOverview } from "@/lib/dataapi";
import { siteConfig } from "@/content/site";
import { ArrowRight, Building2, Search, History, Code2, ChartNoAxesCombined, UsersRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Jobs Data API & Hiring Intelligence",
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
  const overview = getPublicOverview();
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebAPI", name: "Exende Jobs & Hiring Data API", description: "Normalized public job listings, company hiring context, and observed changes through a scoped API.", url: `${siteConfig.url}/products/jobs`, documentation: `${siteConfig.url}/docs/jobs`, provider: { "@type": "Organization", name: "Exende" } }} />
    <ProductHero eyebrow="Jobs & Hiring Data API" title={<>Jobs data.<br />Hiring changes.<br /><span>One API.</span></>} description="Search normalized public job listings, explore company hiring activity, and observe changes without building your own collection pipeline." aside={<DataExplorer />}>
      <ProductActions primary="Explore the catalogue" href="#catalogue" secondary="Start with 2,500 free credits" secondaryHref="/account?mode=signup&next=/dashboard" />
    </ProductHero>
    <ProductSection id="catalogue" eyebrow="Observed coverage" title="Public data. Visible evidence." description="Current counts come directly from the catalogue. Freshness is the most recent canonical job observation, not a promise that every source was checked at that time.">
      <div className={s.protocol} data-reveal><Suspense fallback={<CatalogueLoading />}><CatalogueMetrics overview={overview} /></Suspense></div>
      <div className={s.actions}><PublicCatalogue surface="jobs" /></div>
      <p className={s.note}><Link href="/coverage">Explore coverage & methodology <ArrowRight className="inline h-3 w-3" /></Link></p>
    </ProductSection>
    <ProductSection eyebrow="The data you work with" title={<>From a question<br />to a structured result.</>} description="Use a scoped key to search roles and skills, inspect a company, or retrieve the available history behind a listing.">
      <div className={s.threeColumns}>
        <FeatureCard title="Search jobs"><Search /><p>Filter current listings by role, company, location, country, skill, employment type, and workplace type.</p><code>GET /v1/jobs/search</code><Link href="/docs/jobs#search" className={s.secondary}>Search reference <ArrowRight /></Link></FeatureCard>
        <FeatureCard title="Understand a company"><Building2 /><p>Connect a company domain with its active jobs, observed timeline, and hiring metrics.</p><code>GET /v1/companies/&#123;domain&#125;</code><Link href="/docs/jobs#companies" className={s.secondary}>Company reference <ArrowRight /></Link></FeatureCard>
        <FeatureCard title="Follow observed changes"><History /><p>Read created, updated, and closed versions. Compare activity within the available observation window.</p><code>GET /v1/jobs/&#123;id&#125;/history</code><Link href="/docs/jobs#history" className={s.secondary}>History reference <ArrowRight /></Link></FeatureCard>
      </div>
    </ProductSection>
    <ProductSection>
      <div className={s.featured}><div data-reveal><p className={s.eyebrow}>Developer quickstart</p><h2>Your first request.<br />Five useful records.</h2><p>Create an account, verify your email, and generate a key with <code>jobs:read</code>. Run a small search, then inspect the returned records and credit usage in your dashboard.</p><p className={s.note}>A search returning 5 records costs 5 credits. A search returning no records costs 0 credits. Keep your key in a server environment variable.</p><ProductActions primary="Create free account" secondary="Read the quickstart" /></div><div data-reveal><CodeBlock code={jobsQuickstart} language="bash" title="Search with your Jobs Data API key" /></div></div>
    </ProductSection>
    <ProductSection eyebrow="Build with observed evidence" title="Hiring context for your work." description="Use the fields and history the API actually exposes. Coverage reflects reviewed sources and does not represent the entire hiring market.">
      <div className={s.threeColumns}>
        <FeatureCard title="Market intelligence"><ChartNoAxesCombined /><p>Compare visible hiring across observed companies, roles, and locations. Describe change within the recorded period.</p></FeatureCard>
        <FeatureCard title="Recruiting products"><UsersRound /><p>Power job search, company enrichment, and research workflows with normalized records and source attribution.</p></FeatureCard>
        <FeatureCard title="Applications & agents"><Code2 /><p>Give applications and agents scoped access to structured hiring data with an explicit request and credit contract.</p></FeatureCard>
      </div>
    </ProductSection>
    <ProductClosing />
  </>;
}
