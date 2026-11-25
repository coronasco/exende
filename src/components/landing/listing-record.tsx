"use client";

import { ArrowUpRight, Building2, GitCompareArrows, MapPin, Radio } from "lucide-react";
import { useState } from "react";
import type { PublicSample } from "@/lib/catalogue-preview";
import { employerListingUrl, listingFields, observationTime, publishedListing } from "@/lib/featured-listing";
import s from "./listing-record.module.css";

function display(value: string | null, field: string) {
  if (field.endsWith("_at")) return observationTime(value);
  return value && value !== "unknown" ? value.replaceAll("_", " ") : "Not reported";
}

export function ListingRecord({ later }: { later: PublicSample | null }) {
  const [earlier, setEarlier] = useState(false);
  const record = later && !earlier ? later : publishedListing;
  const other = earlier ? later : publishedListing;
  const changes = later ? listingFields.filter(([field]) => later[field] !== publishedListing[field]) : [];

  return <article className={s.record} aria-label="Example job record">
    <div className={s.top}><span><Radio size={15} /> Exende catalogue</span><a href={employerListingUrl}>Employer listing <ArrowUpRight size={14} /></a></div>
    <div className={s.body}>
      {later && <div className={s.switch} role="group" aria-label="Compare observations">
        <button type="button" aria-pressed={earlier} onClick={() => setEarlier(true)}>Earlier observation</button>
        <button type="button" aria-pressed={!earlier} onClick={() => setEarlier(false)}>Latest observation</button>
      </div>}
      <p className={s.company}><Building2 size={16} />{record.company}</p>
      <h3>{record.title}</h3>
      <p className={s.location}><MapPin size={14} />{display(record.location, "location")}</p>
      <dl className={s.dates}>
        <div><dt>First observed</dt><dd><time dateTime={record.first_seen_at ?? undefined}>{observationTime(record.first_seen_at)}</time></dd></div>
        <div><dt>Last observed</dt><dd><time dateTime={record.last_seen_at ?? undefined}>{observationTime(record.last_seen_at)}</time></dd></div>
      </dl>
      {later && other && <div className={s.diff} aria-live="polite"><GitCompareArrows size={16} />
        {changes.length ? <dl>{changes.map(([field,label])=><div key={field}><dt>{label}</dt><dd>{display(record[field],field)} <small>{earlier ? "Later" : "Previously"} · {display(other[field],field)}</small></dd></div>)}</dl>
        : <p>The observation date advanced. The published listing fields match.</p>}
      </div>}
    </div>
  </article>;
}
