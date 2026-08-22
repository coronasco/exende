import { siteConfig } from "@/content/site";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Script
        id="home-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
          }),
        }}
      />

      <section className="relative isolate flex min-h-dvh items-center overflow-hidden">
        <div className="grid-fade absolute inset-0 opacity-70" />

        <div className="pointer-events-none absolute inset-0">
          <div className="node-pulse absolute left-[12%] top-[22%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          <div className="node-pulse absolute right-[16%] top-[18%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] [animation-delay:1.1s]" />
          <div className="node-pulse absolute left-[20%] bottom-[28%] h-1 w-1 rounded-full bg-white/50 [animation-delay:2.2s]" />
          <div className="node-pulse absolute right-[22%] bottom-[32%] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] [animation-delay:0.7s]" />
          <div className="absolute left-[14%] top-[22%] h-px w-[12%] bg-white/8" />
          <div className="absolute right-[16%] top-[18%] h-[14%] w-px bg-white/8" />
          <div className="absolute bottom-[32%] right-[22%] h-px w-[14%] bg-white/8" />
          <div className="absolute left-[12%] top-[22%] h-[12%] w-px rotate-[37deg] bg-white/8 origin-top" />
        </div>

        <div className="page-shell relative z-10">
          <div className="mx-auto flex max-w-[1040px] flex-col items-center text-center">
            <h1 className="font-display text-[clamp(4.5rem,17vw,11rem)] font-semibold leading-[0.88] tracking-[0.12em] text-white">
              E<span className="text-[var(--color-accent)]">X</span>ENDE
            </h1>

            <div className="mt-8 max-w-[760px] space-y-3">
              <p className="text-[clamp(1.4rem,2.5vw,2.3rem)] font-medium tracking-[-0.04em] text-white">
                Infrastructure APIs for autonomous software.
              </p>
              <p className="text-[clamp(1rem,1.6vw,1.32rem)] leading-8 text-[var(--color-muted)]">
                Agent-native infrastructure, paid per request with x402.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/docs" className="button-link">
                Docs
              </Link>
              <Link href="/api" className="button-link" data-variant="accent">
                API
              </Link>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-5 hidden px-6 text-[0.66rem] text-white/28 sm:block">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between font-mono uppercase tracking-[0.18em]">
            <span>{siteConfig.callbackBase.replace("https://", "")}</span>
            <span>8453</span>
            <span>x402 v2</span>
            <span>{siteConfig.apiBase.replace("https://", "")}</span>
          </div>
        </div>
      </section>
    </>
  );
}
