import { LandingPage } from "@/components/landing/landing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public hiring data, observed over time",
  description:
    "Reviewed public hiring data for market research, recruiting analytics, and product development, with current catalogue metrics and historical observation.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Exende — The data layer for hiring intelligence",
    description: "Public hiring data, normalized and observed over time.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende — The data layer for hiring intelligence",
    description: "Public hiring data, normalized and observed over time.",
  },
};

export default LandingPage;
