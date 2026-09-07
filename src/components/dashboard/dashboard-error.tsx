import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export function DashboardError({ title = "Customer services are unavailable." }: { title?: string }) {
  return (
    <section className="dashboard-error">
      <AlertTriangle />
      <p className="annotation">CONTROL PLANE</p>
      <h1>{title}</h1>
      <p>No placeholder data is shown. Retry when the secure account services are available.</p>
      <Link href="/dashboard">Retry <ArrowRight /></Link>
    </section>
  );
}
