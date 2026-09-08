import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import {
  ArrowRight,
  FileSearch,
  History,
  Webhook,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
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

const infraProducts = [
  {
    icon: Webhook,
    name: "Callback",
    href: "/products/callback",
    docs: "/docs/callback",
    description: "Receive asynchronous events through temporary public webhook endpoints.",
    endpoint: "POST api.exende.dev/v1/callbacks",
    price: "$0.01 USDC",
    tone: "cyan",
  },
  {
    icon: History,
    name: "Retry",
    href: "/products/retry",
    docs: "/docs/retry",
    description: "Execute outbound HTTPS requests as durable jobs with controlled retries.",
    endpoint: "POST retry.exende.dev/v1/retries",
    price: "$0.02 USDC",
    tone: "violet",
  },
  {
    icon: FileSearch,
    name: "Resolve",
    href: "/products/resolve",
    docs: "/docs/resolve",
    description: "Turn bounded public resources into machine-readable output.",
    endpoint: "POST resolve.exende.dev/v1/resolve",
    price: "$0.03 USDC",
    tone: "blue",
  },
] as const;

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Exende products",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Jobs & Hiring Data", url: `${siteConfig.url}/products/jobs` },
            ...infraProducts.map((product, index) => ({
              "@type": "ListItem",
              position: index + 2,
              name: product.name,
              url: `${siteConfig.url}${product.href}`,
            })),
          ],
        }}
      />

      <section className="products-platform-hero">
        <div className="products-platform-hero__art" aria-hidden="true">
          <Image
            src="/media/exende-product-constellation-v1.png"
            alt=""
            fill
            preload
            quality={90}
            sizes="100vw"
          />
        </div>
        <div className="page-shell products-platform-hero__inner">
          <div>
            <p className="eyebrow">Exende platform</p>
            <h1>Data products built to expand with the questions.</h1>
          </div>
          <p>
            Jobs & Hiring Data is the first commercial data product. Callback, Retry, and Resolve
            remain focused infrastructure primitives for systems that act on the data.
          </p>
        </div>
      </section>

      <section className="featured-data-product">
        <div className="page-shell featured-data-product__layout">
          <div className="featured-data-product__copy">
            <span className="product-status"><i /> First data product</span>
            <p className="eyebrow">Jobs & Hiring Data</p>
            <h2>Understand the hiring market beyond a single snapshot.</h2>
            <p>
              Reviewed public career sources, normalized records, current catalogue counts, and
              historical observation for legitimate hiring research and analytics.
            </p>
            <div className="featured-data-product__actions">
              <Link href="/products/jobs" className="primary-cta">Explore Jobs Data <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/docs/jobs" className="secondary-cta">Public API docs</Link>
            </div>
          </div>

          <div className="featured-data-product__visual" aria-hidden="true">
            <Image
              src="/media/exende-jobs-pipeline-v2.png"
              alt=""
              fill
              quality={90}
              sizes="(max-width: 1080px) 100vw, 58vw"
            />
          </div>
        </div>
      </section>

      <section className="infrastructure-products" id="infrastructure">
        <div className="page-shell">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">Agent infrastructure</p>
              <h2>Use one primitive. Compose the system you need.</h2>
            </div>
            <p>
              These production APIs retain independent base URLs, contracts, limits, and x402
              prices. They are not the Jobs Data customer access model.
            </p>
          </div>

          <div className="infra-product-rows">
            {infraProducts.map(({ icon: Icon, ...product }, index) => (
              <article className="infra-product-row" data-tone={product.tone} key={product.name}>
                <div className="infra-product-row__identity">
                  <span>0{index + 1}</span>
                  <Icon />
                  <div><h3>{product.name}</h3><p>{product.description}</p></div>
                </div>
                <div className="infra-product-row__flow" aria-hidden="true">
                  <i /><i /><i /><i /><i />
                </div>
                <div className="infra-product-row__meta">
                  <code>{product.endpoint}</code>
                  <span>{product.price} · x402</span>
                </div>
                <div className="infra-product-row__links">
                  <Link href={product.href}>Product <ArrowRight /></Link>
                  <Link href={product.docs}>Docs</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="product-expansion">
        <div className="page-shell product-expansion__inner">
          <p className="eyebrow">Designed for a growing catalogue</p>
          <h2>Jobs is the beginning, not the boundary.</h2>
          <p>
            New data products will be added only when they have a documented source boundary,
            stable contract, defensible methodology, and product-safe access model.
          </p>
        </div>
      </section>
    </>
  );
}
