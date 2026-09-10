import { JsonLd } from "@/components/json-ld";
import { ProductHero, ProductActions, ProductSection, ProductClosing, productStyles as s } from "@/components/product/product-ui";
import { DataExplorer } from "@/components/landing/data-explorer";
import { ArrowUpRight, Webhook, RotateCw, ScanSearch } from "lucide-react";
import { siteConfig } from "@/content/site";
import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Products — Data APIs and agent infrastructure",
  description:
    "Explore Exende Jobs & Hiring Data, plus Callback, Retry, and Resolve infrastructure APIs.",
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
  { name: "Resolve", description: "Turn a public resource into a bounded, machine-readable result.", price: "$0.03 USDC", href: "/products/resolve", icon: ScanSearch },
];
export default function ProductsPage() {
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", name: "Exende products", itemListElement: [{ "@type": "ListItem", position: 1, name: "Jobs & Hiring Data", url: `${siteConfig.url}/products/jobs` }, ...infrastructure.map((p,i) => ({ "@type": "ListItem", position: i+2, name: p.name, url: `${siteConfig.url}${p.href}` }))] }} />
    <ProductHero eyebrow="Exende products" title={<>Hiring data.<br /><span>Ready to build with.</span></>} description="Search public job listings, understand company hiring activity, and follow observed changes through one consistent API.">
      <ProductActions primary="Explore Jobs Data" href="/products/jobs" secondary="View plans" secondaryHref="/pricing" />
    </ProductHero>
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
