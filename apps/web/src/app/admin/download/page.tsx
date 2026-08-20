import { getBranchCounts } from "@node/api/data/students";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@node/auth";
import { DownloadQrByBranch } from "./download-client";

export const dynamic = "force-dynamic";

export default async function AdminDownloadPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login?redirect=/admin/download");
  }

  const branches = await getBranchCounts();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-slate-900">Download QR Codes</h1>
          <p className="text-slate-500 mt-2">Download QR codes organized by branch in separate folders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.branch}
              className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col"
            >
              <h3 className="text-xl font-bold text-slate-800">{branch.branch}</h3>
              <p className="text-slate-500 text-sm mt-1">
                {branch._count} student{branch._count !== 1 ? "s" : ""}
              </p>
              <DownloadQrByBranch branch={branch.branch} count={branch._count} />
            </div>
          ))}
        </div>

        {branches.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
            <h2 className="text-xl font-medium text-slate-600">No branches found</h2>
            <p className="text-slate-500 mt-1">Import students to see branches here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
