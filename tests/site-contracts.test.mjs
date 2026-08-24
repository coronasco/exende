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

test("machine-readable catalog contains exact confirmed pricing and limits", async () => {
  const catalog = await readJson("public/api/catalog.json");
  const callback = catalog.products.find((product) => product.id === "callback");
  const retry = catalog.products.find((product) => product.id === "retry");

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
});

test("agent discovery files point to canonical documentation and contracts", async () => {
  const llms = await readFile(path.join(projectRoot, "public/llms.txt"), "utf8");
  const full = await readFile(path.join(projectRoot, "public/llms-full.txt"), "utf8");

  for (const text of [llms, full]) {
    assert.match(text, /https:\/\/exende\.dev\/docs\/callback/);
    assert.match(text, /https:\/\/exende\.dev\/docs\/retry/);
    assert.match(text, /https:\/\/exende\.dev\/openapi\/callback\.json/);
    assert.match(text, /https:\/\/exende\.dev\/openapi\/retry\.json/);
  }
});

test("public content contains no obsolete demo prices or secret-shaped live keys", async () => {
  const sourceFiles = (await collectFiles(path.join(projectRoot, "src"))).filter((file) => /\.(ts|tsx|css)$/.test(file));
  const publicFiles = (await collectFiles(path.join(projectRoot, "public"))).filter((file) => /\.(json|txt|svg)$/.test(file));
  const content = (await Promise.all([...sourceFiles, ...publicFiles].map((file) => readFile(file, "utf8")))).join("\n");

  assert.doesNotMatch(content, /\$0\.001\b|\$0\.005\b/);
  assert.doesNotMatch(content, /\bex_live_[A-Za-z0-9_-]{12,}\b/);
  assert.doesNotMatch(content, /\b(?:callback|retry)[_-](?:secret|private_key)\s*[:=]\s*["'][^"']+/i);
});

test("official wordmark is present with intrinsic proportions", async () => {
  const logo = await readFile(path.join(projectRoot, "public/exende-logo.svg"), "utf8");
  assert.match(logo, /viewBox="0 0 263 28"/);
  assert.match(logo, /role="img"/);
  assert.match(logo, /<title[^>]*>EXENDE<\/title>/);
});
