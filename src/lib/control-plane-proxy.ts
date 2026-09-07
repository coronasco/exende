import "server-only";

import { ControlPlaneError, controlPlaneFetch } from "@/lib/control-plane";

const CONTROL_ROUTES: ReadonlyArray<{ method: string; pattern: RegExp }> = [
  { method: "GET", pattern: /^(?:me|overview|api-keys|credits|usage|billing)$/ },
  { method: "POST", pattern: /^(?:api-keys|billing\/checkout|billing\/portal|account\/deletion-request)$/ },
  { method: "DELETE", pattern: /^api-keys\/[0-9a-f-]{36}$/i }
];

export async function proxyAuthRequest(request: Request, path: string[]): Promise<Response> {
  return forward(request, `/api/auth/${path.map(encodeURIComponent).join("/")}`);
}

export async function proxyControlRequest(request: Request, path: string[]): Promise<Response> {
  const route = path.join("/");
  if (!CONTROL_ROUTES.some((entry) => entry.method === request.method && entry.pattern.test(route))) {
    return Response.json({ error: { code: "not_found", message: "Management route not found" } }, { status: 404 });
  }
  return forward(request, `/v1/${route}`);
}

async function forward(request: Request, pathname: string): Promise<Response> {
  if (!sameOriginForMutation(request)) {
    return Response.json({ error: { code: "origin_not_allowed", message: "Origin is not allowed" } }, { status: 403 });
  }
  const incoming = new URL(request.url);
  const query = incoming.search;
  const headers = new Headers();
  for (const name of ["accept", "content-type", "cookie", "origin", "user-agent"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();
  try {
    const upstream = await controlPlaneFetch(`${pathname}${query}`, { method: request.method, headers, body });
    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    const status = error instanceof ControlPlaneError ? error.status : 503;
    const code = error instanceof ControlPlaneError ? error.code : "control_plane_unavailable";
    return Response.json({ error: { code, message: "Customer services are temporarily unavailable" } }, {
      status,
      headers: { "cache-control": "no-store" }
    });
  }
}

function sameOriginForMutation(request: Request): boolean {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") return true;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
