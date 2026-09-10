"use client";

import { ArrowUpRight, Database, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import s from "./catalogue.module.css";

const Explorer = dynamic(() => import("./catalogue-explorer").then(module => module.CatalogueExplorer), {
  loading: () => <p className={s.modalLoading} role="status">Opening the catalogue…</p>,
});

export function CatalogueModal({ endpoint, surface }: { endpoint: string; surface: "homepage" | "jobs" | "coverage" }) {
  const dialog=useRef<HTMLDialogElement>(null), id=useId();
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    if(!open || !dialog.current) return;
    const element=dialog.current;
    element.showModal();
    const overflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return ()=>{if(element.open) element.close(); document.body.style.overflow=overflow;};
  },[open]);
  return <>
    <button type="button" className={s.launchButton} aria-haspopup="dialog" onClick={()=>setOpen(true)}><span className={s.launchIcon}><Database size={16} /></span>Explore sample data<ArrowUpRight size={16} /></button>
    <dialog ref={dialog} className={s.modal} aria-labelledby={`${id}-title`} onClose={()=>setOpen(false)} onKeyDownCapture={event=>{if(event.key==="Escape"){event.preventDefault();dialog.current?.close();}}} onClick={event=>{
      if(event.target!==event.currentTarget) return;
      const bounds=event.currentTarget.getBoundingClientRect();
      if(event.clientX<bounds.left || event.clientX>bounds.right || event.clientY<bounds.top || event.clientY>bounds.bottom) dialog.current?.close();
    }}>
      {open && <>
        <div className={s.modalHeader}><div><p className={s.eyebrow}>Exende · Jobs &amp; Hiring Data</p><h2 id={`${id}-title`}>Catalogue proof</h2></div><button type="button" autoFocus aria-label="Close catalogue preview" onClick={()=>dialog.current?.close()}><X size={21} /></button></div>
        <Explorer endpoint={endpoint} initial={null} surface={surface} />
      </>}
    </dialog>
  </>;
}
