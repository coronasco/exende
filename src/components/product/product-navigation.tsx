import Link from "next/link";
import { ArrowDownRight, ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import s from "./product.module.css";

const workflow = [["workflow","How it works"],["request","Request & response"],["payment","Payment"]] as const;
const pages = {
  "/products": { label: "Products", sections: [["jobs","Jobs Data"],["jobs-intelligence","Jobs Intelligence"],["infrastructure","Agent infrastructure"]] },
  "/products/jobs": { label: "Jobs Data API", sections: [["catalogue","Catalogue"],["operations","Available data"],["quickstart","First request"]] },
  "/products/jobs-intelligence": { label: "Jobs Intelligence", sections: [["endpoints","Endpoints & prices"],["access","Payment flow"],["coverage","Coverage"]] },
  "/products/test-inbox": { label: "Test Inbox", sections: [["workflow","Email workflow"],["included","Price & limits"],["recovery","Recovery"]] },
  "/products/callback": { label: "Callback", sections: workflow },
  "/products/retry": { label: "Retry", sections: workflow },
  "/products/resolve": { label: "Resolve", sections: workflow },
  "/pricing": { label: "Pricing", sections: [["plans","Monthly plans"],["credits","Credit costs"],["jobs-intelligence","Per request"],["infrastructure","Per resource"]] },
  "/coverage": { label: "Coverage", sections: [["catalogue","Current coverage"],["method","Methodology"],["fields","Field definitions"]] },
  "/api": { label: "API index", sections: [["jobs-data","Jobs Data"],["jobs-intelligence","Intelligence"],["test-inbox","Test Inbox"],["callback","Callback"],["retry","Retry"],["resolve","Resolve"]] },
} as const;

export type ProductPath = keyof typeof pages;
export function ProductBreadcrumb({path}: {path: ProductPath}) {
  const crumbs = [{name:"Exende",href:"/"}];
  if (path.startsWith("/products/")) crumbs.push({name:"Products",href:"/products"});
  crumbs.push({name:pages[path].label,href:path});
  return <>
    <JsonLd data={{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:crumbs.map(({name,href},i)=>({"@type":"ListItem",position:i+1,name,item:new URL(href,siteConfig.url).href}))}} />
    <nav aria-label="Breadcrumb" className={s.breadcrumb}>{crumbs.map(({name,href},i)=>
      i===crumbs.length-1 ? <span key={href} aria-current="page">{name}</span> :
      <span key={href}><Link href={href}>{name}</Link><ChevronRight aria-hidden="true" /></span>)}</nav>
  </>;
}
export function SectionLinks({path}: {path: ProductPath}) {
  return <nav className={s.sectionLinks} aria-label="On this page">
    {pages[path].sections.map(([id,label])=><a key={id} href={`#${id}`}>{label}<ArrowDownRight aria-hidden="true" /></a>)}
  </nav>;
}
