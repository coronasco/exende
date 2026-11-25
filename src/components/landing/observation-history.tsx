"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Check, Clock3, FileClock, Fingerprint, GitCompareArrows, History, Radio, ScanLine } from "lucide-react";
import { useScrollStory } from "./use-scroll-story";
import rail from "./scroll-story.module.css";
import s from "./observation-history.module.css";

const phases = [
  { name: "First observed", day: "01", time: "09:12", title: "A record starts here.", detail: "The first time a reviewed source shows the listing, Exende captures its details. This timestamp can be later than the original publication date.", field: "first_seen_at", icon: Fingerprint },
  { name: "Changes recorded", day: "03", time: "14:06", title: "See exactly what changed.", detail: "The source updates the role from hybrid to remote. A new version keeps that change alongside the earlier observation so you can compare the two.", field: "/v1/jobs/{id}/history", icon: GitCompareArrows },
  { name: "Last observed", day: "08", time: "10:41", title: "Know when it was last seen.", detail: "The role is still remote on the next visit. The last-seen timestamp advances even when the listing details stay the same.", field: "last_seen_at", icon: ScanLine },
] as const;

function ExampleRecord({ index }: { index: number }) {
  const phase = phases[index];
  return <figure className={s.exhibit} data-motion-scene aria-label={`Example listing on day ${phase.day}`}>
    <div className={s.file} data-version={index}>
      <div className={s.paper}>
        <div className={s.paperTop}><span><FileClock /> Example listing</span><time dateTime={phase.time}>{phase.time} UTC</time></div>
        <strong className={s.role}>Platform Engineer</strong>
        <dl className={s.fields}>
          <div><dt>Department</dt><dd>Engineering</dd></div>
          <div><dt>Workplace</dt><dd>{index === 1 ? <><del>Hybrid</del><span className={s.added}>Remote</span></> : index === 0 ? "Hybrid" : "Remote"}</dd></div>
        </dl>
        <div className={s.stamp}><phase.icon />{["First capture", "Workplace updated", "Seen again"][index]}</div>
      </div>
    </div>
  </figure>;
}

export function ObservationHistory() {
  const { section, content, clip, navigate, active } = useScrollStory(phases.length);
  return <section ref={section} id="history" className={`${rail.story} ${s.history}`} aria-labelledby="history-heading">
    <div className={`${rail.pin} ${s.stage}`}>
      <div ref={content} className={s.inner}>
        <div className={s.head}>
          <div><p className={s.label}><History aria-hidden="true" /> Observation history</p>
            <h2 id="history-heading">What changed since the last listing?</h2></div>
          <Link href="/docs/jobs#history" className={s.contract}>Read the history contract <ArrowUpRight /></Link>
        </div>
        <div ref={clip} className={`${rail.window} ${s.window}`} role="region" aria-label="Listing history example" tabIndex={0}>
          <ol className={rail.track}>{phases.map((phase, index) => <li key={phase.field} className={rail.slide}>
            <div className={s.scene} data-current={index === active}>
              <ExampleRecord index={index} />
              <div className={s.note}>
                <p className={s.when}><Clock3 /> Day {phase.day} <span>·</span> {phase.time} UTC</p>
                <h3>{phase.title}</h3><p className={s.detail}>{phase.detail}</p>
                <code className={s.field}>{phase.field}</code>
              </div>
            </div>
          </li>)}</ol>
        </div>
        <div className={s.timeline} role="group" aria-label="Choose an observation">
          {phases.map(({ name, day }, index) => <button type="button" key={name} aria-pressed={index === active}
            onClick={() => navigate.current?.(index)}>
            <span className={s.point} aria-hidden="true">{index < active ? <Check /> : <Radio />}</span>
            <span><small>Day {day}</small><b>{name}</b></span>
          </button>)}
        </div>
        <a className={s.skip} href="#jobs-intelligence">Skip listing history <ArrowDownRight size={14} /></a>
      </div>
    </div>
  </section>;
}
