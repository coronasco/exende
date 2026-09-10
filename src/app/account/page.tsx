import { AuthPanel } from "@/components/account/auth-panel";
import { ControlPlaneError, controlPlaneBaseUrl, getAccountIdentity } from "@/lib/control-plane";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { accountDestination } from "@/lib/account-intent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in or create an account",
  description: "Create and manage your Exende account, API keys, credits, usage, and billing.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false },
  openGraph: { title: "Exende customer access", description: "Create and manage your Exende account and Data API access.", url: "/account", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "Exende customer access", description: "Create and manage your Exende account and Data API access.", images: ["/twitter-image"] },
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ next?: string; mode?: string; plan?: string }> }) {
  const params = await searchParams;
  const nextPath = accountDestination(params.next, params.plan);
  const initialMode = params.mode === "signup" ? "register" : "signin";
  let serviceAvailable = controlPlaneBaseUrl() !== null;
  let authenticated = false;
  if (serviceAvailable) {
    try {
      await getAccountIdentity();
      authenticated = true;
    } catch (error) {
      if (!(error instanceof ControlPlaneError) || error.status !== 401) serviceAvailable = false;
    }
  }
  if (authenticated) redirect(nextPath);
  return <AuthPanel key={`${initialMode}:${nextPath}`} initialMode={initialMode} serviceAvailable={serviceAvailable} nextPath={nextPath} />;
}
