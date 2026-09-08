import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = (process.env.SITE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const routes = [
  "/",
  "/products",
  "/products/jobs",
  "/products/callback",
  "/products/retry",
  "/products/resolve",
  "/pricing",
  "/docs",
  "/docs/jobs",
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
  for (const route of ["/openapi/callback.json", "/openapi/retry.json", "/openapi/resolve.json", "/api/catalog.json", "/llms.txt", "/llms-full.txt", "/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/opengraph-image", "/twitter-image"]) {
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
  assert.doesNotMatch(home, /googletagmanager\.com|google-analytics|G-51HMFG32YE/);

  const missing = await fetch(`${baseUrl}/this-route-must-not-exist`);
  const missingHtml = await missing.text();
  assert.equal(missing.status, 404);
  assert.match(missingHtml, /Page not found/);
  assert.equal(occurrences(missingHtml, /<h1(?:\s|>)/gi), 1);
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
