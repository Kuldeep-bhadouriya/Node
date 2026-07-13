"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { Printer } from "lucide-react";

export default function AdminDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", rollNo: "", course: "", semester: "" });

  const fetchStudents = async () => {
    try {
      const data = await trpc.student.getAll.query();
      setStudents(data);
    } catch (err) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await trpc.student.create.mutate({
        name: form.name,
        rollNo: form.rollNo,
        course: form.course,
        semester: parseInt(form.semester),
      });
      toast.success("Student added successfully!");
      setForm({ name: "", rollNo: "", course: "", semester: "" });
      fetchStudents(); // Refresh the grid
    } catch (error: any) {
      toast.error(error.message || "Failed to add student");
    }
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
            <p className="text-slate-500">Manage students and generate physical QR codes.</p>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Printer className="w-4 h-4" /> Print QR Codes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Add Student Form (Hidden when printing) */}
          <div className="lg:col-span-1 print:hidden">
            <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Student</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Full Name</label>
                  <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Roll Number</label>
                  <input required value={form.rollNo} onChange={(e) => setForm({...form, rollNo: e.target.value})} className="w-full border rounded-lg p-2" placeholder="CS2024-001" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Course</label>
                  <input required value={form.course} onChange={(e) => setForm({...form, course: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Computer Science" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Semester</label>
                  <input required type="number" min="1" max="10" value={form.semester} onChange={(e) => setForm({...form, semester: e.target.value})} className="w-full border rounded-lg p-2" placeholder="1" />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition">
                  Register & Generate QR
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: QR Code Grid */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-slate-500 animate-pulse">Loading students...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-3 print:gap-4">
                {students.map((student) => {
                  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/student/${student.id}`;
                  return (
                    <div key={student.id} className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col items-center print:border-slate-300 print:shadow-none print:break-inside-avoid">
                      <div className="bg-white p-3 rounded-xl border mb-4">
                        <QRCode value={url} size={150} level="H" className="w-full h-auto" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 text-center">{student.name}</h3>
                      <p className="text-sm text-slate-500 font-medium">{student.rollNo}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print-specific styling injected globally */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          @page { margin: 10mm; }
        }
      `}} />
    </div>
  );
}
