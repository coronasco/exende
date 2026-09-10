import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { HoverCard } from "@/components/landing/landing-experience";
import s from "./product.module.css";

export { s as productStyles };
export function ProductHero({ eyebrow, title, description, children, aside }: { eyebrow: string; title: ReactNode; description: string; children?: ReactNode; aside?: ReactNode }) {
  return <section className={`${s.hero} ${aside ? s.heroSplit : ""}`}>
    <div className={s.shell}><div className={aside ? s.split : s.heroCopy}>
      <div><p className={s.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={s.lead}>{description}</p>{children}</div>
      {aside ? <div className={s.heroAside}>{aside}</div> : null}
    </div></div>
  </section>;
}
export function ProductSection({ eyebrow, title, description, children, id }: { eyebrow?: string; title?: ReactNode; description?: string; children: ReactNode; id?: string }) {
  return <section className={s.section} id={id}><div className={s.shell}>
    {title ? <div className={s.sectionHeading} data-reveal><div>{eyebrow ? <p className={s.eyebrow}>{eyebrow}</p> : null}<h2>{title}</h2></div>{description ? <p>{description}</p> : null}</div> : null}
    {children}
  </div></section>;
}
export function ProductActions({ primary = "Start with 2,500 free credits", href = "/account?mode=signup&next=/dashboard", secondary = "Read the quickstart", secondaryHref = "/docs/jobs#quickstart" }: { primary?: string; href?: string; secondary?: string; secondaryHref?: string }) {
  return <div className={s.actions}><Link href={href} className={s.primary}>{primary}<ArrowUpRight /></Link><Link href={secondaryHref} className={s.secondary}>{secondary}<ArrowRight /></Link></div>;
}
export function FeatureCard({ number, title, children }: { number?: string; title: string; children: ReactNode }) {
  return <div data-reveal><HoverCard className={s.card}>{number ? <span className={s.number}>{number}</span> : null}<h3>{title}</h3>{children}</HoverCard></div>;
}
export function ProductClosing({ title = <>Bring hiring data<br />into your next product.</>, description = "Create an account, verify your email, and make your first request with a scoped API key." }: { title?: ReactNode; description?: string }) {
  return <section className={s.closing}><div className={s.shell} data-reveal><p className={s.eyebrow}>Start building</p><h2>{title}</h2><p>{description}</p><ProductActions /></div></section>;
}
