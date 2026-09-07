import { proxyControlRequest } from "@/lib/control-plane-proxy";

export const dynamic = "force-dynamic";

async function handler(request: Request, context: RouteContext<"/api/control/[...path]">) {
  const { path } = await context.params;
  return proxyControlRequest(request, path);
}

export { handler as GET, handler as POST, handler as DELETE };
