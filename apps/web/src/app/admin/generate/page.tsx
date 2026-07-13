import { appRouter } from "@node/api/routers/index";
import prisma from "@node/db";
import QRCode from "react-qr-code";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminGeneratePage() {
  const caller = appRouter.createCaller({
    session: null,
    prisma: prisma,
  });

  const students = await caller.student.getAll();
  
  // We determine the base URL using headers if possible, or fallback
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-2">Generate and print QR Codes for Student IDs.</p>
        </div>

        {students.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
            <h2 className="text-xl font-medium text-slate-600">No students found</h2>
            <p className="text-slate-500 mt-1">Add students to the database to generate their QR codes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {students.map((student) => {
              const profileUrl = `${baseUrl}/student/${student.id}`;
              return (
                <div key={student.id} className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl shadow-inner border mb-4">
                    <QRCode
                      value={profileUrl}
                      size={180}
                      level="H"
                      className="w-full h-auto"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 text-center">{student.name}</h3>
                  <p className="text-sm font-medium text-slate-500 mb-1">{student.rollNo}</p>
                  <p className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                    {student.course} - Sem {student.semester}
                  </p>
                  
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
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
