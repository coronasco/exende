import { PublicCatalogue } from "@/components/catalogue/public-catalogue";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import { getPublicOverview } from "@/lib/dataapi";
import { ArrowRight, ArrowUpRight, ChartNoAxesCombined, Clock3, Code2, Database, FileCheck2, Fingerprint, Info, RotateCw, ScanSearch, UsersRound, Webhook } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CatalogueMetrics, CatalogueLoading, OverviewTerminal } from "./catalogue";
import { DataExplorer } from "./data-explorer";
import { HoverCard, LandingExperience } from "./landing-experience";
import { OrbitalGlobe } from "./orbital-globe";
import styles from "./landing.module.css";

const pipeline = [
  { title: "Review public sources", description: "Deliberately selected, public career sources.", icon: FileCheck2 },
  { title: "Normalize records", description: "A consistent structure across different sources.", icon: Database },
  { title: "Observe change", description: "Timestamped observations that add context over time.", icon: ChartNoAxesCombined },
];
const observations = [
  { title: "First observed", description: "Establish when a public listing first entered the observed record.", label: "An observation begins", events: ["Public listing observed"], icon: Fingerprint },
  { title: "Changes recorded", description: "Keep context as the information in a listing changes over time.", label: "Context accumulates", events: ["Initial observation", "Updated information", "Historical record"], icon: Clock3 },
  { title: "Last observed", description: "See the latest recorded observation within the available history.", label: "A documented boundary", events: ["Most recent observation"], icon: ScanSearch },
];
const infrastructure = [
  { name: "Callback", description: "Temporary webhook endpoints.", href: "/products/callback", icon: Webhook },
  { name: "Retry", description: "Durable HTTP requests with backoff.", href: "/products/retry", icon: RotateCw },
  { name: "Resolve", description: "Machine-readable public resources.", href: "/products/resolve", icon: ScanSearch },
];

