import { ProductHero, ProductActions } from "@/components/product/product-ui";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Page not found", description: "The requested Exende page could not be found.", robots: { index: false, follow: false } };
export default function NotFound() {
  return <ProductHero eyebrow="404" title={<>Page not found.<br /><span>A different direction?</span></>} description="This address does not point to an Exende page. Explore the Jobs Data API or return to the homepage."><ProductActions primary="Explore Jobs Data" href="/products/jobs" secondary="Return home" secondaryHref="/" /></ProductHero>;
}
