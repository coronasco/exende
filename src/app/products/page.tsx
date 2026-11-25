import { JsonLd } from "@/components/json-ld";
import { JobsIntelligenceEndpointList } from "@/components/jobs-intelligence/endpoint-list";
import { ProductHero, ProductActions, ProductSection, ProductClosing, productStyles as s } from "@/components/product/product-ui";
import { DataExplorer } from "@/components/landing/data-explorer";
import { ArrowUpRight, Webhook, RotateCw, ScanSearch, MailCheck } from "lucide-react";
import { testInboxStatus } from "@/content/test-inbox";
import { siteConfig } from "@/content/site";
import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Products — Data APIs and agent infrastructure",
  description:
    "Explore Exende Jobs Intelligence with seven pay-per-request APIs, Jobs & Hiring Data subscriptions, and Callback, Retry, and Resolve.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Exende products",
    description: "Public hiring data and focused infrastructure APIs for autonomous software.",
    url: "/products",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende products",
    description: "Public hiring data and focused infrastructure APIs for autonomous software.",
    images: ["/twitter-image"],
  },
};

const infrastructure = [
  { name: "Callback", description: "Receive asynchronous events through temporary webhook endpoints.", price: "$0.01 USDC", href: "/products/callback", icon: Webhook },
  { name: "Retry", description: "Run outbound HTTPS requests with durable retries and attempt history.", price: "$0.02 USDC", href: "/products/retry", icon: RotateCw },
  { name: "Resolve", description: "Turn a public resource into a bounded, machine-readable result.", price: "$0.01 USDC", href: "/products/resolve", icon: ScanSearch },
  { name: "Test Inbox", description: `Private inboxes for signup, password reset, and OTP tests. ${testInboxStatus}.`, price: "$0.02 USDC", href: "/products/test-inbox", icon: MailCheck },
];
export default function ProductsPage() {
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", name: "Exende products", itemListElement: [{ "@type": "ListItem", position: 1, name: "Jobs & Hiring Data", url: `${siteConfig.url}/products/jobs` }, { "@type": "ListItem", position: 2, name: "Jobs Intelligence", url: `${siteConfig.url}/products/jobs-intelligence` }, ...infrastructure.map((p,i) => ({ "@type": "ListItem", position: i+3, name: p.name, url: `${siteConfig.url}${p.href}` }))] }} />
    <ProductHero path="/products" eyebrow="Exende products" title={<>Hiring data &amp;<br /><span>agent APIs.</span></>} description="Choose scoped API access for a data product, or pay per request for hiring intelligence and agent infrastructure.">
      <ProductActions primary="Explore Jobs Data" href="/products/jobs" secondary="View plans" secondaryHref="/pricing" />
      <p className={s.note}>For agents: <Link href="/products/jobs-intelligence">explore seven Jobs Intelligence APIs with x402 pay-per-request access.</Link></p>
    </ProductHero>
    <ProductSection id="jobs-intelligence" eyebrow="Jobs Intelligence · x402" title={<>Hiring intelligence.<br />One request at a time.</>} description="Seven focused APIs for AI agents, from job search to hiring reports. Pay in USDC on Base for the request you need. No API key or subscription required.">
      <div className="orbital-directory"><JobsIntelligenceEndpointList /></div>
      <ProductActions primary="Explore Jobs Intelligence" href="/products/jobs-intelligence" secondary="API docs & examples" secondaryHref="/docs/jobs-intelligence" />
      <p className={s.note}>These seven routes extend the existing api.exende.dev service. Responses describe Exende’s monitored catalogue and include freshness, coverage, and limitations.</p>
    </ProductSection>
    <ProductSection id="jobs">
      <div className={s.featured}>
        <div data-reveal><p className={s.eyebrow}>Jobs & Hiring Data API</p><h2>A changing market.<br />A consistent record.</h2><p>Normalized jobs, company context, skills, and timestamped history from reviewed public career sources. Query the current catalogue or compare what changed over time.</p><ProductActions secondary="Coverage & methodology" secondaryHref="/coverage" /><p className={s.note}>Account access · Scoped API keys · Credit-based usage</p></div>
        <div data-reveal><DataExplorer /></div>
      </div>
    </ProductSection>
    <ProductSection id="infrastructure" eyebrow="For autonomous agents" title={<>Small tools.<br />Useful possibilities.</>} description="Callback, Retry, and Resolve are discoverable in Bazaar. Agents pay per created resource through x402 v2 with USDC on Base.">
      <div className={s.rows}>{infrastructure.map(({ icon: Icon, ...p }) => <Link className={s.row} href={p.href} key={p.name} data-reveal><Icon /><div><h3>{p.name}</h3><p>{p.description}</p></div><span>{p.price}</span><ArrowUpRight /></Link>)}</div>
      <p className={s.note}>Infrastructure x402 payments are separate from Jobs Data subscription credits. <Link href="/docs/x402">Read the payment guide.</Link></p>
    </ProductSection>
    <ProductClosing />
  </>;
}
