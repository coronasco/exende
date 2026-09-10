import { ResetPasswordForm } from "@/components/account/reset-password-form";
import { accountDestination } from "@/lib/account-intent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reset password", description: "Set a new password for your Exende account.", robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string; next?: string }> }) {
  const { token, error, next } = await searchParams;
  return <ResetPasswordForm nextPath={accountDestination(next)} token={typeof token === "string" ? token : null} invalid={error === "INVALID_TOKEN"} />;
}
