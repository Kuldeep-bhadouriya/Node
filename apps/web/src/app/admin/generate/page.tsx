import { auth } from "@node/auth";
import prisma from "@node/db";
import { env } from "@node/env/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import QRCode from "react-qr-code";
import { generateQRToken } from "@/lib/qr-token";

export const dynamic = "force-dynamic";

export default async function AdminGeneratePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Middleware handles the redirect, but this is a safety check
  if (session?.user.role !== "ADMIN") {
    redirect("/login?redirect=/admin/generate");
  }

  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
  });

  const baseUrl = env.BASE_URL;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b pb-4">
          <h1 className="font-bold text-3xl text-slate-900">Generate QR Codes</h1>
          <p className="mt-2 text-slate-500">Generate and print QR Codes for Student IDs.</p>
        </div>

        {students.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
            <h2 className="font-medium text-slate-600 text-xl">No students found</h2>
            <p className="mt-1 text-slate-500">
              Add students to the database to generate their QR codes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {students.map((student) => {
              const qrToken = generateQRToken(student.id);
              const profileUrl = `${baseUrl}/student/${student.id}?token=${encodeURIComponent(qrToken.token)}`;
              return (
                <div
                  key={student.id}
                  className="flex flex-col items-center rounded-2xl border bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 rounded-xl border bg-white p-4 shadow-inner">
                    <QRCode value={profileUrl} size={180} level="H" className="h-auto w-full" />
                  </div>
                  <h3 className="text-center font-bold text-lg text-slate-800">{student.name}</h3>
                  <p className="mb-1 font-medium text-slate-500 text-sm">{student.cardNo}</p>
                  <p className="rounded-md bg-slate-100 px-2 py-1 text-slate-400 text-xs">
                    {student.branch} - {student.batch}
                  </p>

                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 font-medium text-indigo-600 text-sm transition-colors hover:text-indigo-800"
                  >
                    Preview Profile &rarr;
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
