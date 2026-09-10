import { NextResponse, type NextRequest } from "next/server";
import { accountDestination } from "@/lib/account-intent";

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  // Always overwrite client-supplied values. Authentication stays in the existing server layout.
  headers.set("x-exende-dashboard-destination", accountDestination(request.nextUrl.pathname + request.nextUrl.search));
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: "/dashboard/:path*" };
