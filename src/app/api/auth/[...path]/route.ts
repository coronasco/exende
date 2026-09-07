import { proxyAuthRequest } from "@/lib/control-plane-proxy";

export const dynamic = "force-dynamic";

async function handler(request: Request, context: RouteContext<"/api/auth/[...path]">) {
  const { path } = await context.params;
  return proxyAuthRequest(request, path);
}

export { handler as GET, handler as POST, handler as OPTIONS };
