import { LandingPage } from "@/components/landing/landing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs Data API, Hiring Intelligence & Agent APIs",
  description:
    "Search normalized public job listings, track company hiring changes, and explore reviewed coverage. Use a scoped Jobs Data API key or pay per request with x402.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Exende — Jobs Data API & Hiring Intelligence",
    description: "Public hiring data, normalized and observed over time.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exende — Jobs Data API & Hiring Intelligence",
    description: "Public hiring data, normalized and observed over time.",
  },
};

export default LandingPage;
