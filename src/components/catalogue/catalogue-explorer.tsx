"use client";

import { ArrowUpRight, Braces, Check, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { countryName, parseCataloguePreview, type CataloguePreview, type CatalogueGroup, type PublicSample } from "@/lib/catalogue-preview";
import { productEvent } from "@/lib/product-events";
import { CopyButton } from "@/components/landing/copy-button";
import s from "./catalogue.module.css";

function date(value: string | null) { return value ? new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(value)) : "Not available"; }
function label(value: string) { return value === "unknown" ? "Not specified" : value.replaceAll("_", " "); }
export function CatalogueExplorer({ initial, endpoint, surface }: { initial: CataloguePreview | null; endpoint: string; surface: "homepage" | "jobs" | "coverage" }) {
  const id=useId(), inputRef=useRef<HTMLInputElement>(null), immediate=useRef(false);
  const [input,setInput]=useState(""), [revision,setRevision]=useState(0), [data,setData]=useState(initial), [busy,setBusy]=useState(!initial);
  const [error,setError]=useState(""), [selected,setSelected]=useState<PublicSample | null>(null);
  useEffect(()=>{
    if(initial && input === "" && revision === 0) return;
    const controller=new AbortController();
    const delay=immediate.current || revision===0 && input==="" ? 0 : 500; immediate.current=false;
    const timer=setTimeout(async()=>{
      const q=input.trim();
      if(q && q.length<2){setBusy(false);setError("Enter at least 2 characters.");return;}
      try {
        const url=new URL(endpoint); if(q) url.searchParams.set("q",q);
        productEvent("catalogue_search",{surface});
        const response=await fetch(url,{credentials:"omit",headers:{accept:"application/json"},signal:AbortSignal.any([controller.signal,AbortSignal.timeout(8000)])});
        if(!response.ok) throw new Error(response.status===429 ? "Too many searches. Please wait one minute and try again." : response.status===400 ? "Use up to 80 characters and 6 words. Wildcards and pagination are not supported." : "The catalogue preview is temporarily unavailable. Try again shortly.");
        const next=parseCataloguePreview(await response.json());
        if(controller.signal.aborted) return;
        setData(next);setError("");setSelected(null);
        productEvent("catalogue_results",{surface,hasResults:next.summary.active_jobs>0});
      } catch(cause) {
        if(controller.signal.aborted) return;
        setData(null); setError(cause instanceof Error && !["TypeError","TimeoutError"].includes(cause.name) && /^(Too many|Use up|The catalogue)/.test(cause.message) ? cause.message : "The catalogue preview could not be reached. Please try again.");
      } finally {if(!controller.signal.aborted) setBusy(false);}
    },delay);
    return ()=>{clearTimeout(timer);controller.abort();};
  },[input,revision,endpoint,surface,initial]);
  function change(value:string,submit=false){setInput(value.slice(0,80));setBusy(true);setError("");setSelected(null);immediate.current=submit;if(submit)setRevision(v=>v+1);}
  function submit(event:FormEvent){event.preventDefault();change(input,true);}
  function open(job:PublicSample){setSelected(selected?.id===job.id ? null : job);if(selected?.id!==job.id)productEvent("sample_json_opened",{surface});}
  const samples=data?.sample_jobs.slice(0,5) ?? [];
  return <div className={s.explorer} data-catalogue-explorer={surface}>
    <div className={s.intro}><div><p className={s.eyebrow}>Public catalogue explorer</p><h3>Find your starting point.</h3></div><span className={s.badge}><Check size={13} />Limited public preview</span></div>
    <form onSubmit={submit} role="search" className={s.form}>
      <label htmlFor={`${id}-search`} className={s.visuallyHidden}>Search a role, location, country, company or skill</label>
      <div className={s.inputWrap}><Search size={19} aria-hidden="true" /><input ref={inputRef} id={`${id}-search`} type="search" value={input} maxLength={80} autoComplete="off" placeholder="Search a role, location, country, company or skill…" aria-describedby={`${id}-hint`} onChange={event=>change(event.target.value)} />{input && <button type="button" aria-label="Clear catalogue search" onClick={()=>{change("",true);inputRef.current?.focus();}}><X size={17} /></button>}</div>
      <button className={s.searchButton} type="submit">Search <ArrowUpRight size={17} /></button>
    </form>
    <p id={`${id}-hint`} className={s.hint}>Search observed records. Aggregates describe matching coverage; samples are deliberately limited.</p>
    <div role="status" className={s.status}>{busy ? "Searching the catalogue…" : error || (data ? `${data.summary.active_jobs.toLocaleString("en-US")} active jobs across ${data.summary.companies.toLocaleString("en-US")} companies${data.query ? ` matching “${data.query}”` : " in the observed catalogue"}.` : "")}</div>
    {error && <button className={s.retry} type="button" onClick={()=>change(input,true)}>Try again <ArrowUpRight size={14} /></button>}
    {data && !busy && !error && <div className={s.results}>
      <dl className={s.totals}>{[[data.summary.active_jobs,"Active jobs"],[data.summary.companies,"Companies"],[data.summary.countries,"Countries identified"],[data.summary.locations,"Location labels"]].map(([value,title])=><div key={title}><dt>{title}</dt><dd>{Number(value).toLocaleString("en-US")}</dd></div>)}</dl>
      {data.summary.active_jobs===0 ? <div className={s.empty}><Search /><h4>No current catalogue matches.</h4><p>Try a broader role, a country name, or a different company. Coverage reflects the sources currently observed.</p><button type="button" onClick={()=>change("",true)}>View catalogue overview <ArrowUpRight size={14} /></button></div> : <>
        <div className={s.facets}>
          <Group title="Top locations" rows={data.top_locations} search={value=>change(value,true)} />
          <Group title="Top countries" rows={data.top_countries} search={value=>change(value,true)} country />
          <Group title="Roles represented" rows={data.top_roles} search={value=>change(value,true)} />
          <Group title="Companies hiring" rows={data.top_companies} search={value=>change(value,true)} />
        </div>
        <p className={s.hint}>Location labels are source text, not normalized cities. {data.summary.country_unclassified_jobs.toLocaleString("en-US")} matching jobs have no identified country.</p>
        {surface==="coverage" && <dl className={s.window}><div><dt>Earliest first observation among matching active jobs</dt><dd>{date(data.summary.first_observed_at)}</dd></div><div><dt>Latest canonical observation among matching active jobs</dt><dd>{date(data.summary.last_observed_at)}</dd></div></dl>}
        <div className={s.sampleHeading}><h4>Inside a real record.</h4><span>{samples.length} public samples</span></div>
        {samples.length ? <div className={s.samples}>{samples.map(job=><article key={job.id} className={s.sample}>
          <div className={s.jobTop}><div><p>{job.company}</p><h5>{job.title}</h5></div><span className={s.active}>Active</span></div>
          <p className={s.location}>{job.location || "Location not specified"}{job.country_code && <span>{countryName(job.country_code)}</span>}</p>
          <div className={s.jobBottom}><div className={s.tags}><span>{label(job.workplace_type)}</span><span>{label(job.employment_type)}</span></div><button aria-expanded={selected?.id===job.id} aria-controls={selected?.id===job.id ? `${id}-json` : undefined} type="button" onClick={()=>open(job)}><Braces size={15} />{selected?.id===job.id ? "Close JSON" : "View normalized JSON"}</button></div>
          {selected?.id===job.id && <div className={s.json} id={`${id}-json`}><div><span>Actual record · limited public fields</span><CopyButton text={JSON.stringify(selected,null,2)} label="Copy selected sample JSON" /></div><pre tabIndex={0} aria-label="Selected public job JSON"><code>{JSON.stringify(selected,null,2)}</code></pre><p>First observed {date(job.first_seen_at)} · Last observed {date(job.last_seen_at)} · UTC</p></div>}
        </article>)}</div> : <p className={s.noSample}>Matching data exists in the catalogue, but none of the enrolled public samples match this search. Create an account to search the full catalogue.</p>}
      </>}
    </div>}
    <div className={s.footer}><p>Up to 5 records per response from a fixed pool of at most 12. No pagination, full descriptions, or bulk exports.</p><Link href="/account?mode=signup&next=/dashboard">Start with 2,500 free credits <ArrowUpRight size={16} /></Link></div>
  </div>;
}
function Group({title,rows,search,country=false}:{title:string;rows:CatalogueGroup[];search:(value:string)=>void;country?:boolean}) {
  return <div className={s.facet}><h4>{title}</h4>{rows.length ? <ul>{rows.slice(0,3).map(row=><li key={row.value}><button type="button" onClick={()=>search(row.value.slice(0,80))} title={`Search ${row.value}`}><span>{country ? countryName(row.value) : row.value}</span><b>{row.active_jobs.toLocaleString("en-US")}</b></button></li>)}</ul> : <p>No classified values</p>}</div>;
}
