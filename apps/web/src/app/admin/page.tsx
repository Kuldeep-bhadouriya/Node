import { auth } from "@node/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import AdminDashboard from "./admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login?redirect=/admin");
  }

  return <AdminDashboard />;
}
