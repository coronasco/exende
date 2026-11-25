"use client";

import { Activity, ArrowRight, ArrowUpRight, Database, FileSearch, Inbox, KeyRound, Network, Repeat2, Webhook } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CircuitField } from "./circuit-field";
import { MotionToggle, useLandingMotion } from "./landing-experience";
import { networkProducts } from "./network-products";
import s from "./api-network.module.css";

const icons = [Database, Activity, Webhook, Repeat2, FileSearch, Inbox];

export function ApiNetwork({ sample }: { sample: ReactNode }) {
  const [active, setActive] = useState(0);
  const scene = useRef<HTMLElement>(null);
  const [interacted, setInteracted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { paused } = useLandingMotion();
  useEffect(() => {
    if (paused || interacted || hovered || !scene.current || !("IntersectionObserver" in window)) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    function schedule() {
      clearInterval(timer);
      if (visible && !motion.matches && !document.hidden) {
        timer = setInterval(() => setActive(current => (current + 1) % networkProducts.length), 10000);
      }
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    observer.observe(scene.current);
    motion.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      clearInterval(timer);
      observer.disconnect();
      motion.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [paused, interacted, hovered]);
  const selected = networkProducts[active];
  const Current = icons[active];
  return <section ref={scene} className={s.network} data-motion-scene aria-labelledby="network-title">
    <div className={s.stage}>
      <CircuitField />
      <div className={s.content} onFocusCapture={() => setInteracted(true)}
        onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={() => setHovered(false)}>
        <div className={s.router} role="group" aria-label="Explore Exende APIs">
          {networkProducts.map((product, i) => {
            const Icon = icons[i];
            return <button key={product.slug} className={s.satellite} type="button" aria-label={product.name}
              aria-pressed={active === i} aria-controls="selected-api" onClick={() => { setInteracted(true); setActive(i); }}>
              <Icon /><span>{product.name}</span>
            </button>;
          })}
          <div className={s.lens} aria-hidden="true"><i /><div key={selected.slug}><Current /></div></div>
        </div>
        <Link href={`/products/${selected.slug}`} className={s.readout}>{selected.name} <ArrowUpRight /></Link>
        <h1 id="network-title"><span>Hiring intelligence for</span>{" "}<span>software and AI agents.</span></h1>
        <div id="selected-api" aria-live={interacted ? "polite" : "off"} aria-atomic="true">
          <p className={s.lead}>{selected.copy}</p>
          <div key={selected.slug} className={s.route} aria-label="Request flow">
            {selected.stages.map((stage, i) => <span key={stage}>{i > 0 && <i aria-hidden="true" />} {stage}</span>)}
          </div>
          <div className={s.actions}>
            {selected.slug === "jobs" ? sample : <Link href={selected.href} className={s.primary}>{selected.action} <ArrowRight /></Link>}
            <Link href={`/docs/${selected.slug}`}>Read the docs <ArrowUpRight /></Link>
          </div>
          <p className={s.cost}>{selected.price}</p>
        </div>
      </div>
    </div>
    <div className={s.evidence}>
      <Link href="/account?mode=signup&next=/dashboard"><KeyRound />2,500 free credits <ArrowRight /></Link>
      <Link href="/products/jobs-intelligence"><Activity />Jobs Intelligence from $0.02 <ArrowRight /></Link>
      <a href="#infrastructure"><Network />Agent infrastructure <ArrowRight /></a>
      <MotionToggle />
    </div>
  </section>;
}
