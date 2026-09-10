"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./landing.module.css";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);
  async function copy() {
    try { await navigator.clipboard.writeText(text); setStatus("copied"); }
    catch { setStatus("failed"); }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setStatus("idle"), 2200);
  }
  return <span className={styles.copyWrap}><button className={styles.copyButton} type="button" onClick={copy} aria-label={label} title={label}>{status === "copied" ? <Check /> : <Copy />}</button><span className={styles.copyStatus} role="status">{status === "copied" ? "Copied" : status === "failed" ? "Select text to copy" : ""}</span></span>;
}
