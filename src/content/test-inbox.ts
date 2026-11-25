// Change only after the receiving domain and paid end-to-end flow are verified.
export const testInboxRelease: { status: "preview" | "live" } = { status: "live" };
export const testInboxAvailability = testInboxRelease.status;
export const testInboxStatus = testInboxAvailability === "live"
  ? "Available"
  : "Preview — email domain activation pending";
export const testInboxActivationNote = testInboxAvailability === "live"
  ? "The receiving service is activated."
  : "Creation returns HTTP 503 until email domain activation is complete.";

export const testInbox = {
  price: "$0.02",
  base: "https://api.exende.dev",
  createPath: "/v1/inboxes",
  openapi: "/openapi/test-inbox.json",
  limits: { messages: 3, message_bytes: 1048576, ttl_seconds: 86400, wait_seconds: 60 },
} as const;

export const testInboxEndpoints = [
  ["POST", "/v1/inboxes", "Create an inbox, or recover an existing one with the same token and body.", "$0.02 USDC on Base for a new inbox; matching replay is free."],
  ["GET", "/v1/inboxes/lookup", "Recover inbox metadata using the saved access token.", "Bearer access token; no additional payment."],
  ["GET", "/v1/inboxes/{id}/messages", "Read accepted messages and extraction results.", "Bearer access token; no additional payment."],
  ["GET", "/v1/inboxes/{id}/wait?timeout=60&after={message_id}", "Wait up to 60 seconds for a message after the cursor.", "Bearer access token; no additional payment."],
  ["DELETE", "/v1/inboxes/{id}", "Delete the inbox and its stored messages.", "Bearer access token; no additional payment."],
] as const;

export const testInboxQuickstart = `import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const base = "https://api.exende.dev";
const stateFile = ".private/test-inbox.json";
type RequestBody = {
  access_token: string;
  expected_from: string;
  subject_contains?: string;
  otp_length: number;
  link_host?: string;
};
type Inbox = {
  id: string; address: string; expires_at: string;
  messages_url: string; wait_url: string;
};

async function main() {
  const mode = process.argv[2] ?? "create";
  if (!["create", "read", "wait", "delete"].includes(mode)) {
    throw new Error("Use create, read, wait, or delete");
  }
  let body: RequestBody;
  try {
    body = JSON.parse(await readFile(stateFile, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    if (mode !== "create" || !process.env.EXPECTED_FROM) {
      throw new Error("Set EXPECTED_FROM to your app's sender mailbox for a new inbox");
    }
    body = {
      access_token: randomBytes(32).toString("hex"),
      expected_from: process.env.EXPECTED_FROM,
      subject_contains: process.env.SUBJECT_CONTAINS || undefined,
      otp_length: 6,
      link_host: process.env.LINK_HOST || undefined,
    };
    await mkdir(".private", { recursive: true, mode: 0o700 });
    // Save the token AND exact body before authorizing any payment.
    await writeFile(stateFile, JSON.stringify(body), { flag: "wx", mode: 0o600 });
  }
  const headers = { Authorization: "Bearer " + body.access_token };
  let response = await fetch(base + "/v1/inboxes/lookup", { headers });
  if (response.status === 404 && mode === "create") {
    const key = process.env.X402_PRIVATE_KEY;
    if (!key || !/^0x[0-9a-fA-F]{64}$/.test(key)) {
      throw new Error("Provide X402_PRIVATE_KEY through your secret environment");
    }
    const client = new x402Client();
    registerExactEvmScheme(client, {
      signer: privateKeyToAccount(key as import("viem").Hex),
      networks: ["eip155:8453"],
    });
    client.onBeforePaymentCreation(async ({ selectedRequirements }) => {
      if (selectedRequirements.network !== "eip155:8453" ||
          selectedRequirements.scheme !== "exact" ||
          selectedRequirements.amount !== "20000" ||
          selectedRequirements.asset.toLowerCase() !==
            "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913") {
        return { abort: true, reason: "Unexpected Test Inbox payment quote" };
      }
    });
    const paidFetch = wrapFetchWithPayment(fetch, client);
    response = await paidFetch(base + "/v1/inboxes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
  if (!response.ok) throw new Error("Inbox request returned HTTP " + response.status);
  const inbox = await response.json() as Inbox;
  if (mode === "create") {
    // Give this address to your own app's signup/reset flow.
    console.log({ id: inbox.id, address: inbox.address, expires_at: inbox.expires_at });
    return;
  }
  const path = "/v1/inboxes/" + encodeURIComponent(inbox.id);
  const after = process.env.AFTER_MESSAGE_ID;
  const suffix = mode === "read" ? "/messages" : mode === "wait"
    ? "/wait?timeout=60" + (after ? "&after=" + encodeURIComponent(after) : "") : "";
  response = await fetch(base + path + suffix, {
    method: mode === "delete" ? "DELETE" : "GET", headers,
  });
  if (!response.ok) throw new Error("Inbox operation returned HTTP " + response.status);
  console.log(response.status === 204 ? "No content" : await response.text());
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Inbox request failed");
  console.error("Keep .private/test-inbox.json. Retry with the same file; do not generate another token.");
  process.exitCode = 1;
});`;
