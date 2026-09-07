import { ResetPasswordForm } from "@/components/account/reset-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reset password", description: "Set a new password for your Exende account.", robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string }> }) {
  const { token, error } = await searchParams;
  return <ResetPasswordForm token={typeof token === "string" ? token : null} invalid={error === "INVALID_TOKEN"} />;
}
