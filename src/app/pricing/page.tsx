import { JsonLd } from "@/components/json-ld";
import { ProductHero, ProductActions, ProductSection, productStyles as s } from "@/components/product/product-ui";
import { infrastructurePrices } from "@/content/pricing";
import { siteConfig } from "@/content/site";
import { getPublicPlans } from "@/lib/control-plane";
import { accountHref } from "@/lib/account-intent";
import { ArrowRight, ArrowUpRight, Check, Webhook, RotateCw, ScanSearch } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing and access",
  description:
    "Exende Data API subscriptions, included credits, and exact x402 pricing for infrastructure APIs.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Exende pricing and access",
    description: "Customer Data API plans with included credits and fixed x402 infrastructure pricing.",
    url: "/pricing",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende pricing and access",
    description: "Customer Data API plans with included credits and fixed x402 infrastructure pricing.",
    images: ["/twitter-image"],
  },
};
export const dynamic = "force-dynamic";
const icons = [Webhook, RotateCw, ScanSearch];
export default async function PricingPage() {
  const plans = await getPublicPlans().catch(() => null);
  const paidPlans = plans?.filter(plan => ["starter", "pro", "scale"].includes(plan.key)) ?? null;
  const enterprise = plans?.find(plan => plan.key === "enterprise");
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: "Exende Jobs Data API pricing", description: "Jobs Data subscription credits and separate x402 agent infrastructure prices.", url: `${siteConfig.url}/pricing` }} />
    <ProductHero eyebrow="Jobs Data API pricing" title={<>Start with a question.<br /><span>Scale with your product.</span></>} description="Explore with 2,500 free credits. Choose a monthly plan when your application needs more data. Every successful operation has a documented credit cost.">
      <ProductActions primary="Create free account" secondary="How credits work" secondaryHref="#credits" />
    </ProductHero>
    <ProductSection id="plans">
      <div className={s.allowance} data-reveal><div><p className={s.eyebrow}>Onboarding · Free</p><h3>Your first 2,500 credits.</h3><p>For new verified organizations. Available for 14 days, with scoped API keys and a usage dashboard.</p></div><Link className={s.primary} href={accountHref()}>Create free account <ArrowUpRight /></Link></div>
      {paidPlans?.length ? <div className={s.plans}>{paidPlans.map(plan => <article className={s.plan} data-featured={plan.key === "pro"} key={plan.key} data-reveal>
        <p className={s.eyebrow}>Monthly subscription</p><h3>{plan.name}</h3><div className={s.planPrice}>{plan.priceEurMonthly === null ? "Custom" : `€${plan.priceEurMonthly}`}<small> / month</small></div><p>{plan.description}</p>
        <ul><li><Check />{plan.monthlyCredits.toLocaleString("en-US")} monthly credits</li><li><Check />Scoped Jobs Data API keys</li><li><Check />Search, company data & history</li><li><Check />Credit usage dashboard</li></ul>
        <Link href={accountHref("signup", "/dashboard/billing", plan.key)} className={plan.key === "pro" ? s.primary : s.secondary}>Choose {plan.name} <ArrowUpRight /></Link>
      </article>)}</div> : <div className={s.protocol} role="status"><h3>Monthly plans are temporarily unavailable.</h3><p className={s.note}>Please reload to retrieve current prices. You can still read the credit model and account quickstart.</p><Link href="/pricing" className={s.secondary}>Retry plan lookup <ArrowRight /></Link></div>}
      {enterprise ? <div className={s.allowance} style={{ marginTop: 24, marginBottom: 0 }} data-reveal><div><p className={s.eyebrow}>Enterprise</p><h3>More capacity. A conversation.</h3><p>{enterprise.description}</p></div><a className={s.secondary} href={`mailto:${siteConfig.supportEmail}`}>Discuss your requirements <ArrowRight /></a></div> : null}
      <p className={s.note}>Monthly credit grants expire with their plan period. Listed subscription prices include taxes under the current billing configuration. Review the final terms and amount in checkout before confirming payment.</p>
    </ProductSection>
    <ProductSection id="credits" eyebrow="A transparent credit model" title={<>Credits measure usage.<br />Requests can return more.</>} description="A search is billed per returned record. Detail and metrics operations have fixed costs. An empty per-record search uses zero credits.">
      <dl className={s.creditExamples} data-reveal><div><dt>Search returning 5 records</dt><dd>5 credits</dd></div><div><dt>Search returning 50 records</dt><dd>50 credits</dd></div><div><dt>Company detail</dt><dd>2 credits</dd></div><div><dt>Hiring metrics request</dt><dd>5 credits</dd></div></dl>
      <p className={s.note}>Use a small <code>limit</code> when evaluating search results. You can inspect request usage and remaining credits in your dashboard. <Link href="/docs/jobs#credits">Read every operation’s credit cost.</Link></p>
    </ProductSection>
    <ProductSection id="infrastructure" eyebrow="Agent infrastructure" title={<>A separate workflow.<br />Paid per resource.</>} description="Callback, Retry, and Resolve use x402 v2 exact USDC settlement on Base Mainnet. No Jobs Data subscription is required for these payment paths.">
      <div className={s.rows}>{infrastructurePrices.map((item,i) => { const Icon = icons[i]; return <Link className={s.row} href={item.href} key={item.name} data-reveal><Icon /><div><h3>{item.name}</h3><p>{item.unit}</p></div><span>{item.price} USDC</span><ArrowUpRight /></Link>; })}</div>
      <p className={s.note}>The API’s HTTP 402 response provides the authoritative payment requirements. <Link href="/docs/x402">Read the x402 guide.</Link></p>
    </ProductSection>
  </>;
}
