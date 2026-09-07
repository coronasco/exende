"use client";

import type { ApiKeyCreation, ApiKeyMetadata } from "@/lib/control-plane-types";
import { AlertTriangle, Check, Clipboard, KeyRound, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { type FormEvent, useState } from "react";

const availableScopes = [
  { value: "jobs:read", label: "Jobs", description: "Search and retrieve normalized job records." },
  { value: "companies:read", label: "Companies", description: "Read company profiles and hiring context." },
  { value: "signals:read", label: "Signals", description: "Read aggregate hiring metrics." },
] as const;

export function ApiKeysManager({ initialKeys, dataApiUrl }: { initialKeys: ApiKeyMetadata[]; dataApiUrl: string }) {
  const [keys, setKeys] = useState(initialKeys);
  const [creating, setCreating] = useState(false);
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<ApiKeyCreation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function createKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setPending(true);
    setError(null);
    const form = new FormData(formElement);
    const scopes = availableScopes.map((scope) => scope.value).filter((scope) => form.get(scope) === "on");
    if (!scopes.length) {
      setPending(false);
      return setError("Select at least one API scope.");
    }
    try {
      const result = await managementRequest<ApiKeyCreation>("/api/control/api-keys", {
        method: "POST",
        body: JSON.stringify({ name: form.get("name"), scopes, environment: "live" }),
      });
      setCreated(result);
      setKeys((current) => [result.apiKey, ...current]);
      setCreating(false);
      formElement.reset();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The API key could not be created.");
    } finally {
      setPending(false);
    }
  }

  async function revokeKey(key: ApiKeyMetadata) {
    if (!window.confirm(`Revoke “${key.name}”? Applications using this key will immediately lose access.`)) return;
    setError(null);
    try {
      await managementRequest(`/api/control/api-keys/${key.id}`, { method: "DELETE" });
      setKeys((current) => current.map((item) => item.id === key.id ? { ...item, status: "revoked", revokedAt: new Date().toISOString() } : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The API key could not be revoked.");
    }
  }

  async function copySecret() {
    if (!created) return;
    await navigator.clipboard.writeText(created.secret);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  }

  return (
    <>
      <header className="dashboard-heading">
        <div><p className="eyebrow">Developer access</p><h1>API keys</h1><p>Create narrowly scoped credentials. Full secrets are returned once and never stored by Exende.</p></div>
        <button className="dashboard-action" type="button" onClick={() => { setCreating(true); setError(null); }}><Plus /> Create API key</button>
      </header>

      {created ? (
        <section className="key-reveal" aria-live="polite">
          <div className="key-reveal__heading"><span><ShieldCheck /></span><div><p className="annotation">KEY CREATED</p><h2>Copy this key now.</h2><p>For security, it will not be shown again after you close this panel.</p></div><button type="button" onClick={() => setCreated(null)} aria-label="Close key reveal"><X /></button></div>
          <div className="key-secret"><code>{created.secret}</code><button type="button" onClick={copySecret}>{copied ? <Check /> : <Clipboard />}{copied ? "Copied" : "Copy"}</button></div>
          <div className="key-example"><div><span>FIRST REQUEST</span><small>bash</small></div><pre><code>{`curl --get "${dataApiUrl}/v1/jobs/search" \\\n  --data-urlencode "q=software engineer" \\\n  --data-urlencode "limit=5" \\\n  -H "Authorization: Bearer ${created.secret}"`}</code></pre></div>
        </section>
      ) : null}

      {creating ? (
        <section className="dashboard-panel key-create-panel">
          <div className="dashboard-panel__heading"><div><span className="annotation">NEW CREDENTIAL</span><h2>Define access</h2></div><button type="button" onClick={() => setCreating(false)} aria-label="Close key form"><X /></button></div>
          <form onSubmit={createKey}>
            <label className="auth-field"><span>Key name</span><input name="name" required minLength={1} maxLength={80} placeholder="Production integration" autoComplete="off" /></label>
            <fieldset><legend>Allowed APIs</legend>{availableScopes.map((scope, index) => <label key={scope.value}><input type="checkbox" name={scope.value} defaultChecked={index === 0} /><span><strong>{scope.label}</strong><small>{scope.description}</small></span><i><Check /></i></label>)}</fieldset>
            {error ? <p className="auth-message" data-tone="error">{error}</p> : null}
            <div className="key-create-panel__actions"><button type="button" onClick={() => setCreating(false)}>Cancel</button><button type="submit" className="dashboard-action" disabled={pending}><KeyRound /> {pending ? "Creating..." : "Create secure key"}</button></div>
          </form>
        </section>
      ) : null}

      {!creating && error ? <p className="auth-message dashboard-message" data-tone="error"><AlertTriangle />{error}</p> : null}

      <section className="dashboard-panel api-key-list">
        <div className="dashboard-panel__heading"><div><span className="annotation">CREDENTIAL INVENTORY</span><h2>{keys.length} {keys.length === 1 ? "key" : "keys"}</h2></div><span className="api-key-list__legend"><i /> active</span></div>
        {keys.length ? <div className="api-key-table"><div className="api-key-table__head"><span>Name</span><span>Credential</span><span>Scopes</span><span>Last used</span><span>Status</span><span /></div>{keys.map((key) => <div key={key.id} className="api-key-row"><div><span className="api-key-row__icon"><KeyRound /></span><span><strong>{key.name}</strong><small>Created {formatDate(key.createdAt)}</small></span></div><code>{key.display}</code><div className="api-key-row__scopes">{key.scopes.map((scope) => <span key={scope}>{scope}</span>)}</div><span>{key.lastUsedAt ? formatRelative(key.lastUsedAt) : "Never"}</span><span className="api-key-row__status" data-status={key.status}><i /> {key.status}</span><button type="button" onClick={() => revokeKey(key)} disabled={key.status === "revoked"} aria-label={`Revoke ${key.name}`}><Trash2 /></button></div>)}</div> : <div className="dashboard-empty"><KeyRound /><strong>No API keys</strong><p>Create the first credential for your integration.</p></div>}
      </section>
    </>
  );
}

async function managementRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { "content-type": "application/json", ...init.headers } });
  const payload = await response.json().catch(() => null) as { data?: T; error?: { message?: string } } | null;
  if (!response.ok || !payload || !("data" in payload)) throw new Error(payload?.error?.message ?? "The request could not be completed.");
  return payload.data as T;
}

function formatDate(value: string): string { return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value)); }
function formatRelative(value: string): string { const hours = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 3_600_000)); return hours < 1 ? "Just now" : hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`; }
