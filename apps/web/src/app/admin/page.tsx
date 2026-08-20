"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { Printer, Download } from "lucide-react";
import Link from "next/link";

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

  const { data: students = [], isLoading: loading, refetch } = useQuery(trpc.student.getAll.queryOptions());

  const addStudent = useMutation(trpc.student.create.mutationOptions({
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
    }
  }));

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
    <div className="min-h-screen bg-slate-50 p-8 print:p-0 print:bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Manage students and generate QR codes.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/download"
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              <Download className="w-4 h-4" /> Download QR by Branch
            </Link>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Printer className="w-4 h-4" /> Print QR Codes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Add Student Form (Hidden when printing) */}
          <div className="lg:col-span-1 print:hidden">
            <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Student</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Card No.</label>
                    <input required value={form.cardNo} onChange={(e) => setForm({...form, cardNo: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="CY001" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Name</label>
                    <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Batch</label>
                    <input required value={form.batch} onChange={(e) => setForm({...form, batch: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="2024" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Branch</label>
                    <input required value={form.branch} onChange={(e) => setForm({...form, branch: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="CY" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Father's Name</label>
                    <input required value={form.fathersName} onChange={(e) => setForm({...form, fathersName: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Robert Doe" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Mother's Name</label>
                    <input required value={form.mothersName} onChange={(e) => setForm({...form, mothersName: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Mary Doe" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Address</label>
                  <input required value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Student Mobile</label>
                    <input required value={form.studentMobile} onChange={(e) => setForm({...form, studentMobile: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="9876543210" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Parent Mobile</label>
                    <input required value={form.parentsMobile} onChange={(e) => setForm({...form, parentsMobile: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="9123456780" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Blood Group</label>
                    <input required value={form.bloodGroup} onChange={(e) => setForm({...form, bloodGroup: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="O+" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Photo Path (optional)</label>
                    <input value={form.photoPath} onChange={(e) => setForm({...form, photoPath: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="/students/CY/CY001.jpg" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition">
                  Register Student
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Student List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-slate-500 animate-pulse">Loading students...</div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-slate-700">Card No.</th>
                      <th className="text-left p-4 text-sm font-semibold text-slate-700">Name</th>
                      <th className="text-left p-4 text-sm font-semibold text-slate-700">Branch</th>
                      <th className="text-left p-4 text-sm font-semibold text-slate-700">Batch</th>
                      <th className="text-left p-4 text-sm font-semibold text-slate-700">Blood</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {students.map((student: any) => (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="p-4 text-sm font-medium text-slate-900">{student.cardNo}</td>
                        <td className="p-4 text-sm text-slate-700">{student.name}</td>
                        <td className="p-4 text-sm text-slate-700">{student.branch}</td>
                        <td className="p-4 text-sm text-slate-700">{student.batch}</td>
                        <td className="p-4 text-sm text-red-600 font-medium">{student.bloodGroup}</td>
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

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          @page { margin: 10mm; }
        }
      ` }} />
    </div>
  );
}
