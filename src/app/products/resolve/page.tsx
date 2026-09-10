import { InfrastructureProduct } from "@/components/product/infrastructure-product";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Resolve API v1 — Public resources to machine-readable output",
  description: "Resolve public web pages, PDFs, data, text, and image metadata into bounded machine-readable output for $0.03 USDC.",
  alternates: { canonical: "/products/resolve" },
  openGraph: {
    title: "Exende Resolve API v1",
    description: "Safe public-resource detection and normalized machine-readable extraction.",
    url: "/products/resolve",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende Resolve API v1",
    description: "Resolve public resources into bounded machine-readable output.",
    images: ["/twitter-image"],
  },
};

export default function ProductPage() { return <InfrastructureProduct product="resolve" />; }
