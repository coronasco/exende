"use client";

import { ArrowRight, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";

export function ResetPasswordForm({ token, invalid }: { token: string | null; invalid: boolean }) {
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<string | null>(invalid || !token ? "This reset link is invalid or has expired." : null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmation") ?? "");
    if (password !== confirmation) return setError("The passwords do not match.");
    setPending(true);
    setError(null);
    const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ newPassword: password, token }) });
    if (response.ok) setComplete(true);
    else {
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      setError(payload?.message ?? "The password could not be reset.");
    }
    setPending(false);
  }

  return (
    <section className="auth-page auth-page--reset">
      <div className="auth-page__grid" aria-hidden="true" />
      <div className="auth-reset-card">
        <LockKeyhole /><p className="eyebrow">Account recovery</p><h1>{complete ? "Password updated." : "Choose a new password."}</h1>
        {complete ? <><p>Your active sessions were revoked. Sign in again with the new password.</p><Link href="/account" className="auth-submit">Return to sign in <ArrowRight /></Link></> : (
          <form onSubmit={submit} className="auth-form">
            <label className="auth-field"><span>New password</span><input name="password" type="password" minLength={12} maxLength={128} autoComplete="new-password" required disabled={!token} /></label>
            <label className="auth-field"><span>Confirm password</span><input name="confirmation" type="password" minLength={12} maxLength={128} autoComplete="new-password" required disabled={!token} /></label>
            {error ? <p className="auth-message" data-tone="error" role="alert">{error}</p> : null}
            <button className="auth-submit" type="submit" disabled={pending || !token}>{pending ? "Updating..." : "Update password"}<ArrowRight /></button>
          </form>
        )}
      </div>
    </section>
  );
}
