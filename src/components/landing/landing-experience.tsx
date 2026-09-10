"use client";

import { createContext, useContext, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./landing.module.css";

const MotionContext = createContext({ paused: false, toggle: () => {} });
export const useLandingMotion = () => useContext(MotionContext);

export function LandingExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const nebulaProgress = useRef(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reveals = element.querySelectorAll<HTMLElement>("[data-reveal]");
    // Without JavaScript every section stays visible. Enhancement is opt-in.
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.revealed = "true";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -24px 0px" });
    reveals.forEach(node => {
      if (node.getBoundingClientRect().top < window.innerHeight - 24) node.dataset.revealed = "true";
      observer.observe(node);
    });
    element.dataset.enhanced = "true";
    return () => { observer.disconnect(); delete element.dataset.enhanced; };
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let current = nebulaProgress.current;
    let target = 0;
    let distance = 1;
    const paint = () => {
      nebulaProgress.current = current;
      element.style.setProperty("--nebula-x", `${current * -90}px`);
      element.style.setProperty("--nebula-y", `${current * -200}px`);
      element.style.setProperty("--star-y", `${current * -340}px`);
      element.style.setProperty("--nebula-turn", `${current * 7}deg`);
    };
    const tick = () => {
      current += (target - current) * 0.085;
      paint();
      frame = Math.abs(target - current) > 0.0001 ? requestAnimationFrame(tick) : 0;
    };
    const update = () => {
      if (paused || media.matches || document.hidden) return;
      target = Math.max(0, Math.min(1, window.scrollY / distance));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      distance = Math.max(1, element.scrollHeight - window.innerHeight);
      update();
    };
    const sync = () => {
      cancelAnimationFrame(frame); frame = 0;
      if (media.matches) { current = 0; paint(); }
      else update();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", resize);
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [paused]);

  return <MotionContext.Provider value={{ paused, toggle: () => setPaused(value => !value) }}>
    <div ref={root} className={styles.landing} data-paused={paused}>
      <div className={styles.universe} aria-hidden="true"><div className={styles.nebula} /><div className={styles.distantStars} /><div className={styles.nearStars} /></div>
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
