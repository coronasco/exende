import { PublicCatalogue } from "@/components/catalogue/public-catalogue";
import { ProductHero, ProductActions, ProductSection, FeatureCard, productStyles as s } from "@/components/product/product-ui";
import { CatalogueMetrics, CatalogueLoading } from "@/components/landing/catalogue";
import { getPublicOverview } from "@/lib/dataapi";
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Jobs Data Coverage & Methodology", description: "Understand Exende’s observed public job coverage, normalization, freshness, and historical boundaries.", alternates: { canonical: "/coverage" },
  openGraph: { title: "Jobs Data Coverage & Methodology — Exende", description: "Reviewed sources, canonical records, and accurately described observation windows.", url: "/coverage", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "Jobs Data Coverage & Methodology — Exende", description: "Reviewed public hiring data, with a documented observation boundary.", images: ["/twitter-image"] },
};
export default function CoveragePage() {
  const overview = getPublicOverview();
  return <>
    <ProductHero eyebrow="Coverage & methodology" title={<>Know the coverage.<br /><span>Understand the evidence.</span></>} description="Exende observes reviewed public career sources. The catalogue gives you a consistent view of those sources and the changes recorded while they are observed."><ProductActions primary="Explore Jobs Data" href="/products/jobs#catalogue" secondary="Read the API contract" secondaryHref="/docs/jobs" /></ProductHero>
    <ProductSection eyebrow="Current catalogue" title="Real counts. Clear definitions." description="The latest values are fetched from the public aggregate API. They describe observed catalogue coverage, not the whole hiring market."><div className={s.protocol} data-reveal><Suspense fallback={<CatalogueLoading />}><CatalogueMetrics overview={overview} /></Suspense></div><div className={s.actions}><PublicCatalogue surface="coverage" /></div></ProductSection>
    <ProductSection eyebrow="From source to record" title="A deliberate observation process."><div className={s.threeColumns}>
      <FeatureCard number="01" title="Reviewed public sources"><p>Collection starts from deliberately enabled public career sources. A source review and a technical observation are distinct from a grant of unrestricted redistribution rights.</p></FeatureCard>
      <FeatureCard number="02" title="Consistent normalization"><p>Listings retain a source URL alongside normalized employment and workplace types. Skills use a deterministic taxonomy. Missing values remain unknown.</p></FeatureCard>
      <FeatureCard number="03" title="Recorded changes"><p>Meaningful changes create immutable versions. Unchanged listings receive at most one visibility confirmation per UTC day; a complete source snapshot determines closures.</p></FeatureCard>
    </div></ProductSection>
    <ProductSection eyebrow="Reading the data" title="What the fields can tell you."><div className={s.twoColumns}>
      <FeatureCard title="Locations & countries"><p>Location text comes from the source and may describe more than one place. It is not a normalized city identifier. Country codes are assigned only from explicit supported country evidence; city-only and ambiguous locations can remain null.</p></FeatureCard>
      <FeatureCard title="First & last observed"><p>These dates mark Exende observations, not necessarily a listing’s original publication date. The public freshness timestamp is the latest canonical job observation; it does not mean that every source was checked then.</p></FeatureCard>
      <FeatureCard title="History & movement"><p>Created, updated, and closed events describe recorded versions. Initial collection can create many records at once. Historical coverage does not establish a company’s complete hiring history.</p></FeatureCard>
      <FeatureCard title="Hiring metrics"><p>Role mix and velocity describe observed activity. Acceleration is withheld until the history spans the requested window. These metrics are descriptive evidence, not predictions or guarantees.</p></FeatureCard>
    </div><p className={s.note}>Jobs remain source-scoped. Similar roles across different sources are not automatically merged. Use <Link href="/docs/jobs#hiring-metrics">the metrics documentation</Link> to interpret history readiness and normalization limits.</p></ProductSection>
    <ProductSection eyebrow="Use data with context" title="Keep the source and the boundary."><div className={s.featured}><div data-reveal><p className={s.lead}>The public catalogue preview demonstrates the product. Full search, company context, and history require a scoped customer key.</p><ProductActions /></div><div className={s.protocol} data-reveal><h3>Working with returned data</h3><p className={s.note}>Public availability does not remove third-party rights. Check the <Link href="/terms">Terms of Service</Link> and applicable source requirements for your intended use. Contact <a href="mailto:support@exende.dev">support@exende.dev</a> when your use needs clarification.</p></div></div></ProductSection>
  </>;
}
