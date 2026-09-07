"use client";

import { BookOpen, Command, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const searchItems = [
  { label: "Choose a product", detail: "Jobs Data and infrastructure APIs", href: "/docs" },
  { label: "Jobs Data public overview", detail: "GET /v1/public/overview", href: "/docs/jobs" },
  { label: "Jobs Data response", detail: "Catalogue aggregate schema", href: "/docs/jobs#response" },
  { label: "Jobs Data caching", detail: "Freshness and fallback", href: "/docs/jobs#caching" },
  { label: "Jobs Data customer access", detail: "Scoped API keys and routes", href: "/docs/jobs#access" },
  { label: "Create callback", detail: "POST /v1/callbacks", href: "/docs/callback#create-callback" },
  { label: "Send a webhook", detail: "cb.exende.dev/hooks/{id}", href: "/docs/callback#send-webhook" },
  { label: "Wait for an event", detail: "Long-polling behavior", href: "/docs/callback#wait-event" },
  { label: "Read all events", detail: "Event retrieval", href: "/docs/callback#read-events" },
  { label: "Delete callback", detail: "Callback deletion", href: "/docs/callback#delete-callback" },
  { label: "Errors", detail: "Production error codes", href: "/docs/callback#errors" },
  { label: "Create Retry job", detail: "POST retry.exende.dev/v1/retries", href: "/docs/retry#create-job" },
  { label: "Retry lifecycle", detail: "Statuses and polling", href: "/docs/retry#lifecycle" },
  { label: "Attempt history", detail: "GET /attempts", href: "/docs/retry#attempts" },
  { label: "Terminal callback", detail: "Signed final delivery", href: "/docs/retry#terminal-callback" },
  { label: "Retry policies", detail: "Fixed or exponential backoff", href: "/docs/retry#policies" },
  { label: "Retry errors", detail: "Production error codes", href: "/docs/retry#errors" },
  { label: "Resolve a resource", detail: "POST resolve.exende.dev/v1/resolve", href: "/docs/resolve#create-resolve" },
  { label: "Resolve formats", detail: "Web, PDF, data, text, and image metadata", href: "/docs/resolve#formats" },
  { label: "Resolve security", detail: "Public-resource safety controls", href: "/docs/resolve#security" },
  { label: "Resolve errors", detail: "Stable error codes", href: "/docs/resolve#errors" },
  { label: "x402 payments", detail: "USDC on Base Mainnet", href: "/docs/x402" },
  { label: "API reference", detail: "All production endpoints", href: "/api" },
] as const;

export function DocsSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? searchItems.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(normalizedQuery))
    : [];

  return (
    <div className="docs-search">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-muted)]" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 120)}
        className="docs-search__input"
        placeholder="Search documentation..."
        aria-label="Search documentation"
      />
      <span className="pointer-events-none absolute right-4 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded border border-[var(--color-border)] px-2 py-1 font-mono text-[0.65rem] text-[var(--color-muted)]">
        <Command className="h-3 w-3" /> K
      </span>

      {focused && normalizedQuery ? (
        <div className="docs-search__results" role="listbox">
          {results.length ? results.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0 hover:bg-[var(--color-accent-soft)]"
            >
              <BookOpen className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
              <span className="min-w-0">
                <span className="block text-sm text-white">{item.label}</span>
                <span className="mt-0.5 block truncate font-mono text-[0.68rem] text-[var(--color-muted)]">{item.detail}</span>
              </span>
            </Link>
          )) : (
            <p className="px-4 py-4 text-sm text-[var(--color-muted)]">No documentation matches “{query}”.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
