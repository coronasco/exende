import { CodeBlock } from "@/components/code-block";
import { JsonLd } from "@/components/json-ld";
import { codeExamples, resolveExamples } from "@/content/examples";
import { siteConfig } from "@/content/site";
import { ArrowRight, Webhook, RotateCw, ScanSearch } from "lucide-react";
import Link from "next/link";
import { FeatureCard, ProductActions, ProductHero, ProductSection, productStyles as s } from "./product-ui";

const products = {
  callback: {
    name: "Callback", icon: Webhook, price: "0.01", title: <>An event arrives.<br /><span>Your agent is ready.</span></>,
    description: "Create a temporary webhook endpoint. Receive an external event, then read it or wait for it through a simple HTTP API.",
    steps: [
      { title: "Create an endpoint", path: "POST api.exende.dev/v1/callbacks", detail: "One x402-paid creation returns a public callback URL and a private read token." },
      { title: "Receive an event", path: "POST cb.exende.dev/hooks/{id}", detail: "Give the callback URL to the upstream service. It can deliver up to 10 events within the endpoint lifetime." },
      { title: "Read or wait", path: "GET /v1/callbacks/{id}/wait", detail: "Retrieve received events or long-poll for up to 30 seconds with the private read token." },
    ],
    facts: [["Per creation", "$0.01 USDC"], ["Lifetime", "10 minutes"], ["Events", "Up to 10"], ["Event payload", "256 KB max"]],
    heading: <>Receive a result.<br />Skip the receiver setup.</>,
    detail: "Connect asynchronous services to an agent workflow without deploying a webhook server. The creation payment covers delivery, reads, waits, and deletion for that callback.",
    boundary: "Keep the read token private. The callback URL is a temporary event receiver; it is not a permanent message store.",
    example: codeExamples.createCallback,
  },
  retry: {
    name: "Retry", icon: RotateCw, price: "0.02", title: <>A tool call fails.<br /><span>The work continues.</span></>,
    description: "Make an outbound HTTPS request durable. Schedule backoff, recover interrupted work, and inspect every attempt through one API.",
    steps: [
      { title: "Submit the request", path: "POST retry.exende.dev/v1/retries", detail: "Create a durable job with the outbound request and an explicit retry policy in one x402-paid call." },
      { title: "Recover from failures", path: "Exponential backoff · Up to 8 attempts", detail: "Retry schedules transient failures and recovers interrupted work within the job lifetime." },
      { title: "Observe the result", path: "GET /v1/retries/{id}/attempts", detail: "Use a private read token for status and attempt history, or configure an optional signed terminal callback." },
    ],
    facts: [["Per paid job", "$0.02 USDC"], ["Attempts", "Up to 8"], ["Lifetime", "Up to 24h"], ["History", "Per attempt"]],
    heading: <>One job.<br />A documented outcome.</>,
    detail: "The creation payment covers the job and its permitted outbound attempts. The response includes a private read token for follow-up status and history requests.",
    boundary: "Optional terminal callbacks are signed with HMAC and retried independently. The retry policy and target restrictions are documented in the API contract.",
    example: `curl -i -X POST \\\n  https://retry.exende.dev/v1/retries \\\n  -H "Content-Type: application/json" \\\n  --data '{
    "request": {
      "method": "GET",
      "url": "https://httpbin.org/status/204"
    },
    "retry": {
      "max_attempts": 8,
      "strategy": "exponential",
      "initial_delay_seconds": 5,
      "max_delay_seconds": 300
    }
  }'`,
  },
  resolve: {
    name: "Resolve", icon: ScanSearch, price: "0.03", title: <>A public resource.<br /><span>A useful result.</span></>,
    description: "Turn public web pages, PDFs, JSON, CSV, text, and supported image metadata into bounded, machine-readable output.",
    steps: [
      { title: "Validate the URL", path: "POST resolve.exende.dev/v1/resolve", detail: "Submit one public HTTP or HTTPS URL. Network target validation rejects disallowed destinations." },
      { title: "Detect the resource", path: "HTML · PDF · JSON · CSV · Text · Images", detail: "Resolve probes the format and selects a supported extraction path. Browser rendering is conditional." },
      { title: "Read the result", path: "GET /v1/resolves/{id}", detail: "Use the returned job-scoped read token to retrieve the bounded result without another Exende payment." },
    ],
    facts: [["Per paid job", "$0.03 USDC"], ["Download", "10 MiB max"], ["Output", "512 KiB max"], ["Retention", "72 hours"]],
    heading: <>Detect first.<br />Extract what matters.</>,
    detail: "Static HTML is fetched first. Browser rendering is used when requested or when page signals indicate that static HTML is not useful. Other supported formats follow deterministic extraction paths.",
    boundary: "Resolve v1 does not use an LLM or OCR. Output and retention are bounded; consult the contract for supported formats and extraction limits.",
    example: resolveExamples.createCurl,
  },
} as const;

