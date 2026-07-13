export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm aspect-[2/3] bg-slate-900 rounded-2xl shadow-2xl animate-pulse flex flex-col justify-between p-6">
        <div className="flex flex-col items-center gap-6 mt-6">
          <div className="h-4 w-32 bg-slate-800 rounded-md"></div>
          <div className="w-32 h-32 rounded-full bg-slate-800"></div>
          <div className="space-y-2 flex flex-col items-center w-full">
            <div className="h-8 w-3/4 bg-slate-800 rounded-md"></div>
            <div className="h-4 w-1/2 bg-slate-800 rounded-md"></div>
          </div>
          <div className="w-full h-32 bg-slate-800 rounded-xl mt-2"></div>
        </div>
      </div>
    </div>
  );
}
