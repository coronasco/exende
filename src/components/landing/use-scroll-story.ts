"use client";

import { useEffect, useRef, useState } from "react";
import { useLandingMotion } from "./landing-experience";

export function useScrollStory(count: number) {
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const navigate = useRef<((step: number) => void) | null>(null);
  const [active, setActive] = useState(0);
  const { paused } = useLandingMotion();

  useEffect(() => {
    const host = section.current, inner = content.current, viewport = clip.current;
    if (!host || !inner || !viewport) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let pinned = false, inset = 0, travel = 0, distance = 0;
    let frame = 0, previous = -1;

    function update() {
      frame = 0;
      if (!host || !viewport) return;
      const progress = pinned
        ? Math.max(0, Math.min(1, (inset - host.getBoundingClientRect().top) / travel))
        : Math.max(0, Math.min(1, viewport.scrollLeft / (distance || 1)));
      if (progress === previous) return;
      previous = progress;
      const position = progress * (count - 1);
      // Leave each observation fully in view around its stop, even with coarse wheel input.
      const fraction = position - Math.floor(position);
      const segment = Math.max(0, Math.min(1, (fraction - .14) / .72));
      const shift = (Math.floor(position) + segment * segment * (3 - 2 * segment)) * viewport.clientWidth;
      host.style.setProperty("--shift", `${-shift}px`);
      host.style.setProperty("--progress", String(progress));
      setActive(Math.round(progress * (count - 1)));
    }

    function schedule() { if (!frame) frame = requestAnimationFrame(update); }

    function measure() {
      if (!host || !inner || !viewport) return;
      inset = parseFloat(getComputedStyle(host).getPropertyValue("--site-nav-height"));
      const height = document.documentElement.clientHeight - inset;
      distance = viewport.clientWidth * (count - 1);
      travel = Math.max(360, Math.min(height, 860)) * (count - 1);
      pinned = !paused && !motion.matches && inner.offsetHeight <= height && distance > 0;
      host.style.setProperty("--pin-height", `${height}px`);
      host.style.setProperty("--travel", `${travel}px`);
      host.dataset.pinned = String(pinned);
      if (pinned) viewport.scrollLeft = 0;
      previous = -1;
      schedule();
    }

    navigate.current = step => {
      if (pinned) {
        const start = window.scrollY + host.getBoundingClientRect().top - inset;
        window.scrollTo({ top: start + step * travel / (count - 1), behavior: "smooth" });
      } else {
        viewport.scrollTo({ left: step * viewport.clientWidth, behavior: paused || motion.matches ? "instant" : "smooth" });
      }
    };

    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    observer.observe(viewport);
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    viewport.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    motion.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      viewport.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      motion.removeEventListener("change", measure);
      delete host.dataset.pinned;
      navigate.current = null;
    };
  }, [count, paused]);

  return { section, content, clip, navigate, active, paused };
}
