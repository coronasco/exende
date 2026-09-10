import { InfrastructureProduct } from "@/components/product/infrastructure-product";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Callback API — Temporary webhooks for AI agents",
  description:
    "Create a temporary callback endpoint, receive external webhook events, and read or wait for them through HTTP for $0.01 USDC.",
  alternates: { canonical: "/products/callback" },
  openGraph: {
    title: "Exende Callback API",
    description: "Temporary public webhook endpoints with token-protected reads and long polling.",
    url: "/products/callback",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende Callback API",
    description: "Temporary public webhook endpoints with token-protected reads and long polling.",
    images: ["/twitter-image"],
  },
};

export default function ProductPage() { return <InfrastructureProduct product="callback" />; }
