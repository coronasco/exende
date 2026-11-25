import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { HoverCard } from "@/components/landing/landing-experience";
import { ProtocolFigure, productFigures } from "./protocol-figure";
import { ProductBreadcrumb, SectionLinks, type ProductPath } from "./product-navigation";
import s from "./product.module.css";

export { s as productStyles };
type HeroProps = {
  path?: ProductPath;
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
  aside?: ReactNode;
};

export function ProductHero({ path, eyebrow, title, description, children, aside }: HeroProps) {
  const figure = path ? productFigures[path] : undefined;
  return <header className={s.hero}>
    <div className={s.shell}>
      {path && <ProductBreadcrumb path={path} />}
      <div className={s.masthead}>
        <div className={s.heroCopy}>
          <p className={s.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={s.lead}>{description}</p>
          {children}
        </div>
        {aside ? <div className={s.heroAside}>{aside}</div> : figure && (
          <figure className={s.heroArt} data-motion-scene>
            <ProtocolFigure kind={figure.kind} />
            <figcaption>{figure.caption}</figcaption>
          </figure>
        )}
      </div>
      {path && <SectionLinks path={path} />}
    </div>
  </header>;
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
