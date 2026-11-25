import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = (process.env.SITE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const routes = [
  "/",
  "/products",
  "/products/jobs",
  "/products/jobs-intelligence",
  "/products/test-inbox",
  "/products/callback",
  "/products/retry",
  "/products/resolve",
  "/pricing",
  "/coverage",
  "/docs",
  "/docs/jobs",
  "/docs/jobs-intelligence",
  "/docs/test-inbox",
  "/docs/callback",
  "/docs/retry",
  "/docs/resolve",
  "/docs/x402",
  "/api",
  "/account",
  "/terms",
  "/privacy",
];
const indexableRoutes = routes.filter((route) => route !== "/account");

function occurrences(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

test("all public pages render complete crawlable metadata and structured data", async () => {
  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();

    assert.equal(response.status, 200, `${route} did not return HTTP 200`);
    assert.match(html, /<html[^>]+lang="en"/i, `${route} is missing the language declaration`);
    assert.equal(occurrences(html, /<h1(?:\s|>)/gi), 1, `${route} must have exactly one h1`);
    assert.match(html, /<title>[^<]+<\/title>/i, `${route} is missing a title`);
    assert.match(html, /<meta[^>]+name="description"[^>]+content="[^"]+"/i, `${route} is missing a description`);
    assert.match(
      html,
      new RegExp(`<link[^>]+rel="canonical"[^>]+href="https://www\\.exende\\.dev${route === "/" ? "" : route}"`, "i"),
      `${route} has the wrong canonical URL`,
    );
    assert.match(html, /<meta[^>]+property="og:title"[^>]+content="[^"]+"/i, `${route} is missing og:title`);
    assert.match(html, /<meta[^>]+property="og:image"[^>]+content="[^"]+"/i, `${route} is missing og:image`);
    assert.match(html, /<meta[^>]+name="twitter:card"[^>]+content="summary_large_image"/i, `${route} is missing its Twitter card`);
    assert.match(html, /<meta[^>]+name="twitter:image"[^>]+content="[^"]+"/i, `${route} is missing twitter:image`);

    const jsonLdBlocks = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    assert.ok(jsonLdBlocks.length > 0, `${route} has no JSON-LD`);
    for (const [, json] of jsonLdBlocks) {
      const data = JSON.parse(json);
      const nodes = Array.isArray(data) ? data : [data];
      for (const node of nodes) {
        assert.equal(node["@context"], "https://schema.org", `${route} has invalid JSON-LD context`);
        assert.ok(node["@type"], `${route} has JSON-LD without @type`);
      }
    }
  }
});

test("all crawlable internal page links resolve", async () => {
  const links = new Set(routes);

  for (const route of routes) {
    const html = await (await fetch(`${baseUrl}${route}`)).text();
    for (const match of html.matchAll(/<a[^>]+href="([^"]+)"/gi)) {
      const href = match[1].replaceAll("&amp;", "&");
      if (href.startsWith("/") && !href.startsWith("//")) links.add(href.split("#")[0]);
      if (href.startsWith("https://www.exende.dev/")) links.add(new URL(href).pathname);
    }
  }

  for (const link of links) {
    const response = await fetch(`${baseUrl}${link}`, { redirect: "manual" });
    assert.ok(response.status >= 200 && response.status < 400, `${link} returned HTTP ${response.status}`);
  }
});

test("machine-readable, crawler, analytics, and 404 surfaces are available", async () => {
  for (const route of ["/openapi/jobs.json", "/favicon.svg", "/openapi/callback.json", "/openapi/test-inbox.json", "/openapi/retry.json", "/openapi/resolve.json", "/api/catalog.json", "/llms.txt", "/llms-full.txt", "/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/opengraph-image", "/twitter-image"]) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, `${route} did not return HTTP 200`);
  }

  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  for (const route of indexableRoutes) {
    assert.match(sitemap, new RegExp(`<loc>https://www\\.exende\\.dev${route === "/" ? "" : route}</loc>`));
  }
  assert.doesNotMatch(sitemap, /<loc>https:\/\/www\.exende\.dev\/account<\/loc>/);

  const robots = await (await fetch(`${baseUrl}/robots.txt`)).text();
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Disallow: \/dashboard\//);
  assert.match(robots, /Sitemap: https:\/\/www\.exende\.dev\/sitemap\.xml/);

  const home = await (await fetch(baseUrl)).text();
  assert.match(home, /googletagmanager\.com\/gtag\/js\?id=G-51HMFG32YE/);

  const missing = await fetch(`${baseUrl}/this-route-must-not-exist`);
  const missingHtml = await missing.text();
  assert.equal(missing.status, 404);
  assert.match(missingHtml, /Page not found/);
  assert.equal(occurrences(missingHtml, /<h1(?:\s|>)/gi), 1);
});

