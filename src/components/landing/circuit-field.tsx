import type { CSSProperties } from "react";
import s from "./api-network.module.css";

/* The two banks terminate at the same bus as the interactive product nodes. */
const traces = [
  "M-20 20 H54 Q61 20 65 25 L102 62 Q108 68 116 68 H220 L265 112 H385 L421 147 H700",
  "M-20 51 H48 L100 103 H214 L252 141 H362 L386 152 H700",
  "M-20 83 H52 L105 136 H190 L212 158 H700",
  "M-20 113 H32 L92 173 H201 L224 163 H700",
  "M-20 331 H44 L87 288 H181 Q194 288 194 275 V205 Q194 195 203 189 L235 172 H700",
  "M-20 367 H54 L98 323 H214 Q227 323 227 310 V223 L267 181 H360 L389 168 H700",
  "M-20 409 H71 L117 363 H236 Q250 363 250 349 V243 L302 190 H380 L409 173 H700",
];
export function CircuitField() {
  return <svg className={s.field} viewBox="0 0 1400 450" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    {[false, true].map(reverse => <g key={String(reverse)} transform={reverse ? "translate(1400 0) scale(-1 1)" : undefined}>
      {traces.map((d, i) => <g key={d} style={{ "--phase": `${-i * .71 - (reverse ? 1.9 : 0)}s` } as CSSProperties}>
        <path d={d} className={s.trace} />
        <path d={d} pathLength="100" className={s.packet} />
      </g>)}
    </g>)}
  </svg>;
}
