import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(projectRoot, relativePath), "utf8"));
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
    }),
  );
  return files.flat();
}

test("Callback OpenAPI exposes the implemented production contract", async () => {
  const spec = await readJson("public/openapi/callback.json");

  assert.equal(spec.openapi, "3.1.0");
  assert.equal(spec.servers[0].url, "https://api.exende.dev");
  assert.ok(spec.paths["/v1/callbacks"].post);
  assert.ok(spec.paths["/v1/callbacks/{id}/events"].get);
  assert.ok(spec.paths["/v1/callbacks/{id}/wait"].get);
  assert.ok(spec.paths["/v1/callbacks/{id}"].delete);
  assert.deepEqual(
    Object.keys(spec.paths["/hooks/{id}"])
      .filter((key) => ["post", "put", "patch"].includes(key))
      .sort(),
    ["patch", "post", "put"],
  );
  assert.equal(spec.components.schemas.Callback.properties.limits.properties.events.const, 10);
  assert.equal(spec.components.schemas.Callback.properties.limits.properties.payload_bytes.const, 262144);
});

test("Retry OpenAPI exposes the implemented production contract", async () => {
  const spec = await readJson("public/openapi/retry.json");

  assert.equal(spec.openapi, "3.1.0");
  assert.equal(spec.servers[0].url, "https://retry.exende.dev");
  assert.ok(spec.paths["/v1/retries"].post);
  assert.ok(spec.paths["/v1/retries/{id}"].get);
  assert.ok(spec.paths["/v1/retries/{id}/attempts"].get);
  assert.ok(spec.paths["/v1/retries/{id}/callback"].get);
  assert.ok(spec.paths["/v1/retries/{id}/cancel"].post);
  assert.ok(spec.paths["/v1/usage"].get);
  assert.equal(spec.components.schemas.RetryPolicy.properties.max_attempts.maximum, 20);
  assert.match(spec.components.schemas.RetryPolicy.properties.max_attempts.description, /Maximum 8 for x402/);
});

test("Resolve OpenAPI matches the live v1 contract", async () => {
  const spec = await readJson("public/openapi/resolve.json");

  assert.equal(spec.openapi, "3.1.0");
  assert.equal(spec.info.version, "1.0.0");
  assert.equal(spec.servers[0].url, "https://resolve.exende.dev");
  assert.ok(spec.paths["/v1/resolve"].post);
  assert.ok(spec.paths["/v1/resolves/{id}"].get);
  assert.deepEqual(
    spec.paths["/v1/resolve"].post.requestBody.content["application/json"].schema.properties.output.enum,
    ["auto", "markdown", "text", "json"],
  );
  assert.equal(
    spec.paths["/v1/resolves/{id}"].get.parameters[0].schema.pattern,
    "^resolve_[a-f0-9]{32}$",
  );
});

