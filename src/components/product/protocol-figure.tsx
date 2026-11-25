import { Activity, Braces, Check, Clock3, Code2, Database, FileJson2, Fingerprint, Globe2, Inbox, Layers3, Link2, ListFilter, MailCheck, Route, Search, Wallet, Webhook, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import type { ProductPath } from "./product-navigation";
import s from "./protocol-figure.module.css";

type Diagram = "sources" | "records" | "history" | "network" | "payment" | "inbox" | "intelligence" | "index" | "access" | "callback" | "retry" | "event" | "resolve";

function TerminalNode({ x, y, name, icon: Icon }: { x: number; y: number; name: string; icon: LucideIcon }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect className={s.tile} x="-30" y="-24" width="60" height="48" rx="10" />
    <Icon x="-11" y="-11" width="22" height="22" strokeWidth="1.65" />
    <text textAnchor="middle" y="41">{name}</text>
  </g>;
}

function Wire({ d, offset = 0 }: { d: string; offset?: number }) {
  return <g style={{ "--delay": `${offset}s` } as CSSProperties}>
    <path className={s.wire} d={d} />
    <path className={s.pulse} pathLength="100" d={d} />
  </g>;
}

const processes = {
  index: { left: "Discover", center: "Contract", right: "Request", icons: [Globe2, FileJson2, Braces] },
  access: { left: "Verify", center: "Scope", right: "API key", icons: [MailCheck, ListFilter, Fingerprint] },
} as const;

export function ProtocolFigure({ kind }: { kind: Diagram }) {
  let drawing;
  if (kind === "sources") {
    drawing = <>
      <Wire d="M73 43 H110 C143 43 137 95 174 95 H231" offset={-.5} />
      <Wire d="M73 95 H231" offset={-1.6} />
      <Wire d="M73 147 H110 C143 147 137 95 174 95 H231" offset={-2.7} />
      {[Globe2, Search, Link2].map((Icon, i) => <g key={i} transform={`translate(50 ${43 + i * 52})`}>
        <rect x="-24" y="-17" width="49" height="34" rx="7" className={s.tile} /><Icon x="-9" y="-9" width="18" height="18" />
      </g>)}
      <TerminalNode x={260} y={95} name="Reviewed sources" icon={Database} />
    </>;
  } else if (kind === "records") {
    drawing = <>{["Source URL","Company","Job record"].map((label,i) =>
      <g key={label} transform={`translate(${82 - i * 14} ${24 + i * 37})`}>
        <g className={s.sheet} style={{ "--delay": `${i * -.48}s` } as CSSProperties}>
          <rect width={165+i*13} height="47" rx="8" className={s.tile} />
          <Layers3 x="14" y="14" width="18" height="18" />
          <text x="44" y="28">{label}</text><path d={`M${135+i*9} 23h17`} className={s.wire} />
        </g>
      </g>)}</>;
  } else if (kind === "history") {
    drawing = <>
      <Wire d="M10 120 H310" />
      {[["First",55],["Updated",160],["Latest",265]].map(([label,x],i)=><g key={label} transform={`translate(${x} 120)`}>
        <path d="M0 0V-28" className={s.wire} /><circle r="7" className={s.dot} />
        <g className={s.stamp} style={{"--delay":`${-i * 1.3}s`} as CSSProperties}>
          <rect x="-37" y="-74" width="74" height="44" rx="7" className={s.tile} />
          <Clock3 x="-23" y="-58" width="12" height="12" /><path d="M-4 -56h26m-26 8h17" className={s.wire} />
        </g>
        <text textAnchor="middle" y="28">{label}</text>
      </g>)}
    </>;
  } else if (kind === "network") {
    const ports = [[48,43,Database],[36,94,Activity],[48,145,Webhook],[272,43,Clock3],[284,94,Search],[272,145,Inbox]] as const;
    drawing = <>
      {ports.map(([x,y,Icon], i) => <g key={i}>
        <Wire d={`M${x} ${y} H${x < 160 ? 87 : 233} L${x < 160 ? 138 : 182} 94 H160`} offset={-i*.57} />
        <rect x={x-17} y={y-17} width="34" height="34" rx="9" className={s.tile} />
        <Icon x={x-9} y={y-9} width="18" height="18" />
      </g>)}
      <circle cx="160" cy="94" r="38" className={s.halo} /><circle cx="160" cy="94" r="27" className={s.tile} />
      <Route x="147" y="81" width="26" height="26" /><text x="160" y="153" textAnchor="middle">Exende API catalogue</text>
    </>;
  } else if (kind === "payment") {
    drawing = <>
      <Wire d="M53 105 H74 Q84 105 91 97 L137 49 H160" />
      <Wire d="M160 49 H182 L231 97 Q238 105 249 105 H267" offset={-1.3} />
      <Wire d="M267 116 V143 H53 V116" offset={-2.1} />
      <TerminalNode x={48} y={103} name="Request" icon={Braces} /><TerminalNode x={272} y={103} name="Paid call" icon={Check} />
      <rect x="127" y="27" width="66" height="43" rx="12" className={s.tile} /><Wallet x="134" y="41" width="15" height="15" />
      <text x="157" y="52">402</text><text x="160" y="87" textAnchor="middle">USDC on Base</text>
    </>;
  } else if (kind === "callback" || kind === "inbox") {
    const email = kind === "inbox";
    drawing = <>
      {[44,72,100].map((y,i) => <g key={y}>
        <Wire d={`M40 ${y} H72 Q82 ${y} 92 ${(y+72)/2} L111 72 H144`} offset={-i*.75} />
        <circle className={s.dot} cx="35" cy={y} r="4" />
      </g>)}
      <Wire d="M153 72 H260" offset={-.7} />
      <circle cx="145" cy="72" r="37" className={s.halo} />
      <TerminalNode x={145} y={72} icon={email ? Inbox : Webhook} name={email ? "Test Inbox" : "Receiver"} />
      <TerminalNode x={264} y={72} icon={email ? Fingerprint : Braces} name={email ? "Read code" : "Read event"} />
      <text x="44" y="134" textAnchor="middle">{email ? "Incoming mail" : "Webhooks"}</text>
    </>;
  } else if (kind === "retry") {
    drawing = <>
      <Wire d="M48 78 H270" />
      <Wire d="M185 69 H204 V39 Q204 27 191 27 H128 Q116 27 116 39 V70" offset={-1.4} />
      <path d="m110 60 6 9 6-9" className={s.wire} />
      <TerminalNode x={48} y={78} name="Request" icon={Code2} />
      <TerminalNode x={160} y={78} name="Backoff" icon={Clock3} />
      <TerminalNode x={272} y={78} name="Result" icon={Check} />
    </>;
  } else if (kind === "event") {
    drawing = <>
      <Wire d="M48 78 H272" />
      <circle cx="160" cy="78" r="39" className={s.halo} />
      <TerminalNode x={48} y={78} name="Event" icon={Webhook} />
      <TerminalNode x={160} y={78} name="Read token" icon={Fingerprint} />
      <TerminalNode x={272} y={78} name="Payload" icon={Braces} />
    </>;
  } else if (kind === "resolve") {
    drawing = <>
      <Wire d="M80 78 H245" />
      <rect x="19" y="41" width="74" height="68" rx="9" className={s.tile} />
      <Link2 x="28" y="49" width="16" height="16" /><path d="M29 75h51m-51 8h36m-36 8h45" className={s.wire} />
      <path d="M24 70h64" className={s.scanner} />
      <TerminalNode x={160} y={78} name="Resolve" icon={Search} />
      <TerminalNode x={270} y={78} name="Content" icon={FileJson2} />
      <text x="56" y="119" textAnchor="middle">Public URL</text>
    </>;
  } else if (kind === "intelligence") {
    drawing = <>
      <TerminalNode x={44} y={90} name="Query" icon={Search} /><Wire d="M74 89 H108" />
      <rect x="108" y="43" width="193" height="89" rx="12" className={s.tile} />
      <path d="M124 65h159m-159 23h159m-159 23h159" className={s.grid} />
      <path d="M124 107l25-9 21 4 23-18 22 6 27-24 18 6 23-13" pathLength="100" className={s.signal} />
      <text x="205" y="154" textAnchor="middle">Observed hiring signals</text>
    </>;
  } else {
    const { left, center, right, icons } = processes[kind];
    drawing = <>
      <Wire d="M49 95 H273" />
      <Wire d="M68 95 V69 Q68 52 83 52 H244 Q253 52 253 64 V95" offset={-1.5} />
      <TerminalNode x={49} y={95} name={left} icon={icons[0]} />
      <TerminalNode x={160} y={95} name={center} icon={icons[1]} />
      <TerminalNode x={271} y={95} name={right} icon={icons[2]} />
    </>;
  }
  const compact = kind === "callback" || kind === "retry" || kind === "event" || kind === "resolve" || kind === "inbox";
  return <svg viewBox={compact ? "0 10 320 143" : "0 0 320 185"} className={s.figure} aria-hidden="true" focusable="false">{drawing}</svg>;
}

export const productFigures: Partial<Record<ProductPath, { kind: Diagram; caption: string }>> = {
  "/products": { kind: "network", caption: "A shared catalogue for software and agents" },
  "/coverage": { kind: "sources", caption: "Reviewed sources feed the public catalogue" },
  "/products/jobs-intelligence": { kind: "intelligence", caption: "From a hiring question to a structured response" },
  "/products/test-inbox": { kind: "inbox", caption: "A private receiver for each test" },
  "/pricing": { kind: "payment", caption: "Pay per request with x402 on Base" },
  "/api": { kind: "index", caption: "From discovery to a documented endpoint" },
} as const;
