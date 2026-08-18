import React from "react";
import { BadgeCheck, QrCode } from "lucide-react";

export function DigitalIdCard({ student }: { student: any }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-black/40 border border-zinc-200 dark:border-zinc-800 overflow-hidden text-zinc-900 dark:text-zinc-100 flex flex-col relative transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-200/60 dark:hover:shadow-black/50">
        
        {/* Header Pattern / Color Block */}
        <div className="h-32 bg-zinc-900 dark:bg-zinc-100 w-full relative overflow-hidden">
          {/* Subtle noise/pattern overlay could go here */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          {/* Verified Status Badge */}
          <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-white/10 dark:bg-black/10 text-white dark:text-black px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-medium border border-white/10 dark:border-black/10 shadow-sm z-10">
            <BadgeCheck className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Verified</span>
          </div>
          
          <div className="absolute top-5 left-5 z-10">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-white/70 dark:text-black/70 uppercase">
              University Identity
            </h2>
          </div>
        </div>

        {/* Profile Section */}
        <div className="relative px-8 pb-8 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full border-[6px] border-white dark:border-zinc-900 overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shadow-md -mt-14 relative z-20">
            {student.photoUrl ? (
              <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-4xl text-zinc-400">🎓</div>
            )}
          </div>

          <div className="text-center mt-5 w-full">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1">{student.name}</h1>
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold tracking-wide">
              {student.rollNo}
            </div>
          </div>

          {/* Details Grid */}
          <div className="w-full bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-5 mt-7 border border-zinc-100 dark:border-zinc-800/50">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="flex flex-col gap-1.5">
                <span className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Course</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 leading-tight">{student.course}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Semester</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 leading-tight">Semester {student.semester}</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-8 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
               <QrCode className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold tracking-widest uppercase text-center">
              Scan QR to verify authenticity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