test("machine-readable catalog contains exact confirmed pricing and limits", async () => {
  const catalog = await readJson("public/api/catalog.json");
  const jobsData = catalog.products.find((product) => product.id === "jobs-data");
  const callback = catalog.products.find((product) => product.id === "callback");
  const retry = catalog.products.find((product) => product.id === "retry");
  const resolve = catalog.products.find((product) => product.id === "resolve");

  assert.deepEqual(
    [
      jobsData.public_overview.method,
      jobsData.public_overview.url,
      jobsData.public_overview.authentication,
      jobsData.public_overview.payload,
    ],
    [
      "GET",
      "https://data.exende.dev/v1/public/overview",
      "none",
      "aggregate_only",
    ],
  );
  assert.equal(jobsData.customer_api_base_url, "https://data.exende.dev");
  assert.equal(jobsData.customer_access, "available_with_scoped_key");
  assert.equal(jobsData.billing, "live_subscriptions");
  assert.deepEqual(
    jobsData.credit_metering.fixed.map(({ operation, credits }) => [operation, credits]),
    [
      ["jobs.detail", 1],
      ["companies.detail", 2],
      ["companies.hiring", 5],
      ["metrics.overview", 2],
      ["metrics.hiring", 5],
    ],
  );
  assert.ok(jobsData.credit_metering.per_returned_record.every(({ credits }) => credits === 1));
  assert.equal(
    jobsData.public_overview.cache_control,
    "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
  );
  assert.deepEqual(
    [callback.payment.price, callback.payment.amount_atomic, callback.payment.currency, callback.payment.network],
    ["0.01", "10000", "USDC", "eip155:8453"],
  );
  assert.deepEqual(
    [retry.payment.price, retry.payment.amount_atomic, retry.payment.currency, retry.payment.network],
    ["0.02", "20000", "USDC", "eip155:8453"],
  );
  assert.equal(retry.payment.per_attempt_surcharge, false);
  assert.deepEqual(retry.paid_limits, { max_attempts: 8, lifetime_seconds: 86400 });
  assert.deepEqual(retry.api_key_limits, { max_attempts: 20 });
  assert.deepEqual(
    [resolve.payment.price, resolve.payment.amount_atomic, resolve.payment.currency, resolve.payment.network],
    ["0.03", "30000", "USDC", "eip155:8453"],
  );
  assert.deepEqual(
    [resolve.limits.download_bytes, resolve.limits.redirects, resolve.limits.output_bytes, resolve.limits.retention_seconds],
    [10485760, 3, 524288, 259200],
  );
});

test("usage dashboard explains every customer credit cost before requests", async () => {
  const page = await readFile(path.join(projectRoot, "src/app/dashboard/usage/page.tsx"), "utf8");

  assert.match(page, /Only successful requests that return data consume credits/);
  assert.match(page, /returning zero records cost 0 credits/);
  assert.match(page, /GET \/v1\/public\/overview<\/code> is free and keyless/);
  assert.match(page, /1 credit <small>\/ record<\/small>/);
  for (const route of [
    "/v1/jobs/search",
    "/v1/jobs",
    "/v1/jobs/{id}/history",
    "/v1/companies/{domain}/jobs",
    "/v1/skills",
    "/v1/history",
    "/v1/jobs/{id}",
    "/v1/companies/{domain}",
    "/v1/companies/{domain}/hiring",
    "/v1/metrics/overview",
    "/v1/metrics/hiring",
  ]) {
    assert.ok(page.includes(route), `usage dashboard is missing ${route}`);
  }
  assert.match(page, /\["Job detail", "\/v1\/jobs\/\{id\}", 1\]/);
  assert.match(page, /\["Company detail", "\/v1\/companies\/\{domain\}", 2\]/);
  assert.match(page, /\["Company hiring", "\/v1\/companies\/\{domain\}\/hiring", 5\]/);
  assert.match(page, /\["Overview metrics", "\/v1\/metrics\/overview", 2\]/);
  assert.match(page, /\["Hiring metrics", "\/v1\/metrics\/hiring", 5\]/);
});

test("agent discovery files point to canonical documentation and contracts", async () => {
  const llms = await readFile(path.join(projectRoot, "public/llms.txt"), "utf8");
  const full = await readFile(path.join(projectRoot, "public/llms-full.txt"), "utf8");

  for (const text of [llms, full]) {
    assert.match(text, /https:\/\/www\.exende\.dev\/docs\/callback/);
    assert.match(text, /https:\/\/www\.exende\.dev\/docs\/retry/);
    assert.match(text, /https:\/\/www\.exende\.dev\/docs\/resolve/);
    assert.match(text, /https:\/\/www\.exende\.dev\/openapi\/callback\.json/);
    assert.match(text, /https:\/\/www\.exende\.dev\/openapi\/retry\.json/);
    assert.match(text, /https:\/\/www\.exende\.dev\/openapi\/resolve\.json/);
  }
});