export function LandingPage() {
  const overview = getPublicOverview();
  return (
    <LandingExperience>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebAPI", name: "Exende Jobs & Hiring Data", description: "Reviewed public hiring data with current catalogue counts and historical observation.", url: `${siteConfig.url}/products/jobs`, documentation: `${siteConfig.url}/docs/jobs`, provider: { "@type": "Organization", name: "Exende", url: siteConfig.url } }} />
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={`${styles.shell} ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Jobs &amp; Hiring Data API</p>
            <h1 id="hero-title">The data layer<br />for hiring<br /><span>intelligence.</span></h1>
            <p className={styles.heroLead}>Search normalized public job listings, explore company hiring activity, and observe changes through one API.</p>
            <div className={styles.actions}>
              <Link href="#catalogue" className={styles.primary}>Explore sample data <ArrowUpRight /></Link>
              <Link href="/account?mode=signup&next=/dashboard" className={styles.secondary}>Start with 2,500 free credits <ArrowRight /></Link>
            </div>
          </div>
          <OrbitalGlobe />
        </div>
      </section>
      <section id="catalogue" className={styles.proof} aria-labelledby="catalogue-proof-title">
        <div className={styles.shell}>
          <div className={styles.splitHeading} data-reveal>
            <div><p className={styles.eyebrow}>Catalogue proof</p><h2 id="catalogue-proof-title">Coverage you<br />can inspect.</h2></div>
            <p className={styles.body}>An open view of the catalogue, straight from the public API. Real counts, clear definitions, and the timestamp of the latest observation.</p>
          </div>
          <div className={styles.catalogue} data-reveal>
            <div className={styles.catalogueTop}>
              <a href={siteConfig.dataApiOverview} className={styles.endpoint}><span>GET</span><code>/v1/public/overview</code><ArrowUpRight /></a>
              <span className={styles.publicAccess}>Public · no key required</span>
            </div>
            <Suspense fallback={<CatalogueLoading />}><CatalogueMetrics overview={overview} /></Suspense>
            <div className={styles.catalogueDetails}>
              <div><Database /><h3>Source scope</h3><p>Enabled, reviewed public career sources. Coverage grows as sources are reviewed.</p></div>
              <div><Code2 /><h3>Record format</h3><p>Canonical job records, company context, and structured JSON through the Data API.</p></div>
              <div><Clock3 /><h3>Observation window</h3><p>Recorded observations over time. Data freshness reflects the latest canonical job observation.</p></div>
            </div>
            <div className={styles.catalogueFoot}>
              <p><Info />Counts describe reviewed coverage, not the whole market.</p>
              <PublicCatalogue />
            </div>
          </div>
        </div>
      </section>
      <section className={styles.section} id="data-apis" aria-labelledby="data-title">
        <div className={`${styles.shell} ${styles.productInner}`}>
          <div data-reveal>
            <p className={styles.eyebrow}>Jobs &amp; Hiring Data</p>
            <h2 id="data-title">One changing market.<br />A cleaner data layer.</h2>
            <p className={styles.body}>Public career pages are inconsistent. Exende turns reviewed hiring observations into a consistent data layer you can search, compare, and build with.</p>
            <ol className={styles.pipeline}>{pipeline.map(({ title, description, icon: Icon }) => <li key={title}><Icon /><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
          </div>
          <div className={styles.productPreview} data-reveal><DataExplorer /></div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.history}`} aria-labelledby="history-title">
        <div className={styles.shell}>
          <div className={styles.centerHeading} data-reveal>
            <p className={styles.eyebrow}>The value of time</p>
            <h2 id="history-title">A listing is a snapshot.<br />Observation creates context.</h2>
            <p className={styles.body}>Understand what was publicly observable, and how it changed.<br />Build a view that goes beyond a single moment.</p>
          </div>
          <div className={styles.timeline}>
            {observations.map(({ title, description, label, events, icon: Icon }, index) => (
              <div data-reveal key={title}>
                <HoverCard className={styles.observationCard}>
                  <div className={styles.cardNumber}><span>0{index + 1}</span><Icon /></div>
                  <h3>{title}</h3><p>{description}</p>
                  <ol className={styles.observationEvents} aria-label={label}>{events.map(event => <li key={event}><i aria-hidden="true" /><span>{event}</span></li>)}</ol>
                  <small>{label}</small>
                </HoverCard>
              </div>
            ))}
          </div>
          <p className={styles.historyNote} data-reveal>Observation dates describe the available record, not a company’s complete hiring history.</p>
        </div>
      </section>
      <section className={styles.section} id="use-cases" aria-labelledby="use-cases-title">
        <div className={`${styles.shell} ${styles.useCasesInner}`}>
          <div data-reveal><p className={styles.eyebrow}>Built for evidence-led teams</p><h2 id="use-cases-title">Hiring signals with a documented boundary.</h2><p className={styles.body}>A clearer view of public hiring activity, with the source and time context your work needs.</p></div>
          <div className={styles.useCaseGrid}>
            <article data-reveal><ChartNoAxesCombined /><h3>Market research</h3><p>Compare observed hiring activity across companies and time.</p><div className={styles.useCaseDetail}><span>Research dimensions</span><ul><li>Company activity</li><li>Reviewed sources</li><li>Historical movement</li></ul></div></article>
            <article data-reveal><UsersRound /><h3>Recruiting analytics</h3><p>Connect roles, companies, and observations in a consistent view.</p><div className={styles.useCaseDetail}><span>Connected context</span><div className={styles.contextTags}><span>Jobs</span><span>Companies</span><span>Skills</span><span>History</span></div></div></article>
            <article data-reveal><Code2 /><h3>Data products</h3><p>Bring reviewed hiring context into your own applications.</p><div className={styles.useCaseDetail}><span>Documented access</span><code>jobs:read<br />companies:read<br />signals:read</code></div></article>
          </div>
        </div>
      </section>
      <section className={styles.section} id="access" aria-labelledby="access-title">
        <div className={`${styles.shell} ${styles.developerInner}`}>
          <div data-reveal>
            <p className={styles.eyebrow}>Developer access</p>
            <h2 id="access-title">Start with a scoped<br />Data API key.</h2>
            <p className={styles.body}>Explore the public overview first. Create a verified account for scoped access to job search, company data, history, and hiring metrics.</p>
            <div className={styles.actions}><Link href="/account?mode=signup&next=/dashboard" className={styles.primary}>Get started <ArrowUpRight /></Link><Link href="/docs/jobs" className={styles.secondary}>Read the docs <ArrowRight /></Link></div>
          </div>
          <div data-reveal><Suspense fallback={<div className={styles.terminalLoading} aria-label="Loading public overview example" />}><OverviewTerminal overview={overview} /></Suspense></div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.agents}`} id="infrastructure" aria-labelledby="agents-title">
        <div className={`${styles.shell} ${styles.agentsInner}`}>
          <div data-reveal>
            <p className={styles.eyebrow}>For autonomous agents</p>
            <h2 id="agents-title">Small tools for<br />agent workflows.</h2>
            <p className={styles.body}>Discover Callback, Retry, and Resolve in Bazaar. Agents pay per resource through x402 v2 on Base.</p>
            <p className={styles.agentBoundary}>Jobs Data uses accounts and scoped API keys.</p>
            <Link href="/docs/x402" className={styles.textLink}>Explore agent APIs <ArrowRight /></Link>
          </div>
          <div className={styles.agentProducts} data-reveal>
            {infrastructure.map(({ name, description, href, icon: Icon }) => <Link href={href} key={name}><span className={styles.agentIcon}><Icon /></span><div><h3>{name}</h3><p>{description}</p></div><ArrowUpRight /></Link>)}
            <span className={styles.agentProtocol}>x402 v2 <i /> Bazaar discovery <i /> Base</span>
          </div>
        </div>
      </section>
      <section className={styles.finalCta} aria-labelledby="final-title">
        <div className={`${styles.shell} ${styles.centerHeading}`} data-reveal>
          <p className={styles.eyebrow}>Build on public evidence</p>
          <h2 id="final-title">Bring hiring data<br />into your next product.</h2>
          <p className={styles.body}>Explore the catalogue. Build with documented, scoped API access.</p>
          <div className={styles.actions}><Link href="/products/jobs" className={styles.primary}>Explore Jobs Data <ArrowUpRight /></Link><Link href="/pricing" className={styles.secondary}>Access &amp; pricing <ArrowRight /></Link></div>
        </div>
      </section>
    </LandingExperience>
  );
}
