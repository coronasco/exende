import { JsonLd } from "@/components/json-ld";
import { ProductFlow, ProductsHeaderFlow } from "@/components/exende-visuals";
import { siteConfig } from "@/content/site";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products — Callback and Retry APIs",
  description:
    "Explore Exende Callback for temporary webhooks and Exende Retry for durable outbound HTTP requests.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Exende products — Callback and Retry",
    description: "Two focused infrastructure APIs for AI agents and automated workflows.",
    url: "/products",
  },
  twitter: {
    card: "summary",
    title: "Exende products — Callback and Retry",
    description: "Two focused infrastructure APIs for AI agents and automated workflows.",
  },
};

const products = [
  {
    number: "01",
    name: "Callback",
    href: "/products/callback",
    docs: "/docs/callback",
    description:
      "Create a temporary public webhook endpoint, receive external events, then read or wait for them with a private capability token.",
    endpoint: `POST ${siteConfig.callbackApiBase}/v1/callbacks`,
    price: "$0.01 USDC per callback",
    detail: "10 minutes · 10 events · 256 KB per event",
    tone: "cyan",
  },
  {
    number: "02",
    name: "Retry",
    href: "/products/retry",
    docs: "/docs/retry",
    description:
      "Execute an outbound HTTPS request as a durable job with retries, recovery, status polling, attempt history, and an optional terminal callback.",
    endpoint: `POST ${siteConfig.retryApiBase}/v1/retries`,
    price: "$0.02 USDC per paid job",
    detail: "Up to 8 attempts · up to 24 hours · no per-attempt surcharge",
    tone: "violet",
  },
] as const;

export default function ProductsPage() {
  return (
    <div className="technical-grid relative min-h-[calc(100svh-72px)] overflow-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Exende infrastructure APIs",
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${siteConfig.url}${product.href}`,
            name: `Exende ${product.name}`,
          })),
        }}
      />
      <div className="page-shell relative z-10 py-14 sm:py-20">
        <header className="products-hero grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div className="max-w-[700px]">
            <p className="section-kicker">Production products</p>
            <span className="mt-3 block h-[3px] w-12 bg-[var(--color-accent)] shadow-[0_0_12px_rgba(32,215,234,0.55)]" />
            <h1 className="section-title mt-5 text-[clamp(3.5rem,5.2vw,5.5rem)] leading-[0.84] text-white">
              The primitives
              <br />agents need<span className="text-[var(--color-accent)]">.</span>
            </h1>
            <p className="mt-5 max-w-[620px] text-[1.05rem] leading-8 text-[var(--color-muted)]">
              Callback receives asynchronous events. Retry makes outbound requests durable. Each is a
              separate API with its own contract, pricing, limits, and documentation.
            </p>
          </div>
          <div className="products-hero-visual">
            <ProductsHeaderFlow />
          </div>
        </header>

        <div className="mt-12 grid gap-5 sm:mt-16">
          {products.map((product) => (
            <article key={product.name} className="product-overview-row" data-tone={product.tone}>
              <div className="product-number">{product.number}</div>
              <div>
                <p className="annotation text-[var(--color-accent)]">Exende</p>
                <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] uppercase tracking-[0.035em] text-white">
                  {product.name}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                  {product.description}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href={product.href} className="button-link" data-variant="accent">
                    Product details <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href={product.docs} className="button-link">
                    Read docs <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="min-w-0">
                <ProductFlow variant={product.tone === "violet" ? "retry" : "callback"} />
                <pre className="mt-5 overflow-x-auto rounded border border-[var(--color-border)] bg-black/20 p-4 font-mono text-xs leading-6 text-white">
                  <code>{`curl -X POST \\\n+  ${product.endpoint.replace("POST ", "")} \\\n+  -H "Content-Type: application/json"`}</code>
                </pre>
              </div>
              <dl className="space-y-4 text-sm">
                <div><dt className="annotation text-[var(--color-muted)]">x402 price</dt><dd className="mt-2 text-white">{product.price}</dd></div>
                <div><dt className="annotation text-[var(--color-muted)]">Included</dt><dd className="mt-2 leading-6 text-[var(--color-muted)]">{product.detail}</dd></div>
                <div><dt className="annotation text-[var(--color-muted)]">Network</dt><dd className="mt-2 text-white">Base · eip155:8453</dd></div>
              </dl>
            </article>
          ))}
        </div>

        <p className="mt-7 text-right font-mono text-[0.67rem] text-[var(--color-muted)]">
          Callback: {siteConfig.callbackApiBase} · Retry: {siteConfig.retryApiBase}
        </p>
      </div>
    </div>
  );
}
