import { JsonLd } from "@/components/json-ld";
import { LiveOverview, LiveOverviewFallback } from "@/components/live-overview";
import { siteConfig } from "@/content/site";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  Check,
  Clock3,
  Database,
  FileSearch,
  History,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  Webhook,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Public hiring data, observed over time",
  description:
    "Reviewed public hiring data for market research, recruiting analytics, and product development, with current catalogue metrics and historical observation.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Exende — The data layer for hiring intelligence",
    description: "Public hiring data, normalized and observed over time.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Exende — The data layer for hiring intelligence",
    description: "Public hiring data, normalized and observed over time.",
  },
};

const infrastructure = [
  {
    icon: Webhook,
    name: "Callback",
    description: "Temporary webhook endpoints for asynchronous events.",
    href: "/products/callback",
    tone: "cyan",
  },
  {
    icon: History,
    name: "Retry",
    description: "Durable outbound HTTP requests with controlled backoff.",
    href: "/products/retry",
    tone: "violet",
  },
  {
    icon: FileSearch,
    name: "Resolve",
    description: "Bounded machine-readable output from public resources.",
    href: "/products/resolve",
    tone: "blue",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebAPI",
          name: "Exende Jobs & Hiring Data",
          description: "Reviewed public hiring data with current catalogue counts and historical observation.",
          url: `${siteConfig.url}/products/jobs`,
          documentation: `${siteConfig.url}/docs/jobs`,
          provider: { "@type": "Organization", name: "Exende", url: siteConfig.url },
        }}
      />

      <section className="data-hero">
        <div className="data-hero__grid" />
        <div className="data-hero__art" aria-hidden="true">
          <Image
            src="/media/exende-data-globe-v3.png"
            alt=""
            fill
            preload
            quality={90}
            sizes="(max-width: 900px) 100vw, 68vw"
          />
        </div>
        <div className="page-shell data-hero__inner">
          <div className="data-hero__copy">
            <p className="eyebrow">Public data for more capable systems</p>
            <h1>
              The data layer for <span>hiring intelligence.</span>
            </h1>
            <p className="data-hero__lead">
              Reviewed public hiring data, normalized for research, analytics, and products that
              need a reliable view of how companies are hiring.
            </p>
            <div className="data-hero__actions">
              <Link href="/products/jobs" className="primary-cta">
                Explore jobs data <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/docs/jobs" className="secondary-cta">
                View public API
              </Link>
            </div>
            <ul className="hero-trust" aria-label="Product principles">
              <li><Check /> Reviewed public sources</li>
              <li><Check /> Observed over time</li>
              <li><Check /> Built for developers</li>
            </ul>
          </div>

          <div className="globe-signals" aria-hidden="true">
            <div className="globe-signal globe-signal--one">
              <BriefcaseBusiness />
              <span><strong>Hiring data</strong>Current catalogue</span>
            </div>
            <div className="globe-signal globe-signal--two">
              <History />
              <span><strong>Historical context</strong>Observed over time</span>
            </div>
            <div className="globe-signal globe-signal--three">
              <Database />
              <span><strong>Normalized records</strong>Consistent structure</span>
            </div>
          </div>
        </div>
      </section>

      <section className="proof-band" aria-labelledby="catalogue-proof-title">
        <div className="page-shell">
          <div className="proof-band__heading">
            <div>
              <p className="eyebrow">Catalogue proof</p>
              <h2 id="catalogue-proof-title">Current coverage, from the source.</h2>
            </div>
            <p>
              These values come from Exende&apos;s public aggregate endpoint. They are catalogue
              counts, not claims of complete market coverage.
            </p>
          </div>
          <Suspense fallback={<LiveOverviewFallback />}>
            <LiveOverview />
          </Suspense>
        </div>
      </section>

      <section className="data-section data-section--jobs" id="data-apis">
        <div className="page-shell data-product-layout">
          <div className="data-product-copy">
            <p className="eyebrow">Jobs & Hiring Data</p>
            <h2>One changing market. A cleaner data layer.</h2>
            <p>
              Public career sources are inconsistent by design. Exende reviews sources,
              normalizes observations, and preserves the time dimension needed to understand
              what changed, not only what is visible now.
            </p>
            <Link href="/products/jobs" className="inline-arrow">
              Explore the data product <ArrowRight />
            </Link>
          </div>

          <div className="pipeline-stage" aria-label="Exende data pipeline">
            <div className="pipeline-stage__rail" />
            <div className="pipeline-node">
              <Radar />
              <span>Reviewed sources</span>
              <small>Public career pages</small>
            </div>
            <div className="pipeline-node pipeline-node--bright">
              <Database />
              <span>Normalize</span>
              <small>Consistent records</small>
            </div>
            <div className="pipeline-node">
              <Clock3 />
              <span>Observe</span>
              <small>Historical movement</small>
            </div>
            <div className="pipeline-node pipeline-node--output">
              <Search />
              <span>Access</span>
              <small>Product-safe APIs</small>
            </div>
          </div>
        </div>
      </section>

      <section className="history-section">
        <div className="page-shell history-layout">
          <div className="history-visual" aria-hidden="true">
            <div className="history-orbit history-orbit--one" />
            <div className="history-orbit history-orbit--two" />
            <div className="history-core"><History /></div>
            <div className="history-event history-event--one"><span />First observed</div>
            <div className="history-event history-event--two"><span />Changed</div>
            <div className="history-event history-event--three"><span />Last observed</div>
          </div>
          <div className="history-copy">
            <p className="eyebrow">The value of time</p>
            <h2>A listing is a snapshot. Observation creates context.</h2>
            <p>
              Historical observation makes it possible to study hiring movement without treating
              a single crawl as the whole market. Exende records what was publicly observable and
              when it changed.
            </p>
            <div className="history-facts">
              <div><strong>Current</strong><span>Canonical active catalogue</span></div>
              <div><strong>Observed</strong><span>Timestamped public signals</span></div>
              <div><strong>Bounded</strong><span>Claims tied to reviewed sources</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="data-section" id="use-cases">
        <div className="page-shell">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">Built for evidence-led teams</p>
              <h2>Hiring signals with a documented boundary.</h2>
            </div>
            <p>
              Use current catalogue counts and historical observation for research. Exende does
              not claim universal coverage or guaranteed real-time completeness.
            </p>
          </div>
          <div className="use-case-row">
            <article><Building2 /><h3>Market research</h3><p>Compare visible hiring activity across observed companies and time periods.</p></article>
            <article><Radar /><h3>Recruiting analytics</h3><p>Build normalized views of roles, sources, and public hiring movement.</p></article>
            <article><Sparkles /><h3>Data products</h3><p>Add reviewed hiring context to applications without rebuilding the collection layer.</p></article>
          </div>
        </div>
      </section>

      <section className="developer-section" id="access">
        <div className="page-shell developer-layout">
          <div className="developer-copy">
            <p className="eyebrow">Developer access</p>
            <h2>Start with the public catalogue overview.</h2>
            <p>
              The aggregate overview is available today without an Exende key. Product-safe job
              search, company data, customer accounts, and subscription access are coming soon.
            </p>
            <div className="availability-note">
              <ShieldCheck />
              <span><strong>No internal access exposed.</strong> Protected DataAPI operations and operator tooling remain private.</span>
            </div>
            <Link href="/docs/jobs" className="primary-cta">
              Read the public API docs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="terminal-card">
            <div className="terminal-card__top">
              <span>Public overview</span>
              <span>GET</span>
            </div>
            <pre><code><span className="terminal-muted"># Current catalogue aggregates</span>{"\n"}curl &quot;{siteConfig.dataApiOverview}&quot; \
  -H &quot;Accept: application/json&quot;</code></pre>
            <div className="terminal-schema">
              <p>Response fields</p>
              <span><b>active_jobs</b> finite non-negative number</span>
              <span><b>active_companies</b> finite non-negative number</span>
              <span><b>active_sources</b> finite non-negative number</span>
              <span><b>last_updated_at</b> ISO 8601 UTC or null</span>
            </div>
          </div>
        </div>
      </section>

      <section className="agent-access-section">
        <div className="page-shell agent-access-layout">
          <div>
            <p className="eyebrow">Agent access</p>
            <h2>Human plans first. x402 where agents need direct access.</h2>
          </div>
          <p>
            Exende&apos;s established infrastructure APIs can be discovered and paid per resource
            through x402 v2 on Base. Customer Jobs Data plans and entitlements are a separate,
            upcoming access model.
          </p>
          <Link href="/docs/x402" className="inline-arrow">How x402 works <ArrowRight /></Link>
        </div>
      </section>

      <section className="infrastructure-section" id="infrastructure">
        <div className="page-shell">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">Agent infrastructure</p>
              <h2>Focused APIs for the work around the data.</h2>
            </div>
            <p>Secondary primitives for event capture, resilient execution, and public-resource resolution.</p>
          </div>
          <div className="infrastructure-list">
            {infrastructure.map(({ icon: Icon, name, description, href, tone }, index) => (
              <Link href={href} className="infrastructure-item" data-tone={tone} key={name}>
                <span className="infrastructure-item__number">0{index + 1}</span>
                <Icon />
                <span><strong>{name}</strong><small>{description}</small></span>
                <ArrowRight />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="page-shell final-cta__inner">
          <Bot aria-hidden="true" />
          <p className="eyebrow">Build on public evidence</p>
          <h2>Bring hiring data into your next product.</h2>
          <p>Explore what is available today and what is coming next.</p>
          <div>
            <Link href="/products/jobs" className="primary-cta">Explore Jobs Data <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/pricing" className="secondary-cta">Access & pricing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
