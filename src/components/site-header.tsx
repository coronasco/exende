"use client";

import { BrandMark } from "@/components/brand-mark";
import { ArrowRight, ArrowUpRight, BookOpenText, Boxes, Braces, Layers2, Menu, Radar, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import landingStyles from "@/components/landing/landing.module.css";
import s from "./site-header.module.css";

const navigation = [
  { label: "Products", href: "/products", icon: Boxes },
  { label: "Coverage", href: "/coverage", icon: Radar },
  { label: "Pricing", href: "/pricing", icon: Layers2 },
  { label: "API index", href: "/api", icon: Braces },
  { label: "Docs", href: "/docs", icon: BookOpenText },
] as const;
const signup = "/account?mode=signup&next=/dashboard";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const mast = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const band = mast.current;
    if (!band) return;
    const observer = new IntersectionObserver(([entry]) => {
      band.dataset.siteStart = String(entry.isIntersecting);
    });
    observer.observe(band);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function dismiss(event: PointerEvent | FocusEvent) {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setMenuOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      trigger.current?.focus();
    }
    const desktop = matchMedia("(min-width: 900px)");
    function closeOnDesktop() { if (desktop.matches) setMenuOpen(false); }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    document.addEventListener("keydown", escape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
      document.removeEventListener("keydown", escape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  const links = navigation.map(({ label, href, icon: Icon }) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return <Link href={href} key={href} className={s.navLink} data-active={active}
      aria-current={active ? (pathname === href ? "page" : "location") : undefined} onClick={() => setMenuOpen(false)}>
      <Icon aria-hidden="true" /><span>{label}</span><ArrowUpRight className={s.mobileArrow} aria-hidden="true" />
    </Link>;
  });

  return <><div className={s.mast} ref={mast} data-site-start="true" aria-hidden="true" /><header ref={header} data-dashboard-active={pathname === "/dashboard" || pathname.startsWith("/dashboard/")}
    className={`site-header ${landingStyles.landingHeader} ${s.header}`}>
    <div className={s.bar}>
      <BrandMark className={s.brand} />
      <nav className={s.desktopNav} aria-label="Primary navigation">{links}</nav>
      <div className={s.actions}>
        <Link className={s.signin} href="/account">Sign in</Link>
        <Link className={s.cta} href={signup} onClick={() => setMenuOpen(false)}>Get started <span><ArrowUpRight aria-hidden="true" /></span></Link>
        <button ref={trigger} type="button" className={s.toggle} aria-label="Toggle navigation menu"
          aria-controls="mobile-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <nav className={s.drawer} id="mobile-navigation" aria-label="Mobile navigation" hidden={!menuOpen}>
        {links}
        <Link href="/account" className={s.mobileSignin} onClick={() => setMenuOpen(false)}>Sign in <ArrowRight /></Link>
      </nav>
    </div>
  </header></>;
}
