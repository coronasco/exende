import { PublicCatalogue } from "@/components/catalogue/public-catalogue";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import { getPublicOverview } from "@/lib/dataapi";
import { ArrowRight, ArrowUpRight, ChartNoAxesCombined, Code2, Database, FileSearch, Inbox, KeyRound, Repeat2, UsersRound, Webhook } from "lucide-react";
import { JobsIntelligenceEndpointList } from "@/components/jobs-intelligence/endpoint-list";
import { ProtocolFigure } from "@/components/product/protocol-figure";
import { DataExplorer } from "./data-explorer";
import { ListingExample } from "./listing-example";
import { ListingRecord } from "./listing-record";
import { ObservationHistory } from "./observation-history";
import Link from "next/link";
import { Suspense } from "react";
import { ApiNetwork } from "./api-network";
import { CatalogueLoading, CatalogueMetrics, OverviewTerminal } from "./catalogue";
import { LandingExperience } from "./landing-experience";
import { networkProducts } from "./network-products";
import { RequestFlow } from "./request-flow";
import s from "./network-sections.module.css";

const pipeline = [
  { kind: "sources", title: "Review public sources", copy: "Exende monitors selected, reviewed public career pages. Each record keeps its source so you can check where it came from." },
  { kind: "records", title: "Normalize the records", copy: "Jobs from different sources share a JSON structure for titles, companies, locations, and skills. Records remain scoped to their source." },
  { kind: "history", title: "Observe changes", copy: "Timestamped observations let you follow a listing from its first appearance through later versions and its most recent sighting." },
] as const;

const useCases = [
  { icon: ChartNoAxesCombined, name: "Market research", copy: "Compare observed activity across companies, roles, and periods. Use the reported coverage and freshness to interpret a change.", href: "/docs/jobs-intelligence#trends", action: "Market trends" },
  { icon: UsersRound, name: "Recruiting analytics", copy: "Look up a company’s active roles and requested skills, then follow the hiring history available for its domain.", href: "/docs/jobs#companies", action: "Company data" },
  { icon: Code2, name: "Data products", copy: "Build a job search, company profile, or research tool on structured records using scoped keys and documented credit costs.", href: "/docs/jobs#quickstart", action: "Developer quickstart" },
];
const agentIcons = [Webhook, Repeat2, FileSearch, Inbox];

