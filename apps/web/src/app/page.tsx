export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            College QR ID
          </h1>
          <p className="mt-3 text-slate-500">
            Digital identity cards for students
          </p>
        </div>
      </div>
      
      <footer className="absolute bottom-0 w-full py-6 bg-slate-100 border-t border-slate-200 text-center">
        <p className="text-slate-600 text-sm">
          Made by <span className="font-semibold text-slate-900">Kuldeep</span>
        </p>
        <a 
          href="mailto:kuldeepsinghbhadouriya1093@gmail.com"
          className="text-slate-500 text-sm hover:text-slate-900 transition-colors"
        >
          kuldeepsinghbhadouriya1093@gmail.com
        </a>
      </footer>
    </div>
  );
}
