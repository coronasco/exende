import { CodeBlock } from "@/components/code-block";
import { ResolveDiagram } from "@/components/exende-visuals";
import { JsonLd } from "@/components/json-ld";
import { resolveExamples } from "@/content/examples";
import { siteConfig } from "@/content/site";
import { ArrowRight, FileSearch, ScanSearch, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resolve API v1 — Public resources to machine-readable output",
  description: "Resolve public web pages, PDFs, data, text, and image metadata into bounded machine-readable output for $0.03 USDC.",
  alternates: { canonical: "/products/resolve" },
  openGraph: {
    title: "Exende Resolve API v1",
    description: "Safe public-resource detection and normalized machine-readable extraction.",
    url: "/products/resolve",
  },
  twitter: {
    card: "summary",
    title: "Exende Resolve API v1",
    description: "Resolve public resources into bounded machine-readable output.",
  },
};

const steps = [
  { number: "01", title: "Validate", description: "Accept one public HTTP or HTTPS URL and reject disallowed network targets.", icon: ShieldCheck },
  { number: "02", title: "Detect", description: "Probe the resource and select one supported extraction path.", icon: ScanSearch },
  { number: "03", title: "Normalize", description: "Return bounded content, data, text, document details, or image metadata.", icon: FileSearch },
] as const;

export default function ResolveProductPage() {
  return (
    <div className="technical-grid min-h-[calc(100svh-72px)]">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Exende Resolve API v1",
        url: `${siteConfig.url}/products/resolve`,
        description: "Resolve public resources into bounded, machine-readable output.",
        provider: { "@type": "Organization", name: "Exende", url: siteConfig.url },
        offers: { "@type": "Offer", price: "0.03", priceCurrency: "USDC", description: "One Resolve job on Base Mainnet." },
      }} />

      <section className="page-shell relative z-10 grid min-h-[680px] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[0.72fr_1.28fr] lg:py-24">
        <div>
          <div className="flex items-center gap-3">
            <p className="section-kicker">Exende Resolve API v1</p>
            <span className="product-status">Available</span>
          </div>
          <h1 className="section-title mt-7 text-[clamp(3.7rem,5vw,5.8rem)] leading-[0.86] text-white">
            Turn public URLs
            <br />into useful data.
          </h1>
          <p className="mt-7 max-w-[570px] text-base leading-8 text-[var(--color-muted)]">
            Resolve safely detects public web pages, PDFs, JSON, CSV, text, and supported images,
            then returns a bounded machine-readable result through one HTTP API.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link href="/docs/resolve" className="button-link" data-variant="solid">Read the docs <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/pricing" className="button-link">View pricing <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
        <div className="product-hero-art lg:w-full lg:max-w-[960px] lg:justify-self-end">
          <ResolveDiagram />
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[rgba(2,7,15,0.9)] py-5 sm:py-7">
        <div className="page-shell grid lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.number} className="workflow-step">
                <p className="font-mono text-[0.82rem] text-[var(--color-accent)]">{step.number}</p>
                <div className="mt-4 flex gap-5">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md border border-[var(--color-border-strong)] text-[var(--color-accent)]"><Icon className="h-6 w-6" /></span>
                  <div><h2 className="text-lg uppercase tracking-[0.14em] text-white">{step.title}</h2><p className="mt-1 text-[0.85rem] leading-6 text-[var(--color-muted)]">{step.description}</p></div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-shell grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="section-kicker">One resource, one result</p>
          <h2 className="section-title mt-5 text-[clamp(2.8rem,4vw,4.7rem)] leading-[0.9] text-white">Detection before extraction.</h2>
          <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">
            Static HTML is fetched first. Browser rendering is used only when requested or when page
            signals show static HTML is not useful. PDF, JSON, CSV, text, XML, and image metadata use
            deterministic format-specific paths; Resolve does not use an LLM or OCR in v1.
          </p>
          <dl className="mt-7 grid grid-cols-2 gap-4 text-sm">
            <div className="fact-tile"><dt>Price</dt><dd>$0.03 USDC</dd></div>
            <div className="fact-tile"><dt>Download</dt><dd>10 MiB max</dd></div>
            <div className="fact-tile"><dt>Output</dt><dd>512 KiB max</dd></div>
            <div className="fact-tile"><dt>Retention</dt><dd>72 hours</dd></div>
          </dl>
        </div>
        <CodeBlock code={resolveExamples.createCurl} language="bash" title="Resolve a public resource — initial request returns HTTP 402" />
      </section>
    </div>
  );
}