export function LandingPage() {
  const overview = getPublicOverview();
  return (
    <LandingExperience>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "WebAPI",
          name: "Exende Jobs & Hiring Data",
          description: "Normalized job listings and observed hiring history from reviewed public sources.",
          url: siteConfig.url + "/products/jobs",
          documentation: siteConfig.url + "/docs/jobs",
          provider: { "@type": "Organization", name: "Exende", url: siteConfig.url },
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Exende API products",
          numberOfItems: networkProducts.length,
          itemListElement: networkProducts.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: product.name,
            url: siteConfig.url + "/products/" + product.slug,
          })),
        },
      ]} />
      <ApiNetwork sample={<PublicCatalogue />} />
      <div className={s.sections}>
        <section id="listing" className={s.chapter} aria-labelledby="listing-heading">
          <div className={s.split}>
            <div><p className={s.label}>Inside the catalogue</p>
              <h2 id="listing-heading">What one job record tells you.</h2>
              <p>See the role, employer, and location as Exende observed them. The dates show when the catalogue first and last saw this listing.</p>
              <p className={s.exampleCost}>Jobs Data search · {networkProducts[0].price}</p>
              <a className={s.textLink} href="https://data.exende.dev/v1/public/search?q=Spotify">Inspect the public response <ArrowUpRight /></a>
            </div>
            <Suspense fallback={<ListingRecord later={null} />}><ListingExample /></Suspense>
          </div>
        </section>

        <section id="data-apis" className={s.chapter} aria-labelledby="pipeline-heading">
          <div className={s.centerHead}>
            <h2 id="pipeline-heading">From public listings to structured data.</h2>
          </div>
          <div className={s.pipeline}>
            {pipeline.map(({ kind, title, copy }) => <article key={kind} data-motion-scene>
              <div className={s.illustration}><ProtocolFigure kind={kind} /></div>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>)}
          </div>
        </section>

        <section id="catalogue" className={s.chapter} aria-labelledby="coverage-heading">
          <div className={s.heading}>
            <div><p className={s.label}>Public catalogue</p><h2 id="coverage-heading">Inspect the coverage.</h2></div>
            <p>These are counts from the reviewed catalogue. The timestamp is the latest canonical job observation. Check the source before comparing periods.</p>
          </div>
          <div className={s.figures}><Suspense fallback={<CatalogueLoading />}><CatalogueMetrics overview={overview} /></Suspense></div>
          <div className={s.links}><a href={siteConfig.dataApiOverview}><Database /> GET /v1/public/overview <ArrowUpRight /></a><Link href="/coverage">Coverage &amp; methodology <ArrowRight /></Link></div>
        </section>

        <section id="capabilities" className={s.chapter} aria-labelledby="capabilities-heading">
          <div className={s.split}>
            <div><p className={s.label}>Jobs Data API</p><h2 id="capabilities-heading">Four ways to query the catalogue.</h2>
              <p>Search individual jobs, connect them to companies, inspect their recorded history, or aggregate hiring metrics. Each operation has a defined scope and credit cost.</p>
              <Link href="/products/jobs" className={s.textLink}>Explore Jobs Data <ArrowRight /></Link>
            </div>
            <DataExplorer />
          </div>
        </section>

        <ObservationHistory />

        <section id="jobs-intelligence" className={s.chapter} aria-labelledby="intelligence-heading">
          <div className={s.heading}><div><p className={s.label}>Jobs Intelligence · x402</p><h2 id="intelligence-heading">Seven hiring questions.<br />Pay per request.</h2></div>
            <p>An agent can use a wallet on Base to access these seven GET endpoints. Each response includes the coverage or observation context available for that question.</p>
          </div>
          <div className={`${s.endpoints} orbital-directory`}><JobsIntelligenceEndpointList /></div>
          <div className={s.links}><Link href="/products/jobs-intelligence">Explore Jobs Intelligence <ArrowRight /></Link><Link href="/docs/jobs-intelligence">Endpoint reference <ArrowUpRight /></Link></div>
        </section>

        <section id="use-cases" className={s.chapter} aria-labelledby="applications-heading">
          <div className={s.heading}><div><p className={s.label}>Applications</p><h2 id="applications-heading">What can you build?</h2></div></div>
          <div className={s.cases}>{useCases.map(({ icon: Icon, ...item }) => <article key={item.name}>
            <Icon aria-hidden="true" /><h3>{item.name}</h3><p>{item.copy}</p><Link href={item.href}>{item.action} <ArrowRight /></Link>
          </article>)}</div>
        </section>

        <section id="infrastructure" className={s.chapter} aria-labelledby="tools-heading">
          <div className={s.split}><div><p className={s.label}>Agent infrastructure</p>
            <h2 id="tools-heading">Give an agent the tools to finish the job.</h2>
            <p>Create a receiver, retry a request, read a public resource, or catch a test email. Each tool has its own contract and creation price in USDC on Base.</p>
            <Link href="/docs/x402" className={s.textLink}>How x402 payments work <ArrowRight /></Link></div>
            <div className={s.tools}>{networkProducts.slice(2).map((product,i) => {
              const Icon = agentIcons[i];
              return <article key={product.slug}><div className={s.toolTitle}><Icon /><h3><Link href={`/products/${product.slug}`}>{product.name} <ArrowUpRight /></Link></h3></div>
                <p>{product.copy}</p><div className={s.toolMeta}><span>{product.price}</span><Link href={`/docs/${product.slug}`}>Reference <ArrowRight /></Link></div>
              </article>;
            })}</div>
          </div>
        </section>

        <RequestFlow />

        <section id="access" className={s.chapter} aria-labelledby="access-heading">
          <div className={s.split}><div><p className={s.label}>Developer access</p><h2 id="access-heading">Make your first request.</h2>
            <p>Run the public overview without a key. For customer endpoints, verify your email, create an API key with the required scopes, and send it as a Bearer token.</p>
            <p>New verified organizations receive 2,500 credits for 14 days. A search returning five records costs five credits.</p>
            <div className={s.links}><Link href="/account?mode=signup&next=/dashboard"><KeyRound /> Create an account <ArrowRight /></Link><Link href="/docs/jobs#quickstart">Read the quickstart <ArrowUpRight /></Link></div>
          </div><Suspense fallback={<p>Loading the public overview…</p>}><OverviewTerminal overview={overview} /></Suspense></div>
        </section>
        <section className={s.closing} aria-label="Get started with Exende">
          <h2>Choose your access.</h2><p>Use a scoped key for a data product, or pay for individual calls with x402.</p>
          <div className={s.links}><Link href="/pricing" className={s.primary}>Compare access &amp; pricing <ArrowRight /></Link><Link href="/products">Browse all six products <ArrowUpRight /></Link></div>
        </section>
      </div>
    </LandingExperience>
  );
}