test("public content contains no obsolete demo prices or secret-shaped live keys", async () => {
  const sourceFiles = (await collectFiles(path.join(projectRoot, "src"))).filter((file) => /\.(ts|tsx|css)$/.test(file));
  const publicFiles = (await collectFiles(path.join(projectRoot, "public"))).filter((file) => /\.(json|txt|svg)$/.test(file));
  const content = (await Promise.all([...sourceFiles, ...publicFiles].map((file) => readFile(file, "utf8")))).join("\n");

  assert.doesNotMatch(content, /\$0\.001\b|\$0\.005\b/);
  assert.doesNotMatch(content, /\bex_live_[A-Za-z0-9_-]{12,}\b/);
  assert.doesNotMatch(content, /\bexd_(?:live|test)_[A-Za-z0-9_-]{20,}\b/);
  assert.doesNotMatch(content, /\b(?:sk|whsec)_(?:test|live)_[A-Za-z0-9_-]{12,}\b/);
  assert.doesNotMatch(content, /\b(?:callback|retry)[_-](?:secret|private_key)\s*[:=]\s*["'][^"']+/i);
  assert.doesNotMatch(content, /NEXT_PUBLIC_(?:EXENDE_CONTROL_PLANE_URL|EXENDE_DATA_API_URL)/);
});

test("customer account routes preserve the server-only control-plane boundary", async () => {
  const controlClient = await readFile(path.join(projectRoot, "src/lib/control-plane.ts"), "utf8");
  const proxy = await readFile(path.join(projectRoot, "src/lib/control-plane-proxy.ts"), "utf8");
  const dashboardLayout = await readFile(path.join(projectRoot, "src/app/dashboard/layout.tsx"), "utf8");
  const sitemap = await readFile(path.join(projectRoot, "src/app/sitemap.ts"), "utf8");
  const accountPage = await readFile(path.join(projectRoot, "src/app/account/page.tsx"), "utf8");
  const envExample = await readFile(path.join(projectRoot, ".env.example"), "utf8");

  assert.match(controlClient, /^import "server-only";/);
  assert.match(controlClient, /url\.protocol !== "https:" && !isLocalHost\(url\.hostname\)/);
  assert.match(proxy, /const CONTROL_ROUTES:/);
  assert.match(proxy, /api-keys\|billing\\\/checkout\|billing\\\/portal\|billing\\\/plan-change/);
  assert.match(proxy, /plan-change\(\?:\\\/preview\|\\\/cancel\)\?\|account\\\/deletion-request/);
  assert.doesNotMatch(proxy, /\/internal\/v1/);
  assert.match(dashboardLayout, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
  assert.doesNotMatch(sitemap, /["']\/dashboard/);
  assert.doesNotMatch(sitemap, /["']\/account/);
  assert.match(accountPage, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
  assert.doesNotMatch(envExample, /NEXT_PUBLIC_/);
  assert.doesNotMatch(envExample, /(?:SECRET|TOKEN|PRIVATE|PASSWORD|API_KEY)\s*=/);
});

test("official wordmark is present with intrinsic proportions", async () => {
  const logo = await readFile(path.join(projectRoot, "public/exende-logo.svg"), "utf8");
  assert.match(logo, /viewBox="0 0 263 28"/);
  assert.match(logo, /role="img"/);
  assert.match(logo, /<title[^>]*>EXENDE<\/title>/);
});

test("legal pages identify the operator and public support channel without Google Analytics", async () => {
  const terms = await readFile(path.join(projectRoot, "src/app/terms/page.tsx"), "utf8");
  const privacy = await readFile(path.join(projectRoot, "src/app/privacy/page.tsx"), "utf8");
  const layout = await readFile(path.join(projectRoot, "src/app/layout.tsx"), "utf8");
  const site = await readFile(path.join(projectRoot, "src/content/site.ts"), "utf8");

  for (const page of [terms, privacy]) {
    assert.match(page, /siteConfig\.legalOperator/);
    assert.match(page, /siteConfig\.supportEmail/);
  }
  assert.match(site, /supportEmail:\s*"support@exende\.dev"/);
  assert.doesNotMatch(layout, /googletagmanager|google-analytics|analyticsId/);
});
