import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export function DashboardError({ title = "Customer services are unavailable." }: { title?: string }) {
  return (
    <section className="dashboard-error">
      <AlertTriangle />
      <p className="annotation">ACCOUNT SERVICES</p>
      <h1>{title}</h1>
      <p>Please try again shortly. Your account data will appear when the service reconnects.</p>
      <Link href="/dashboard">Retry <ArrowRight /></Link>
    </section>
  );
}
