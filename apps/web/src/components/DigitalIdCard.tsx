import React from "react";
import { BadgeCheck } from "lucide-react";

export function DigitalIdCard({ student }: { student: any }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col p-6 border border-white/10">
        
        {/* Verified Status Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-500/30 backdrop-blur-md">
          <BadgeCheck className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Verified</span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-5 mt-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-200">
            University Identity Card
          </h2>

          <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl bg-white/10 flex items-center justify-center">
            {student.photoUrl ? (
              <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-5xl">🎓</div>
            )}
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">{student.name}</h1>
            <p className="text-indigo-200 font-medium text-sm">Roll No: {student.rollNo}</p>
          </div>

          <div className="w-full bg-black/20 rounded-xl p-5 mt-2 backdrop-blur-md border border-white/5">
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
              <div>
                <p className="text-indigo-300/80 text-[10px] uppercase tracking-wider mb-1">Course</p>
                <p className="font-semibold text-white leading-tight">{student.course}</p>
              </div>
              <div>
                <p className="text-indigo-300/80 text-[10px] uppercase tracking-wider mb-1">Semester</p>
                <p className="font-semibold text-white leading-tight">Semester {student.semester}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full text-center mt-8 pt-4">
          <p className="text-[10px] text-indigo-200/50 uppercase tracking-widest">
            Scan QR to verify authenticity
          </p>
        </div>
      </div>
    </div>
  );
}
