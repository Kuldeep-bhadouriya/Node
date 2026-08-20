"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Download, Printer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

interface StudentForm {
  cardNo: string;
  name: string;
  batch: string;
  branch: string;
  fathersName: string;
  mothersName: string;
  address: string;
  studentMobile: string;
  parentsMobile: string;
  bloodGroup: string;
  photoPath: string;
}

export default function AdminDashboard() {
  const [form, setForm] = useState<StudentForm>({
    cardNo: "",
    name: "",
    batch: "",
    branch: "",
    fathersName: "",
    mothersName: "",
    address: "",
    studentMobile: "",
    parentsMobile: "",
    bloodGroup: "",
    photoPath: "",
  });

  const {
    data: students = [],
    isLoading: loading,
    refetch,
  } = useQuery(trpc.student.getAll.queryOptions());

  const addStudent = useMutation(
    trpc.student.create.mutationOptions({
      onSuccess: () => {
        toast.success("Student added successfully!");
        setForm({
          cardNo: "",
          name: "",
          batch: "",
          branch: "",
          fathersName: "",
          mothersName: "",
          address: "",
          studentMobile: "",
          parentsMobile: "",
          bloodGroup: "",
          photoPath: "",
        });
        refetch();
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to add student");
      },
    }),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent.mutate({
      cardNo: form.cardNo,
      name: form.name,
      batch: form.batch,
      branch: form.branch,
      fathersName: form.fathersName,
      mothersName: form.mothersName,
      address: form.address,
      studentMobile: form.studentMobile,
      parentsMobile: form.parentsMobile,
      bloodGroup: form.bloodGroup,
      photoPath: form.photoPath || undefined,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between print:hidden">
          <div>
            <h1 className="font-bold text-3xl text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Manage students and generate QR codes.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/download"
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700"
            >
              <Download className="h-4 w-4" /> Download QR by Branch
            </Link>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
            >
              <Printer className="h-4 w-4" /> Print QR Codes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT: Add Student Form (Hidden when printing) */}
          <div className="lg:col-span-1 print:hidden">
            <div className="sticky top-8 rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-bold text-slate-800 text-xl">Add New Student</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">
                      Card No.
                    </label>
                    <input
                      required
                      value={form.cardNo}
                      onChange={(e) => setForm({ ...form, cardNo: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="CY001"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">Batch</label>
                    <input
                      required
                      value={form.batch}
                      onChange={(e) => setForm({ ...form, batch: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">Branch</label>
                    <input
                      required
                      value={form.branch}
                      onChange={(e) => setForm({ ...form, branch: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="CY"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">
                      Father's Name
                    </label>
                    <input
                      required
                      value={form.fathersName}
                      onChange={(e) => setForm({ ...form, fathersName: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Robert Doe"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">
                      Mother's Name
                    </label>
                    <input
                      required
                      value={form.mothersName}
                      onChange={(e) => setForm({ ...form, mothersName: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Mary Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block font-medium text-slate-700 text-sm">Address</label>
                  <input
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">
                      Student Mobile
                    </label>
                    <input
                      required
                      value={form.studentMobile}
                      onChange={(e) => setForm({ ...form, studentMobile: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="9876543210"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">
                      Parent Mobile
                    </label>
                    <input
                      required
                      value={form.parentsMobile}
                      onChange={(e) => setForm({ ...form, parentsMobile: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="9123456780"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">
                      Blood Group
                    </label>
                    <input
                      required
                      value={form.bloodGroup}
                      onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="O+"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-medium text-slate-700 text-sm">
                      Photo Path (optional)
                    </label>
                    <input
                      value={form.photoPath}
                      onChange={(e) => setForm({ ...form, photoPath: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="/students/CY/CY001.jpg"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-slate-900 py-2 font-medium text-white transition hover:bg-slate-800"
                >
                  Register Student
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Student List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="animate-pulse text-slate-500">Loading students...</div>
            ) : (
              <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <table className="w-full">
                  <thead className="border-b bg-slate-50">
                    <tr>
                      <th className="p-4 text-left font-semibold text-slate-700 text-sm">
                        Card No.
                      </th>
                      <th className="p-4 text-left font-semibold text-slate-700 text-sm">Name</th>
                      <th className="p-4 text-left font-semibold text-slate-700 text-sm">Branch</th>
                      <th className="p-4 text-left font-semibold text-slate-700 text-sm">Batch</th>
                      <th className="p-4 text-left font-semibold text-slate-700 text-sm">Blood</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {students.map((student: any) => (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium text-slate-900 text-sm">{student.cardNo}</td>
                        <td className="p-4 text-slate-700 text-sm">{student.name}</td>
                        <td className="p-4 text-slate-700 text-sm">{student.branch}</td>
                        <td className="p-4 text-slate-700 text-sm">{student.batch}</td>
                        <td className="p-4 font-medium text-red-600 text-sm">
                          {student.bloodGroup}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {students.length === 0 && (
                  <div className="p-8 text-center text-slate-500">
                    No students found. Add students using the form or import from CSV.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`@media print {
          body { background: white !important; }
          @page { margin: 10mm; }
        }`}
      </style>
    </div>
  );
}
