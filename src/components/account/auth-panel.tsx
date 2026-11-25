"use client";

import { ProtocolFigure } from "@/components/product/protocol-figure";
import design from "@/components/product/access.module.css";

import { ArrowRight, Check, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";

import { accountHref } from "@/lib/account-intent";
import { productEvent } from "@/lib/product-events";

type AuthMode = "signin" | "register" | "forgot";

export function AuthPanel({ serviceAvailable, nextPath, initialMode = "signin" }: { serviceAvailable: boolean; nextPath: string; initialMode?: "signin" | "register" }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  function changeMode(value: AuthMode) {
    if (pending) return;
    setMode(value);
    setMessage(null);
    window.history.replaceState(null, "", accountHref(value === "register" ? "signup" : "signin", nextPath));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      if (mode === "forgot") {
        await authRequest("/api/auth/request-password-reset", { email: form.get("email"), redirectTo: `${window.location.origin}/account/reset-password?${new URLSearchParams({ next: nextPath })}` });
        setMessage({ tone: "success", text: "If the address exists, a secure reset link has been sent." });
        return;
      }
      if (mode === "register") {
        productEvent("signup_started");
        await authRequest("/api/auth/sign-up/email", {
          name: form.get("name"), email: form.get("email"), password: form.get("password"), callbackURL: `${window.location.origin}${nextPath}`,
        });
        productEvent("signup_completed");
        setMessage({ tone: "success", text: "Account created. Check your email to verify it before signing in." });
        return;
      }
      await authRequest("/api/auth/sign-in/email", {
        email: form.get("email"), password: form.get("password"), rememberMe: true, callbackURL: `${window.location.origin}${nextPath}`,
      });
      window.location.assign(nextPath);
    } catch (error) {
      setMessage({ tone: "error", text: error instanceof Error ? error.message : "The request could not be completed." });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={`auth-page ${design.access}`}>
      <div className="page-shell auth-page__inner">
        <div className="auth-page__intro">
          <p className="eyebrow">Jobs Data API access</p>
          <h1>Your Jobs Data<br /><span>workspace.</span></h1>
          <p>Search public jobs, explore company hiring, and work with observed changes. Start with 2,500 free credits after email verification.</p>
          <div className={design.keyDiagram}><ProtocolFigure kind="access" /></div>
          <div className="auth-page__signal"><span><KeyRound /></span><div><strong>Create your API key</strong><small>Choose scopes and keep your key in a server environment.</small></div></div>
          <div className="auth-page__signal"><span><ShieldCheck /></span><div><strong>Make your first request</strong><small>Copy a search request, receive data, and inspect credit usage.</small></div></div>
        </div>

        <div className="auth-card">
          <div className="auth-card__status"><span data-live={serviceAvailable}><i /> {serviceAvailable ? "Secure access online" : "Account service unavailable"}</span><LockKeyhole /></div>
          {mode !== "forgot" ? (
            <div className="auth-tabs" data-mode={mode} role="group" aria-label="Account access">
              <button type="button" aria-pressed={mode === "signin"} onClick={() => changeMode("signin")}>Sign in</button>
              <button type="button" aria-pressed={mode === "register"} onClick={() => changeMode("register")}>Create account</button>
            </div>
          ) : null}
          <div key={mode} className="auth-card__heading">
            <h2>{mode === "register" ? "Create your account." : mode === "forgot" ? "Reset your password." : "Sign in to Exende."}</h2>
            <p>{mode === "register" ? "Verify your email to activate 2,500 free credits for 14 days." : mode === "forgot" ? "We will send a one-hour reset link if the address is registered." : "Use the email address linked to your organization."}</p>
          </div>

          <form onSubmit={submit} className="auth-form">
            {mode === "register" ? <AuthField label="Name" name="name" type="text" autoComplete="name" minLength={2} /> : null}
            <AuthField label="Email" name="email" type="email" autoComplete="email" />
            {mode !== "forgot" ? <AuthField label="Password" name="password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={12} /> : null}
            {message ? <p className="auth-message" data-tone={message.tone} role="status">{message.tone === "success" ? <Check /> : null}{message.text}</p> : null}
            {!serviceAvailable ? <p className="auth-message" data-tone="error">Account services are temporarily unavailable. Please try again shortly.</p> : null}
            <button type="submit" className="auth-submit" disabled={pending || !serviceAvailable}>{pending ? "Working..." : mode === "register" ? "Create free account" : mode === "forgot" ? "Send reset link" : "Sign in"}{!pending ? <ArrowRight /> : null}</button>
            {mode === "register" ? (
              <p className="auth-legal">
                By creating an account, you agree to the <Link href="/terms">Terms of Service</Link> and acknowledge the <Link href="/privacy">Privacy Policy</Link>.
              </p>
            ) : null}
          </form>

          <div className="auth-card__footer">
            {mode === "signin" ? <button type="button" onClick={() => changeMode("forgot")}>Forgot password?</button> : null}
            {mode === "forgot" ? <button type="button" onClick={() => changeMode("signin")}>Back to sign in</button> : null}
            <Link href="/docs/jobs">Read the API docs <ArrowRight /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function AuthField({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return <label className="auth-field"><span>{label}</span><input {...props} required /></label>;
}

async function authRequest(path: string, body: Record<string, unknown>): Promise<unknown> {
  const response = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const payload = await response.json().catch(() => null) as { message?: unknown; error?: { message?: unknown } } | null;
  if (!response.ok) {
    const message = typeof payload?.message === "string" ? payload.message : typeof payload?.error?.message === "string" ? payload.error.message : "The request could not be completed.";
    throw new Error(message);
  }
  return payload;
}
