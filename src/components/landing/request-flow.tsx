"use client";

import { ArrowDownRight, ArrowUpRight, Braces, CheckCheck, Pause, Play, Repeat2, Webhook } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProtocolFigure } from "@/components/product/protocol-figure";
import { useScrollStory } from "./use-scroll-story";
import rail from "./scroll-story.module.css";
import s from "./request-flow.module.css";

const steps = [
  { name: "Receive", product: "Callback", icon: Webhook, figure: "callback", title: "Give the result a destination.", method: "POST", path: "/v1/callbacks", text: "Create a temporary receiver. Give its callback URL to the service doing the work and keep the private read token for your agent.", output: "callback_url · read_token" },
  { name: "Execute", product: "Retry", icon: Repeat2, figure: "retry", title: "Schedule the request.", method: "POST", path: "/v1/retries", text: "Set callback_url to your receiver and supply a callback secret. Retry handles transient failures and delivers the terminal result to the webhook.", output: "Retry job → callback_url" },
  { name: "Read", product: "Callback", icon: CheckCheck, figure: "event", title: "Pick up the result.", method: "GET", path: "/v1/callbacks/{id}/wait", text: "Wait for the event with the private read token. The receiver lasts ten minutes. For a longer-running job, poll its status through Retry.", output: "Private read → event payload" },
] as const;

export function RequestFlow() {
  const { section, content, clip, navigate, active, paused } = useScrollStory(steps.length);
  const playButton = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || paused) return;
    navigate.current?.(0);
    const timers = steps.slice(1).map((_, i) => setTimeout(() => navigate.current?.(i + 1), (i + 1) * 2200));
    timers.push(setTimeout(() => setPlaying(false), steps.length * 2200));
    const stop = () => setPlaying(false);
    const stopOnInput = (event: Event) => {
      if (event.target instanceof Node && !playButton.current?.contains(event.target)) stop();
    };
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("keydown", stopOnInput);
    window.addEventListener("pointerdown", stopOnInput);
    document.addEventListener("visibilitychange", stop);
    motion.addEventListener("change", stop);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("keydown", stopOnInput);
      window.removeEventListener("pointerdown", stopOnInput);
      document.removeEventListener("visibilitychange", stop);
      motion.removeEventListener("change", stop);
    };
  }, [playing, paused, navigate]);

  return <section className={`${rail.story} ${s.flow}`} ref={section} id="workflow" aria-labelledby="flow-heading" data-paused={paused}>
    <div className={`${rail.pin} ${s.pin}`}>
      <div ref={content} className={s.inner}>
        <div className={s.heading}>
          <div><p className={s.label}><Webhook /> Callback × Retry</p><h2 id="flow-heading">Connect two APIs in one workflow.</h2></div>
          <p className={s.intro}>Follow a request from a temporary webhook to the job that calls it back.</p>
        </div>
        <div className={`${rail.window} ${s.window}`} ref={clip} role="region" aria-label="Workflow steps" tabIndex={0}>
          <ol className={rail.track}>
            {steps.map((step, index) => <li key={step.name} className={rail.slide}>
              <div className={s.card}>
                <div className={s.copy}>
                  <p className={s.meta}><span>0{index + 1} / 03</span>{step.product}</p>
                  <h3>{step.title}</h3><p className={s.description}>{step.text}</p>
                  <code className={s.endpoint}><b>{step.method}</b>{step.path}</code>
                </div>
                <figure className={s.figure} data-motion-scene>
                  <div><ProtocolFigure kind={step.figure} /></div>
                  <figcaption><Braces aria-hidden="true" />{step.output}</figcaption>
                </figure>
              </div>
            </li>)}
          </ol>
        </div>
        <div className={s.controls}>
          <div className={s.stops} role="group" aria-label="Choose a workflow step">
            {steps.map(({name, icon: Icon}, index) => <button key={name} type="button" aria-pressed={index === active}
              onClick={() => { setPlaying(false); navigate.current?.(index); }}><Icon aria-hidden="true" />{name}</button>)}
          </div>
          <div className={s.tools}>
            <button ref={playButton} type="button" className={s.play} onClick={() => setPlaying(value => !value)}>{playing ? <Pause /> : <Play />}{playing ? "Pause example" : "Play example"}</button>
            <Link href="/docs/retry">Retry contract <ArrowUpRight /></Link>
          </div>
        </div>
        <div className={s.progress} aria-hidden="true"><i /></div>
        <a className={s.skip} href="#access">Skip the workflow <ArrowDownRight size={14} /></a>
      </div>
    </div>
  </section>;
}
