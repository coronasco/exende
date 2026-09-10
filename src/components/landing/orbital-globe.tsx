"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { MotionToggle, useLandingMotion } from "./landing-experience";
import styles from "./landing.module.css";

const TAU = Math.PI * 2;
const rings = [
  { radius: .40, tilt: 1.07, angle: -.72, speed: .085, blue: false },
  { radius: .42, tilt: 1.2, angle: .38, speed: -.065, blue: false },
  { radius: .425, tilt: 1.25, angle: .15, speed: .15, blue: true },
];

/** Flat annular ribbons, projected in 3D. Rear arcs render behind the planet. */
function drawOrbits(context: CanvasRenderingContext2D, width: number, height: number, time: number, scroll: number, front: boolean) {
  context.clearRect(0, 0, width, height);
  const scale = width / 900;
  const point = (theta: number, ring: typeof rings[number], offset = 0) => {
    const angle = ring.angle + scroll * .09 + Math.sin(time * .035) * .025;
    const tilt = ring.tilt + Math.sin(time * .025) * .018;
    const radius = width * ring.radius + offset * scale;
    const x = Math.cos(theta) * radius;
    const y = Math.sin(theta) * radius * Math.cos(tilt);
    return { x: width / 2 + x * Math.cos(angle) - y * Math.sin(angle), y: height / 2 + x * Math.sin(angle) + y * Math.cos(angle) };
  };
  const start = front ? 0 : Math.PI;
  const end = front ? Math.PI : TAU;
  const path = (ring: typeof rings[number], offset: number, from = start, to = end) => {
    context.beginPath();
    for (let i = 0; i <= 160; i++) {
      const p = point(from + (to - from) * i / 160, ring, offset);
      if (i === 0) context.moveTo(p.x, p.y); else context.lineTo(p.x, p.y);
    }
  };
  for (const ring of rings) {
    context.save();
    if (!ring.blue) {
      // Radial width foreshortens with the orbital plane, avoiding a tube-like stroke.
      for (let i = 0; i < 160; i++) {
        const a = start + Math.PI * i / 160;
        const b = start + Math.PI * (i + 1.1) / 160;
        const points = [point(a, ring, -2.5), point(a, ring, 2.5), point(b, ring, 2.5), point(b, ring, -2.5)];
        const shine = Math.pow(Math.max(0, Math.cos(a - time * .06 + .4)), 12);
        const light = Math.round(47 + 100 * shine + 24 * Math.sin(a * 3));
        context.beginPath(); points.forEach((p, j) => j ? context.lineTo(p.x, p.y) : context.moveTo(p.x, p.y)); context.closePath();
        context.fillStyle = `rgba(${light},${light + 12},${light + 25},${front ? .85 : .45})`; context.fill();
      }
      for (const [offset, alpha] of [[-3, .22], [2.8, .55], [6.5, .18], [9, .07]]) {
        path(ring, offset); context.strokeStyle = `rgba(192,218,243,${alpha})`; context.lineWidth = .65 * scale; context.stroke();
      }
    } else {
      path(ring, 0); context.strokeStyle = "rgba(72,153,244,.1)"; context.lineWidth = 7 * scale; context.stroke();
      context.strokeStyle = "rgba(138,204,255,.75)"; context.lineWidth = .9 * scale; context.shadowColor = "#499fff"; context.shadowBlur = 7 * scale; context.stroke();
      context.shadowBlur = 0;
      path(ring, 5); context.strokeStyle = "rgba(80,158,230,.2)"; context.lineWidth = .5 * scale; context.stroke();
    }
    // Small moving highlights give the orbital bands motion without spinning the UI.
    for (let i = 0; i < (ring.blue ? 2 : 16); i++) {
      const theta = ((time * ring.speed + i * TAU / (ring.blue ? 2 : 16)) % TAU + TAU) % TAU;
      if ((theta < Math.PI) !== front) continue;
      const p = point(theta, ring, ring.blue ? 0 : 9);
      context.beginPath(); context.arc(p.x, p.y, (ring.blue ? 2 : .75) * scale, 0, TAU);
      context.fillStyle = ring.blue ? "#d8f1ff" : "rgba(186,212,234,.5)";
      context.shadowColor = "#529eff"; context.shadowBlur = ring.blue ? 12 * scale : 0; context.fill();
    }
    context.restore();
  }
}

export function OrbitalGlobe() {
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const elapsed = useRef(8);
  const scrollPose = useRef(0);
  const { paused } = useLandingMotion();

  useEffect(() => {
    const rear = back.current, forward = front.current, container = stage.current;
    const rearContext = rear?.getContext("2d"), frontContext = forward?.getContext("2d");
    if (!rear || !forward || !container || !rearContext || !frontContext) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, previous = 0;
    let inView = true;
    const canAnimate = () => !paused && !media.matches && inView && !document.hidden;
    const paint = () => {
      drawOrbits(rearContext, width, height, elapsed.current, scrollPose.current, false);
      drawOrbits(frontContext, width, height, elapsed.current, scrollPose.current, true);
      container.style.setProperty("--globe-y", `${scrollPose.current * -32}px`);
    };
    const tick = (now: number) => {
      if (!canAnimate()) { frame = 0; previous = 0; return; }
      if (now - previous >= 1000 / 30) {
        elapsed.current += previous ? Math.min((now - previous) / 1000, .06) : 0;
        scrollPose.current += (Math.min(window.scrollY / window.innerHeight, 1.3) - scrollPose.current) * .08;
        previous = now; paint();
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      if (canAnimate() && !frame) frame = requestAnimationFrame(tick);
      else if (!canAnimate()) {
        cancelAnimationFrame(frame); frame = 0; previous = 0;
        if (media.matches) scrollPose.current = 0;
        paint();
      }
    };
    const resize = () => {
      const rect = container.getBoundingClientRect(); width = rect.width; height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      for (const [canvas, context] of [[rear, rearContext], [forward, frontContext]] as const) {
        canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
      }
      paint(); sync();
    };
    const sizeObserver = new ResizeObserver(resize);
    const viewObserver = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    sizeObserver.observe(container); viewObserver.observe(container);
    media.addEventListener("change", sync); document.addEventListener("visibilitychange", sync);
    resize();
    return () => { cancelAnimationFrame(frame); sizeObserver.disconnect(); viewObserver.disconnect(); media.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); };
  }, [paused]);

  return <div className={styles.globeStage} ref={stage}>
    <div className={styles.globeScene}>
      <canvas ref={back} className={styles.orbitBack} aria-hidden="true" />
      <div className={styles.planet} aria-hidden="true"><Image src="/media/landing/globe.webp" alt="" fill preload sizes="(max-width: 700px) 82vw, 52vw" quality={90} /></div>
      <canvas ref={front} className={styles.orbitFront} aria-hidden="true" />
    </div>
    <div className={styles.globeCaption}><span>Public data. Observed over time.</span><MotionToggle /></div>
  </div>;
}
