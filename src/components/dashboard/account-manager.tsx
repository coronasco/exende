"use client";

import type { AccountIdentity } from "@/lib/control-plane-types";
import { AlertTriangle, Check, KeyRound, LogOut, MailCheck, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function AccountManager({ identity }: { identity: AccountIdentity }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [deletionRequested, setDeletionRequested] = useState(false);

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await run("profile", async () => {
      await authRequest("/api/auth/update-user", { name: form.get("name") });
      setMessage({ tone: "success", text: "Profile name updated." });
      router.refresh();
    });
  }

  async function sendPasswordReset() {
    await run("password", async () => {
      await authRequest("/api/auth/request-password-reset", { email: identity.user.email, redirectTo: `${window.location.origin}/account/reset-password` });
      setMessage({ tone: "success", text: "A secure password reset link has been sent." });
    });
  }

  async function revokeOtherSessions() {
    await run("sessions", async () => {
      await authRequest("/api/auth/revoke-other-sessions", {});
      setMessage({ tone: "success", text: "All other active sessions have been revoked." });
    });
  }

  async function requestDeletion() {
    if (!window.confirm("Submit an account deletion request? Access is not removed immediately; the request enters a controlled review workflow.")) return;
    await run("deletion", async () => {
      await managementRequest("/api/control/account/deletion-request");
      setDeletionRequested(true);
      setMessage({ tone: "success", text: "Deletion request recorded. No data has been removed automatically." });
    });
  }

  async function signOut() {
    await run("signout", async () => {
      await authRequest("/api/auth/sign-out", {});
      router.replace("/account");
      router.refresh();
    });
  }

  async function run(key: string, action: () => Promise<void>) {
    setPending(key);
    setMessage(null);
    try { await action(); }
    catch (error) { setMessage({ tone: "error", text: error instanceof Error ? error.message : "The request could not be completed." }); }
    finally { setPending(null); }
  }

  return (
    <>
      <header className="dashboard-heading"><div><p className="eyebrow">Identity & security</p><h1>Account</h1><p>Manage your profile and active sessions without exposing internal organization identifiers.</p></div></header>
      {message ? <p className="billing-notice" data-tone={message.tone}>{message.tone === "success" ? <Check /> : <AlertTriangle />}{message.text}</p> : null}
      <section className="account-settings-grid">
        <article className="dashboard-panel account-settings-card">
          <div className="dashboard-panel__heading"><div><span className="annotation">PROFILE</span><h2>Personal information</h2></div><UserRound /></div>
          <form onSubmit={updateProfile}>
            <label className="auth-field"><span>Name</span><input name="name" defaultValue={identity.user.name} minLength={2} maxLength={80} required /></label>
            <label className="auth-field"><span>Email</span><input value={identity.user.email} readOnly aria-describedby="verified-email" /></label>
            <p id="verified-email" className="account-verified"><MailCheck /> Verified email address</p>
            <button type="submit" className="dashboard-action" disabled={pending !== null}>{pending === "profile" ? "Saving..." : "Save profile"}</button>
          </form>
        </article>

        <article className="dashboard-panel account-settings-card">
          <div className="dashboard-panel__heading"><div><span className="annotation">ORGANIZATION</span><h2>{identity.organization.name}</h2></div><ShieldCheck /></div>
          <dl className="account-org-details"><div><dt>Role</dt><dd>{identity.organization.role}</dd></div><div><dt>Plan</dt><dd>{identity.organization.planKey}</dd></div><div><dt>Status</dt><dd>{identity.organization.status}</dd></div></dl>
          <p>The account model supports future organization members while keeping billing, credits, and keys owned by the organization.</p>
        </article>
      </section>

      <section className="dashboard-panel security-settings">
        <div className="dashboard-panel__heading"><div><span className="annotation">SECURITY</span><h2>Password and sessions</h2></div><KeyRound /></div>
        <div><div><strong>Reset password</strong><p>Receive a one-hour reset link at your verified email address.</p></div><button type="button" onClick={sendPasswordReset} disabled={pending !== null}>{pending === "password" ? "Sending..." : "Send reset link"}</button></div>
        <div><div><strong>Other sessions</strong><p>Revoke every session except the browser you are currently using.</p></div><button type="button" onClick={revokeOtherSessions} disabled={pending !== null}>{pending === "sessions" ? "Revoking..." : "Log out other sessions"}</button></div>
        <div><div><strong>Current session</strong><p>End this session and return to the public website.</p></div><button type="button" onClick={signOut} disabled={pending !== null}><LogOut /> {pending === "signout" ? "Signing out..." : "Sign out"}</button></div>
      </section>

      <section className="dashboard-panel danger-zone">
        <div><span><Trash2 /></span><div><p className="annotation">CONTROLLED DELETION</p><h2>Request account deletion</h2><p>This creates an auditable request. It does not bypass subscription review, retention requirements, or cross-plane cleanup.</p></div></div>
        <button type="button" onClick={requestDeletion} disabled={pending !== null || deletionRequested}>{deletionRequested ? "Request pending" : pending === "deletion" ? "Submitting..." : "Request deletion"}</button>
      </section>
    </>
  );
}

async function authRequest(path: string, body: Record<string, unknown>) {
  const response = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const payload = await response.json().catch(() => null) as { message?: string; error?: { message?: string } } | null;
  if (!response.ok) throw new Error(payload?.message ?? payload?.error?.message ?? "The request could not be completed.");
}

async function managementRequest(path: string) {
  const response = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  const payload = await response.json().catch(() => null) as { error?: { message?: string } } | null;
  if (!response.ok) throw new Error(payload?.error?.message ?? "The request could not be completed.");
}