export function InfrastructureProduct({ product }: { product: keyof typeof products }) {
  const p = products[product];
  const Icon = p.icon;
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: `Exende ${p.name} API`, url: `${siteConfig.url}/products/${product}`, description: p.description, provider: { "@type": "Organization", name: "Exende", url: siteConfig.url }, offers: { "@type": "Offer", price: p.price, priceCurrency: "USDC", description: `One x402-paid ${p.name} resource on Base Mainnet.` } }} />
    <ProductHero eyebrow={`${p.name} API · Agent infrastructure`} title={p.title} description={p.description} aside={
      <div className={s.protocol}><div className={s.protocolHead}><span>{p.name.toUpperCase()} / WORKFLOW</span><Icon /></div><ol className={s.protocolSteps}>{p.steps.map((step,i) => <li key={step.title}><span>0{i+1}</span><div><strong>{step.title}</strong><code>{step.path}</code></div></li>)}</ol><dl className={s.facts}>{p.facts.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
    }><ProductActions primary="Read the API docs" href={`/docs/${product}`} secondary="OpenAPI contract" secondaryHref={`/openapi/${product}.json`} /><p className={s.note}>x402 v2 · USDC on Base · Discoverable in Bazaar</p></ProductHero>
    <ProductSection eyebrow="A focused HTTP workflow" title="Three steps. One useful primitive.">
      <div className={s.threeColumns}>{p.steps.map((step,i) => <FeatureCard number={`0${i+1}`} title={step.title} key={step.title}><p>{step.detail}</p><code>{step.path}</code></FeatureCard>)}</div>
    </ProductSection>
    <ProductSection><div className={s.featured}><div data-reveal><p className={s.eyebrow}>The request contract</p><h2>{p.heading}</h2><p>{p.detail}</p><p className={s.note}>{p.boundary}</p><Link href={`/docs/${product}`} className={s.secondary}>Explore the full API reference <ArrowRight /></Link></div><div data-reveal><CodeBlock code={p.example} language="bash" title="Initial request returns HTTP 402 payment requirements" /></div></div></ProductSection>
    <ProductSection eyebrow="Built for agent workflows" title="Discover. Pay. Use.">
      <div className={s.twoColumns}><div data-reveal><p className={s.lead}>An x402-aware client reads the HTTP 402 payment requirements, settles the exact USDC amount, and retries with its payment signature.</p><ProductActions primary="Read the x402 guide" href="/docs/x402" secondary="Browse infrastructure" secondaryHref="/products#infrastructure" /></div><div className={s.protocol} data-reveal><p className={s.eyebrow}>Payment model</p><h3>Paid per created resource.</h3><p className={s.note}>Jobs Data subscriptions and credits are a separate access model. Infrastructure creation uses its own documented contract and payment requirements.</p><a href={siteConfig.bazaarSearch} className={s.secondary}>View Bazaar discovery <ArrowRight /></a></div></div>
    </ProductSection>
  </>;
}
