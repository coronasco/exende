"use client";

import { createContext, useContext, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./landing.module.css";

const MotionContext = createContext({ paused: false, toggle: () => {} });
export const useLandingMotion = () => useContext(MotionContext);

export function LandingExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) return;
    const reveals = element.querySelectorAll<HTMLElement>("[data-reveal]");
    // Without JavaScript every section stays visible. Enhancement is opt-in.
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          if (!target.dataset.revealed) target.dataset.entered = "true";
          target.dataset.revealed = "true";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -24px 0px" });
    reveals.forEach(node => {
      if (node.getBoundingClientRect().top < window.innerHeight - 24) node.dataset.revealed = "true";
      observer.observe(node);
    });
    const sceneObserver = new IntersectionObserver(entries => {
      for (const entry of entries) (entry.target as HTMLElement).dataset.onscreen = String(entry.isIntersecting);
    }, { rootMargin: "80px" });
    element.querySelectorAll("[data-motion-scene]").forEach(scene => sceneObserver.observe(scene));
    element.dataset.enhanced = "true";
    return () => { observer.disconnect(); sceneObserver.disconnect(); delete element.dataset.enhanced; };
  }, []);

  return <MotionContext.Provider value={{ paused, toggle: () => setPaused(value => !value) }}>
    <div ref={root} className={styles.landing} data-paused={paused}>
      {children}
    </div>
  </MotionContext.Provider>;
}

export function MotionToggle() {
  const { paused, toggle } = useLandingMotion();
  return <button className={styles.motionToggle} type="button" onClick={toggle} aria-label={paused ? "Resume page motion" : "Pause page motion"} aria-pressed={paused}>{paused ? <Play /> : <Pause />}<span>{paused ? "Resume motion" : "Pause motion"}</span></button>;
}

export function HoverCard({ children, className }: { children: ReactNode; className: string }) {
  const card = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const bounds = useRef<DOMRect | null>(null);
  const reduced = useRef(false);
  const { paused } = useLandingMotion();
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { reduced.current = media.matches; };
    sync(); media.addEventListener("change", sync);
    return () => { cancelAnimationFrame(frame.current); media.removeEventListener("change", sync); };
  }, []);
  function reset() {
    cancelAnimationFrame(frame.current);
    bounds.current = null;
    const element = card.current;
    if (!element) return;
    element.style.removeProperty("--tilt-x"); element.style.removeProperty("--tilt-y");
    element.style.removeProperty("--hover-x"); element.style.removeProperty("--hover-y");
  }
  function move(event: PointerEvent<HTMLElement>) {
    if (reduced.current || paused || event.pointerType !== "mouse" || !card.current) return;
    bounds.current ??= card.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.current.left) / bounds.current.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.current.top) / bounds.current.height));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      card.current?.style.setProperty("--tilt-x", `${(0.5 - y) * 8}deg`);
      card.current?.style.setProperty("--tilt-y", `${(x - 0.5) * 8}deg`);
      card.current?.style.setProperty("--hover-x", `${x * 100}%`);
      card.current?.style.setProperty("--hover-y", `${y * 100}%`);
    });
  }
  return <article ref={card} className={`${styles.hoverCard} ${className}`} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>{children}</article>;
}