test("Jobs Data is described as a WebAPI rather than an incomplete Product snippet", async () => {
  for (const route of ["/", "/products/jobs"]) {
    const html = await (await fetch(`${baseUrl}${route}`)).text();
    const nodes = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
      .flatMap(([, json]) => {
        const data = JSON.parse(json);
        return Array.isArray(data) ? data : [data];
      });
    const jobs = nodes.find((node) => node["@type"] === "WebAPI");
    assert.ok(jobs, `${route} is missing its Jobs Data WebAPI description`);
    assert.equal(jobs.url, "https://www.exende.dev/products/jobs");
    assert.equal(jobs.documentation, "https://www.exende.dev/docs/jobs");
    assert.equal(jobs.provider["@type"], "Organization");
    assert.ok(!nodes.some((node) => node["@type"] === "Product"), `${route} exposes obsolete Product markup`);
  }
});

test("customer dashboard is private and omitted from discovery surfaces", async () => {
  const dashboard = await fetch(`${baseUrl}/dashboard`, { redirect: "manual" });
  const html = await dashboard.text();
  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();

  assert.ok([200, 307, 308].includes(dashboard.status));
  if (dashboard.status === 200) assert.match(html, /<meta[^>]+name="robots"[^>]+content="noindex, nofollow"/i);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/www\.exende\.dev\/dashboard/);
  const account = await (await fetch(`${baseUrl}/account`)).text();
  assert.match(account, /<meta[^>]+name="robots"[^>]+content="noindex, nofollow"/i);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/www\.exende\.dev\/account/);
});

test("product navigation exposes matching breadcrumbs and working section anchors in the initial HTML", async () => {
  const publicPages = routes.filter(route => route.startsWith("/products") || ["/pricing", "/coverage", "/api"].includes(route));

  for (const route of publicPages) {
    const html = await (await fetch(baseUrl + route)).text();
    const navigation = html.match(/<nav[^>]*aria-label="On this page"[^>]*>([\s\S]*?)<\/nav>/i);
    assert.ok(navigation, `${route} is missing its section index`);
    const anchors = [...navigation[1].matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
    assert.ok(anchors.length > 0, `${route} has no section links`);
    for (const anchor of anchors) assert.ok(html.includes(`id="${anchor}"`), `${route}#${anchor} is missing`);

    const nodes = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
      .flatMap(([, json]) => JSON.parse(json));
    const breadcrumb = nodes.find(node => node["@type"] === "BreadcrumbList");
    assert.equal(breadcrumb?.itemListElement.at(-1)?.item, `https://www.exende.dev${route}`);
  }
});

test("homepage explains the catalogue, all seven hiring endpoints, and agent access in the initial HTML", async () => {
  const response = await fetch(baseUrl);
  const markup = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  for (const section of ["listing", "catalogue", "data-apis", "capabilities", "history", "jobs-intelligence", "use-cases", "infrastructure", "access"]) {
    assert.ok(markup.includes(`id="${section}"`), `missing ${section} section`);
  }
  for (const endpoint of ["search", "company", "signals", "changes", "skills", "trends", "report"]) {
    assert.ok(markup.includes(`href="/docs/jobs-intelligence#${endpoint}"`), `missing ${endpoint} contract`);
  }
  for (const product of ["callback", "retry", "resolve", "test-inbox"]) {
    assert.ok(markup.includes(`href="/products/${product}"`), `missing ${product} product`);
  }
  assert.ok(markup.indexOf('id="listing"') < markup.indexOf('id="data-apis"'));
  assert.match(markup, /Senior Machine Learning Engineer - Messaging Platform/);
  assert.match(markup, /5 search results = 5 credits/);
  assert.match(markup, /first_seen_at/);
  assert.match(markup, /last_seen_at/);
  assert.match(markup, /2,500/);
});
