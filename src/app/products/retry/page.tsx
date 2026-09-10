import { InfrastructureProduct } from "@/components/product/infrastructure-product";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Retry API v1 — Durable HTTP retries for AI agents",
  description:
    "Execute outbound HTTPS requests as durable jobs with automatic retries, status polling, attempt history, and optional terminal callbacks.",
  alternates: { canonical: "/products/retry" },
  openGraph: {
    title: "Exende Retry API v1",
    description: "Durable outbound HTTP jobs with recovery and up to 8 attempts for $0.02 USDC.",
    url: "/products/retry",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende Retry API v1",
    description: "Durable outbound HTTP jobs with recovery and up to 8 attempts for $0.02 USDC.",
    images: ["/twitter-image"],
  },
};

export default function ProductPage() { return <InfrastructureProduct product="retry" />; }
